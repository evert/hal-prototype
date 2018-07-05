import { Context } from '@curveball/core';
import { MethodNotAllowed } from '../errors';

export default class AbstractBackend {

  middleware(ctx: Context, next: Function) {

    switch (ctx.request.method) {
      case 'GET' :
        return this.get(ctx);
      default :
        throw new MethodNotAllowed('Method not allowed: ' + ctx.request.method);
    }

  }

  async get(ctx: Context) {

    throw new MethodNotAllowed('Method not allowed');

  }

}
