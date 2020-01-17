const Snowflake = require('../');

const snowflake = new Snowflake();

const start = Date.now();

const total = 100000000;

const main = async () => {
  for (let i = 0; i < total; i++) {
    await snowflake.next();
    // console.log(await snowflake.next('hex'));
    // console.log(Number.parseInt(await snowflake.next('hex'), 16).toString(2));
  }

  const dur = Date.now() - start;
  console.log(dur, total / dur, total / dur * 60);
};

main();
