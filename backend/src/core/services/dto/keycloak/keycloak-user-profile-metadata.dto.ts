import { KeycloakUserProfileAttributeMetadataDto } from './keycloak-user-profile-attribute-metadata.dto';
import { KeycloakUserProfileAttributeGroupMetadataDto } from './keycloak-user-profile-attribute-group-metadata.dto';

export class KeycloakUserProfileMetadataDto {
  attributes?: KeycloakUserProfileAttributeMetadataDto[];
  groups?: KeycloakUserProfileAttributeGroupMetadataDto[];
}
