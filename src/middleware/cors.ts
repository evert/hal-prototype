import { Context } from 'curveball';

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
  ctx.response.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
  ctx.response.set('Access-Control-Allow-Origin', allowedOrigin.join(','));

  if (ctx.method === 'OPTIONS' && ctx.request.get('Origin')) {
    // It was a preflight-request. Don't call other middlewares.
    ctx.body = '';
    ctx.status = 204;
    return;
  }

  return next();
}
