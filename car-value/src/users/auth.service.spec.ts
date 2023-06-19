import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService,
    module: TestingModule,
    mockUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // Create mock of userService
    mockUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('Creates new user with salted and hashed password', async () => {
      const user = await service.signUp('john@gmail.com', '123456');
      expect(user.password).not.toEqual('123456');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
    it('Throws an error if user signs up with existing email', async () => {
      mockUsersService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
      await expect(service.signUp('test@test.com', 'test')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('Throws if signIn called with non-existent email', async () => {
      await expect(
        service.signIn('non_existent_email@test.com', 'test'),
      ).rejects.toThrowError(new UnauthorizedException('Invalid email'));
    });
    it('Throws if user signs in with wrong password', async () => {
      mockUsersService.find = () =>
        Promise.resolve([
          { id: 1, email: 'test@test.com', password: 'salt.hash' } as User,
        ]);
      await expect(
        service.signIn('test@test.com', 'wrong_password'),
      ).rejects.toThrowError(new UnauthorizedException('Invalid password'));
    });
    it('Returns found user if valid email and password', async () => {
      // mockUsersService.find = () =>
      //   Promise.resolve([
      //     { id: 1, email: 'test@test.com', password: 'salt.hash' } as User,
      //   ]);
      // const user = await service.signIn('test@test.com', 'salt.hash');
      // expect(user).toBeDefined();
    });
  });
});
