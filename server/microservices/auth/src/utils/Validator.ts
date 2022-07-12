import ApiError from '../models/exceptions/ApiError';

export default class Validator {
  private errors: string[] = [];
  public validateEmail(email: string) {
    if (!email) this.errors.push('No email provided');
    if (email.length > 255) this.errors.push('Email is too long');
    if (email.search(/@/) === -1) this.errors.push('Email must contain @');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      this.errors.push('Invalid email');
    return this;
  }

  public validatePassword(password: string) {
    if (!password) this.errors.push('No password provided');
    if (password.length > 255) this.errors.push('Password is too long');
    if (password.length < 8) this.errors.push('Password is too short');
    if (password.search(/[\d]/) === -1)
      this.errors.push('Password must contain at least one number');
    if (password.search(/[a-z]/) === -1)
      this.errors.push('Password must contain at least one lowercase letter');
    if (password.search(/[A-Z]/) === -1)
      this.errors.push('Password must contain at least one uppercase letter');
    if (password.search(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) === -1) {
      this.errors.push('Password must contain at least one special character');
    }
    if (password.search(/\s/) !== -1)
      this.errors.push('Password must not contain spaces');
    return this;
  }

  public submit() {
    if (this.errors.length > 0) throw ApiError.badRequest(this.errors);
  }
}
