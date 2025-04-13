import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ description: "Full name of the user" })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Email address of the user" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Password minimum 6 characters" })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
