import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { toIntOrUndefined } from 'lib';
import { eventRoutes } from './routes/event';

const app = new Hono();

app.use('*', cors());

eventRoutes(app);

serve({ fetch: app.fetch, port: toIntOrUndefined(process.env.PORT) });
