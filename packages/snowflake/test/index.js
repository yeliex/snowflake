const Snowflake = require('../');

const snowflake = new Snowflake();

const start = Date.now();

const total = 100000000;

const main = async () => {
  for (let i = 0; i < total; i++) {
    await snowflake.next();
  }

  const dur = Date.now() - start;
  console.log(dur, total / dur);
};

main();
