import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { CommonErrorsFactory } from '@view-models/error/common-errors-factory';
import { TabErrorsFactory } from '@view-models/tab/tab-errors-factory';
import { TabRenderizationError } from '@view-models/tab/tab-renderization-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(TabErrorsFactory.name, () => {
  describe('constructor', () => {
    it(`should extends the ${CommonErrorsFactory.name}`, () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TabErrorsFactory({
        request,
      });

      expect(errorsFactory).toBeInstanceOf(CommonErrorsFactory);
    });

    it('should create an instance when all the required fields are given', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TabErrorsFactory({
        request,
      });

      expect(errorsFactory.locale).toBe(defaultLocale);
      expect(errorsFactory.request).toBe(request);
    });

    it('should create an instance when the locale field is given with all the required fields', () => {
      const locale = 'pt-BR';

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TabErrorsFactory({
        locale,
        request,
      });

      expect(errorsFactory.locale).toBe(locale);
      expect(errorsFactory.request).toBe(request);
    });
  });

  describe(TabErrorsFactory.prototype.getTabRenderizationError.name, () => {
    it(`should return an ${TabRenderizationError.name} instance with a localized error message`, async () => {
      const locale = 'pt-BR';
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TabErrorsFactory({
        locale,
        request,
      });

      const errorMessage = 'localized error message';
      const translationFunction = jest.fn().mockReturnValue(errorMessage);
      const getServerSideTranslationSpy = jest
        .spyOn(ServerSideTranslationUtils, 'getServerSideTranslation')
        .mockResolvedValue(translationFunction);

      const failedWriteResult = getTestFailedWriteResult();
      const failedWriteResults = [failedWriteResult];
      const error = await errorsFactory.getTabRenderizationError(failedWriteResults);

      expect(error).toBeInstanceOf(TabRenderizationError);
      expect(getServerSideTranslationSpy).toHaveBeenCalledWith(locale, expect.any(Array));
      expect(error.message).toBe(errorMessage);

      getServerSideTranslationSpy.mockRestore();
    });
  });
});
