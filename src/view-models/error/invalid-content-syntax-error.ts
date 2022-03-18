import { ErrorCode } from '@enums/error-code';
import { BaseError, CommonErrorData } from '@view-models/error/base-error';
import AjvLocalizeEn from 'ajv-i18n/localize/en';
import AjvLocalizePtBr from 'ajv-i18n/localize/pt-BR';
import { Localize } from 'ajv-i18n/localize/types';

class InvalidContentSyntaxErrorDetails {
  public validationErrors: any;

  public constructor(errorDetailsData: InvalidContentSyntaxErrorDetails) {
    this.validationErrors = errorDetailsData.validationErrors;
  }
}

export type InvalidContentSyntaxErrorData = CommonErrorData & {
  locale: string;
  validationErrors: any;
};

export class InvalidContentSyntaxError extends BaseError<InvalidContentSyntaxErrorDetails> {
  public static readonly ERROR_CODE = ErrorCode.Common_InvalidContentSyntaxError;

  private static readonly DEFAULT_AJV_LOCALIZE = AjvLocalizeEn;

  private static readonly LOCALE_TO_AJV_LOCALIZE_MAP: Map<string, Localize> = new Map([
    ['en-US', AjvLocalizeEn],
    ['pt-BR', AjvLocalizePtBr],
  ]);

  public details: InvalidContentSyntaxErrorDetails | null;

  public constructor({
    locale,
    message,
    request,
    validationErrors,
  }: InvalidContentSyntaxErrorData) {
    super({ message, request, errorCode: InvalidContentSyntaxError.ERROR_CODE });

    let ajvLocalize = InvalidContentSyntaxError.LOCALE_TO_AJV_LOCALIZE_MAP.get(locale);
    if (!ajvLocalize) ajvLocalize = InvalidContentSyntaxError.DEFAULT_AJV_LOCALIZE;

    ajvLocalize(validationErrors);

    this.details = new InvalidContentSyntaxErrorDetails({
      validationErrors: validationErrors,
    });
  }
}
