import { Context } from 'koa';
import * as Debug from 'debug';
import * as createError from 'http-errors';

const debug = Debug('snowflake:response');

export default async (ctx: Context, next) => {
    // @ts-ignore
    ctx.throw = (code, message?) => {
        if (!message) {
            if (code instanceof Error) {
                message = code.message;
                code = (<any>Error).code || 500;
            } else if(!code){
                code = 404;
                message = createError(404).message;
            } else if (isNaN(Number(code))) {
                message = code;
                code = 500;
            } else {
                message = createError(code, message).message;
            }
        }
        if (message instanceof Error) {
            message = message.message || createError(code).message;
        }

        debug(code, message);

        const acceptJson = (ctx.get('accept') === 'application/json') || ctx.query.type === 'json';

        if (acceptJson) {
            ctx.set('content-type', 'application/json; charset=utf-8');
        } else {
            ctx.set('content-type', 'text/html; charset=utf-8');
        }

        if (acceptJson) {
            const data = <any>{
                code
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
    };

    await next();
}
