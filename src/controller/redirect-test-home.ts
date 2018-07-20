import { Context } from '@curveball/core';

export default (ctx: Context) => {

  ctx.response.type = 'application/hal+json';
  ctx.response.body = {
    _links: {
      'redir-300': { href: '/redirect-test/300' },
      'redir-307': { href: '/redirect-test/307' },
      'redir-308': { href: '/redirect-test/308' },
    }
  };

};
