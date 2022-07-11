type ErrorsCreationParam = Error[] | Error | string | string[];
export default class ApiError extends Error {
  public code: number;
  public errors: Error[];
  constructor(message: string, code: number, errors: ErrorsCreationParam = []) {
    if (errors instanceof Error) {
      errors = [{ name: errors.name, message: errors.message }];
    }

    if (typeof errors === 'string') {
      errors = [{ name: 'Custom error', message: errors }];
    }

    if (Array.isArray(errors)) {
      errors = errors.map((error) =>
        typeof error === 'string'
          ? { name: 'Custom error', message: error }
          : error
      );
    }

    if (errors.length === 1) {
      message += `: ${errors[0].message.toLowerCase()}`;
    }
    super(message);
    this.code = code;
    this.errors = errors;
  }

  public static badRequest(errors: ErrorsCreationParam) {
    return new ApiError('Bad request', 400, errors);
  }

  public static unauthorized(errors: ErrorsCreationParam) {
    return new ApiError('Unauthorized', 401, errors);
  }
}
