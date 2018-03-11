import { Context } from 'koa';
import { MethodNotAllowed, BadRequest, NotImplemented } from '../errors';
import path from 'path';
import util from 'util';
import fs from 'fs';

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default function main(blobPath: string) {

  blobPath = path.normalize(blobPath);

  return function(ctx: Context, next: Function) {

    switch(ctx.method) {
      case 'GET' :
        return get(ctx, blobPath);
      default :
        throw new MethodNotAllowed('Method not allowed: ' + ctx.method);
    }

  }

}

async function get(ctx: Context, blobPath: string) {

  // Taking off the slash at the start.
  const localPath = path.join(
    blobPath,
    ctx.path.substring(1)
  );

  if (!localPath.startsWith(blobPath)) {
    throw new BadRequest('Bad path');
  }

  const info = await stat(localPath);

  if (info.isDirectory()) {

    return await getDirectory(ctx, localPath);

  } else if (info.isFile()) {

    return await getFile(ctx, localPath);

  } else {

    throw new NotImplemented('Files are not yet implemented');

  }

}

async function getDirectory(ctx: Context, localPath: string) {

  ctx.body = {
    _links: {
      self: { href: ctx.path }
    }

  };

  for(const file of await readdir(localPath)) {

    // Remove dotfiles
    if (file.substring(0,1) === '.') {
      continue;
    }
    if (!ctx.body._links.item) {
      ctx.body._links.item = [];
    }
    ctx.body._links.item.push({
      href: path.join(ctx.path,file)
    });

  }

  if (ctx.path!=='/') {

    ctx.body._links.collection = { href: path.resolve(ctx.path, '..') };

  }

}

async function getFile(ctx: Context, localPath: string) {

  ctx.body = await readFile(localPath);
  switch(path.extname(localPath)) {

    case '.css' :
      ctx.type = 'text/css';
      break;

  }

}
