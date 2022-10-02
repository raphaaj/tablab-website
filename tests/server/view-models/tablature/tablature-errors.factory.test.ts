import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import { CommonErrorsFactory } from '@server/view-models/error/common-errors-factory';
import { TablatureErrorsFactory } from '@server/view-models/tablature/tablature-errors-factory';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';
import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(TablatureErrorsFactory.name, () => {
  describe('constructor', () => {
    it(`should extends the ${CommonErrorsFactory.name}`, () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TablatureErrorsFactory({
        request,
      });

      expect(errorsFactory).toBeInstanceOf(CommonErrorsFactory);
    });

    it('should create an instance when all the required fields are given', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TablatureErrorsFactory({
        request,
      });

      expect(errorsFactory.locale).toBe(defaultLocale);
      expect(errorsFactory.request).toBe(request);
    });

    it('should create an instance when the locale field is given with all the required fields', () => {
      const locale = 'pt-BR';

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TablatureErrorsFactory({
        locale,
        request,
      });

      expect(errorsFactory.locale).toBe(locale);
      expect(errorsFactory.request).toBe(request);
    });
  });

  describe(TablatureErrorsFactory.prototype.getTablatureRenderizationError.name, () => {
    it(`should return an ${TablatureRenderizationError.name} instance with a localized error message`, async () => {
      const locale = 'pt-BR';
      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new TablatureErrorsFactory({
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
      const error = await errorsFactory.getTablatureRenderizationError(failedWriteResults);

      expect(error).toBeInstanceOf(TablatureRenderizationError);
      expect(getServerSideTranslationSpy).toHaveBeenCalledWith(locale, expect.any(Array));
      expect(error.message).toBe(errorMessage);

      getServerSideTranslationSpy.mockRestore();
    });
  });
});
