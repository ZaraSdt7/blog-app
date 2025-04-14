import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../src/modules/users/user.service";

describe("UsersService", () => {
    let service: UsersService;
    let model: any;

    const mockUser = {
        _id: "1",
        name: "User1",
        email: "user@gmail.com",
        password: "hashedPassword",
        role: "user",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken("User"),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get(getModelToken("User"));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a user", async () => {
            model.findOne.mockReturnValue(null);
            model.create.mockReturnValue(mockUser);

            const result = await service.create({
                name: "User1",
                email: "user@gmail.com",
                password: "hashedPassword",
            });
            expect(result).toEqual(mockUser);
        });

        it("should throw ConflictException if email exists", async () => {
            model.findOne.mockReturnValue(mockUser);

            await expect(
                service.create({
                    name: "User1",
                    email: "user@gmail.com",
                    password: "hashedPassword",
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe("findById", () => {
        it("should return a user", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });
            const result = await service.findById("1");
            expect(result).toEqual(mockUser);
        });

        it("should throw NotFoundException if user not found", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            await expect(service.findById("1")).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
