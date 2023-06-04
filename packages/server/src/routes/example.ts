import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

const BodySchema = Type.Object({ name: Type.String() });

type BodyType = Static<typeof BodySchema>;

export const exampleRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  fastify.post<{ Body: BodyType }>(
    '/',
    { schema: { body: BodySchema } },
    async (req) => {
      return { hello: req.body.name };
    },
  );
};
