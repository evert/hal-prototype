import { Context } from 'koa';
import highlight from 'highlight.js';

export default async function middleware(ctx: Context, next: Function) {

  if (!ctx.accepts('text/html')) {
    return next();
  }

  await next();

  if (ctx.response.is('application/json', 'application/hal+json')) {

    ctx.type = 'text/html';
    generateHtmlIndex(ctx, ctx.body);

  }

}

function generateHtmlIndex(ctx: Context, body: Object) {

  const jsonBody = syntaxHighlightJson(body);
  const links = generateLinks(body);

  ctx.body = `
<!DOCTYPE html>
<html>
  <head>
    <title>HAL prototyper</title>
    <link rel="stylesheet" href="/css/main.css" type="text/css" />
    <link rel="stylesheet" href="/css/solarized-dark.css" type="text/css" />
  </head>
  <body>
    <header>
      <h1>HAL prototyper</h1>
    </header>

    <main>
      ${links}

      <h2>Body</h2>
      <code class="hljs"><pre>${jsonBody}</pre></code>

    </main>

  </body>
</html>
`;

  console.log(ctx.body);

}

function h(input: string): string {

  const map: { [s: string]: string } = {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '"' : '&quot'
  };

  return input.replace(/&<>"/g, s => map[s]);

}

function syntaxHighlightJson(body: Object): string {

  return highlight.highlight('json', JSON.stringify(body, undefined, '  ')).value;

}

function generateLinks(body: any): string {

  if (!body._links) return;

  let linkHtml = '';

  for (const rel in body._links) {

    const links =
      Array.isArray(body._links[rel]) ?
      body._links[rel] :
      [body._links[rel]];

    const linkCount = links.length;
    let first = true;

    for (const link of links) {

      linkHtml += `<tr>`;
      if (first) {
        linkHtml += `<td rowspan="${linkCount}">${h(rel)}</td>`;
        first = false;
      }
      linkHtml += `<td><a href="${h(link.href)}">${h(link.href)}</a></td>`;
      linkHtml += `<td>` + (link.title ? h(link.title) : '') + `</td>`;
      linkHtml += `</tr>\n`;

    }


  }

  return `
    <h2>Links</h2>
    <table>
      <tr>
        <th>Relationship</th><th>Url</th><th>Title</th>
      </tr>
      ${linkHtml}
    </table>
  `;

}

