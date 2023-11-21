FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy files
COPY . .

# Install dependencies
RUN yarn --no-progress --frozen-lockfile --ignore-engines --ignore-scripts

# Build packages
RUN yarn build --scope client


FROM nginx:alpine AS runner

# Install bash
RUN apk add --no-cache bash

# Copy in all build artifacts
COPY --from=builder /usr/src/app/packages/client/dist /usr/share/nginx/html
COPY ./packages/client/server/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./packages/client/server/entrypoint.sh ./

# Begin serving the client
CMD ["./entrypoint.sh"]
