import { Context } from '@curveball/core';
import fs from 'fs';

export default async (ctx: Context, next: Function) => {

  ctx.response.type = 'text/csv';
  ctx.response.body = fs.readFileSync(__dirname + '/../../blobs/games.csv');
  ctx.response.headers.set('Link', '</testing/csv?page=2>; rel="next"; title="More..."');

};
