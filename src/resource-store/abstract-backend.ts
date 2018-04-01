import { Context } from 'koa';
import { MethodNotAllowed } from '../errors';

export default class AbstractBackend {

  middleware(ctx: Context, next: Function) {

    switch (ctx.method) {
      case 'GET' :
        return this.get(ctx);
      default :
        throw new MethodNotAllowed('Method not allowed: ' + ctx.method);
    }

  }

  async get(ctx: Context) {

    throw new MethodNotAllowed('Method not allowed');

  }

}
