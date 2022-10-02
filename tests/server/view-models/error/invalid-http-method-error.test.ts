import { ErrorCode } from '@common/enums/error-code';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(InvalidHttpMethodError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const acceptedMethods = ['GET'];
      const message = 'test message';

      const url = '/test';
      const method = 'POST';
      const request = httpMocks.createRequest<NextApiRequest>({ method, url });

      const error = new InvalidHttpMethodError({
        acceptedMethods,
        message,
        request,
      });

      expect(error.errorCode).toBe(ErrorCode.Common_InvalidHttpMethodError);
      expect(error.message).toBe(message);
      expect(error.details?.path).toBe(url);
      expect(error.details?.receivedMethod).toBe(method);
      expect(error.details?.allowedMethods).toBe(acceptedMethods);
    });
  });
});
