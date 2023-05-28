import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Response<T> {
    success: boolean; // if request is success
    data: T; // response data
    errorCode?: string; // code for errorType
    errorMessage?: string; // message display to user
    showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
    traceId?: string; // Convenient for back-end Troubleshooting: unique request ID
    host?: string; // onvenient for backend Troubleshooting: host of current access server
}

const messageMap = {
    10000: '密码错误',
    10003: '用户不存在',
    10005: '用户已存在',
    10006: '权限不足',
};

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((response = {}) => {
                const {success = true, showType, data, ...rest} = response;
                return {
                    data,
                    showType,
                    success,
                    msg: success ? '操作成功' : '操作失败',
                    ...rest,
                };
            }),
        );
    }
}
