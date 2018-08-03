const Snowflake = require('../');

const snowflake = new Snowflake();

const start = Date.now();

const handler = async (i) => {
  await snowflake.next();

  if (i === 99999) {
    const dur = Date.now() - start;
    console.log(dur, 100000 / dur);
  }
};

const main = () => {
  for (let i = 0; i < 100000; i++) {
    handler(i);
  }
};

main();
