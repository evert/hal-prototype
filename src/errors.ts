export abstract class HttpError extends Error {

  public httpCode = 500;

}

export class BadRequest extends HttpError {

  public httpCode = 400;

}

export class MethodNotAllowed extends HttpError {

  public httpCode = 405;

}

export class NotImplemented extends HttpError {

  public httpCode = 501;

}
