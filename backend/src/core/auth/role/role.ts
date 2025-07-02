export class Role {
  public static readonly DeviceGroupView = new Role(
    'device-group.view',
    'Geräte-Gruppe ansehen',
  );
  public static readonly DeviceGroupManage = new Role(
    'device-group.manage',
    'Geräte-Gruppe verwalten',
    [Role.DeviceGroupView],
  );
  static readonly DeviceTypeView = new Role(
    'device-type.view',
    'Geräte-Typ ansehen',
  );
  public static readonly DeviceTypeManage = new Role(
    'device-type.manage',
    'Geräte-Typ verwalten',
    [Role.DeviceTypeView],
  );
  public static readonly DeviceView = new Role(
    'device.view',
    'Geräte ansehen',
    [Role.DeviceTypeView, Role.DeviceGroupView],
  );
  public static readonly DeviceManage = new Role(
    'device.manage',
    'Geräte verwalten',
    [Role.DeviceView],
  );
  public static readonly LocationView = new Role(
    'location.view',
    'Standorte ansehen',
  );
  public static readonly LocationManage = new Role(
    'location.manage',
    'Standorte verwalten',
    [Role.LocationView],
  );

  public static readonly ConsumableGroupView = new Role(
    'consumable-group.view',
    'Verbrauchsgüter-Gruppe ansehen',
  );
  public static readonly ConsumableGroupManage = new Role(
    'consumable-group.manage',
    'Verbrauchsgüter-Gruppe verwalten',
    [Role.ConsumableGroupView],
  );
  public static readonly ConsumableView = new Role(
    'consumable.view',
    'Verbrauchsgüter ansehen',
    [Role.ConsumableGroupView, Role.LocationView],
  );
  public static readonly ConsumableManage = new Role(
    'consumable.manage',
    'Verbrauchsgüter verwalten',
    [Role.ConsumableView],
  );

  public static readonly UserView = new Role('user.view', 'Benutzer ansehen');
  public static readonly UserManage = new Role(
    'user.manage',
    'Benutzer verwalten',
    [Role.UserView],
  );

  public static readonly GroupView = new Role('group.view', 'Gruppen ansehen');
  public static readonly GroupManage = new Role(
    'group.manage',
    'Gruppen verwalten',
    [Role.GroupView],
  );

  public static readonly Administrator = new Role('admin', 'Administratoren', [
    Role.GroupManage,
    Role.UserManage,
    Role.LocationManage,
    Role.DeviceTypeManage,
    Role.DeviceGroupManage,
    Role.DeviceManage,
    Role.ConsumableGroupManage,
    Role.ConsumableManage,
  ]);

  public name: string;
  public description: string;
  public relations: Role[];

  constructor(name: string, description: string, relations: Role[] = []) {
    this.name = name;
    this.description = description;
    this.relations = relations;
  }
}
