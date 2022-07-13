import ApiError from '../src/models/exceptions/ApiError';

test('should work fine with Error', (done) => {
  new ApiError('asdad', 111, new Error('asdasd'));
  done();
});
