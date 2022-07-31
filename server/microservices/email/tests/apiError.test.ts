import ApiError from '../src/errors/ApiError';

test('Creating an api error with an error array', (done) => {
  new ApiError(400, 'Bad Request', [new Error('Mailing failed')]);
  done();
});

test('Creating an api error without an error array', (done) => {
  new ApiError(400, 'Bad Request');
  done();
});
