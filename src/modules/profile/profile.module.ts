import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService, FileUploadInterceptor],
})
export class ProfileModule {}