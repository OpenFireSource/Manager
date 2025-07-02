import { Injectable, Logger, OnModuleDestroy, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AMQPChannel,
  AMQPClient,
  AMQPConsumer,
  AMQPMessage,
} from '@cloudamqp/amqp-client';

@Injectable({ scope: Scope.DEFAULT })
export class AmqpService implements OnModuleDestroy {
  /**
   * Exchanges, die in der Anwendung verwendet werden
   * Die Reihenfolge ist wichtig, da die Exchanges in dieser Reihenfolge erstellt werden.
   * @private
   */
  private readonly exchanges: {
    [key: string]: {
      type: string;
      name: string;
      durable: boolean;
      bindings: { exchange: string; routing: string }[];
    };
  } = {
    data: {
      type: 'fanout',
      name: 'data',
      durable: true,
      bindings: [],
    }, // Für Datenänderungen in der Datenbanke (Aktualisierung der Search, ...)
    file: {
      type: 'fanout',
      name: 'file',
      durable: true,
      bindings: [],
    }, // Notifications von Minio
  };

  /**
   * Die Queues, die in der Anwendung verwendet werden
   * Die Reihenfolge ist wichtig, da die Queues in dieser Reihenfolge erstellt werden.
   * @private
   */
  private readonly queues: {
    [key: string]: {
      durable: boolean;
      name: string;
      bindings?: { exchange: string; routing: string }[];
    };
  } = {
    data: {
      name: 'data',
      durable: true,
      bindings: [{ exchange: this.exchanges.data.name, routing: '' }],
    },
    file: {
      name: 'file',
      durable: true,
      bindings: [{ exchange: this.exchanges.file.name, routing: '' }],
    },
  };

  private client: AMQPClient;
  private channel: AMQPChannel;

  private consumers: AMQPConsumer[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const host = configService.get<string>('AMQP.host'); // TODO hier gehts weiter
    const vhost = configService.get<string | undefined>('AMQP.vhost') ?? '';
    const port = configService.get<number>('AMQP.port');
    const username = encodeURIComponent(
      configService.get<string>('AMQP.username')!,
    );
    const password = encodeURIComponent(
      configService.get<string>('AMQP.password')!,
    );
    const amqpUrl = `amqp://${username}:${password}@${host}:${port}${vhost}`;
    this.client = new AMQPClient(amqpUrl);
  }

  /**
   * Verbinde dich mit dem AMQP-Server und Umgebung einrichten
   */
  async setupEnvironment(): Promise<void> {
    this.logger.debug('AMQP-Setup gestartet');
    await this.client.connect();
    this.channel = await this.client.channel();
    const channel = await this.client.channel();

    // Exchanges erstellen
    for (const ex of Object.keys(this.exchanges)) {
      const exchange = this.exchanges[ex];
      await channel.exchangeDeclare(exchange.name, exchange.type, {
        durable: exchange.durable,
        autoDelete: false,
        internal: false,
        passive: false,
      });
      this.logger.debug(`AMQP-Exchange ${exchange.name} erstellt.`);
      if (exchange.bindings) {
        for (const binding of exchange.bindings) {
          await channel.exchangeBind(
            exchange.name,
            binding.exchange,
            binding.routing,
          );
          this.logger.debug(
            `AMQP-Exchange ${exchange.name} an ${binding.exchange} mir Routing-Key '${binding.routing}' gebunden.`,
          );
        }
      }
    }

    // Queues erstellen
    for (const qu of Object.keys(this.queues)) {
      const queue = this.queues[qu];
      await channel.queueDeclare(queue.name, {
        durable: queue.durable,
        autoDelete: false,
        passive: false,
        exclusive: false,
      });
      this.logger.debug(`AMQP-Queue ${queue.name} erstellt.`);
      if (queue.bindings) {
        for (const binding of queue.bindings) {
          await channel.queueBind(
            queue.name,
            binding.exchange,
            binding.routing,
          );
          this.logger.debug(
            `AMQP-Queue ${queue.name} an ${binding.exchange} mir Routing-Key '${binding.routing}' gebunden.`,
          );
        }
      }
    }

    await channel.close();
    this.logger.debug('AMQP-Setup abgeschlossen');
  }

  async registerConsumer<T, K>(
    queue: string,
    injectedServices: K,
    callback: (routing: string, data: T, services: K) => Promise<void>,
  ) {
    const consumer = await this.channel.basicConsume(
      queue,
      {},
      (message: AMQPMessage) => {
        try {
          const data = JSON.parse(message.bodyToString()!) as T;
          void callback(message.routingKey, data, injectedServices);
        } catch (e) {
          this.logger.error(e);
        }
      },
    );
    this.consumers.push(consumer);
  }

  /**
   * Veröffentliche eine Nachricht, dass sich ein Daten-Element geändert hat.
   * @param topic
   * @param data
   */
  async publishDataChange(topic: string, data: any): Promise<void> {
    try {
      await this.channel.basicPublish(
        this.exchanges.data.name,
        topic,
        JSON.stringify(data),
      );
      this.logger.debug(`Data-Change mit Topic'${topic}' veröffentlicht.`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleDestroy(): Promise<any> {
    for (const consumer of this.consumers) {
      await consumer.cancel();
    }
  }
}
