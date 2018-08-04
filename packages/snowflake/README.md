# snowflake
a javascript implement of twitter-snowflake uniq-id generation arithmetic

![https://npmjs.org/package/@yeliex/snowflake](https://img.shields.io/npm/v/@yeliex/snowflake.svg?type=flat-square)
![https://hub.docker.com/r/yeliex/snowflake/](https://img.shields.io/badge/-docker-blue.svg?type=flat-square&logo=docker)

### Installation
```bash
$ npm i @yeliex/snowflake -S
# OR
$ yarn add @yeliex/snowflake
```

### Usage
```javascript
const Snowflake = require('@yeliex/snowflake');

const snowflake = new Snowflake();

snowflake.next().then((id)=>{
  console.log(id.toString('hex'));
})
```

### Api
#### class Snowflake
##### constructor: (options: SnowFlakeOption)
##### public async next: () => Promise(Buffer)
async return flake id
##### public static await: (ms: number) => Promise

##### static readonly endpointId: string 
endpoint id gen with hostname(docker only) or ip
##### static readonly MAX_SEQUENCE: number
##### static readonly MAX_ENDPOINT: number
##### static readonly MAX_WORKER: number
##### static readonly MAX_DATACENTER: number
##### readonly worker: number
##### readonly mark: SnowFlakeMark
##### readonly offset: number

#### SnowFlakeOption
```typescript
type SnowFlakeMark = 0 | 1;

interface SnowFlake {
    mark?: SnowFlakeMark
    datacenter?: number
    worker?: number
    endpoint?: number // if set, datacenter and worker would be ignored
    offset?: number // timestamp offset, default 0
}
```
