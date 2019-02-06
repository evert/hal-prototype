import { Context } from '@curveball/core';

export default async (ctx: Context, next: Function) => {

  ctx.response.type = 'application/hal+json';

  ctx.response.body = {

    _links: {
      self: { href: '/testing' },
      previous: { href: '/testing/?page=1', title: 'Previous page', },
      next: { href: '/testing/?page=2', title: 'Next page' },
      author: { href: 'https://evertpot.com', title: 'Evert Pot' },
      help: { href: 'https://google.com/', title: 'Google it' },
      search: { href: 'https://google.com/{?q}', templated: true },
      edit: { href: ctx.request.path },
      'create-form': { href: ctx.request.path },
      'my-link': { href: '/foo-bar', title: 'Custom link' },
      alternate: [
        { href: '/testing/markdown', type: 'text/markdown', title: 'Markdown test' },
        { href: '/testing/csv', type: 'text/csv', title: 'Csv test' },
        { href: '/testing/rss', type: 'application/rss+xml', title: 'RSS' },
        { href: '/testing/rss', type: 'application/atom+xml', title: 'Atom' },
      ],
      'code-repository': { href: 'https://github.com/evert/hal-browser' },
      'redirect-test': { href: '/redirect-test' }
    },

    msg: 'Hello world!',
    version: require(__dirname + '/../../node_modules/hal-browser/package.json').version,
    name: "test resource!"

  }

};
