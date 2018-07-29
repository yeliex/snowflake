const Snowflake = require('../');

const snowflake = new Snowflake();

const obj = {};

const handler = async (i) => {
  const id = await snowflake.next();
  if (obj[id]) {
    console.log('exist', id);
  }
  obj[id] = true;
  // console.log(i, await snowflake.next(), Date.now());
};

const main = () => {
  for (let i = 0; i < 100; i++) {
    handler(i);
  }
};

main();
