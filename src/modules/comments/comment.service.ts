import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PostsService } from "../posts/post.service";
import { User } from "../users/schema/user.schema";
import { UserRole } from "../users/schema/enum/user.enum";

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private postsService: PostsService,
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        userId: string,
    ): Promise<Comment> {
        const { content, postId } = createCommentDto;

        // see if the post exists
        await this.postsService.findOne(postId);

        const comment = new this.commentModel({
            content,
            post: postId,
            author: userId,
        });
        return comment.save();
    }

    async findByPost(
        postId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ comments: Comment[]; total: number }> {
        // see if the post exists
        await this.postsService.findOne(postId);

        const skip = (page - 1) * limit;
        const comments = await this.commentModel
            .find({ post: postId })
            .skip(skip)
            .limit(limit)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .exec();
        const total = await this.commentModel.countDocuments({ post: postId })
            .exec();
        return { comments, total };
    }

    async findOne(id: string): Promise<Comment> {
        const comment = await this.commentModel
            .findById(id)
            .populate("author", "name email")
            .exec();
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        return comment;
    }

    async update(
        id: string,
        updateCommentDto: UpdateCommentDto,
        user: User,
    ): Promise<Comment> {
        const comment = await this.commentModel.findById(id).exec();
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        // just user admin can update their own comment
        if (comment._id !== user.id && user.role !== UserRole.ADMIN) {
            throw new UnauthorizedException(
                "You are not allowed to update this comment",
            );
        }

        const updatedComment = await this.commentModel
            .findByIdAndUpdate(id, updateCommentDto, { new: true })
            .populate("author", "name email")
            .exec();

        if (!updatedComment) {
            throw new NotFoundException("Comment not found after update");
        }

        return updatedComment;
    }

    async remove(id: string, user: User): Promise<void> {
        const comment = await this.commentModel.findById(id).exec();
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        // just user admin can delete their own comment
        if (comment._id !== user.id && user.role !== UserRole.ADMIN) {
            throw new UnauthorizedException(
                "You are not allowed to delete this comment",
            );
        }

        await this.commentModel.findByIdAndDelete(id).exec();
    }
}
