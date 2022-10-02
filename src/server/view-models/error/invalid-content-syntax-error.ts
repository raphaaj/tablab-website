import { ErrorCode } from '@common/enums/error-code';
import {
  InvalidContentSyntaxError as CommonInvalidContentSyntaxError,
  InvalidContentSyntaxErrorDetails as CommonInvalidContentSyntaxErrorDetails,
} from '@common/view-models/errors/invalid-content-syntax-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';
import { DefinedError } from 'ajv';
import AjvLocalizeEn from 'ajv-i18n/localize/en';
import AjvLocalizePtBr from 'ajv-i18n/localize/pt-BR';
import { Localize } from 'ajv-i18n/localize/types';

class InvalidContentSyntaxErrorDetails implements CommonInvalidContentSyntaxErrorDetails {
  public validationErrors: DefinedError[];

  public constructor(errorDetailsData: InvalidContentSyntaxErrorDetails) {
    this.validationErrors = errorDetailsData.validationErrors;
  }
}

export interface InvalidContentSyntaxErrorData extends CommonErrorData {
  locale: string;
  validationErrors: any;
}

export class InvalidContentSyntaxError
  extends BaseError<InvalidContentSyntaxErrorDetails>
  implements CommonInvalidContentSyntaxError
{
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
