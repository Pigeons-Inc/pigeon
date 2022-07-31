import { SendController } from '../src/controllers/SendController';

describe('SendController', () => {
  it('should be defined', () => {
    expect(SendController).toBeDefined();
    expect(new SendController()).toBeDefined();
  });
});
