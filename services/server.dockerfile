FROM node:20-alpine as base


FROM base AS pruner

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune server --docker


FROM base as builder

WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --no-progress --frozen-lockfile --ignore-engines --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN yarn build

RUN yarn --no-progress --frozen-lockfile --ignore-engines --ignore-scripts --production


FROM base as runner

WORKDIR /app
COPY --from=builder /app .

CMD ["node", "/app/packages/server/dist/index.js"]
