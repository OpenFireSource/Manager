import { KeycloakUserProfileMetadataDto } from './keycloak-user-profile-metadata.dto';
import { KeycloakCredentialRepresentationDto } from './keycloak-credential-representation.dto';
import { KeycloakFederatedIdentityRepresentationDto } from './keycloak-federated-identity-representation.dto';
import { KeycloakUserConsentRepresentationDto } from './keycloak-user-consent-representation.dto';
import { KeycloakSocialLinkRepresentationDto } from './keycloak-social-link-representation.dto';

export class KeycloakUserDto {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
  attributes?: Record<string, string[]>;
  userProfileMetadata?: KeycloakUserProfileMetadataDto;
  self?: string;
  origin?: string;
  createdTimestamp?: number;
  enabled?: boolean;
  totp?: boolean;
  federationLink?: string;
  serviceAccountClientId?: string;
  credentials?: KeycloakCredentialRepresentationDto[];
  disableableCredentialTypes?: string[];
  requiredActions?: string[];
  federatedIdentities?: KeycloakFederatedIdentityRepresentationDto[];
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  clientConsents?: KeycloakUserConsentRepresentationDto[];
  notBefore?: number;
  applicationRoles?: Record<string, string[]>;
  socialLinks?: KeycloakSocialLinkRepresentationDto[];
  access?: Record<string, boolean>;
  groups?: string[];
}
