/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import ApiError from '../src/models/exceptions/ApiError';

test('should work fine with Error', (done) => {
  new ApiError('asdad', 111, new Error('asdasd'));
  done();
});

test('should work fine without errors', (done) => {
  new ApiError('asdad', 111);
  done();
});
