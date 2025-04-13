import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ description: "Full name of the user", required: false })
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({ description: "Email address of the user", required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: "Password minimum 6 characters",
        required: false,
    })
    @IsOptional()
    @MinLength(6)
    password?: string;
}
