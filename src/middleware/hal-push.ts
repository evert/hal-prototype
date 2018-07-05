import { Middleware, Application, Context } from '@curveball/core';
import fetch from 'node-fetch';
import url from 'url';
import { Http2ServerResponse } from 'http2';

type Link = {
  href: string;
};

const supportedTypes = [
  'application/json',
  'application/hal+json'
];

/**
 * This middleware listens for `push=` query arguments and automatically
 * does HTTP/2 pushes for those relationships.
 */
export default function mw(app: Application): Middleware {

  return async(ctx, next) => {

    await next();

    // Do we support the content-type for push?
    if (!supportedTypes.includes(ctx.response.type)) {
      return;
    }

    // Did the client want a push?
    if (!ctx.request.query.push) {
      return;
    }

    // Lets see if there's a link with this name.
    if (!ctx.response.body || !ctx.response.body._links || !ctx.response.body._links[ctx.request.query.push]) {
      return;
    }

    const rel = ctx.request.query.push;

    let links = ctx.response.body._links[rel];

    const isArray = Array.isArray(links);
    if (!isArray) {
      links = [links];
    }

    const promises = [];
    for (const link of links) {
      await push(link, ctx, app);
    }

  }

}

async function push(link: Link, ctx: Context, app: Application) {

  console.log('Maybe pushing', link.href);

  if (link.href.substring(0, 1) !== '/') {
    // Skipping all non-relative links
    console.log('Ignoring', link.href, 'because it doesn\'t start with /');
    return;
  }

  await ctx.response.push( async pushCtx => {

    console.log('Doing a subrequest to ', link.href);

    pushCtx.request.path = link.href;
    pushCtx.response = await app.subRequest(
      'GET',
      link.href,
      {
        Accept: supportedTypes.join(';')
      }
    );
    console.log('Pushing', link.href);

  });

}
