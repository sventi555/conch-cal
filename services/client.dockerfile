FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install python3 for nx
RUN apk add --no-cache python3 make g++

# Copy in monorepo configuration files
COPY lerna.json ./
COPY nx.json ./

# Install dependencies
COPY yarn.lock ./
COPY package.json ./
COPY ./packages/lib/package.json ./packages/lib/package.json
COPY ./packages/client/package.json ./packages/client/package.json

RUN yarn --no-progress --frozen-lockfile --ignore-engines

# Copy source code
COPY ./packages/lib ./packages/lib
COPY ./packages/client ./packages/client

# Build lib and client
RUN yarn build


FROM nginx:alpine AS runner

# Install bash
RUN apk add --no-cache bash

# Copy in all build artifacts
COPY --from=builder /usr/src/app/packages/client/dist /usr/share/nginx/html
COPY ./packages/client/server/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./packages/client/server/entrypoint.sh ./

# Begin serving the client
CMD ["./entrypoint.sh"]
