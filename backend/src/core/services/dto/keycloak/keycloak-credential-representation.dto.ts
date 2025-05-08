export class KeycloakCredentialRepresentationDto {
  id?: string;
  type?: string;
  userLabel?: string;
  createdDate?: number;
  secretData?: string;
  credentialData?: string;
  priority?: number;
  value?: string;
  temporary?: boolean;
  device?: string;
  hashedSaltedValue?: string;
  salt?: string;
  hashIterations?: number;
  counter?: number;
  algorithm?: string;
  digits?: number;
  period?: number;
  config?: Record<string, string>;
}
