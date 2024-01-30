import fs from 'fs';
import i18next, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { i18n } from '../../../next-i18next.config';

const localesFolder = path.join(process.cwd(), 'public', 'locales');

i18next.use(Backend).init({
  ns: ['errors'],
  load: 'currentOnly',
  initImmediate: false,
  fallbackLng: i18n.defaultLocale,
  supportedLngs: i18n.locales,
  preload: fs.readdirSync(localesFolder).filter((fileName) => {
    const joinedPath = path.join(localesFolder, fileName);
    return fs.lstatSync(joinedPath).isDirectory();
  }),
  backend: {
    loadPath: path.join(localesFolder, '{{lng}}/{{ns}}.json'),
    addPath: path.join(localesFolder, '{{lng}}/{{ns}}.missing.json'),
  },
});

export class ServerSideTranslationUtils {
  public static getDefaultLocale(): string {
    return i18n.defaultLocale;
  }

  public static async getServerSideTranslation(
    locale: string,
    namespacesRequired?: string[] | undefined
  ): Promise<TFunction> {
    if (namespacesRequired)
      await ServerSideTranslationUtils._loadMissingResources(locale, namespacesRequired);

    return i18next.getFixedT(locale, namespacesRequired);
  }

  private static async _loadMissingResources(locale: string, namespaces: string[]): Promise<void> {
    namespaces.forEach(async (namespace) => {
      if (!i18next.hasResourceBundle(locale, namespace)) {
        await i18next.loadNamespaces(namespace);
      }
    });
  }
}
