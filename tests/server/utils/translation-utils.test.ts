import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import i18next from 'i18next';

interface NamespaceData {
  identifier: string;
  loaded: boolean;
}

function getTestNamespacesData(): NamespaceData[] {
  return [
    {
      identifier: 'namespace1',
      loaded: true,
    },
    {
      identifier: 'namespace2',
      loaded: false,
    },
  ];
}

function createHasResourceBundleMock(
  namespacesData: NamespaceData[]
): (lng: string, ns: string) => boolean {
  return function hasResourceBundleMock(lng: string, ns: string): boolean {
    let namespaceLoaded = false;

    const namespaceData = namespacesData.find((namespaceData) => namespaceData.identifier === ns);

    if (namespaceData && namespaceData.loaded) namespaceLoaded = true;

    return namespaceLoaded;
  };
}

function createLoadNamespacesMock(
  namespacesData: NamespaceData[]
): (ns: string | readonly string[]) => Promise<void> {
  return async function (ns: string | readonly string[]): Promise<void> {
    const namespaceData = namespacesData.find((namespaceData) => namespaceData.identifier === ns);

    if (namespaceData) namespaceData.loaded = true;

    return await Promise.resolve();
  };
}

describe(ServerSideTranslationUtils.name, () => {
  describe(ServerSideTranslationUtils.getDefaultLocale.name, () => {
    it('should return en-US', () => {
      const defaultLocale = ServerSideTranslationUtils.getDefaultLocale();

      expect(defaultLocale).toBe('en-US');
    });
  });

  describe(ServerSideTranslationUtils.getServerSideTranslation.name, () => {
    const LOCALES = ['en-US', 'pt-BR'];

    it.each(LOCALES)(
      'should return a translation function for the given locale - %s',
      async (locale) => {
        const getFixedTSpy = jest.spyOn(i18next, 'getFixedT');

        const t = await ServerSideTranslationUtils.getServerSideTranslation(locale);

        expect(typeof t).toBe('function');
        expect(getFixedTSpy).toHaveBeenCalledWith(locale, undefined);

        getFixedTSpy.mockRestore();
      }
    );

    it.each(LOCALES)(
      'should return a translation function for the given locale with the required namespaces loaded - %s',
      async (locale) => {
        const namespacesData = getTestNamespacesData();
        const namespacesIdentifiers = namespacesData.map((nd) => nd.identifier);
        const namespacesIdentifiersNotLoaded = namespacesData
          .filter((nd) => !nd.loaded)
          .map((nd) => nd.identifier);

        const getFixedTSpy = jest.spyOn(i18next, 'getFixedT');

        const hasResourceBundleSpy = jest
          .spyOn(i18next, 'hasResourceBundle')
          .mockImplementation(createHasResourceBundleMock(namespacesData));

        const loadNamespacesSpy = jest
          .spyOn(i18next, 'loadNamespaces')
          .mockImplementation(createLoadNamespacesMock(namespacesData));

        const t = await ServerSideTranslationUtils.getServerSideTranslation(
          locale,
          namespacesIdentifiers
        );

        expect(typeof t).toBe('function');
        expect(getFixedTSpy).toHaveBeenCalledWith(locale, namespacesIdentifiers);

        namespacesIdentifiers.forEach((ns, i) =>
          expect(hasResourceBundleSpy).toHaveBeenNthCalledWith(i + 1, locale, ns)
        );
        namespacesIdentifiersNotLoaded.forEach((ns) =>
          expect(loadNamespacesSpy).toHaveBeenCalledWith(ns)
        );
        namespacesData.forEach((nd) => expect(nd.loaded).toBe(true));

        hasResourceBundleSpy.mockRestore();
        loadNamespacesSpy.mockRestore();
      }
    );
  });
});
