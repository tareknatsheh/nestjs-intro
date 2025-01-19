import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}
    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
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
            access_token: await this.signToken(user.id, user.email),
        };
    }

    async register(authDto: AuthDto): Promise<{ access_token: string }> {
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

            return {
                access_token: await this.signToken(user.id, user.email),
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exist');
                }
                throw new InternalServerErrorException(
                    'Something went wrong with the database',
                );
            }
            throw error;
        }
    }

    async signToken(id: string, email: string): Promise<string> {
        const payload = {
            sub: id,
            email,
        };
        return this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: this.config.get('JWT_SECRET'),
        });
    }
}
