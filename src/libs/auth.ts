import { Context } from 'koa';
import * as Debug from 'debug';
import config from './Config';
import Error from './Error';

const debug = Debug('snowflake:request:auth');

const authRequired = config.security.token.length;
const tokens = config.security.token;

export default async (ctx: Context) => {
    if (!authRequired) {
        return;
    }
    const token = ctx.get('X-TOKEN') || ctx.query.token;

    if (!token) {
        debug(token, 'unauthed');
        throw new Error(403);
    }

    if (!tokens.includes(token)) {
        debug(token, 'unauthed');
        throw new Error(403);
    }
    debug(token, 'authed');
}
