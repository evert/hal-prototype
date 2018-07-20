import { Context } from '@curveball/core';

export default async (ctx: Context, next: Function) => {

  // Calling other middlewares first
  await next();

  // Decorating with some more properties.
  ctx.response.body._links['ep:testing'] = {
    href: '/testing',
  };

};
