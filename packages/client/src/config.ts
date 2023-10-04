interface Environment {
  apiHost: string;
}

declare global {
  // eslint-disable-next-line no-var
  var ENV: Environment;
}

/**
 * Extracts config values from process in dev and from the environment.js file in production.
 * Note: Vite will only include variables that are prefixed with VITE_ in the built application.
 * Please add any updates to `.env.example`, `server/entrypoint.sh`, and here.
 */
const config =
  globalThis.ENV ||
  ({
    apiHost: import.meta.env['VITE_API_HOST'],
  } as Environment);

export default config;
