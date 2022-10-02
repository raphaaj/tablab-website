import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import { NextApiRequest } from 'next';

export interface BaseErrorsFactoryData {
  locale?: string;
  request: NextApiRequest;
}

export class BaseErrorsFactory {
  public locale: string;
  public request: NextApiRequest;

  public constructor({ locale, request }: BaseErrorsFactoryData) {
    this.locale = locale || ServerSideTranslationUtils.getDefaultLocale();
    this.request = request;
  }
}
