import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { KeycloakService } from '../services/keycloak.service';
import { firstValueFrom, of, tap } from 'rxjs';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InternalErrorDto } from '../../shared/dto/internal-error.dto';

describe('UserService', () => {
  let service: UserService;
  let keycloakService: KeycloakService;

  beforeEach(async () => {
    keycloakService = {} as KeycloakService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: KeycloakService,
          useValue: keycloakService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCount', async () => {
    const count = 10;
    keycloakService.getUserCount = jest.fn().mockReturnValueOnce(of(count));

    expect(await firstValueFrom(service.getCount())).toEqual({ count });
  });

  it('getUsers', async () => {
    const users = [{ id: '1' }, { id: '2' }];
    keycloakService.getUsers = jest.fn().mockReturnValueOnce(of(users));

    expect(await firstValueFrom(service.getUsers())).toEqual(users);
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = { id: '1' };
      keycloakService.getUser = jest.fn().mockReturnValueOnce(of(user));

      expect(await firstValueFrom(service.getUser('1'))).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      keycloakService.getUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(firstValueFrom(service.getUser('1'))).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('should throw BadRequestException', async () => {
      keycloakService.getUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(firstValueFrom(service.getUser('1'))).rejects.toThrowError(
        new BadRequestException('Bad Request'),
      );
    });

    it('should throw InternalServerException', async () => {
      keycloakService.getUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(firstValueFrom(service.getUser('1'))).rejects.toThrowError(
        new InternalServerErrorException(),
      );
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = { id: '1' };
      const body = { username: 'test' };
      keycloakService.createUser = jest.fn().mockReturnValueOnce(of(null));
      keycloakService.getUserByUsername = jest
        .fn()
        .mockReturnValueOnce(of(user));

      expect(await firstValueFrom(service.createUser(body as any))).toEqual(
        user,
      );
    });

    it('should throw BadRequestException', async () => {
      const body = { username: 'test' };
      keycloakService.createUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.createUser(body as any)),
      ).rejects.toThrowError(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerException #1', async () => {
      const body = { username: 'test' };
      keycloakService.createUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.createUser(body as any)),
      ).rejects.toThrowError(new InternalServerErrorException());
    });

    it('should throw InternalServerException #2', async () => {
      const body = { username: 'test' };
      keycloakService.createUser = jest.fn().mockReturnValueOnce(of(null));
      keycloakService.getUserByUsername = jest
        .fn()
        .mockReturnValueOnce(of(null));

      await expect(
        firstValueFrom(service.createUser(body as any)),
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = { id: '1' };
      const body = { username: 'test' };
      keycloakService.updateUser = jest.fn().mockReturnValueOnce(of(null));
      keycloakService.getUser = jest.fn().mockReturnValueOnce(of(user));

      expect(
        await firstValueFrom(service.updateUser('1', body as any)),
      ).toEqual(user);
    });

    it('should throw BadRequestException', async () => {
      const body = { username: 'test' };
      keycloakService.updateUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.updateUser('1', body as any)),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerException #1', async () => {
      const body = { username: 'test' };
      keycloakService.updateUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.updateUser('1', body as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw InternalServerException #2', async () => {
      const body = { username: 'test' };
      keycloakService.updateUser = jest.fn().mockReturnValueOnce(of({}));
      keycloakService.getUser = jest.fn().mockReturnValueOnce(of(null));

      await expect(
        firstValueFrom(service.updateUser('1', body as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      keycloakService.deleteUser = jest.fn().mockReturnValueOnce(of(null));

      await expect(
        firstValueFrom(service.deleteUser('1')),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user not found', async () => {
      keycloakService.deleteUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.deleteUser('1')),
      ).rejects.toThrowError(new NotFoundException());
    });

    it('should throw BadRequestException', async () => {
      keycloakService.deleteUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.deleteUser('1')),
      ).rejects.toThrowError(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerException', async () => {
      keycloakService.deleteUser = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.deleteUser('1')),
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });
});
