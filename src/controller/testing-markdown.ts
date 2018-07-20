import { Context } from '@curveball/core';

export default async (ctx: Context, next: Function) => {

  ctx.response.type = 'text/markdown';
  ctx.response.body = 
`Markdown
=========

We just added markdown support to the browser. How fun is that?

H2
--

### H3

#### H4

A paragraph. With *emphasis*. Or **bold**. ~~strikethrough~~

* List item 1
* List item 2

1. Ordered list.
2. Another item.
3. Hey

I am a [link](https://evertpot.com).

\`\`\`javascript
console.log('Some in-line code');
\`\`\`
`;

};
