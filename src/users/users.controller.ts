import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({ type: User, isArray: true })
    @ApiNotFoundResponse()
    @ApiQuery({ name: 'name', required: false })
    @Get()
    getAllUsers(@Query('name') name?: string) {
        return this.usersService.findAll(name);
    }

    @ApiOkResponse({ type: User })
    @ApiNotFoundResponse()
    @Get(':id')
    getOneUser(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @ApiCreatedResponse({ type: User })
    @Post()
    createUser(@Body() user: CreateUserDTO) {
        return this.usersService.addOne(user);
    }
}
