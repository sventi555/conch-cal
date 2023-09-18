import { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getAuth } from '../auth';

export const verifyToken: MiddlewareHandler<{
  Variables: {
    userId: string;
  };
}> = async (c, next) => {
  const token = c.req.header('Authorization');
  if (token == null || !token.startsWith('Bearer ')) {
    throw new HTTPException(401);
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token.split(' ')[1]);
    c.set('userId', decodedToken.uid);
    await next();
  } catch (err) {
    throw new HTTPException(401);
  }
};
