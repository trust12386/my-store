import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtContants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<null | Omit<User, 'password'>> {
    const existUser = await this.userService.findByUsername(username);

    if (!existUser) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return null;
    }

    const { password: ignorePass, ...restUser } = existUser;

    return restUser;
  }

  async login(user: User) {

    const { password, ...restUser } = user;

    const payload = { ...restUser, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      user: restUser,
      expiresIn: jwtContants.expiresIn,
    };
  }
}
