import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Posts } from "./schema/post.schema";
import { User } from "../users/schema/user.schema";
import { UserRole } from "../users/schema/enum/user.enum";

@Injectable()
export class PostsService {
    constructor(@InjectModel(Posts.name) private postModel: Model<Posts>) {}

    async create(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const post = new this.postModel({
            ...createPostDto,
            author: userId,
        });
        return post.save();
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
    ): Promise<{ posts: Posts[]; total: number }> {
        const skip = (page - 1) * limit;
        const posts = await this.postModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .exec();
        const total = await this.postModel.countDocuments().exec();
        return { posts, total };
    }

    async findOne(id: string): Promise<Posts> {
        const post = await this.postModel
            .findById(id)
            .populate("author", "name email")
            .exec();
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }

    async update(
        id: string,
        updatePostDto: UpdatePostDto,
        user: User,
    ): Promise<Posts> {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException("Post not found");
        }

        // just user can update their own post
        if (
            post.author.toString() !== user.id.toString() &&
            user.role !== UserRole.ADMIN
        ) {
            throw new UnauthorizedException(
                "You are not allowed to update this post",
            );
        }

        const updatedPost = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate("author", "name email")
            .exec();

        if (!updatedPost) {
            throw new NotFoundException("Post not found after update");
        }

        return updatedPost;
    }

    async remove(id: string, user: User): Promise<void> {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException("Post not found");
        }

        //just user can delete their own post
        if (
            post.author.toString() !== user.id.toString() &&
            user.role !== UserRole.ADMIN
        ) {
            throw new UnauthorizedException(
                "You are not allowed to delete this post",
            );
        }

        await this.postModel.findByIdAndDelete(id).exec();
    }
}
