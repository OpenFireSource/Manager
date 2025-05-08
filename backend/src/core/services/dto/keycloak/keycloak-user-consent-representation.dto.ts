export class KeycloakUserConsentRepresentationDto {
  clientId?: string;
  grantedClientScopes?: string[];
  createdDate?: number;
  lastUpdatedDate?: number;
  grantedRealmRoles?: string[];
}
