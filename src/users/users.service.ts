import { Injectable, Logger } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(private prisma: PrismaService) {}
    async editUser(id: string, editUserDto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: editUserDto,
        });
        delete user.password;
        this.logger.log(`User with id ${id} has been updated`);

        return user;
    }
}
