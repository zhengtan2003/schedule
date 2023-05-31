import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<T> {
        return next.handle().pipe(
            map((response = {}) => {
                const {success = true, showType, data, ...rest} = response;
                return {
                    data,
                    showType,
                    success,
                    message: success ? '操作成功' : '操作失败',
                    ...rest,
                };
            }),
        );
    }
}
