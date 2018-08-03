import * as Debug from 'debug';
import Snowflake from '@yeliex/snowflake';
import auth from '../libs/auth';
import config from '../libs/Config';

const debug = Debug('snowflake:flake');

const snowflake = new Snowflake({
    datacenter: config.snowflake.datacenter,
    offset: config.snowflake.offset,
    worker: config.snowflake.worker,
    endpoint: config.snowflake.endpoint
});

export default async (ctx) => {
    await auth(ctx);

    const id = (await snowflake.next()).toString('hex');

    ctx.throw(200, id);

    debug(new Date(), id);
}
