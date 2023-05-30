import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Serialize(UserDto) // Controller wide serialisation
@Controller('auth')
@UseInterceptors(CurrentUserInterceptor) // Controller wide interceptor
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    console.log('Session: ' + session);
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  // @UseInterceptors(new SerializeInterceptor(UserDto)) // Custom interceptor added here
  // @Serialize(UserDto) // Custom decorator
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  @HttpCode(204)
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.userService.update(parseInt(id), body);
  }
}
