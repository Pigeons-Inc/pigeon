export default class ApiError extends Error {
  status: number;
  errors: Error[];

  constructor(status: number, message: string, errors: Error[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  public static unauthorizedError() {
    return new ApiError(401, 'Not authorized');
  }

  public static forbidden() {
    return new ApiError(403, 'Access forbidden');
  }
}
