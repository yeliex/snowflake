const Snowflake = require('../lib');

const snowflake = new Snowflake();

const main = async () => {
  console.log(await snowflake.next());
};


