import Koa from 'koa';
import { Context } from 'koa';

import cors from './middleware/cors';
import FileBackend from './resource-store/file-backend';
import resourceStore from './resource-store/middleware';
import browser from './middleware/browser';
import halEmbed from './middleware/hal-embed';
import problem from './middleware/problem';

const app = new Koa();

app.use(cors);
app.use(browser);
app.use(problem);
app.use(halEmbed);

const fileBackend = new FileBackend(__dirname + '/../blobs');
app.use(resourceStore(fileBackend));

app.listen(3000);
