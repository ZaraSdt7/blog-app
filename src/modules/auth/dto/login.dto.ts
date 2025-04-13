// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ description: "Email address of the user" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Password" })
    @IsNotEmpty()
    password: string;
}
