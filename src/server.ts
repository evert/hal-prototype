import { Application, Context } from '@curveball/core';
import http2 from 'http2';
import fs from 'fs';

import cors from './middleware/cors';
import FileBackend from './resource-store/file-backend';
import resourceStore from './resource-store/middleware';
import browser from 'hal-browser';
import halEmbed from './middleware/hal-embed';
import halPush from './middleware/hal-push';
import problem from './middleware/problem';
import routes from './routes';

const port = 3080;
const httpsPort = 3443;

const options = {
  key: fs.readFileSync(__dirname + '/../keys/localhost-privkey.pem'),
  cert: fs.readFileSync(__dirname + '/../keys/localhost-cert.pem')
};

const app = new Application();

app.use( (ctx, next) => {
  console.log(ctx.request.method + ' ' + ctx.request.path);
  return next();
});
app.use(cors);
app.use(browser());
app.use(problem);
app.use(halEmbed);
app.use(halPush(app));

routes.forEach( route => app.use(route));

const fileBackend = new FileBackend(__dirname + '/../blobs');
app.use(resourceStore(fileBackend));

const http2Server = http2.createSecureServer(options, app.callback()).listen(httpsPort);

console.log('Listening on port ' + httpsPort);

app.listen(port);

console.log('Listening on port ' + port);
