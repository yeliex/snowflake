import Debug from 'debug';
import Snowflake from '@yeliex/snowflake';
import { type Middleware } from 'koa';
import auth from '../libs/auth.js';
import config from '../libs/Config.js';

const debug = Debug('snowflake:flake');

const snowflake = new Snowflake({
    datacenter: config.snowflake.datacenter,
    offset: config.snowflake.offset,
    worker: config.snowflake.worker,
    endpoint: config.snowflake.endpoint,
});

const handler: Middleware = async (ctx) => {
    await auth(ctx);

    const id = (await snowflake.next('hex'));

    ctx.throw(200, id);

    debug(new Date(), id);
};

export default handler;
