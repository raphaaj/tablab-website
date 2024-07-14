import NextI18NextConfig from '@next-i18next.config';
import { ITranslationService } from '@server/services/translation-service/interfaces/translation-service.interface';
import { TranslationFunction } from '@server/services/translation-service/types/translation-function.type';
import i18next from 'i18next';
import { injectable } from 'tsyringe';

import fs from 'fs';
import Backend from 'i18next-fs-backend';
import path from 'path';

const localesFolder = path.join(process.cwd(), 'public', 'locales');
i18next.use(Backend).init({
  ns: ['errors'],
  load: 'currentOnly',
  initImmediate: false,
  fallbackLng: NextI18NextConfig.i18n.defaultLocale,
  supportedLngs: NextI18NextConfig.i18n.locales,
  preload: fs.readdirSync(localesFolder).filter((fileName) => {
    const joinedPath = path.join(localesFolder, fileName);
    return fs.lstatSync(joinedPath).isDirectory();
  }),
  backend: {
    loadPath: path.join(localesFolder, '{{lng}}/{{ns}}.json'),
    addPath: path.join(localesFolder, '{{lng}}/{{ns}}.missing.json'),
  },
});

@injectable()
export class TranslationService implements ITranslationService {
  public getDefaultLocale(): string {
    return NextI18NextConfig.i18n.defaultLocale;
  }

  public getSupportedLocales(): string[] {
    return NextI18NextConfig.i18n.locales;
  }

  public async getTranslationFunction(
    locale: string,
    namespacesRequired?: string[]
  ): Promise<TranslationFunction> {
    if (namespacesRequired) await this._loadMissingResources(locale, namespacesRequired);

    return i18next.getFixedT(locale, namespacesRequired) as TranslationFunction;
  }

  private async _loadMissingResources(locale: string, namespaces: string[]): Promise<void> {
    for (const namespace of namespaces) {
      if (!i18next.hasResourceBundle(locale, namespace)) {
        await i18next.loadNamespaces(namespace);
      }
    }
  }
}
