import { IsAlphanumeric, IsString, Max, MaxLength } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @IsAlphanumeric()
    @MaxLength(10)
    username: string;
    @MaxLength(50)
    firstName?: string;
    @MaxLength(50)
    lastName?: string;
    @Max(100)
    age?: number;
}
