FROM node:20-alpine as base


FROM base AS pruner

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune client --docker


FROM base as builder

WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --no-progress --frozen-lockfile --ignore-engines --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN yarn build


FROM nginx:alpine AS runner

# Install bash
RUN apk add --no-cache bash

# Copy in all build artifacts
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html
COPY ./packages/client/server/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./packages/client/server/entrypoint.sh ./

# Begin serving the client
CMD ["./entrypoint.sh"]
