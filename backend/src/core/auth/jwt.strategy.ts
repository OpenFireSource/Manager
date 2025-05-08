import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { RequestUserDto } from './dto/request-user.dto';
import { JwtDto } from './dto/jwt.dto';
import { RequestContextService } from '../services/request-context.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly contextService: RequestContextService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: configService.get('KEYCLOAK.issuer'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('KEYCLOAK.url')}/realms/${configService.get('KEYCLOAK.realm')}/protocol/openid-connect/certs`,
      }),
    });
  }

  validate(payload: JwtDto): RequestUserDto {
    this.contextService.set('userId', payload.sub);
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.resource_access['manager-backend'].roles,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };
  }
}
