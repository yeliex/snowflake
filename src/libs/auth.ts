import { Context } from 'koa';
import config from './Config';
import Error from './Error';

const authRequired = config.security.token.length;
const tokens = config.security.token;

export default async (ctx: Context) => {
    if (!authRequired) {
        return;
    }
    const token = ctx.get('X-TOKEN');

    if (!token) {
        throw new Error(403);
    }

    if (tokens.includes(token)) {

    }
}
