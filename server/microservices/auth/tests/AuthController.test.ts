/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import { AuthController } from '../src/controllers/AuthController';

describe('AuthController', () => {
  it('should be defined', () => {
    expect(AuthController).toBeDefined();
    expect(new AuthController()).toBeDefined();
  });

  it('should work without any arguments', async () => {
    const controller = new AuthController();
    await expect(controller.ping()).resolves.toEqual({ message: 'pong' });
    await expect(controller.validateCredentials()).rejects.toThrow();
    await expect(controller.register()).rejects.toThrow();
    await expect(controller.login()).rejects.toThrow();
    await expect(controller.logout()).rejects.toThrow();
    await expect(controller.validate()).rejects.toThrow();
    await expect(controller.refresh()).rejects.toThrow();
    await expect(controller.activate()).rejects.toThrow();
  });
});
