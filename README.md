# Fullstack Template

This is a template for a fullstack web application.
It is laid out as a monorepo composed of 3 packages by default:
- [client](./packages/client/README.md): Frontend application built with [Vite](https://vitejs.dev/)
- [server](./packages/server/README.md): Backend API built with [Hono](https://hono.dev/)
- [lib](./packages/lib/README.md): Library containing shared code used in both the client and server

## Requirements

- Node.js v20+

## Getting Started

Install dependencies:
```
yarn
```

Start the app in dev mode:
```
yarn dev
```

Commands can be run in the package workspaces by prefixing the command with the package name.

For example:
```
yarn client test
```

## Releasing

This repository contains a workflow that publishes docker images (client + server) to the specified GCP artifact registry.
In order to publish images, the following GitHub Actions variables and secrets need to be set.

### Variables

- `IMAGE_REGISTRY`: the location of the image registry being published to.

### Secrets

- `GCP_CREDS`: a base64 encoded service account key json file.
The service account should have read/write permissions on the artifact registry.
