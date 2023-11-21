interface Environment {
  hosts: {
    api: string;
  };
  firebase: {
    apiKey: string;
    projectId: string;
    appId: string;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var ENV: Environment;
}

const getEnv = (): Environment => ({
  hosts: {
    api: import.meta.env['VITE_API_HOST'],
  },
  firebase: {
    apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
    projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
    appId: import.meta.env['VITE_FIREBASE_APP_ID'],
  },
});

/**
 * Extracts config values from process in dev and from the environment.js file in production.
 * Note: Vite will only include variables that are prefixed with VITE_ in the built application.
 * Please add any updates to `.env.example`, `server/entrypoint.sh`, and here.
 */
const config = globalThis.ENV || getEnv();
export default config;
