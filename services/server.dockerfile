FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy files
COPY . .

# Install dependencies
RUN yarn --no-progress --frozen-lockfile --ignore-engines --ignore-scripts

# Build packages
RUN yarn build --scope server

# Remove dev dependencies
RUN yarn --no-progress --frozen-lockfile --ignore-engines --ignore-scripts --production

# Begin serving server
CMD ["yarn", "server", "start"]
