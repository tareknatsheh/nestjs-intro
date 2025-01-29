import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('BookmarkService', () => {
    let service: BookmarkService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [BookmarkService],
        }).compile();

        service = module.get<BookmarkService>(BookmarkService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
