import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { UnauthorizedException } from "@nestjs/common";
import { PostsService } from "src/modules/posts/post.service";
import { User } from "../src/modules/users/schema/user.schema";

describe("PostsService", () => {
    let service: PostsService;
    let model: any;

    const mockPost = {
        _id: "1",
        title: "Test Post",
        content: "This is a test post.",
        author: "user1",
    };

    const mockUser = {
        id: "user1",
        role: "user",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: getModelToken("Post"),
                    useValue: {
                        find: jest.fn(),
                        countDocuments: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);
        model = module.get(getModelToken("Post"));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a post", async () => {
            model.create.mockReturnValue(mockPost);
            const result = await service.create(
                { title: "Test Post", content: "This is a test post." },
                "user1",
            );
            expect(result).toEqual(mockPost);
        });
    });

    describe("findAll", () => {
        it("should return paginated posts", async () => {
            model.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockPost]),
            });
            model.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });

            const result = await service.findAll(1, 10);
            expect(result).toEqual({ posts: [mockPost], total: 1 });
        });
    });

    describe("update", () => {
        it("should update a post", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockPost),
            });
            model.findByIdAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockPost),
            });

            const result = await service.update(
                "1",
                { title: "Updated" },
                mockUser as User,
            );
            expect(result).toEqual(mockPost);
        });

        it("should throw UnauthorizedException if not author or admin", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    ...mockPost,
                    author: "other",
                }),
            });

            await expect(
                service.update("1", { title: "Updated" }, mockUser as User),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
