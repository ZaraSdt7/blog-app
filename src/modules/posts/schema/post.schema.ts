import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/modules/users/schema/user.schema";

@Schema({ timestamps: true })
export class Posts extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    author: User;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
