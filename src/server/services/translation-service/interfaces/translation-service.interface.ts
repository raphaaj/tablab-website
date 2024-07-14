import { TranslationFunction } from '@server/services/translation-service/types/translation-function.type';

export const ITranslationServiceInjectionToken = 'ITranslationService';

export interface ITranslationService {
  getDefaultLocale(): string;

  getSupportedLocales(): string[];

  getTranslationFunction(
    locale: string,
    namespacesRequired?: string[]
  ): Promise<TranslationFunction>;
}
