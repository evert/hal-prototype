import { Context } from 'koa';
import fetch from 'node-fetch';
import url from 'url';

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

  if (!ctx.query.embed) {
    return next();
  }

  await next();

  if (!ctx.response.is(supportedTypes)) {
    return;
  }

  // Lets see if there's a link with this name.
  if (!ctx.response.body || !ctx.response.body._links || !ctx.response.body._links[ctx.query.embed]) {
    return;
  }

  const rel = ctx.query.embed;

  let links = ctx.response.body._links[rel];

  const isArray = Array.isArray(links);
  if (!isArray) {
    links = [links];
  }

  const promises = [];
  for (const link of links) {
    promises.push(embed(link));
  }
  const result = (await Promise.all(promises)).filter( item => !!item );
  if (!ctx.response.body._embedded) {
    ctx.response.body._embedded = {};
  }

  if (!ctx.response.body._embedded[rel]) {
    ctx.response.body._embedded[rel] =
      result.length === 1 && !isArray ? result[0] : result;
  } else {
    // Something was already in there, we're gonna merge it.
    ctx.response.body._embedded[rel] =
      ctx.response.body._embedded[rel].concat(result);
  }

}

async function embed(link: Link) {

  if (link.href.substring(0, 1) !== '/') {
    // Skipping all non-relative links
    return;
  }

  const response = await fetch(
    url.resolve('http://localhost:3000/', link.href),
    {
      headers: {
        Accept: supportedTypes.join(';')
      }
    }
  );

  // Is this a response we can embed?
  const contentType = response.headers.get('content-type').split(';')[0];
  if (!supportedTypes.includes(contentType)) {
    return;
  }

  const json = await response.json();

  return json;

}
