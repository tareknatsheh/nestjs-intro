import { IsString } from 'class-validator';

export class CreateUserDTO {
    id: number;
    @IsString()
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    isActive: boolean = true;
}
