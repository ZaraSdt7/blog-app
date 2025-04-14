import { Module } from "@nestjs/common";
import { ConfigModule } from "./modules/database/config.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "./modules/database/config.service";
import databaseConfig from "./modules/database/database.config";
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/user.module';
import { PostsModule } from "./modules/posts/post.module";
import { CommentsModule } from "./modules/comments/comment.module";
import { ProfileModule } from "./modules/profile/profile.module";


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        databaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ProfileModule
  ],

})
export class AppModule {}
