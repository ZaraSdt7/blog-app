import { Module } from "@nestjs/common";
import { ConfigModule } from "./modules/database/config.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "./modules/database/config.service";
import { databaseConfig } from "./modules/database/jwt-config";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        databaseConfig(configService),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
