import { Context } from '@curveball/core';

const allowedHeaders = [
  'Content-Type',
  'User-Agent',
];

const allowedOrigin = [
  '*',
];

/**
 * This middleware sets CORS headers to anything may call it.
 */
export default async function middleware(ctx: Context, next: Function) {
  ctx.response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
  ctx.response.headers.set('Access-Control-Allow-Origin', allowedOrigin.join(','));

  if (ctx.request.method === 'OPTIONS' && ctx.request.headers.get('Origin')) {
    // It was a preflight-request. Don't call other middlewares.
    ctx.response.body = '';
    ctx.response.status = 204;
    return;
  }

  return next();
}
