import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [
        { username: 'tarek', id: '1', isActive: true, createdAt: new Date() },
        { username: 'ahmed', id: '2', isActive: true, createdAt: new Date() },
        { username: 'mohamed', id: '3', isActive: true, createdAt: new Date() },
    ];

    findAll(username?: string): User[] {
        if (username) {
            const user = this.users.filter(
                (user) => user.username === username,
            );
            if (user.length === 0) {
                throw new NotFoundException(`User ${username} was not found`);
            }
            return user;
        }
        return this.users;
    }

    findById(id: string): User {
        const user: User = this.users.find((user) => user.id === id);
        if (!user) {
            throw new NotFoundException(`User ${id} was not found`);
        }
        return user;
    }

    addOne(user: CreateUserDTO): { message: string; user: User } {
        const newUser = {
            ...user,
            id: uuidv4(),
            createdAt: new Date(),
            isActive: true,
        };
        this.users.push(newUser);
        return {
            message: 'User added successfully',
            user: newUser,
        };
    }
}
