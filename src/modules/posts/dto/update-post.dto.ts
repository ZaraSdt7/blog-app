import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
    @ApiProperty({ description: "Title of the post", required: false })
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @ApiProperty({ description: "Content of the post", required: false })
    @IsOptional()
    @IsNotEmpty()
    content?: string;
}
