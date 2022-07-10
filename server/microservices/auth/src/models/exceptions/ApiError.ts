export default class ApiError extends Error {
  public code: number;
  public errors: Error[];
  constructor(message: string, code: number, errors: Error[] | Error | string) {
    if (errors instanceof Error) {
      errors = [errors];
    }

    if (typeof errors === 'string') {
      errors = [{ name: 'Custom error', message: errors }];
    }

    super(message);
    this.code = code;
    this.errors = errors;
  }

  public static badRequest(errors: Error[] | Error | string) {
    return new ApiError('Bad request', 400, errors);
  }

  public static unauthorized(errors: Error[] | Error | string) {
    return new ApiError('Unauthorized', 401, errors);
  }
}
