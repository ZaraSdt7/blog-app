import { MongooseModuleOptions } from "@nestjs/mongoose";
import { ConfigService } from "./config.service";

export const databaseConfig = (
    configService: ConfigService,
): MongooseModuleOptions => ({
    uri: configService.mongoUri,
});

export default databaseConfig;