import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '1',
    name: "User1",
    email: "user@gmail.com",
    password: 'hashedPassword',
    role: 'user',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken('ResetToken'), useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register({
        name: 'User1',
        email: 'user@gmail.com',
        password: 'password1234',
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        name: 'User1',
        email: 'user@gmail.com',
        password: 'password1234',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'user@gmail.com',
        sub: '1',
        role: 'user',
      });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password1234',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        email: 'user@gmail.com',
        password: 'password1234',
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'user@gmail.com',
        sub: '1',
        role: 'user',
      });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({
          email: 'user@gmail.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});