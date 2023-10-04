FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install python3
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY yarn.lock ./
COPY package.json ./
COPY ./packages/lib/package.json ./packages/lib/package.json
COPY ./packages/server/package.json ./packages/server/package.json

RUN yarn --no-progress --frozen-lockfile --ignore-engines

# Copy source code
COPY ./packages/lib ./packages/lib
COPY ./packages/server ./packages/server

# Build lib and server
RUN yarn lib build
RUN yarn server build

# Remove dev dependencies
RUN yarn --no-progress --frozen-lockfile --ignore-engines --ignore-scripts --production


FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy in node modules and root package.json
COPY package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy in lib build artifacts
COPY --from=builder /usr/src/app/packages/lib/package.json ./packages/lib/package.json
COPY --from=builder /usr/src/app/packages/lib/dist ./packages/lib/dist

# Copy in server build artifacts
COPY --from=builder /usr/src/app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /usr/src/app/packages/server/dist ./packages/server/dist

# Begin serving the server
CMD ["yarn", "server", "start"]
