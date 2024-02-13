FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS pruner

WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune client --docker


FROM base as builder

WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN pnpm build


FROM nginx:alpine AS runner

# Install bash
RUN apk add --no-cache bash

# Copy in all build artifacts
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html
COPY ./packages/client/server/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./packages/client/server/entrypoint.sh ./

# Begin serving the client
CMD ["./entrypoint.sh"]
