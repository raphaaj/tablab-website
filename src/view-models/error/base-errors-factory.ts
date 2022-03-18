import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { NextApiRequest } from 'next';

export type BaseErrorsFactoryData = {
  locale?: string;
  request: NextApiRequest;
};

export class BaseErrorsFactory {
  public locale: string;
  public request: NextApiRequest;

  public constructor({ locale, request }: BaseErrorsFactoryData) {
    this.locale = locale || ServerSideTranslationUtils.getDefaultLocale();
    this.request = request;
  }
}
