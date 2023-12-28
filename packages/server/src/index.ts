import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { eventRoutes, recurrenceRoutes } from './routes';
import { toIntOrUndefined } from './utils/parse';

const app = new Hono();

app.use('*', cors());

eventRoutes(app);
recurrenceRoutes(app);

serve({ fetch: app.fetch, port: toIntOrUndefined(process.env.PORT) });
