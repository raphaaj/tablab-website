import { ErrorCode } from '@enums/error-code';
import { InvalidContentSyntaxError } from '@view-models/error/invalid-content-syntax-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';
import AjvLocalizeEn from 'ajv-i18n/localize/en';
import AjvLocalizePtBr from 'ajv-i18n/localize/pt-BR';

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
      const locale = 'en-US';
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();
      const validationErrors = { field: 'value' };

      const error = new InvalidContentSyntaxError({
        locale,
        message,
        request,
        validationErrors,
      });

      expect(error.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
      expect(error.message).toBe(message);
      expect(error.details?.validationErrors).toEqual(validationErrors);
    });

    describe('localization', () => {
      it.each([
        ['en-US', AjvLocalizeEn],
        ['pt-BR', AjvLocalizePtBr],
      ])(
        'should localize the validation errors based on the given locale - %s',
        (locale, expectedLocalizationFunction) => {
          const message = 'test message';
          const request = httpMocks.createRequest<NextApiRequest>();
          const validationErrors = { field: 'value' };

          const error = new InvalidContentSyntaxError({
            locale,
            message,
            request,
            validationErrors,
          });

          expect(error.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
          expect(error.message).toBe(message);
          expect(error.details?.validationErrors).toEqual(validationErrors);
          expect(expectedLocalizationFunction).toHaveBeenCalledWith(validationErrors);
        }
      );

      it('should fallback to the default localization function when no localization function is identified for the given locale', () => {
        const locale = '?';
        const message = 'test message';
        const request = httpMocks.createRequest<NextApiRequest>();
        const validationErrors = { field: 'value' };

        const error = new InvalidContentSyntaxError({
          locale,
          message,
          request,
          validationErrors,
        });

        expect(error.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(error.message).toBe(message);
        expect(error.details?.validationErrors).toEqual(validationErrors);
        expect(AjvLocalizeEn).toHaveBeenCalledWith(validationErrors);
      });
    });
  });
});
