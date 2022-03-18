import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { BaseErrorsFactory, BaseErrorsFactoryData } from '@view-models/error/base-errors-factory';
import { InternalError } from '@view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@view-models/error/invalid-http-method-error';

export type CommonErrorsFactoryData = BaseErrorsFactoryData;

export class CommonErrorsFactory extends BaseErrorsFactory {
  public constructor(errorsFactoryData: CommonErrorsFactoryData) {
    super(errorsFactoryData);
  }

  public async getInternalError(): Promise<InternalError> {
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

    return new InternalError({
      message: t(`errors:code2message.${InternalError.ERROR_CODE}`),
      request: this.request,
    });
  }

  public async getInvalidContentSyntaxError(
    validationErrors: any
  ): Promise<InvalidContentSyntaxError> {
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

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
    const t = await ServerSideTranslationUtils.getServerSideTranslation(this.locale, ['errors']);

    return new InvalidHttpMethodError({
      acceptedMethods,
      message: t(`errors:code2message.${InvalidHttpMethodError.ERROR_CODE}`),
      request: this.request,
    });
  }
}
