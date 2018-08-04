# snowflake
server to generate uniq-id with twitter-snowflake arithmetic


![https://hub.docker.com/r/yeliex/snowflake/](https://img.shields.io/badge/-docker-blue.svg?type=flat-square&logo=docker)
![https://hub.docker.com/r/yeliex/snowflake/](https://img.shields.io/github/package-json/v/yeliex/snowflake.svg?type=flat-square&logo=docker&label=version)
![https://npmjs.org/package/@yeliex/snowflake](https://img.shields.io/npm/v/@yeliex/snowflake.svg?type=flat-square&logo=npm&label=@yeliex/snowflake)

### Usage
```bash
$ docker run -p 3000:3000 --name snowflake yeliex/snowflake
$ curl localhost:3000
# or
$ curl localhost:3000?type=json
# or
$ curl -H "Accept: application/json" localhost:3000
```

## Authorization
```bash
$ docker run -p 3000:3000 --name snowflake -v ./config:/snowflake/config yeliex/snowflake

# config/config.yml
security:
  token:
    - token1
    - token2
    
$ curl -H "X-TOKEN: token1" localhost:3000
# OR
$ curl localhost:3000?token=token1
```

### Configuration
- production: /snowflake/config.yml
- development: ./config/config.yml

```bash
# Server base
server:
  listenPort: 3000

snowflake:
  region: 1
  worker: 1
  endpoint: 1 # replace region and worker

security:
  token: # if empty, run without auth
    - token1
    - token2
```

### api
#### ALL /_health
health check

#### GET /
gen id
##### Return json
`/?type=json` OR header `Accept: application/json`

##### Auth
`/?token=token` OR header `X-Token: token`
