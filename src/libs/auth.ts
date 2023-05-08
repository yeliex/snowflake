import { Context } from 'koa';
import Debug from 'debug';
import config from './Config.js';
import Error from './Error.js';

const debug = Debug('snowflake:request:auth');

const authRequired = config.security.token && config.security.token.length;
const tokens = config.security.token;

export default async (ctx: Context) => {
    if (!authRequired) {
        return;
    }
    const token = ctx.get('X-TOKEN') || ctx.query.token as string;

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
