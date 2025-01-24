import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('smoke test', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true, // Automatically remove properties that do not match the DTO
            }),
        );
        await app.init();
    });

    afterAll(() => {
        app.close();
    });

    it.todo('should pass');
});
