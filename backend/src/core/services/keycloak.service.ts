import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { jwtDecode } from 'jwt-decode';
import {
  catchError,
  firstValueFrom,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { KeycloakClientDto } from './dto/keycloak/keycloak-client.dto';
import { KeycloakUserDto } from './dto/keycloak/keycloak-user.dto';
import { AxiosError } from 'axios';
import { KeycloakErrorDto } from './dto/keycloak/keycloak-error.dto';
import { InternalErrorDto } from '../../shared/dto/internal-error.dto';
import { Role } from '../auth/role/role';
import { KeycloakGroupCount } from './dto/keycloak/keycloak-group-count';
import { KeycloakGroupDto } from './dto/keycloak/keycloak-group.dto';
import { KeycloakRoleDto } from './dto/keycloak/keycloak-role.dto';

@Injectable()
export class KeycloakService {
  private token = '';
  private readonly keycloakUrl: string;
  public readonly realm: string;
  public readonly clientId: string;
  private readonly clientSecret: string;
  private readonly defaultGroups: { name: string; roles: Role[] }[] = [
    {
      name: 'Administratoren',
      roles: [Role.Administrator],
    },
  ];

  private get tokenUrl() {
    return `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK.url')!;
    this.realm = this.configService.get<string>('KEYCLOAK.realm')!;
    this.clientId = this.configService.get<string>('KEYCLOAK.clientId')!;
    this.clientSecret = this.configService.get<string>(
      'KEYCLOAK.clientSecret',
    )!;
  }

  async setupEnvironment() {
    try {
      await this.checkClients();
      await this.checkBackendRoles();
      await this.checkDefaultGroups();
      await this.checkAdminAccount();
    } catch (e) {
      this.logger.error('Keycloak-Setup fehlgeschlagen', e);
    }
  }

  private async checkDefaultGroups() {
    let groupCount = await firstValueFrom(this.getGroupCount());
    let allGroups: KeycloakGroupDto[] = [];
    let offset = 0;

    while (offset < groupCount) {
      const groups = await firstValueFrom(this.getGroups(offset, 100));
      allGroups.push(...groups);
      offset += 100;
    }

    for (const defaultGroup of this.defaultGroups) {
      let group = allGroups.find((g) => g.name === defaultGroup.name);
      if (!group) {
        const newGroup = await firstValueFrom(
          this.createGroup({
            name: defaultGroup.name,
            attributes: {
              protected: [true],
            },
          }),
        );
        if (!newGroup) {
          this.logger.error('Cannot create group');
          throw new Error('Cannot create group');
        }

        offset = 0;
        allGroups = [];
        groupCount = await firstValueFrom(this.getGroupCount());
        while (offset < groupCount) {
          const groups = await firstValueFrom(this.getGroups(offset, 100));
          allGroups.push(...groups);
          offset += 100;
        }
        group = allGroups.find((g) => g.name === defaultGroup.name);
        if (!group) {
          this.logger.error('Cannot find group');
          throw new Error('Cannot find group');
        }
      }
      for (const role of defaultGroup.roles) {
        await firstValueFrom(this.addRoleToGroup(group.id!, role.name));
      }
    }
  }

  private async checkAdminAccount() {
    const token = await this.getToken();
    const usersResp = await firstValueFrom(
      this.httpService.get(
        `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
        this.generateHeader(token),
      ),
    );
    if (usersResp.status !== 200) {
      throw new Error('Cannot get users');
    }

    if (usersResp.data.length === 0) {
      const data = {
        username: 'admin',
        email: 'root@localhost',
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: 'admin',
          },
        ],
      };
      // Benutzer erstellen
      const user = await firstValueFrom(
        this.createUser(data).pipe(
          mergeMap(() => this.getUserByUsername(data.username)),
        ),
      );
      if (!user) {
        this.logger.error('Problem beim erstellen des Admin-Accounts');
        throw new Error('Cannot create user');
      }

      // Gruppe abrufen
      const adminGroup = await firstValueFrom(
        this.getGroupByName(
          this.defaultGroups.find((g) => g.name === 'Administratoren')!.name,
        ),
      );
      if (!adminGroup) {
        this.logger.error('Cannot find administrator group');
        throw new Error('Cannot find group');
      }

      // Benutzer der Gruppe hinzufügen
      await firstValueFrom(this.addUserToGroup(user.id, adminGroup.id!));
    }
  }

  private async checkBackendRoles() {
    const token = await this.getToken();

    const clientsResp = await firstValueFrom(
      this.httpService.get<KeycloakClientDto[]>(
        `${this.keycloakUrl}/admin/realms/${this.realm}/clients?first=0&max=101&clientId=manager-backend&search=true`,
        this.generateHeader(token),
      ),
    );
    if (
      clientsResp.status !== 200 ||
      !clientsResp.data ||
      clientsResp.data.length === 0
    ) {
      throw new Error('Cannot get backend Client');
    }

    const backendClientId = clientsResp.data[0].id!;
    const rolesResp = await this.getClientRoles(backendClientId);

    for (const backendRole of Object.keys(Role)) {
      try {
        const kRole = rolesResp.find(
          (role: any) => role.name === Role[backendRole].name,
        );
        if (!kRole) {
          const data = {
            name: Role[backendRole].name,
            description: Role[backendRole].description,
          };
          const createRoleResp = await firstValueFrom(
            this.httpService.post(
              `${this.keycloakUrl}/admin/realms/${this.realm}/clients/${backendClientId}/roles`,
              data,
              this.generateHeader(token),
            ),
          );
          if (createRoleResp.status !== 201) {
            throw new Error(`Cannot create role ${Role[backendRole].name}`);
          }

          const newRoleResp = await firstValueFrom(
            this.httpService.get(
              `${this.keycloakUrl}/admin/realms/${this.realm}/clients/${backendClientId}/roles/${Role[backendRole].name}`,
              this.generateHeader(token),
            ),
          );
          if (newRoleResp.status !== 200) {
            throw new Error(`Cannot find role ${Role[backendRole].name}`);
          }

          const availableRoles = await this.getClientRoles(backendClientId);
          if (Role[backendRole].relations) {
            for (const relation of Role[backendRole].relations) {
              const relationRole = availableRoles.find(
                (role: any) => role.name === relation.name,
              );
              if (!relationRole) {
                throw new Error(`Cannot find role ${relation.name}`);
              }
              const assignResponse = await firstValueFrom(
                this.httpService.post(
                  `${this.keycloakUrl}/admin/realms/${this.realm}/roles-by-id/${newRoleResp.data['id']}/composites`,
                  [
                    {
                      id: relationRole['id'],
                      description: relationRole['description'],
                      name: relationRole['name'],
                    },
                  ],
                  this.generateHeader(token),
                ),
              );
              if (assignResponse.status !== 204) {
                throw new Error(
                  `Cannot assign role ${relation} to ${Role[backendRole].name}`,
                );
              }
            }
          }
          continue;
        } else {
          if (Role[backendRole].relations) {
            const availableRoles = await this.getClientRoles(backendClientId);
            const compositeRolesResp = await firstValueFrom(
              this.httpService.get(
                `${this.keycloakUrl}/admin/realms/${this.realm}/roles-by-id/${kRole['id']}/composites`,
                this.generateHeader(token),
              ),
            );
            if (compositeRolesResp.status !== 200) {
              throw new Error(
                `Cannot get composite roles for ${Role[backendRole].name}`,
              );
            }
            for (const relation of Role[backendRole].relations) {
              if (
                compositeRolesResp.data.find(
                  (role: any) => role.name === relation.name,
                )
              ) {
                continue;
              }
              const relationRole = availableRoles.find(
                (role: any) => role.name === relation.name,
              );
              if (!relationRole) {
                throw new Error(`Cannot find role ${relation}`);
              }
              const assignResponse = await firstValueFrom(
                this.httpService.post(
                  `${this.keycloakUrl}/admin/realms/${this.realm}/roles-by-id/${kRole['id']}/composites`,
                  [
                    {
                      id: relationRole['id'],
                      description: relationRole['description'],
                      name: relationRole['name'],
                    },
                  ],
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                ),
              );
              if (assignResponse.status !== 204) {
                throw new Error(
                  `Cannot assign role ${relation} to ${Role[backendRole].name}`,
                );
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  private async getClientRoles(backendClientId: string) {
    const token = await this.getToken();
    const rolesResp = await firstValueFrom(
      this.httpService.get<KeycloakClientDto[]>(
        `${this.keycloakUrl}/admin/realms/${this.realm}/clients/${backendClientId}/roles`,
        this.generateHeader(token),
      ),
    );

    if (rolesResp.status !== 200) {
      throw new Error('Cannot get roles');
    }

    return rolesResp.data;
  }

  private async checkClients() {
    const token = await this.getToken();

    const clientsResp = await firstValueFrom(
      this.httpService.get<KeycloakClientDto[]>(
        `${this.keycloakUrl}/admin/realms/${this.realm}/clients`,
        this.generateHeader(token),
      ),
    );
    if (clientsResp.status !== 200) {
      throw new Error('Cannot get clients');
    }

    // WebFrontend-Client prüfen
    const webFrontendClient = clientsResp.data.find(
      (client: any) => client.clientId === 'web-frontend',
    );
    if (!webFrontendClient) {
      await firstValueFrom(
        this.httpService.post(
          `${this.keycloakUrl}/admin/realms/${this.realm}/clients`,
          {
            clientId: 'web-frontend',
            name: 'Web-Frontend',
            alwaysDisplayInConsole: false,
            protocol: 'openid-connect',
            publicClient: true,
            authorizationServicesEnabled: false,
            standardFlowEnabled: true,
            implicitFlowEnabled: false,
            serviceAccountsEnabled: false,
            directAccessGrantsEnabled: false,
            frontchannelLogout: true,
            rootUrl: this.configService.get<string>('KEYCLOAK.webFrontend')!,
            baseUrl: this.configService.get<string>('KEYCLOAK.webFrontend')!,
            webOrigins: [
              this.configService.get<string>('KEYCLOAK.webFrontend')!,
            ],
            redirectUris: ['/*'],
          },
          this.generateHeader(token),
        ),
      );
    }
  }

  private async getToken() {
    if (this.tokenIsValid()) {
      return this.token;
    }

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        this.tokenUrl,
        {
          grant_type: 'client_credentials',
        },
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    if (tokenResponse.status !== 200) {
      throw new Error('Cannot get token');
    }
    this.token = tokenResponse.data.access_token;
    return this.token;
  }

  private tokenIsValid(): boolean {
    if (this.token === '') {
      return false;
    }

    try {
      const payload = jwtDecode(this.token);
      if (!payload.exp || !payload.iat) {
        return false;
      }
      const lifetime = payload.exp - payload.iat;
      // Token ist valid, wenn es noch bis zu 90% der Lebenszeit hat
      return payload.exp > Date.now() / 1000 + lifetime * 0.9;
    } catch (e) {
      this.logger.error('Cannot decode token', e);
      return false;
    }
  }

  public getUserCount(): Observable<number> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<number>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/count`,
          this.generateHeader(t),
        ),
      ),
      map((x) => x.data),
    );
  }

  public getUsers(
    offset?: number,
    limit?: number,
  ): Observable<KeycloakUserDto[]> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakUserDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
          {
            ...this.generateHeader(t),
            params: { max: limit ?? 100, first: offset ?? 0 },
          },
        ),
      ),
      map((x) => x.data),
    );
  }

  public getUser(id: string): Observable<KeycloakUserDto> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakUserDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${id}`,
          this.generateHeader(t),
        ),
      ),
      map((x) => x.data),
      catchError(this.handleError.bind(this)),
    );
  }

  public getUserByUsername(
    username: string,
  ): Observable<KeycloakUserDto | null> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakUserDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
          { ...this.generateHeader(t), params: { username } },
        ),
      ),
      map((x) => (x.data.length > 0 ? x.data[0] : null)),
      catchError(this.handleError.bind(this)),
    );
  }

  public createUser(
    user: Partial<KeycloakUserDto>,
  ): Observable<KeycloakUserDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.post<KeycloakUserDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
          user,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public updateUser(
    id: string,
    user: Partial<KeycloakUserDto>,
  ): Observable<KeycloakUserDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.put<KeycloakUserDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${id}`,
          user,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public deleteUser(id: string) {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.delete(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${id}`,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public getGroupCount(): Observable<number> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupCount>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups/count`,
          this.generateHeader(t),
        ),
      ),
      map((x) => x.data.count),
    );
  }

  public getGroups(
    offset?: number,
    limit?: number,
  ): Observable<KeycloakGroupDto[]> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups`,
          {
            ...this.generateHeader(t),
            params: { max: limit ?? 100, first: offset ?? 0 },
          },
        ),
      ),
      map((x) => x.data),
    );
  }

  public getGroup(id: string): Observable<KeycloakGroupDto> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${id}`,
          this.generateHeader(t),
        ),
      ),
      map((x) => x.data),
    );
  }

  public getGroupsByName(
    name: string,
    offset?: number,
    limit?: number,
  ): Observable<KeycloakGroupDto[]> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups`,
          {
            ...this.generateHeader(t),
            params: {
              q: name,
              max: limit ?? 100,
              first: offset ?? 0,
            },
          },
        ),
      ),
      map((x) => x.data),
    );
  }

  public getGroupByName(
    name: string,
  ): Observable<KeycloakGroupDto | undefined> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups`,
          {
            ...this.generateHeader(t),
            params: {
              exact: true,
              search: name,
            },
          },
        ),
      ),
      map((x) => (x.data.length > 0 ? x.data[0] : undefined)),
    );
  }

  public createGroup(
    group: Partial<KeycloakGroupDto>,
  ): Observable<KeycloakGroupDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.post<KeycloakGroupDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups`,
          group,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public updateGroup(
    id: string,
    user: Partial<KeycloakGroupDto>,
  ): Observable<KeycloakGroupDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.put<KeycloakGroupDto>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${id}`,
          user,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public deleteGroup(id: string) {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.delete(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${id}`,
          this.generateHeader(t),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public getBackendClientRoles() {
    return this.getClientByClientId(this.clientId).pipe(
      tap((client) => {
        if (!client) {
          this.logger.error('Cannot find client');
          throw new InternalServerErrorException(500);
        }
      }),
      // Rollen abrufen
      mergeMap((client) =>
        from(this.getToken()).pipe(
          mergeMap((token) =>
            this.httpService.get<KeycloakRoleDto[]>(
              `${this.keycloakUrl}/admin/realms/${this.realm}/clients/${client?.id ?? ''}/roles`,
              this.generateHeader(token),
            ),
          ),
          map((x) => x.data),
        ),
      ),
    );
  }

  public addRoleToGroup(groupId: string, role: string): Observable<void> {
    // Client abrufen
    return this.getClientByClientId(this.clientId).pipe(
      tap((client) => {
        if (!client) {
          this.logger.error('Cannot find client');
          throw new InternalServerErrorException(500);
        }
      }),
      // Rolle abrufen
      mergeMap((client) => {
        return this.getRoleByName(client!.id!, role).pipe(
          map((role) => {
            return {
              role,
              client,
            };
          }),
        );
      }),
      // Rolle der Gruppe hinzufügen
      mergeMap((x) =>
        from(this.getToken()).pipe(
          mergeMap((t) =>
            this.httpService.post<KeycloakGroupDto>(
              `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${groupId}/role-mappings/clients/${x.client!.id}`,
              [
                {
                  id: x.role.id,
                  name: x.role.name,
                },
              ],
              this.generateHeader(t),
            ),
          ),
          mergeMap(() => of(void 0)),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  public removeRoleFromGroup(groupId: string, role: string) {
    // client abrufen
    return this.getClientByClientId(this.clientId).pipe(
      tap((client) => {
        if (!client) {
          this.logger.error('Cannot find client');
          throw new InternalServerErrorException(500);
        }
      }),
      // Rolle abufen
      mergeMap((client) =>
        this.getRoleByName(client!.id!, role).pipe(
          map((role) => {
            return {
              role,
              client,
            };
          }),
        ),
      ),
      // Rolle aus Gruppe entfernen
      mergeMap((x) =>
        from(this.getToken()).pipe(
          mergeMap((t) =>
            this.httpService.delete<KeycloakGroupDto>(
              `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${groupId}/role-mappings/clients/${x.client!.id}`,
              {
                ...this.generateHeader(t),
                data: [
                  {
                    id: x.role.id,
                    name: x.role.name,
                  },
                ],
              },
            ),
          ),
          mergeMap(() => of(void 0)),
        ),
      ),
      catchError(this.handleError.bind(this)),
    );
  }

  private getRoleByName(
    clientUuid: string,
    roleName: string,
  ): Observable<KeycloakRoleDto> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakRoleDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/clients/${clientUuid}/roles`,
          {
            ...this.generateHeader(t),
            params: { search: roleName },
          },
        ),
      ),
      map((x) => (x.data.length > 0 ? x.data[0] : undefined)),
      catchError(this.handleError.bind(this)),
    );
  }

  private getClientByClientId(
    clientId: string,
  ): Observable<KeycloakClientDto | undefined> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakClientDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/clients`,
          {
            ...this.generateHeader(t),
            params: { clientId },
          },
        ),
      ),
      map((x) => (x.data.length > 0 ? x.data[0] : undefined)),
      catchError(this.handleError.bind(this)),
    );
  }

  public addUserToGroup(userId: string, groupId: string): Observable<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.put(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/groups/${groupId}`,
          undefined,
          this.generateHeader(t),
        ),
      ),
      mergeMap(() => of(void 0)),
      catchError(this.handleError.bind(this)),
    );
  }

  public removeUserFromGroup(
    userId: string,
    groupId: string,
  ): Observable<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.delete(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/groups/${groupId}`,
          this.generateHeader(t),
        ),
      ),
      mergeMap(() => of(void 0)),
      catchError(this.handleError.bind(this)),
    );
  }

  public getGroupMembers(
    groupId: string,
    offset?: number,
    limit?: number,
  ): Observable<KeycloakUserDto[]> {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakUserDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/groups/${groupId}/members`,
          {
            ...this.generateHeader(t),
            params: { max: limit ?? 100, first: offset ?? 0 },
          },
        ),
      ),
      map((x) => x.data),
    );
  }

  private generateHeader(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private handleError(error: AxiosError<KeycloakErrorDto>) {
    // TODO maybe better error handling
    this.logger.debug(error);
    return throwError(
      () =>
        new InternalErrorDto(error.status!, error.response!.data.errorMessage),
    );
  }

  getUserGroups(userId: string, offset: number, limit: number) {
    return from(this.getToken()).pipe(
      mergeMap((t) =>
        this.httpService.get<KeycloakGroupDto[]>(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/groups`,
          {
            ...this.generateHeader(t),
            params: { max: limit ?? 100, first: offset ?? 0 },
          },
        ),
      ),
      map((x) => x.data),
    );
  }
}
