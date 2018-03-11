import Koa from 'koa';
import { Context } from 'koa';

import resourceStore from './middleware/resource-store';
import browser from './middleware/browser';

const app = new Koa();

app.use(browser);
app.use(resourceStore(__dirname + '/../blobs'));

app.listen(3000);
