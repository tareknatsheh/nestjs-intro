import {
    IsAlphanumeric,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class EditBookmarkDto {
    @IsOptional()
    @IsString()
    @IsAlphanumeric()
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255, { message: 'Description is too long' })
    description?: string;

    @IsOptional()
    @IsUrl()
    @IsString()
    link?: string;
}
