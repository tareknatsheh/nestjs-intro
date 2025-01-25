import { IsAlphanumeric, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBookmarkDto {
    @IsString()
    @IsAlphanumeric()
    title: string;

    @IsString()
    @MaxLength(255, { message: 'Description is too long' })
    description: string;

    @IsUrl()
    @IsString()
    link: string;
}
