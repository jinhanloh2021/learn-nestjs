import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  // Use Utility Type Partial. Attrs can be a subset of User.
  // Only use async if you want to await something. Not necessary as Nest handles this.
  async update(id: number, attrs: Partial<User>) {
    // 1. User must exist
    const user = await this.findOne(id); //throws NotFound

    // 2. Update User
    Object.assign(user, attrs); // Overwrites attrs onto user

    // Another way to overwrite common attributes
    // const updatedUser = {
    //   ...user,
    //   ...attrs,
    // };

    // 3. Save updated user
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
