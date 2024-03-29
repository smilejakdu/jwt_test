import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { log } from "console";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    log("jwt.strategy payload : ");
    super({
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT,
    });
  }

  async validate(payload: any) {
    log("jwt.strategy payload : ", payload);
    return { id: payload.id, username: payload.username };
  }
}
