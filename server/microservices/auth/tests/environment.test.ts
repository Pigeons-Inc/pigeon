describe('environment test', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return error if PASSWORD_SALT is undefined', async () => {
    process.env.PASSWORD_SALT = undefined;
    await expect(import('../src/app')).rejects.toBeInstanceOf(Error);
  });

  it('should return error if ACCESS_TOKEN_SECRET is undefined', async () => {
    process.env.ACCESS_TOKEN_SECRET = undefined;
    await expect(import('../src/app')).rejects.toBeInstanceOf(Error);
  });

  it('should return error if REFRESH_TOKEN_SECRET is undefined', async () => {
    process.env.REFRESH_TOKEN_SECRET = undefined;
    await expect(import('../src/app')).rejects.toBeInstanceOf(Error);
  });
});
