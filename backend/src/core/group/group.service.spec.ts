import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { KeycloakService } from '../services/keycloak.service';
import { firstValueFrom, of, tap } from 'rxjs';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InternalErrorDto } from '../../shared/dto/internal-error.dto';

describe('GroupService', () => {
  let service: GroupService;
  let keycloakService: KeycloakService;

  beforeEach(async () => {
    keycloakService = {} as KeycloakService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: KeycloakService,
          useValue: keycloakService,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCount', async () => {
    const count = 10;
    keycloakService.getGroupCount = jest.fn().mockReturnValueOnce(of(count));

    expect(await firstValueFrom(service.getCount())).toEqual({ count });
  });

  it('getGroups', async () => {
    const groups = [{ id: '1' }, { id: '2' }];
    keycloakService.getGroups = jest.fn().mockReturnValueOnce(of(groups));

    expect(await firstValueFrom(service.getGroups())).toEqual(groups);
  });

  describe('getGroup', () => {
    it('no clientRoles', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));

      expect(await firstValueFrom(service.getGroup('1'))).toEqual({
        ...group,
        roles: [],
      });
    });

    it('with clientRoles #1', async () => {
      const group = { id: '1', clientRoles: {} };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));

      expect(await firstValueFrom(service.getGroup('1'))).toEqual({
        ...group,
        roles: [],
      });
    });

    it('with clientRoles #2', async () => {
      const group = { id: '1', clientRoles: { test: [1] } };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      (keycloakService as any).clientId = 'test';

      expect(await firstValueFrom(service.getGroup('1'))).toEqual({
        ...group,
        roles: [1],
      });
    });
  });

  describe('createGroup', () => {
    it('should create a group', async () => {
      const group = { id: '1' };
      keycloakService.createGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.getGroupByName = jest.fn().mockReturnValueOnce(of(group));

      expect(await firstValueFrom(service.createGroup(group as any))).toEqual(
        group,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      const group = { id: '1' };
      keycloakService.createGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.getGroupByName = jest.fn().mockReturnValueOnce(of(null));

      await expect(
        firstValueFrom(service.createGroup(group as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw BadRequestException', async () => {
      const group = { id: '1' };
      keycloakService.createGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );
      await expect(
        firstValueFrom(service.createGroup(group as any)),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });
  });

  describe('updateGroup', () => {
    it('should update a group', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValue(of(group));
      keycloakService.updateGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.getGroupByName = jest.fn().mockReturnValueOnce(of(group));

      expect(
        await firstValueFrom(service.updateGroup('1', group as any)),
      ).toEqual(group);
    });

    it('should throw BadRequestException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );
      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw BadRequestException #2', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.updateGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );
      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw BadRequestException #3', async () => {
      const group = {
        id: '1',
        attributes: {
          protected: ['true'],
        },
      };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(
        new BadRequestException(
          'Geschützte Gruppen dürfen nicht verändert werden',
        ),
      );
    });

    it('should throw InternalServerErrorException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.updateGroup = jest.fn().mockReturnValueOnce(of(group));

      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw InternalServerErrorException #2', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of(group).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw InternalServerErrorException #3', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest
        .fn()
        .mockReturnValueOnce(of(group))
        .mockReturnValueOnce(of(null));
      keycloakService.updateGroup = jest.fn().mockReturnValueOnce(of(group));

      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw NotFoundException', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of(group).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'NotFound');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.updateGroup('1', group as any)),
      ).rejects.toThrow(new NotFoundException());
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.deleteGroup = jest.fn().mockReturnValueOnce(of(group));

      expect(await firstValueFrom(service.deleteGroup('1'))).toEqual(group);
    });

    it('should throw NotFoundException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of(group).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should throw NotFoundException #2', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.deleteGroup = jest.fn().mockReturnValueOnce(
        of(group).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should throw BadRequestException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new BadRequestException('Bad Request'),
      );
    });

    it('should throw BadRequestException #2', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.deleteGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(401, 'Bad Request');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new BadRequestException('Bad Request'),
      );
    });

    it('should throw BadRequestException #3', async () => {
      const group = { id: '1', attributes: { protected: ['true'] } };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new BadRequestException(
          'Geschützte Gruppen dürfen nicht verändert werden',
        ),
      );
    });

    it('should throw InternalServerException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should throw InternalServerException #2', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.deleteGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(firstValueFrom(service.deleteGroup('1'))).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  describe('addRoleToGroup', () => {
    it('should add a role to a group', async () => {
      const group = { id: '1' };
      const role = { id: '2' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.addRoleToGroup = jest.fn().mockReturnValueOnce(of(role));

      expect(await firstValueFrom(service.addRoleToGroup('1', '2'))).toEqual(
        role,
      );
    });

    it('should throw NotFoundException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.addRoleToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw NotFoundException #2', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw BadRequestException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw BadRequestException #2', async () => {
      const group = { id: '1', attributes: { protected: ['true'] } };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(
        new BadRequestException(
          'Geschützte Gruppen dürfen nicht verändert werden',
        ),
      );
    });

    it('should throw BadRequestException #3', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.addRoleToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerErrorException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw InternalServerErrorException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.addRoleToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addRoleToGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('removeRoleToGroup', () => {
    it('should add a role to a group', async () => {
      const group = { id: '1' };
      const role = { id: '2' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.removeRoleFromGroup = jest
        .fn()
        .mockReturnValueOnce(of(role));

      expect(
        await firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).toEqual(role);
    });

    it('should throw NotFoundException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.removeRoleFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw NotFoundException #2', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw BadRequestException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw BadRequestException #2', async () => {
      const group = { id: '1', attributes: { protected: ['true'] } };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(
        new BadRequestException(
          'Geschützte Gruppen dürfen nicht verändert werden',
        ),
      );
    });

    it('should throw BadRequestException #3', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.removeRoleFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerErrorException #1', async () => {
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw InternalServerErrorException #1', async () => {
      const group = { id: '1' };
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.removeRoleFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeRoleFromGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('getRoles', () => {
    it('should get roles of backend-client', async () => {
      const group = { id: '1' };
      const roles = [{ id: '2' }];
      keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
      keycloakService.getBackendClientRoles = jest
        .fn()
        .mockReturnValueOnce(of(roles));

      expect(await firstValueFrom(service.getRoles())).toEqual(roles);
    });

    it('should throw NotFoundException', async () => {
      keycloakService.getBackendClientRoles = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(firstValueFrom(service.getRoles())).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should throw BadRequestException', async () => {
      keycloakService.getBackendClientRoles = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(firstValueFrom(service.getRoles())).rejects.toThrow(
        new BadRequestException('Bad Request'),
      );
    });

    it('should throw BadRequestException', async () => {
      keycloakService.getBackendClientRoles = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(firstValueFrom(service.getRoles())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  it('getMembers', async () => {
    //const group = { id: '1' };
    const members = [{ id: '2' }];
    //keycloakService.getGroup = jest.fn().mockReturnValueOnce(of(group));
    keycloakService.getGroupMembers = jest
      .fn()
      .mockReturnValueOnce(of(members));
    keycloakService.getUsers = jest.fn().mockReturnValueOnce(of(members));

    // TODO better test
    expect(await firstValueFrom(service.getMembers('1'))).not.toBeNull();
  });

  describe('addMemberToGroup', () => {
    it('should add a member to a group', async () => {
      keycloakService.addUserToGroup = jest
        .fn()
        .mockReturnValueOnce(of(undefined));

      expect(
        await firstValueFrom(service.addMemberToGroup('1', '2')),
      ).toBeUndefined();
    });

    it('should throw NotFoundException', async () => {
      keycloakService.addUserToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addMemberToGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw BadRequestException', async () => {
      keycloakService.addUserToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addMemberToGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerErrorException', async () => {
      keycloakService.addUserToGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.addMemberToGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('removeMemberFromGroup', () => {
    it('should remove a member to a group', async () => {
      keycloakService.removeUserFromGroup = jest
        .fn()
        .mockReturnValueOnce(of(undefined));

      expect(
        await firstValueFrom(service.removeMemberFromGroup('1', '2')),
      ).toBeUndefined();
    });

    it('should throw NotFoundException', async () => {
      keycloakService.removeUserFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(404, 'Not Found');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeMemberFromGroup('1', '2')),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should throw BadRequestException', async () => {
      keycloakService.removeUserFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(400, 'Bad Request');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeMemberFromGroup('1', '2')),
      ).rejects.toThrow(new BadRequestException('Bad Request'));
    });

    it('should throw InternalServerErrorException', async () => {
      keycloakService.removeUserFromGroup = jest.fn().mockReturnValueOnce(
        of({}).pipe(
          tap(() => {
            throw new InternalErrorDto(500, 'Internal Server Error');
          }),
        ),
      );

      await expect(
        firstValueFrom(service.removeMemberFromGroup('1', '2')),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });
});
