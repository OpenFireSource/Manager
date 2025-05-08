export class KeycloakGroupDto {
  id?: string;
  name?: string;
  path?: string;
  parentId?: string;
  subGroupCount?: number;
  subGroups?: KeycloakGroupDto[];
  attributes?: Record<string, any[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  access?: Record<string, boolean>;
}
