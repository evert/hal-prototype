import { Application, Context } from '@curveball/core';
import http2 from 'http2';
import fs from 'fs';

import cors from './middleware/cors';
import FileBackend from './resource-store/file-backend';
import resourceStore from './resource-store/middleware';
import browser from './middleware/browser';
import halEmbed from './middleware/hal-embed';
import halPush from './middleware/hal-push';
import problem from './middleware/problem';

const port = 3080;
const httpsPort = 3443;

const options = {
  key: fs.readFileSync(__dirname + '/../keys/localhost-privkey.pem'),
  cert: fs.readFileSync(__dirname + '/../keys/localhost-cert.pem')
};

const app = new Application();

app.use(cors);
app.use(browser);
app.use(problem);
app.use(halEmbed);
app.use(halPush(app));

app.use( (ctx, next) => {

  if (ctx.request.path !== '/300') {
    return next();
  }

  ctx.response.status = 300;
  ctx.response.headers.append('Link', [
    '</foo> rel="alternate"',
    '</bar> rel="alternate"',
  ]);
  ctx.response.headers.set('Content-Type', 'text/html');
  ctx.response.headers.set('Location', 'http://localhost:3080/');
  ctx.response.body = '<h3>Multiple choices</h3>';
  ctx.response.body = '';

});

const fileBackend = new FileBackend(__dirname + '/../blobs');
app.use(resourceStore(fileBackend));

const http2Server = http2.createSecureServer(options, app.callback()).listen(httpsPort);

console.log('Listening on port ' + httpsPort);

app.listen(port);

console.log('Listening on port ' + port);
