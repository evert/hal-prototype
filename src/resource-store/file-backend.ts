import { Context } from 'koa';
import { BadRequest, NotImplemented } from '../errors';
import path from 'path';
import util from 'util';
import fs from 'fs';
import AbstractBackend from './abstract-backend';

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default class FileBackend extends AbstractBackend {

  public blobPath: string;

  constructor(blobPath: string) {
    super();
    this.blobPath = path.normalize(blobPath);
  }

  async get(ctx: Context) {

    // Taking off the slash at the start.
    const localPath = path.join(
      this.blobPath,
      ctx.path.substring(1)

    );
    console.log(localPath, this.blobPath);

    if (!localPath.startsWith(this.blobPath)) {
      throw new BadRequest('Bad path');
    }

    const info = await stat(localPath);

    if (info.isDirectory()) {

      return this.getDirectory(ctx, localPath);

    } else if (info.isFile()) {

      return this.getFile(ctx, localPath);

    } else {

      throw new NotImplemented('Files are not yet implemented');

    }

  }

  async getDirectory(ctx: Context, localPath: string) {

    ctx.body = {
      _links: {
        self: { href: ctx.path }
      }

    };

    for (const file of await readdir(localPath)) {

      // Remove dotfiles
      if (file.substring(0, 1) === '.') {
        continue;
      }
      if (!ctx.body._links.item) {
        ctx.body._links.item = [];
      }
      ctx.body._links.item.push({
        href: path.join(ctx.path, file)
      });

    }

    if (ctx.path !== '/') {

      ctx.body._links.collection = { href: path.resolve(ctx.path, '..') };

    }

  }

  async getFile(ctx: Context, localPath: string) {

    ctx.body = await readFile(localPath);
    switch (path.extname(localPath)) {

      case '.css' :
        ctx.type = 'text/css';
        break;

    }

}

}
