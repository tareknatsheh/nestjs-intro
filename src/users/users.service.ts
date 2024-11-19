import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';

const users = [];

@Injectable()
export class UsersService {
    getAllUsers() {
        return users;
    }

    getOneUser(id: number) {
        const user: CreateUserDTO = users.find((user) => user.id === id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
    }
}
