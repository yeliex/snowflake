const { v4: uuid } = require('uuid');

const start = Date.now();

const total = 100000000;

for (let i = 0; i < total; i++) {
  uuid();
}

const dur = Date.now() - start;

console.log(dur, total / dur, total / dur * 60);
