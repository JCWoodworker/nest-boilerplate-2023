import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
    accessTokenexpiration: string,
    refreshTokenExpiration: string,
  ) {
    const user = await this.usersService.findOneByUsername(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.userId,
      username: user.username,
      userType: user.userType,
    };
    return [
      await this.jwtService.signAsync({
        ...payload,
        expiresIn: accessTokenexpiration,
      }),
      await this.jwtService.signAsync({
        ...payload,
        expiresIn: refreshTokenExpiration,
      }),
    ];
  }
}
