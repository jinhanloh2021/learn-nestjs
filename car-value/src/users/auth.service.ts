import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify<string, string, number, Buffer>(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash the user password
    // Generate salt
    const salt: string = randomBytes(8).toString('hex');

    // Hash salt and password together
    const digest: Buffer = await scrypt(password, salt, 32);

    // Join digest and salt together
    const result: string = salt + '.' + digest.toString('hex');

    // Create new user
    const user = await this.usersService.create(email, result);

    // Return user
    return user;
  }
  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const [salt, hash] = user.password.split('.');
    const digest: Buffer = await scrypt(password, salt, 32);

    if (hash !== digest.toString('hex')) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}
