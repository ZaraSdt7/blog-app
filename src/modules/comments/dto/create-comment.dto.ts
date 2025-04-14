import { IsMongoId, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({ description: "Content of the comment" })
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: "ID of the post to comment on" })
    @IsNotEmpty()
    @IsMongoId()
    postId: string;
}
