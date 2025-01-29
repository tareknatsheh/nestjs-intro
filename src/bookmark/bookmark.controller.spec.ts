import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('BookmarkController', () => {
    let controller: BookmarkController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            controllers: [BookmarkController],
            providers: [BookmarkService],
        }).compile();

        controller = module.get<BookmarkController>(BookmarkController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
