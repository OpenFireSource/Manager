import {JwtPayload} from 'jwt-decode';

export interface AccessTokenDto extends JwtPayload {
  resource_access?: {
    "manager-backend"?: {
      roles?: string[];
    }
  };
}
