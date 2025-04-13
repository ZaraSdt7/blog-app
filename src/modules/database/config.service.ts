import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService) {}

    get mongoUri(): string {
        return this.configService.get<string>(
            "MONGO_URI",
            "mongodb://localhost:27017/blog-app",
        );
    }

    get jwtSecret(): string {
        return this.configService.get<string>(
            "JWT_SECRET",
            "0e4c97cd05f0d895b85306129f285ce66994043a7870d5a8f05f6d348ef5e901",
        );
    }

    get port(): number {
        return this.configService.get<number>("PORT", 3000);
    }
}
