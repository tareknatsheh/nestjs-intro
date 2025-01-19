import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor() {}

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Get('me')
    getMe(@GetUser() user: Omit<User, 'password'>) {
        return user;
    }
}
