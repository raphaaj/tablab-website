import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import {
  BaseErrorsFactory,
  BaseErrorsFactoryData,
} from '@server/view-models/error/base-errors-factory';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { TFunction } from 'next-i18next';

export type CommonErrorsFactoryData = BaseErrorsFactoryData;

export class CommonErrorsFactory extends BaseErrorsFactory {
  public constructor(errorsFactoryData: CommonErrorsFactoryData) {
    super(errorsFactoryData);
  }

  public async getInternalError(): Promise<InternalError> {
    const t = await this._getTFunction();

    return new InternalError({
      message: t(`errors:code2message.${InternalError.ERROR_CODE}`),
      request: this.request,
    });
  }

  public async getInvalidContentSyntaxError(
    validationErrors: any
  ): Promise<InvalidContentSyntaxError> {
    const t = await this._getTFunction();

    return new InvalidContentSyntaxError({
      locale: this.locale,
      message: t(`errors:code2message.${InvalidContentSyntaxError.ERROR_CODE}`),
      request: this.request,
      validationErrors,
    });
  }

  public async getInvalidHttpMethodError(
    acceptedMethods: string[]
  ): Promise<InvalidHttpMethodError> {
    const t = await this._getTFunction();

    return new InvalidHttpMethodError({
      acceptedMethods,
      message: t(`errors:code2message.${InvalidHttpMethodError.ERROR_CODE}`),
      request: this.request,
    });
  }

  private async _getTFunction(): Promise<TFunction> {
    return await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);
  }
}
