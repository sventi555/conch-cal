import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { toInt } from 'lib';
import { eventRoutes } from './routes/event';

const app = new Hono();

eventRoutes(app);

serve({ fetch: app.fetch, port: toInt(process.env.PORT) });
