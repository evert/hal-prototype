import { Context } from 'curveball';
import { HttpError } from '../errors';

export default async function middleware(ctx: Context, next: Function) {

  try {

    await next();

  } catch (error) {

    if (error instanceof HttpError) {
      emitError(ctx, error.httpCode, error);
    } else {
      emitError(ctx, 500, error);
    }
  }

}

function emitError(ctx: Context, httpCode: number, error: Error) {

  ctx.response.status = httpCode;
  ctx.response.headers.set('Content-Type', 'application/problem+json');
  ctx.response.body = {

    type: 'https://evertpot.com/errors/' + httpCode,
    title: error.message,
    status: httpCode

  };

  console.error(error);

}
