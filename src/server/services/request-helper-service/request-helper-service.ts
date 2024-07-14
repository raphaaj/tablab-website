import { IRequestHelperService } from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import type { ITranslationService } from '@server/services/translation-service/interfaces/translation-service.interface';
import { ITranslationServiceInjectionToken } from '@server/services/translation-service/interfaces/translation-service.interface';
import { NextApiRequest } from 'next';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RequestHelperService implements IRequestHelperService {
  public constructor(
    @inject(ITranslationServiceInjectionToken) private _translationService: ITranslationService
  ) {}

  public getLocaleOption(request: NextApiRequest): string | null {
    return this._getLocaleFromRequestHeaders(request);
  }

  public getLocaleOptionOrDefaultLocale(request: NextApiRequest): string {
    return this.getLocaleOption(request) ?? this._translationService.getDefaultLocale();
  }

  private _getLocaleFromRequestHeaders(request: NextApiRequest): string | null {
    let locale: string | null = null;

    const acceptLanguageHeaderValue = request.headers['accept-language'];
    if (acceptLanguageHeaderValue) {
      const acceptedLocales =
        this._getAcceptedLocalesFromAcceptLanguageHeaderValue(acceptLanguageHeaderValue);

      const supportedLocales = this._translationService.getSupportedLocales();

      locale = this._getLocalePreferenceFromAcceptedLocalesAndSupportedLocales(
        acceptedLocales,
        supportedLocales
      );
    }

    return locale;
  }

  private _getAcceptedLocalesFromAcceptLanguageHeaderValue(
    acceptLanguageHeaderValue: string
  ): string[] {
    return acceptLanguageHeaderValue
      .split(',')
      .map((languagePreference) => {
        const languagePreferenceParts = languagePreference.trim().split(';q=');

        if (languagePreferenceParts.length === 1) {
          languagePreferenceParts.push('1.0');
        }

        return {
          locale: languagePreferenceParts[0],
          quality: parseFloat(languagePreferenceParts[1]) || 0.0,
        };
      })
      .filter((localePreference) => localePreference.quality > 0)
      .sort((lp1, lp2) => lp2.quality - lp1.quality)
      .map((localePreference) => localePreference.locale);
  }

  private _getLocalePreferenceFromAcceptedLocalesAndSupportedLocales(
    acceptedLocales: string[],
    supportedLocales: string[]
  ): string | null {
    let localePreference: string | null = null;

    const localePreferences = acceptedLocales.filter(
      (acceptedLocale) => supportedLocales.indexOf(acceptedLocale) > -1
    );

    if (localePreferences.length > 0) localePreference = localePreferences[0];

    return localePreference;
  }
}
