import { ErrorCode } from '@common/enums/error-code';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

jest.mock('ajv-i18n/localize/en', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock('ajv-i18n/localize/pt-BR', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe(InvalidContentSyntaxError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();
      const validationErrors = { field: 'value' };

      const error = new InvalidContentSyntaxError({
        message,
        request,
        validationErrors,
      });

      expect(error.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
      expect(error.message).toBe(message);
      expect(error.details?.validationErrors).toEqual(validationErrors);
    });
  });
});
