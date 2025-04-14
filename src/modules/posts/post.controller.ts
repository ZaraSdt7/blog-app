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
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AuthGuard } from "@nestjs/passport";
import { PostsService } from "./post.service";
import { Posts } from "./schema/post.schema";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post()
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Create a new post" })
    @ApiResponse({
        status: 201,
        description: "Post created successfully",
        type: Post,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async create(
        @Body() createPostDto: CreatePostDto,
        @Req() req,
    ): Promise<Posts> {
        return this.postsService.create(createPostDto, req.user._id);
    }

    @Get()
    @ApiOperation({ summary: "Get all posts with pagination" })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: "List of posts",
        type: Object,
    })
    async findAll(
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
    ): Promise<{ posts: Posts[]; total: number }> {
        return this.postsService.findAll(page, limit);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a post by ID" })
    @ApiResponse({ status: 200, description: "Post details", type: Post })
    @ApiResponse({ status: 404, description: "Post not found" })
    async findOne(@Param("id") id: string): Promise<Posts> {
        return this.postsService.findOne(id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put(":id")
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Update a post by ID" })
    @ApiResponse({
        status: 200,
        description: "Post updated successfully",
        type: Post,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Post not found" })
    async update(
        @Param("id") id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req,
    ): Promise<Posts> {
        return this.postsService.update(id, updatePostDto, req.user);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":id")
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Delete a post by ID" })
    @ApiResponse({ status: 200, description: "Post deleted successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Post not found" })
    async remove(@Param("id") id: string, @Req() req): Promise<void> {
        return this.postsService.remove(id, req.user);
    }
}
