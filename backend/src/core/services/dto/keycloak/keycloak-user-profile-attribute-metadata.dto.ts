export class KeycloakUserProfileAttributeMetadataDto {
  name?: string;
  displayName?: string;
  required?: boolean;
  readOnly?: boolean;
  annotations?: Record<string, any>;
  validators?: Record<string, Record<string, any>>;
  group?: string;
  multivalued?: boolean;
}
