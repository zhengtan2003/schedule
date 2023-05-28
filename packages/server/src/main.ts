import {AppModule} from './app.module';
import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {TransformInterceptor} from './interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    const options = new DocumentBuilder()
        .setTitle('Schedule')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger-doc', app, document);
    await app.listen(3000);
}

bootstrap();
