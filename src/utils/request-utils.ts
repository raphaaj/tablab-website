import { NextApiRequest } from 'next';
import { i18n } from '../../next-i18next.config';

export class RequestUtils {
  public request: NextApiRequest;

  public constructor(request: NextApiRequest) {
    this.request = request;
  }

  public getLocaleOption(): string | null {
    return this._getLocaleFromRequestHeaders();
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

  private _getLocaleFromRequestHeaders(): string | null {
    let locale: string | null = null;

    const acceptLanguageHeaderValue = this.request.headers['accept-language'];
    if (acceptLanguageHeaderValue) {
      const acceptedLocales =
        this._getAcceptedLocalesFromAcceptLanguageHeaderValue(acceptLanguageHeaderValue);

      locale = this._getLocalePreferenceFromAcceptedLocalesAndSupportedLocales(
        acceptedLocales,
        i18n.locales
      );
    }

    return locale;
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
