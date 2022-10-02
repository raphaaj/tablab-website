import { RequestUtils } from '@server/utils/request-utils';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(RequestUtils.name, () => {
  describe('constructor', () => {
    it('should create an instance with the given request object', () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const requestUtils = new RequestUtils(request);

      expect(requestUtils.request).toBe(request);
    });
  });

  describe(RequestUtils.prototype.getLocaleOption.name, () => {
    it('should return null if no language preference is set on the request', () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const requestUtils = new RequestUtils(request);

      const localeOption = requestUtils.getLocaleOption();

      expect(localeOption).toBe(null);
    });

    it.each([
      ['en-US', 'en-US'],
      ['pt-BR', 'pt-BR'],
      [null, 'de-DE'],
      ['en-US', 'en-US;q=0.9'],
      ['pt-BR', 'pt-BR;q=0.9'],
      [null, 'de-DE;q=0.9'],
      ['en-US', 'en-US;q=0.9, pt-BR;q=0.8'],
      ['pt-BR', 'pt-BR;q=0.9, en-US;q=0.8'],
      ['en-US', 'en-US;q=0.9, pt-BR;q='],
      ['pt-BR', 'pt-BR;q=0.9, en-US;q='],
      ['en-US', 'de-DE, en-US;q=0.9, pt-BR;q=0.8'],
      ['pt-BR', 'de-DE, pt-BR;q=0.9, en-US;q=0.8'],
      ['en-US', 'de-DE, en-US;q=0.9, pt-BR;q='],
      ['pt-BR', 'de-DE, pt-BR;q=0.9, en-US;q='],
      ['en-US', 'de-DE;q=1.0, en-US;q=0.9, pt-BR;q=0.8'],
      ['pt-BR', 'de-DE;q=1.0, pt-BR;q=0.9, en-US;q=0.8'],
    ])(
      'should return %s when the accept language header is set to %s',
      (expectedLocaleOption, acceptLanguageHeaderValue) => {
        const request = httpMocks.createRequest<NextApiRequest>({
          headers: { 'accept-language': acceptLanguageHeaderValue },
        });

        const requestUtils = new RequestUtils(request);

        const localeOption = requestUtils.getLocaleOption();

        expect(localeOption).toBe(expectedLocaleOption);
      }
    );

    it('should return en-US if no language preference is set on the request', () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const requestUtils = new RequestUtils(request);

      const localeOption = requestUtils.getLocaleOption();

      expect(localeOption).toBe(null);
    });
  });
});
