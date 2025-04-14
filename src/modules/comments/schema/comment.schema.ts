import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../../users/schema/user.schema";
import { Posts } from "src/modules/posts/schema/post.schema";

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    author: User;

    @Prop({ type: Types.ObjectId, ref: "Post", required: true })
    post: Posts;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
