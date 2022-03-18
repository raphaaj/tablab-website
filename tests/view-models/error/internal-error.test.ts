import { ErrorCode } from '@enums/error-code';
import { InternalError } from '@view-models/error/internal-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(InternalError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the require fields are given', () => {
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();

      const error = new InternalError({
        message,
        request,
      });

      expect(error.errorCode).toBe(ErrorCode.Common_UnknownError);
      expect(error.message).toBe(message);
      expect(error.details).toBe(null);
    });
  });
});
