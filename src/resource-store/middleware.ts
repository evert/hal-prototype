import { Context } from 'curveball';
import AbstractBackend from './abstract-backend';

export default function main(backend: AbstractBackend) {

  return function(ctx: Context, next: Function) {

    return backend.middleware(ctx, next);

  };

}
