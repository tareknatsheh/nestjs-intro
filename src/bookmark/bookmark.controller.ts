import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateBookmarkDto } from './dto/create-bookmarrk.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    private readonly logger = new Logger(BookmarkController.name);
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    async getAllBookmarks(@GetUser('id') id: string) {
        return await this.bookmarkService.getAllBookmarks(id);
    }

    @Get(':id')
    async getBookmarkById(@Param('id') bookmarkId: string) {
        return await this.bookmarkService.getBookmarkById(bookmarkId);
    }

    @Post()
    async createBookmark(
        @GetUser('id') id: string,
        @Body() createBookmarkDto: CreateBookmarkDto,
    ) {
        this.logger.log('createBookmarkDto', createBookmarkDto);
        return await this.bookmarkService.createBookmark(id, createBookmarkDto);
    }

    @Patch(':id')
    async updateBookmark(
        @GetUser('id') id: string,
        @Body() editBookmarkDto: EditBookmarkDto,
        @Param('id') bookmarkId: string,
    ) {
        return await this.bookmarkService.updateBookmark(
            id,
            bookmarkId,
            editBookmarkDto,
        );
    }

    @Delete(':id')
    async deleteBookmark(
        @GetUser('id') id: string,
        @Param('id') bookmarkId: string,
    ) {
        return await this.bookmarkService.deleteBookmark(id, bookmarkId);
    }
}
