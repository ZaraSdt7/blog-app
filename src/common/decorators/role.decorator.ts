import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/modules/users/schema/enum/user.enum";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
