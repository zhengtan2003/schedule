interface Response {
    data?: any,
    success?: boolean,
    message?: string,
    showType?: number,

    [key: string]: any
}

export class HttpResponse {
    constructor(response?: Response) {
        const { data, success = true, message = '操作成功', showType, ...rest } = response || {};
        return {
            data,
            showType,
            success,
            message,
            ...rest,
        };
    }
}