import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
    @ApiProperty({ description: "Updated content of the comment" })
    @IsNotEmpty()
    content: string;
}
