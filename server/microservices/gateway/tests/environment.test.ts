describe('environment test', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return error if API_SECRET is undefined', async () => {
    process.env.API_SECRET = undefined;
    await expect(import('../src/app')).rejects.toBeInstanceOf(Error);
  });

  it('should return error if AUTH_SERVICE_URL is undefined', async () => {
    process.env.AUTH_SERVICE_URL = undefined;
    await expect(import('../src/app')).rejects.toBeInstanceOf(Error);
  });
});
