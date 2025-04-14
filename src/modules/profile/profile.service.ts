import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { User } from '../users/schema/user.schema';
 
  
  @Injectable()
  export class ProfileService {
    constructor(private usersService: UsersService) {}
  
    async getProfile(userId: string): Promise<User> {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  
    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
      const { email } = updateProfileDto;
      if (email) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser && existingUser._id!== userId) {
          throw new ConflictException('Email already exists');
        }
      }
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.usersService.update(userId, updateProfileDto, user);
    }
  
    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
      const { currentPassword, newPassword } = changePasswordDto;
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.update(userId, { password: hashedPassword }, user);
    }
  
    async updateProfilePicture(userId: string, file: Express.Multer.File): Promise<User> {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const profilePictureUrl = `/uploads/${file.filename}`;
      return this.usersService.update(userId, { profilePicture: profilePictureUrl }, user);
    }
  }