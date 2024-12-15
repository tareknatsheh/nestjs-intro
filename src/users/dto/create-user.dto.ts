import { IsString } from 'class-validator';

export class CreateUserDTO {
    id: string;
    @IsString()
    name: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    isActive: boolean = true;
}
