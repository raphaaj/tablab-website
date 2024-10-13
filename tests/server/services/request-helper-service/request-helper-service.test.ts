import { RequestHelperService } from '@server/services/request-helper-service/request-helper-service';
import {
  ITranslationService,
  ITranslationServiceInjectionToken,
} from '@server/services/translation-service/interfaces/translation-service.interface';
import { container } from '@tests/container';
import { mock, mockReset } from 'jest-mock-extended';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

const translationServiceMock = mock<ITranslationService>();

container.register<ITranslationService>(ITranslationServiceInjectionToken, {
  useValue: translationServiceMock,
});
container.register(RequestHelperService.name, RequestHelperService);

let requestHelperService: RequestHelperService;

beforeEach(() => {
  mockReset(translationServiceMock);

  requestHelperService = container.resolve<RequestHelperService>(RequestHelperService.name);
});

describe(RequestHelperService.name, () => {
  describe(RequestHelperService.prototype.getLocaleOption.name, () => {
    it('should return null if no language preference is set on the request', () => {
      const request = httpMocks.createRequest<NextApiRequest>();

      const localeOption = requestHelperService.getLocaleOption(request);

      expect(localeOption).toBe(null);
    });

    it('should return null if a language preference is set on the request but not supported', () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        headers: { 'accept-language': 'zz-ZZ' },
      });

      translationServiceMock.getSupportedLocales.mockReturnValueOnce([]);

      const localeOption = requestHelperService.getLocaleOption(request);

      expect(localeOption).toBe(null);
    });

    it.each([
      ['en-US', 'en-US', ['en-US']],
      ['pt-BR', 'pt-BR', ['pt-BR']],
      [null, 'de-DE', ['en-US']],
      ['en-US', 'en-US;q=0.9', ['en-US']],
      ['pt-BR', 'pt-BR;q=0.9', ['pt-BR']],
      [null, 'de-DE;q=0.9', ['en-US']],
      ['en-US', 'en-US;q=0.9, pt-BR;q=0.8', ['en-US', 'pt-BR']],
      ['pt-BR', 'pt-BR;q=0.9, en-US;q=0.8', ['en-US', 'pt-BR']],
      ['en-US', 'en-US;q=0.9, pt-BR;q=', ['en-US', 'pt-BR']],
      ['pt-BR', 'pt-BR;q=0.9, en-US;q=', ['en-US', 'pt-BR']],
      ['en-US', 'de-DE, en-US;q=0.9, pt-BR;q=0.8', ['en-US', 'pt-BR']],
      ['pt-BR', 'de-DE, pt-BR;q=0.9, en-US;q=0.8', ['en-US', 'pt-BR']],
      ['en-US', 'de-DE, en-US;q=0.9, pt-BR;q=', ['en-US', 'pt-BR']],
      ['pt-BR', 'de-DE, pt-BR;q=0.9, en-US;q=', ['en-US', 'pt-BR']],
      ['en-US', 'de-DE;q=1.0, en-US;q=0.9, pt-BR;q=0.8', ['en-US', 'pt-BR']],
      ['pt-BR', 'de-DE;q=1.0, pt-BR;q=0.9, en-US;q=0.8', ['en-US', 'pt-BR']],
    ])(
      'should return %s when the accept language header is set to %s and the supported locales are %p',
      (expectedLocaleOption, acceptLanguageHeaderValue, supportedLocales) => {
        const request = httpMocks.createRequest<NextApiRequest>({
          headers: { 'accept-language': acceptLanguageHeaderValue },
        });

        translationServiceMock.getSupportedLocales.mockReturnValueOnce(supportedLocales);

        const localeOption = requestHelperService.getLocaleOption(request);

        expect(localeOption).toBe(expectedLocaleOption);
      }
    );
  });

  describe(RequestHelperService.prototype.getLocaleOptionOrDefaultLocale.name, () => {
    it('should return the default locale if no language preference is set on the request', () => {
      const defaultLocale = 'zz-ZZ';
      const request = httpMocks.createRequest<NextApiRequest>();

      translationServiceMock.getDefaultLocale.mockReturnValueOnce(defaultLocale);

      const localeOption = requestHelperService.getLocaleOptionOrDefaultLocale(request);

      expect(localeOption).toBe(defaultLocale);
    });

    it('should return the default locale if a language preference is set on the request but not supported', () => {
      const defaultLocale = 'zz-ZZ';
      const request = httpMocks.createRequest<NextApiRequest>({
        headers: { 'accept-language': 'xx-XX' },
      });

      translationServiceMock.getDefaultLocale.mockReturnValueOnce(defaultLocale);
      translationServiceMock.getSupportedLocales.mockReturnValueOnce([defaultLocale]);

      const localeOption = requestHelperService.getLocaleOptionOrDefaultLocale(request);

      expect(localeOption).toBe(defaultLocale);
    });

    it('should return the prefered locale if a language preference is set on the request and supported', () => {
      const defaultLocale = 'zz-ZZ';
      const preferedLocale = 'xx-XX';
      const request = httpMocks.createRequest<NextApiRequest>({
        headers: { 'accept-language': preferedLocale },
      });

      translationServiceMock.getDefaultLocale.mockReturnValueOnce(defaultLocale);
      translationServiceMock.getSupportedLocales.mockReturnValueOnce([
        defaultLocale,
        preferedLocale,
      ]);

      const localeOption = requestHelperService.getLocaleOptionOrDefaultLocale(request);

      expect(localeOption).toBe(preferedLocale);
    });
  });
});
