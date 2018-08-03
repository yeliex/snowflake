import Config from './libs/Config';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as Debug from 'debug';
import Controller from './controller';
import response from './libs/response';

const debug = Debug('snowflake:app');
const debugRequest = Debug('snowflake:app:request');

const app = new Koa();

app.use(response);

const errorHandler = (error: any, ctx: Koa.Context) => {
    ctx.throw(error.status || error.id || error.code || 500, error.message || error.error || error);
};

// 处理异常捕获
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        errorHandler(error, ctx);
    }
});

app.on('error', errorHandler);

app.use(async (ctx, next) => {
    debugRequest(`${ctx.originalUrl} ${ctx.request.type}`);
    await next();
});

const router = new KoaRouter();

router.get('/_health', async (ctx) => {
    ctx.throw(200, 'success');
});

router.get('/', Controller);

router.all('*', async (ctx) => {
    ctx.throw();
});

app.use(router.routes()).use(router.allowedMethods({throw: true}));

app.listen(Config.server.listenPort, () => {
    debug('start listen at', Config.server.listenPort);
});
