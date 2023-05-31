import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = HttpStatus.UNPROCESSABLE_ENTITY; // 自定义状态码，例如 422
        console.log('ValidationExceptionFilter')
        response.status(status).json({
            statusCode: status,
            message: 'Validation Error',
        });
    }
}
