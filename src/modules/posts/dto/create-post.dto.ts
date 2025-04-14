import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({ description: "Title of the post" })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: "Content of the post" })
    @IsNotEmpty()
    content: string;
}
