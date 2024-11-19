import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { UsersService } from './users.service';

const users = [];

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    getOneUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getOneUser(id);
    }

    @Post()
    createUser(@Body() user: CreateUserDTO) {
        users.push(user);
        return user;
    }
}
