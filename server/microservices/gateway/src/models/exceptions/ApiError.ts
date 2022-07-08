export default class ApiError extends Error {
  public code: number;
  public errors: Error[];
  constructor(message: string, code: number, errors: Error[]) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
}
