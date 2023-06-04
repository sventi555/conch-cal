import fastify from 'fastify';
import { exampleRoutes } from './example';

describe('example routes', () => {
  const app = fastify();
  app.register(exampleRoutes);

  test('get /', async () => {
    const res = await app.inject({ method: 'GET', url: '/' });
    expect(res.statusCode).toEqual(200);
    expect(res.json()).toEqual({ hello: 'world' });
  });
});
