import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async editUser(id: string, editUserDto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: editUserDto,
        });
        delete user.password;
        return user;
    }
}
