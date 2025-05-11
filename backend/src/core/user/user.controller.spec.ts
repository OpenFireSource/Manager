import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { firstValueFrom, of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    service = {} as UserService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCount', async () => {
    const mockCount = { count: 5 };
    service.getCount = jest.fn().mockReturnValue(of(mockCount));

    expect(await firstValueFrom(controller.getCount())).toEqual(mockCount);

    expect(service.getCount).toHaveBeenCalled();
  });

  it('getAll', async () => {
    const mockUsers = [{ id: 1 }];
    service.getUsers = jest.fn().mockReturnValue(of(mockUsers));

    expect(
      await firstValueFrom(controller.getUsers({ offset: 0, limit: 10 })),
    ).toEqual(mockUsers);

    expect(service.getUsers).toHaveBeenCalledWith(0, 10);
  });

  it('getOne', async () => {
    const mockUser = { id: 1 };
    service.getUser = jest.fn().mockReturnValue(of(mockUser));

    expect(await firstValueFrom(controller.getUser({ id: '1' }))).toEqual(
      mockUser,
    );

    expect(service.getUser).toHaveBeenCalledWith('1');
  });

  it('create', async () => {
    const mockUser = { id: 1 };
    const mockBody = {};
    service.createUser = jest.fn().mockReturnValue(of(mockUser));

    expect(
      await firstValueFrom(controller.createUser(mockBody as any)),
    ).toEqual(mockUser);

    expect(service.createUser).toHaveBeenCalledWith(mockBody);
  });

  it('update', async () => {
    const mockUser = { id: 1 };
    const mockBody = {};
    service.updateUser = jest.fn().mockReturnValue(of(mockUser));

    expect(
      await firstValueFrom(controller.updateUser({ id: '1' }, mockBody as any)),
    ).toEqual(mockUser);

    expect(service.updateUser).toHaveBeenCalledWith('1', mockBody);
  });

  it('delete', async () => {
    const mockUser = { id: 1 };
    service.deleteUser = jest.fn().mockReturnValue(of(mockUser));

    expect(await firstValueFrom(controller.deleteUser({ id: '1' }))).toEqual(
      mockUser,
    );

    expect(service.deleteUser).toHaveBeenCalledWith('1');
  });

  it('addUserToGroup', async () => {
    const mockBody = { groupId: 'test' };
    service.addUserToGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.addUserToGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.addUserToGroup).toHaveBeenCalledWith('1', mockBody.groupId);
  });

  it('removeUserFromGroup', async () => {
    const mockBody = { groupId: 'test' };
    service.removeUserFromGroup = jest.fn().mockReturnValue(of(undefined));

    expect(
      await firstValueFrom(
        controller.removeUserFromGroup({ id: '1' }, mockBody as any),
      ),
    ).toBeUndefined();

    expect(service.removeUserFromGroup).toHaveBeenCalledWith(
      '1',
      mockBody.groupId,
    );
  });

  it('getMembers', async () => {
    const response = ['test'];
    service.getGroups = jest.fn().mockReturnValue(of(response));

    expect(await firstValueFrom(controller.getGroups({ id: '1' }))).toEqual(
      response,
    );

    expect(service.getGroups).toHaveBeenCalledWith('1');
  });
});
