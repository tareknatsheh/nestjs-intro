import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [
        { name: 'tarek', id: '1', isActive: true },
        { name: 'ahmed', id: '2', isActive: true },
        { name: 'mohamed', id: '3', isActive: true },
    ];

    findAll(name?: string): User[] {
        if (name) {
            return this.users.filter((user) => user.name === name);
        }
        return this.users;
    }

    findById(id: string): User {
        const user: User = this.users.find((user) => user.id === id);
        if (!user) {
            throw new Error(`User ${id} was not found`);
        }
        return user;
    }

    addOne(user: CreateUserDTO): { message: string; user: User } {
        user.id = uuidv4();
        this.users.push(user);
        return {
            message: 'User added successfully',
            user,
        };
    }
}
