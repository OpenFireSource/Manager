import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Role } from './role';

describe('RoleGuard', () => {
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    context = {
      getHandler: () => () => ({}),
      switchToHttp: () => ({ getRequest: () => null }),
    } as any;
  });

  it('should be defined', () => {
    expect(new RoleGuard(reflector)).toBeDefined();
  });

  it('no roles defined', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => undefined);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeTruthy();
  });

  it('user not defined', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => []);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: undefined,
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeFalsy();
  });

  it('user has no roles, no roles requested', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => []);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeTruthy();
  });

  it('user has no roles, one role requested', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [Role.UserView]);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeFalsy();
  });

  it('user has UserView role, UserView role requested', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [Role.UserView]);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [Role.UserView.name],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeTruthy();
  });

  it('user has UserView role and more, UserView role requested', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [Role.UserView]);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [Role.UserView.name, Role.UserManage.name],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeTruthy();
  });

  it('user has UserView, UserManage role and more, UserView and UserManage role requested', () => {
    jest
      .spyOn(reflector, 'get')
      .mockImplementation(() => [Role.UserView, Role.UserManage]);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [
                Role.UserView.name,
                Role.UserManage.name,
                Role.Administrator.name,
              ],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeTruthy();
  });

  it('user has UserView role, UserView and UserManage role requested', () => {
    jest
      .spyOn(reflector, 'get')
      .mockImplementation(() => [Role.UserView, Role.UserManage]);
    jest.spyOn(context, 'getHandler').mockImplementation(() => () => undefined);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      () =>
        ({
          getRequest: () => ({
            user: {
              roles: [Role.UserView.name],
            },
          }),
        }) as any,
    );

    const roleGuard = new RoleGuard(reflector);

    expect(roleGuard.canActivate(context)).toBeFalsy();
  });
});
