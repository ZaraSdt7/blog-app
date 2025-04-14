import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentSchema } from "./schema/comment.schema";
import { PostsModule } from "../posts/post.module";
import { CommentsController } from "./comment.controller";
import { CommentsService } from "./comment.service";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Comment.name,
            schema: CommentSchema,
        }]),
        PostsModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule {}
