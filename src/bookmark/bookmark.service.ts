import { Injectable, NotFoundException } from '@nestjs/common';
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

    async updateBookmark(bookmarkId: string, data: EditBookmarkDto) {
        return await this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: { ...data },
        });
    }

    async deleteBookmark(bookmarkId: string) {
        return await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
