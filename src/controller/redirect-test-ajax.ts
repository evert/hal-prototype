import { Context } from '@curveball/core';

export default (ctx: Context) => {

  const status = ctx.state.params.status;
  ctx.response.type = 'text/html';
  ctx.response.body = `
<h1>${status}</h1>
<form method="post" action="/redirect-test/${status}">
<input type="submit">
</forM>
`;

};
