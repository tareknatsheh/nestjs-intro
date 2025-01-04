import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    login() {
        return 'This action logs a user in';
    }
    register() {
        return 'This action registers a user';
    }
}
