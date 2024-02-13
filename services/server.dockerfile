FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS pruner

WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune server --docker


FROM base as builder

WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN pnpm build

RUN pnpm install --frozen-lockfile --ignore-scripts --prod


FROM base as runner

WORKDIR /app
COPY --from=builder /app .

CMD ["node", "/app/packages/server/dist/index.js"]
