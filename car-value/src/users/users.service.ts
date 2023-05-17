import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {} // Inject user repo in UserService

  create(email: string, password: string) {
    // Create function doesn't persist data, just constructs entity
    const user: User = this.repo.create({ email, password }); // important if there is validation on entity

    // Saves to database. Persists data
    return this.repo.save(user);

    // Try not to do this, hooks won't run. save(), remove(), hooks run. insert(), update(), delete() hooks won't run.
    // return this.repo.save({email, password});
  }
}
