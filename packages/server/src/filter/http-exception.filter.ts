import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const status = exception.getStatus();
        const response: any = exception.getResponse();
        console.log(exception)
        console.log(host)
        const msg = Array.isArray(response?.message) ? response?.message.join(',') : response?.message;
        ctx.getResponse().status(status).json({
            success: false,
            showType: 2,
            msg,
        });
    }
}
