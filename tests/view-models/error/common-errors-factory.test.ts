import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { CommonErrorsFactory } from '@view-models/error/common-errors-factory';
import { InternalError } from '@view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@view-models/error/invalid-http-method-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(CommonErrorsFactory.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new CommonErrorsFactory({
        request,
      });

      expect(errorsFactory.locale).toBe(defaultLocale);
      expect(errorsFactory.request).toBe(request);
    });

    it('should create an instance when the locale field is given with all the required fields', () => {
      const locale = 'pt-BR';

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new CommonErrorsFactory({
        locale,
        request,
      });

      expect(errorsFactory.locale).toBe(locale);
      expect(errorsFactory.request).toBe(request);
    });
  });

  describe(CommonErrorsFactory.prototype.getInternalError.name, () => {
    it(`should return an ${InternalError.name} instance with a localized error message`, async () => {
      const locale = 'pt-BR';
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new CommonErrorsFactory({
        locale,
        request,
      });

      const errorMessage = 'localized error message';
      const translationFunction = jest.fn().mockReturnValue(errorMessage);
      const getServerSideTranslationSpy = jest
        .spyOn(ServerSideTranslationUtils, 'getServerSideTranslation')
        .mockResolvedValue(translationFunction);

      const error = await errorsFactory.getInternalError();

      expect(error).toBeInstanceOf(InternalError);
      expect(getServerSideTranslationSpy).toHaveBeenCalledWith(locale, expect.any(Array));
      expect(error.message).toBe(errorMessage);

      getServerSideTranslationSpy.mockRestore();
    });
  });

  describe(CommonErrorsFactory.prototype.getInvalidContentSyntaxError.name, () => {
    it(`should return an ${InvalidContentSyntaxError.name} instance with a localized error message`, async () => {
      const locale = 'pt-BR';
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new CommonErrorsFactory({
        locale,
        request,
      });

      const errorMessage = 'localized error message';
      const translationFunction = jest.fn().mockReturnValue(errorMessage);
      const getServerSideTranslationSpy = jest
        .spyOn(ServerSideTranslationUtils, 'getServerSideTranslation')
        .mockResolvedValue(translationFunction);

      const validationErrors = { field: 'value' };
      const error = await errorsFactory.getInvalidContentSyntaxError(validationErrors);

      expect(error).toBeInstanceOf(InvalidContentSyntaxError);
      expect(getServerSideTranslationSpy).toHaveBeenCalledWith(locale, expect.any(Array));
      expect(error.message).toBe(errorMessage);
      expect(error.details?.validationErrors).toBe(validationErrors);

      getServerSideTranslationSpy.mockRestore();
    });
  });

  describe(CommonErrorsFactory.prototype.getInvalidHttpMethodError.name, () => {
    it(`should return an ${InvalidHttpMethodError.name} instance with a localized error message`, async () => {
      const locale = 'pt-BR';
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new CommonErrorsFactory({
        locale,
        request,
      });

      const errorMessage = 'localized error message';
      const translationFunction = jest.fn().mockReturnValue(errorMessage);
      const getServerSideTranslationSpy = jest
        .spyOn(ServerSideTranslationUtils, 'getServerSideTranslation')
        .mockResolvedValue(translationFunction);

      const acceptedMethods = ['POST'];
      const error = await errorsFactory.getInvalidHttpMethodError(acceptedMethods);

      expect(error).toBeInstanceOf(InvalidHttpMethodError);
      expect(getServerSideTranslationSpy).toHaveBeenCalledWith(locale, expect.any(Array));
      expect(error.message).toBe(errorMessage);
      expect(error.details?.allowedMethods).toBe(acceptedMethods);

      getServerSideTranslationSpy.mockRestore();
    });
  });
});
