import { BaseError, BaseErrorData } from '@view-models/error/base-error';
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
    it('should create an instance when all the required fields are given', () => {
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
