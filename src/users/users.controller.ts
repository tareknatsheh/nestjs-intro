import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Get('me')
    getMe(@GetUser() user: Omit<User, 'password'>) {
        return user;
    }

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Patch()
    async editUser(
        @GetUser('id') id: string,
        @Body() editUserDto: EditUserDto,
    ) {
        return await this.usersService.editUser(id, editUserDto);
    }
}
