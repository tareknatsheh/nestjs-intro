import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { User } from 'src/types/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async login(loginDto: LoginDto): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email,
            },
        });

        if (!user) {
            throw new NotFoundException();
        }
        const isPassCorrect = await argon.verify(
            user.password,
            loginDto.password,
        );
        if (!isPassCorrect) {
            throw new ForbiddenException('Email or password is incorrect.');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    async register(authDto: AuthDto): Promise<User> {
        console.log(authDto);

        try {
            const password = await argon.hash(authDto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: authDto.email,
                    name: authDto.name,
                    password,
                },
            });

            const newUser = {
                id: user.id,
                email: user.email,
                name: user.name,
            };

            return newUser;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials already exist');
                }
                throw new InternalServerErrorException(
                    'Something went wrong with the database',
                );
            }
            throw error;
        }
    }
}
