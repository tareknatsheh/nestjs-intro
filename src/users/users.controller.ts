import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Logger,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
    ApiCreatedResponse,
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
    @ApiQuery({ name: 'name', required: false })
    @Get()
    getAllUsers(@Query('name') name?: string) {
        return this.usersService.findAll(name);
    }
    @ApiOkResponse({ type: User })
    @Get(':id')
    getOneUser(@Param('id') id: string) {
        try {
            return this.usersService.findById(id);
        } catch (error) {
            Logger.error(error.message);
            throw new NotFoundException(error.message);
        }
    }
    @ApiCreatedResponse({ type: User })
    @Post()
    createUser(@Body() user: CreateUserDTO) {
        return this.usersService.addOne(user);
    }
}
