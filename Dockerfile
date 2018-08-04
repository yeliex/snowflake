FROM node:alpine

RUN apk add curl openssl --no-cache && \
    mkdir -p /snowflake && \
    mkdir -p /snowflake/config

WORKDIR /snowflake

COPY ./ ./

RUN yarn --prod=false && \
    npm run build && \
    rm -rf src/ node_modules/ tsconfig.json && \
    yarn --prod && \
    yarn cache clean

CMD node index.js
