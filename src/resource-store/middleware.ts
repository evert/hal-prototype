import { Context } from 'koa';
import AbstractBackend from './abstract-backend';

export default function main(backend: AbstractBackend) {

  return function(ctx: Context, next: Function) {

    return backend.middleware(ctx, next);

  };

}
