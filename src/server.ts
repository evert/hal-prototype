import Koa from 'koa';
import { Context } from 'koa';

import cors from './middleware/cors';
import resourceStore from './middleware/resource-store';
import browser from './middleware/browser';
import halEmbed from './middleware/hal-embed';

const app = new Koa();

app.use(cors);
app.use(browser);
app.use(halEmbed);
app.use(resourceStore(__dirname + '/../blobs'));

app.listen(3000);
