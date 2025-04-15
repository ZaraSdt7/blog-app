import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { User } from "./schema/user.schema";
import { UserRole } from "./schema/enum/user.enum";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name } = createUserDto;

        // search for existing user
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        //password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({
            name,
            email,
            password: hashedPassword,
            role: UserRole.USER, // default role
        });

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().select("-password").exec();
    }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select("-password")
            .exec();
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        requester: User,
    ): Promise<User> {
        // just user can update their own profile
        if (
            requester.id !== id && requester.role !== UserRole.ADMIN
        ) {
            throw new UnauthorizedException(
                "You are not allowed to update this user",
            );
        }

        const updateData: any = { ...updateUserDto };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .select("-password")
            .exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    // only admin can delete users
    async remove(id: string, requester: User): Promise<void> {
        if (requester.role !== UserRole.ADMIN) {
            throw new UnauthorizedException("Only admins can delete users");
        }

        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
            throw new NotFoundException("User not found");
        }
    }
}
