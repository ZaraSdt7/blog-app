import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "./config.service";

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.jwtSecret,
    signOptions: { expiresIn: "1d" },
});
