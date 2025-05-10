import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { firstValueFrom, of } from 'rxjs';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;

  beforeEach(async () => {
    service = {} as GroupService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getRoles', async () => {
    const mockRoles = ['roles'];
    service.getRoles = jest.fn().mockReturnValue(of(mockRoles));

    expect(await firstValueFrom(controller.getRoles())).toEqual(mockRoles);

    expect(service.getRoles).toHaveBeenCalled();
  });

  it('getCount', async () => {
    const mockCount = { count: 5 };
    service.getCount = jest.fn().mockReturnValue(of(mockCount));

    expect(await firstValueFrom(controller.getCount())).toEqual(mockCount);

    expect(service.getCount).toHaveBeenCalled();
  });

  it('getAll', async () => {
    const mockUsers = [{ id: 1 }];
    service.getGroups = jest.fn().mockReturnValue(of(mockUsers));

    expect(
      await firstValueFrom(controller.getGroups({ offset: 0, limit: 10 })),
    ).toEqual(mockUsers);

    expect(service.getGroups).toHaveBeenCalledWith(0, 10);
  });

  it('getOne', async () => {
    const mockUser = { id: 1 };
    service.getGroup = jest.fn().mockReturnValue(of(mockUser));

    expect(await firstValueFrom(controller.getGroup({ id: '1' }))).toEqual(
      mockUser,
    );

    expect(service.getGroup).toHaveBeenCalledWith('1');
  });

  it('create', async () => {
    const mockUser = { id: 1 };
    const mockBody = {};
    service.createGroup = jest.fn().mockReturnValue(of(mockUser));

    expect(
      await firstValueFrom(controller.createGroup(mockBody as any)),
    ).toEqual(mockUser);

    expect(service.createGroup).toHaveBeenCalledWith(mockBody);
  });

  it('update', async () => {
    const mockUser = { id: 1 };
    const mockBody = {};
    service.updateGroup = jest.fn().mockReturnValue(of(mockUser));

    expect(
      await firstValueFrom(
        controller.updateGroup({ id: '1' }, mockBody as any),
      ),
    ).toEqual(mockUser);

    expect(service.updateGroup).toHaveBeenCalledWith('1', mockBody);
  });

  it('delete', async () => {
    const mockUser = { id: 1 };
    service.deleteGroup = jest.fn().mockReturnValue(of(mockUser));

    expect(await firstValueFrom(controller.deleteGroup({ id: '1' }))).toEqual(
      mockUser,
    );

    expect(service.deleteGroup).toHaveBeenCalledWith('1');
  });

  it('addRoleToGroup', async () => {
    const mockBody = { role: 'test' };
    service.addRoleToGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.addRoleToGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.addRoleToGroup).toHaveBeenCalledWith('1', mockBody.role);
  });

  it('addRoleToGroup', async () => {
    const mockBody = { role: 'test' };
    service.removeRoleFromGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.removeRoleFromGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.removeRoleFromGroup).toHaveBeenCalledWith(
      '1',
      mockBody.role,
    );
  });

  it('addMemberToGroup', async () => {
    const mockBody = { userId: 'test' };
    service.addMemberToGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.addMemberToGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.addMemberToGroup).toHaveBeenCalledWith('1', mockBody.userId);
  });

  it('removeMemberFromGroup', async () => {
    const mockBody = { userId: 'test' };
    service.removeMemberFromGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.removeMemberFromGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.removeMemberFromGroup).toHaveBeenCalledWith(
      '1',
      mockBody.userId,
    );
  });

  it('getMembers', async () => {
    const response = ['test'];
    service.getMembers = jest.fn().mockReturnValue(of(response));

    expect(await firstValueFrom(controller.getMembers({ id: '1' }))).toEqual(
      response,
    );

    expect(service.getMembers).toHaveBeenCalledWith('1');
  });
});
