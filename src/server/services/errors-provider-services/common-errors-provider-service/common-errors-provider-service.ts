import { InternalError as CommonInternalError } from '@common/view-models/errors/internal-error';
import {
  InvalidContentSyntaxError as CommonInvalidContentSyntaxError,
  ValidationError,
} from '@common/view-models/errors/invalid-content-syntax-error';
import { InvalidHttpMethodError as CommonInvalidHttpMethodError } from '@common/view-models/errors/invalid-http-method-error';
import { ICommonErrorsProviderService } from '@server/services/errors-provider-services/common-errors-provider-service/interfaces/common-errors-provider-service.interface';
import {
  IRequestHelperServiceInjectionToken,
  type IRequestHelperService,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import type { ITranslationService } from '@server/services/translation-service/interfaces/translation-service.interface';
import { ITranslationServiceInjectionToken } from '@server/services/translation-service/interfaces/translation-service.interface';
import { TranslationFunction } from '@server/services/translation-service/types/translation-function.type';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { NextApiRequest } from 'next';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CommonErrorsProviderService implements ICommonErrorsProviderService {
  public constructor(
    @inject(ITranslationServiceInjectionToken)
    protected _translationService: ITranslationService,
    @inject(IRequestHelperServiceInjectionToken)
    protected _requestHelperService: IRequestHelperService
  ) {}

  public async getInternalError(request: NextApiRequest): Promise<CommonInternalError> {
    const t = await this._getTranslationFunction(request);

    return new InternalError({
      message: t(`errors:code2message.${InternalError.ERROR_CODE}`),
      request,
    });
  }

  public async getInvalidContentSyntaxError(
    request: NextApiRequest,
    validationErrors: ValidationError[]
  ): Promise<CommonInvalidContentSyntaxError> {
    const t = await this._getTranslationFunction(request);

    return new InvalidContentSyntaxError({
      message: t(`errors:code2message.${InvalidContentSyntaxError.ERROR_CODE}`),
      request,
      validationErrors,
    });
  }

  public async getInvalidHttpMethodError(
    request: NextApiRequest,
    acceptedMethods: string[]
  ): Promise<CommonInvalidHttpMethodError> {
    const t = await this._getTranslationFunction(request);

    return new InvalidHttpMethodError({
      message: t(`errors:code2message.${InvalidHttpMethodError.ERROR_CODE}`),
      request,
      acceptedMethods,
    });
  }

  protected async _getTranslationFunction(request: NextApiRequest): Promise<TranslationFunction> {
    const locale = this._requestHelperService.getLocaleOptionOrDefaultLocale(request);
    return await this._translationService.getTranslationFunction(locale, ['errors']);
  }
}
