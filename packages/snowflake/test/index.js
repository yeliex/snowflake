const Snowflake = require('../');

const snowflake = new Snowflake();

const start = Date.now();

const total = 3000000;

const handler = async (i) => {
  await snowflake.next();

  if (i === total - 1) {
    const dur = Date.now() - start;
    console.log(dur, total / dur);
  }
};

const main = () => {
  for (let i = 0; i < total; i++) {
    handler(i);
  }
};

main();
