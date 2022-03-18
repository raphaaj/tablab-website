import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { BaseErrorsFactory } from '@view-models/error/base-errors-factory';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(BaseErrorsFactory.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      const request = httpMocks.createRequest<NextApiRequest>();

      const errorsFactory = new BaseErrorsFactory({
        request,
      });

      expect(errorsFactory.locale).toBe(defaultLocale);
      expect(errorsFactory.request).toBe(request);
    });

    it('should create an instance when the locale field is given with all the required fields', () => {
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
