import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { ProfileService } from './profile.service';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import { AuthGuard } from '@nestjs/passport';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiProperty,
  } from '@nestjs/swagger';
  import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';
import { User } from '../users/schema/user.schema';
  
  class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }
  
  @ApiTags('profile')
  @Controller('profile')
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Req() req): Promise<User> {
      return this.profileService.getProfile(req.user._id);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Put()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto): Promise<User> {
      return this.profileService.updateProfile(req.user._id, updateProfileDto);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Post('change-password')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ status: 201, description: 'Password changed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password' })
    async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto): Promise<void> {
      return this.profileService.changePassword(req.user._id, changePasswordDto);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Post('profile-picture')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload profile picture' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiResponse({ status: 201, description: 'Profile picture uploaded successfully', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Invalid file format' })
    @UseInterceptors(FileUploadInterceptor)
    async uploadProfilePicture(
      @Req() req,
      @UploadedFile() file: Express.Multer.File,
    ): Promise<User> {
      return this.profileService.updateProfilePicture(req.user._id, file);
    }
  }