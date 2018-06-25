import { Application, Context } from 'curveball';
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
app.use(halPush);

const fileBackend = new FileBackend(__dirname + '/../blobs');
app.use(resourceStore(fileBackend));

const http2Server = http2.createSecureServer(options, app.callback.bind(app)).listen(httpsPort);
app.listen(port);

http2Server.on('goaway', () => {
  console.log('goaway');
});
http2Server.on('stream', stream => {
  stream.on('goaway', () => {
    console.log('stream goaway');
  });
  stream.on('error', (err) => {
    console.log('stream error', err);
  });
});
http2Server.on('request', request => {
  request.on('goaway', () => {
    console.log('request goaway');
  });
  request.on('error', (err) => {
    console.log('request error', err);
  });
});
