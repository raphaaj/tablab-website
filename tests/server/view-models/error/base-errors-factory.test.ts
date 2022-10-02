import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import { BaseErrorsFactory } from '@server/view-models/error/base-errors-factory';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(BaseErrorsFactory.name, () => {
  describe('constructor', () => {
    it('should create an instance with the default locale when only the required fields are given', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new BaseErrorsFactory({
        request,
      });

      expect(errorsFactory.locale).toBe(defaultLocale);
      expect(errorsFactory.request).toBe(request);
    });

    it('should create an instance with the given locale when one is specified', () => {
      const locale = 'pt-BR';

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new BaseErrorsFactory({
        locale,
        request,
      });

      expect(errorsFactory.locale).toBe(locale);
      expect(errorsFactory.request).toBe(request);
    });
  });
});
