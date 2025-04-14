import { Test, TestingModule } from "@nestjs/testing";
import {
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ProfileService } from "../src/modules/profile/profile.service";
import { UsersService } from "../src/modules/users/user.service";

describe("ProfileService", () => {
    let service: ProfileService;
    let usersService: UsersService;

    const mockUser = {
        id: "1",
        name: "User1",
        email: "user@gmail.com",
        password: "hashedPassword",
        role: "user",
    };

    const mockUsersService = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                { provide: UsersService, useValue: mockUsersService },
            ],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        usersService = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getProfile", () => {
        it("should return user profile", async () => {
            mockUsersService.findById.mockResolvedValue(mockUser);
            const result = await service.getProfile("1");
            expect(result).toEqual(mockUser);
        });

        it("should throw NotFoundException if user not found", async () => {
            mockUsersService.findById.mockResolvedValue(null);
            await expect(service.getProfile("1")).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("updateProfile", () => {
        it("should update profile", async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.findById.mockResolvedValue(mockUser);
            mockUsersService.update.mockResolvedValue({
                ...mockUser,
                name: "Updated",
            });

            const result = await service.updateProfile("1", {
                name: "Updated",
            });
            expect(result.name).toEqual("Updated");
        });

        it("should throw ConflictException if email exists", async () => {
            mockUsersService.findByEmail.mockResolvedValue({ _id: "2" });
            await expect(
                service.updateProfile("1", { email: "user@gmail.com" }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe("changePassword", () => {
        it("should change password", async () => {
            mockUsersService.findById.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
            jest.spyOn(bcrypt, "hash").mockResolvedValue(
                "newHashedPassword" as never,
            );
            mockUsersService.update.mockResolvedValue(mockUser);

            await service.changePassword("1", {
                currentPassword: "password1234",
                newPassword: "newpassword",
            });
            expect(mockUsersService.update).toHaveBeenCalledWith(
                "1",
                { password: "newHashedPassword" },
                mockUser,
            );
        });

        it("should throw UnauthorizedException if current password is incorrect", async () => {
            mockUsersService.findById.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

            await expect(
                service.changePassword("1", {
                    currentPassword: "wrong",
                    newPassword: "newpassword",
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
