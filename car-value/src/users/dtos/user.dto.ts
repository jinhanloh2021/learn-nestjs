//default way of displaying user to outside world
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  // Password not included here. We don't want to expose password.
}
