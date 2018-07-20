import { Context } from '@curveball/core';

export default (ctx: Context) => {

  switch(ctx.state.params.status) {
    case 300: 
      ctx.response.status = 300;
      ctx.response.headers.append('Link', [
        '</foo> rel="alternate"',
        '</bar> rel="alternate"',
      ]);
      ctx.response.headers.set('Content-Type', 'text/html');
      ctx.response.headers.set('Location', 'http://localhost:3080/');
      ctx.response.body = '<h3>Multiple choices</h3>';
      ctx.response.body = '';
    break;
    default: 
      ctx.response.status = parseInt(ctx.state.params.status,10);
      ctx.response.headers.set('Content-Type', 'text/html');
      ctx.response.headers.set('Location', 'http://localhost:3080/');
      ctx.response.body = '<h3>'+ctx.state.params.status+'</h3>';
      ctx.response.body = '';
      break;

  }

};
