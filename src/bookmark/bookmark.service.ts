import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    async getAllBookmarks(userId: string) {
        return await this.prisma.bookmark.findMany({
            where: {
                userId,
            },
        });
    }

    async getBookmarkById(bookmarkId: string) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }
        return bookmark;
    }

    async createBookmark(
        userId: string,
        data: { link: string; title: string; description: string },
    ) {
        return await this.prisma.bookmark.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async updateBookmark(
        userId: string,
        bookmarkId: string,
        data: EditBookmarkDto,
    ) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }
        if (bookmark.userId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to edit this bookmark',
            );
        }
        return await this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: { ...data },
        });
    }

    async deleteBookmark(userId: string, bookmarkId: string) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }
        if (bookmark.userId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to delete this bookmark',
            );
        }
        return await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
