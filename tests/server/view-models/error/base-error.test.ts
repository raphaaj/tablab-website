import { BaseError, BaseErrorData } from '@server/view-models/error/base-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

class TestError extends BaseError<null> {
  public details: null;

  public constructor(errorData: BaseErrorData) {
    super(errorData);

    this.details = null;
  }
}

describe(BaseError.name, () => {
  describe('constructor', () => {
    it('should set the errorCode and message properties according to the given data', () => {
      const errorCode = 123;
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();

      const error = new TestError({
        errorCode,
        message,
        request,
      });

      expect(error.errorCode).toBe(errorCode);
      expect(error.message).toBe(message);
    });
  });
});
