import auth from '../libs/auth';
import config from '../libs/Config';
import Snowflake from '@yeliex/snowflake';

const snowflake = new Snowflake({

});

export default async (ctx, next) => {
    await auth(ctx);

    const acceptJson = (ctx.get('accept') === 'application/json') || ctx.query.type === 'json';


}
