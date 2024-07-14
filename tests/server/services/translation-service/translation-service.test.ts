import { TranslationService } from '@server/services/translation-service/translation-service';
import { container } from '@tests/container';
import i18next, { TFunction } from 'i18next';
import { mock } from 'jest-mock-extended';

function getApplicationDefaultLocale() {
  return 'zz-ZZ';
}

function getAplicationLocales() {
  return ['zz-ZZ', 'xx-XX'];
}

jest.mock('@next-i18next.config', () => {
  return {
    i18n: {
      defaultLocale: getApplicationDefaultLocale(),
      locales: getAplicationLocales(),
    },
  };
});

jest.mock('i18next', () => {
  const i18Next = {
    use: jest.fn(),
    init: jest.fn(),
    hasResourceBundle: jest.fn(),
    loadNamespaces: jest.fn(),
    getFixedT: jest.fn(),
  };

  i18Next.use.mockImplementation(() => i18Next);

  return {
    default: i18Next,
    __esModule: true,
  };
});

container.register(TranslationService.name, TranslationService);

let translationService: TranslationService;

const i18NextGetFixedTSpy = jest.spyOn(i18next, 'getFixedT');
const i18NextHasResourceBundleSpy = jest.spyOn(i18next, 'hasResourceBundle');
const i18NextLoadNamespacesSpy = jest.spyOn(i18next, 'loadNamespaces');

beforeEach(() => {
  i18NextGetFixedTSpy.mockReset();
  i18NextHasResourceBundleSpy.mockReset();
  i18NextLoadNamespacesSpy.mockReset();

  translationService = container.resolve<TranslationService>(TranslationService.name);
});

describe(TranslationService.name, () => {
  describe(TranslationService.prototype.getDefaultLocale.name, () => {
    it(`should return the application's default locale`, () => {
      const applicationDefaultLocale = getApplicationDefaultLocale();

      const defaultLocale = translationService.getDefaultLocale();

      expect(defaultLocale).toBe(applicationDefaultLocale);
    });
  });

  describe(TranslationService.prototype.getSupportedLocales.name, () => {
    it(`should return the application's supported locales`, () => {
      const applicationLocales = getAplicationLocales();

      const supportedLocales = translationService.getSupportedLocales();

      expect(supportedLocales).toEqual(applicationLocales);
    });
  });

  describe(TranslationService.prototype.getTranslationFunction.name, () => {
    it('should return a translation function for the given locale', async () => {
      const locale = getApplicationDefaultLocale();

      const fixedTMock = mock<TFunction>();
      i18NextGetFixedTSpy.mockImplementation(() => fixedTMock);

      const translationFunction = await translationService.getTranslationFunction(locale);

      expect(translationFunction).toBe(fixedTMock);
      expect(i18NextGetFixedTSpy).toHaveBeenCalledWith(locale, undefined);
    });

    it('should return a translation function for the given locale and load required namespaces if not loaded yet', async () => {
      const locale = getApplicationDefaultLocale();
      const namespaces = ['namespace-1', 'namespace-2'];

      const fixedTMock = mock<TFunction>();
      i18NextGetFixedTSpy.mockImplementation(() => fixedTMock);
      i18NextHasResourceBundleSpy.mockReturnValue(false);
      i18NextLoadNamespacesSpy.mockResolvedValue();

      const translationFunction = await translationService.getTranslationFunction(
        locale,
        namespaces
      );

      expect(translationFunction).toBe(fixedTMock);

      for (let i = 0; i < namespaces.length; i++) {
        const namespace = namespaces[i];

        expect(i18NextHasResourceBundleSpy).toHaveBeenNthCalledWith(i + 1, locale, namespace);
        expect(i18NextLoadNamespacesSpy).toHaveBeenNthCalledWith(i + 1, namespace);
      }
    });

    it('should return a translation function for the given locale and not load namespaces already loaded', async () => {
      const locale = getApplicationDefaultLocale();
      const namespaces = ['namespace-1', 'namespace-2'];

      const fixedTMock = mock<TFunction>();
      i18NextGetFixedTSpy.mockImplementation(() => fixedTMock);
      i18NextHasResourceBundleSpy.mockReturnValue(true);
      i18NextLoadNamespacesSpy.mockResolvedValue();

      const translationFunction = await translationService.getTranslationFunction(
        locale,
        namespaces
      );

      expect(translationFunction).toBe(fixedTMock);

      for (let i = 0; i < namespaces.length; i++) {
        const namespace = namespaces[i];

        expect(i18NextHasResourceBundleSpy).toHaveBeenNthCalledWith(i + 1, locale, namespace);
      }

      expect(i18NextLoadNamespacesSpy).not.toHaveBeenCalled();
    });
  });
});
