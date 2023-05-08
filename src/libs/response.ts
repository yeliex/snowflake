import { Middleware } from 'koa';
import Debug from 'debug';
import createError from 'http-errors';

const debug = Debug('snowflake:response');

const ResponseMiddleware: Middleware = async (ctx, next) => {
    ctx.throw = ((code: number, message?: string) => {
        if (!message) {
            if ((code as any as Error) instanceof Error) {
                message = (code as any as Error).message;
                code = (<any> Error).code || 500;
            } else if (!code) {
                code = 404;
                message = createError(404).message;
            } else if (isNaN(Number(code))) {
                message = code as any;
                code = 500;
            } else {
                message = createError(code, message as any).message;
            }
        }
        if ((message as any) instanceof Error) {
            message = (message as any as Error).message || createError(code).message;
        }

        debug(code, message);

        const acceptJson = (ctx.get('accept') === 'application/json') || ctx.query.type === 'json';

        if (acceptJson) {
            ctx.set('content-type', 'application/json; charset=utf-8');
        } else {
            ctx.set('content-type', 'text/html; charset=utf-8');
        }

        if (acceptJson) {
            const data = <any> {
                code,
            };
            if (code < 400) {
                data.data = message;
            } else {
                data.message = message;
            }
            ctx.body = JSON.stringify(data);
        } else {
            ctx.body = message;
        }
        ctx.status = code;
    }) as any;

    await next();
};

export default ResponseMiddleware;
