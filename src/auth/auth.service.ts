import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    login() {
        return 'This action logs a user in';
    }
    register() {
        return 'This action registers a user';
    }
}
