import { Context } from 'curveball';
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
 * This middleware listens for `embed=` query arguments and automatically
 * turns links matching this into an embedded HAL resource.
 */
export default async function middleware(ctx: Context, next: Function) {

  // If there was no push query variable, or no push support, skip.
  // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
  if (!(<Http2ServerResponse>ctx.res).stream || !ctx.query.push) {
    return next();
  }

  // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
  if (!(<HttpServerResponse>ctx.res).stream.pushAllowed) {
    console.log('Client has push disabled');
    return next();
  }

  await next();

  if (!ctx.response.is(supportedTypes)) {
    return;
  }

  // Lets see if there's a link with this name.
  if (!ctx.response.body || !ctx.response.body._links || !ctx.response.body._links[ctx.query.push]) {
    return;
  }

  const rel = ctx.query.push;

  let links = ctx.response.body._links[rel];

  const isArray = Array.isArray(links);
  if (!isArray) {
    links = [links];
  }

  const promises = [];
  for (const link of links) {
    await push(link, ctx);
  }

}

async function push(link: Link, ctx: Context) {

  console.log('Maybe pushing', link.href);

  if (link.href.substring(0, 1) !== '/') {
    // Skipping all non-relative links
    console.log('Ignoring', link.href, 'because it doesn\'t start with /');
    return;
  }

  const response = await fetch(
    url.resolve('http://localhost:3080/', link.href),
    {
      headers: {
        Accept: supportedTypes.join(';')
      }
    }
  );

  console.log('Pushing', link.href);

  // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
  (<HttpServerResponse>ctx.res).stream.on('error', err => {
    console.log(err);
  });

  // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
  if (!(<HttpServerResponse>ctx.res).stream.pushAllowed) {
    console.log('Client has push disabled');
    return;
  }

  // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
  (<Http2ServerResponse>ctx.res).createPushResponse(
    {
      ':path': link.href,
      ':status': response.status
    },
    async (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      res.stream.on('error', err => {
        console.log('push stream error', err);
      });


      res.statusCode = response.status;

      const forbiddenHeaders = [
        'connection'
      ];

      // @ts-ignore node-fetch package is out of date
      for(const key of response.headers.keys()) {
        if (forbiddenHeaders.includes(key)) {
          continue;
        }

        res.setHeader(key, response.headers.get(key));
      };
      // @ts-ignore Koa.res is not Http2ServerResponse, but it should.
      if (!(<HttpServerResponse>ctx.res).stream.pushAllowed) {
        console.log('Client has push disabled');
        return;
      }
      res.end(await response.buffer());
    }
  );

  /*
  const json = await response.json();

  return json;
   */

}
