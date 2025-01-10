import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Automatically remove properties that do not match the DTO
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Nest API')
        .setDescription('A demo API built with NestJS')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
