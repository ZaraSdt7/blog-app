import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "./comment.service";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post()
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Create a new comment" })
    @ApiResponse({
        status: 201,
        description: "Comment created successfully",
        type: Comment,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Post not found" })
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Req() req,
    ): Promise<Comment> {
        return this.commentsService.create(createCommentDto, req.user._id);
    }

    @Get("post/:postId")
    @ApiOperation({ summary: "Get all comments for a post with pagination" })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({ status: 200, description: "List of comments", type: Object })
    @ApiResponse({ status: 404, description: "Post not found" })
    async findByPost(
        @Param("postId") postId: string,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
    ): Promise<{ comments: Comment[]; total: number }> {
        return this.commentsService.findByPost(postId, page, limit);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a comment by ID" })
    @ApiResponse({ status: 200, description: "Comment details", type: Comment })
    @ApiResponse({ status: 404, description: "Comment not found" })
    async findOne(@Param("id") id: string): Promise<Comment> {
        return this.commentsService.findOne(id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put(":id")
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Update a comment by ID" })
    @ApiResponse({
        status: 200,
        description: "Comment updated successfully",
        type: Comment,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Comment not found" })
    async update(
        @Param("id") id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req,
    ): Promise<Comment> {
        return this.commentsService.update(id, updateCommentDto, req.user);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":id")
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Delete a comment by ID" })
    @ApiResponse({ status: 200, description: "Comment deleted successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Comment not found" })
    async remove(@Param("id") id: string, @Req() req): Promise<void> {
        return this.commentsService.remove(id, req.user);
    }
}
