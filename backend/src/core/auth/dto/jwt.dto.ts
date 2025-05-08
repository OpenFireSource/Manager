export interface JwtDto {
  sub: string;
  resource_access: {
    'manager-backend': {
      roles: string[];
    };
  };
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  scope: string;
}
