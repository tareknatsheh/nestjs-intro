import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateBookmarkDto } from '../src/bookmark/dto/create-bookmarrk.dto';

describe('smoke test', () => {
    let app: INestApplication;
    let prisma: PrismaService;

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
        await app.listen(3333);
        prisma = app.get(PrismaService);
        pactum.request.setBaseUrl('http://localhost:3333');
        await prisma.cleanDb();
    });

    afterAll(async () => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'test@gmail.com',
            password: '123123',
            name: 'john',
        };
        describe('register', () => {
            it('should register new user', async () => {
                return pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(HttpStatus.CREATED);
            });
            it('should throw an error if duplicate user email', async () => {
                return pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(HttpStatus.FORBIDDEN)
                    .expectBodyContains('Email already exist');
            });
            it('should throw an error if email is empty', async () => {
                return pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({ password: '123' })
                    .expectStatus(HttpStatus.BAD_REQUEST)
                    .expectBodyContains('email should not be empty');
            });
        });
        describe('login', () => {
            it('should login', async () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .stores('userToken', 'access_token');
            });
        });
    });
    describe('Users', () => {
        it('should get /me', async () => {
            return pactum
                .spec()
                .get('/users/me')
                .withBearerToken('$S{userToken}')
                .expectStatus(HttpStatus.OK);
        });

        it('should update me user', async () => {
            const editUserDto = { name: 'john doe' };
            return pactum
                .spec()
                .patch('/users')
                .withBody({ ...editUserDto })
                .withBearerToken('$S{userToken}')
                .expectStatus(HttpStatus.OK)
                .expectBodyContains(editUserDto.name);
        });
    });
    describe('Bookmarks', () => {
        const bookmarkDto: CreateBookmarkDto = {
            title: 'Google',
            description: 'Search engine',
            link: 'https://google.com',
        };
        it('should create bookmark', async () => {
            return pactum
                .spec()
                .post('/bookmarks')
                .withBody(bookmarkDto)
                .withBearerToken('$S{userToken}')
                .expectStatus(HttpStatus.CREATED)
                .expectBodyContains(bookmarkDto.title)
                .stores('bookmarkId', 'id');
        });
        describe('Edit bookmark', () => {
            it('should edit bookmark by id', async () => {
                const editBookmarkDto = { title: 'Facebook' };
                return pactum
                    .spec()
                    .patch('/bookmarks/$S{bookmarkId}')
                    .withBody(editBookmarkDto)
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(editBookmarkDto.title)
                    .expectBodyContains(bookmarkDto.description)
                    .expectBodyContains(bookmarkDto.link);
            });

            it('should not edit bookmark by id if not owner', async () => {
                // Create a new bookmark
                await pactum
                    .spec()
                    .post('/bookmarks')
                    .withBody({ ...bookmarkDto, title: 'snapchat' })
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.CREATED)
                    .stores('bookmarkId', 'id');

                const newUserDto: AuthDto = {
                    email: 'newuser@email.com',
                    password: '123123',
                    name: 'new user',
                };
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(newUserDto)
                    .expectStatus(HttpStatus.CREATED)
                    .stores('newUserToken', 'access_token');

                const editBookmarkDto = { title: 'Twitter' };
                return pactum
                    .spec()
                    .patch('/bookmarks/$S{bookmarkId}')
                    .withBody(editBookmarkDto)
                    .withBearerToken('$S{newUserToken}')
                    .expectStatus(HttpStatus.FORBIDDEN);
            });
        });

        describe('Delete bookmark', () => {
            it('should delete bookmark by id', async () => {
                await pactum
                    .spec()
                    .get('/bookmarks/$S{bookmarkId}')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.OK);

                await pactum
                    .spec()
                    .delete('/bookmarks/$S{bookmarkId}')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.OK);

                await pactum
                    .spec()
                    .get('/bookmarks/$S{bookmarkId}')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.NOT_FOUND);
            });
            it('should not delete bookmark by id if not owner', async () => {
                // Create a new bookmark
                await pactum
                    .spec()
                    .post('/bookmarks')
                    .withBody({ ...bookmarkDto, title: 'instagram' })
                    .withBearerToken('$S{userToken}')
                    .expectStatus(HttpStatus.CREATED)
                    .stores('bookmarkId', 'id')
                    .inspect();

                await pactum
                    .spec()
                    .delete('/bookmarks/$S{bookmarkId}')
                    .withBearerToken('$S{newUserToken}')
                    .expectStatus(HttpStatus.FORBIDDEN);
            });
        });
    });
});
