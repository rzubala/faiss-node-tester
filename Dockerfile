FROM node:20-alpine

ENV APP_ROOT=/app

RUN apk update && apk upgrade && apk add bash

RUN corepack enable

COPY . ${APP_ROOT}/

WORKDIR ${APP_ROOT}

RUN pnpm install

CMD ["node", "src/index.js"]