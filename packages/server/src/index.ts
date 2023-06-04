import 'dotenv/config';

import cors from '@fastify/cors';
import Fastify from 'fastify';
import { toInt } from 'lib';
import { exampleRoutes } from './routes';

const fastify = Fastify({ logger: true });

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send();
});

fastify.register(cors);

fastify.register(exampleRoutes);

(async () => {
  try {
    await fastify.listen({
      host: '0.0.0.0',
      port: toInt(process.env.PORT) || 3001,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
