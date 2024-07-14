import { ErrorCode } from '@common/enums/error-code';
import {
  InvalidContentSyntaxError as CommonInvalidContentSyntaxError,
  InvalidContentSyntaxErrorDetails as CommonInvalidContentSyntaxErrorDetails,
  ValidationError,
} from '@common/view-models/errors/invalid-content-syntax-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';

class InvalidContentSyntaxErrorDetails implements CommonInvalidContentSyntaxErrorDetails {
  public validationErrors: ValidationError[];

  public constructor(errorDetailsData: InvalidContentSyntaxErrorDetails) {
    this.validationErrors = errorDetailsData.validationErrors;
  }
}

export interface InvalidContentSyntaxErrorData extends CommonErrorData {
  validationErrors: ValidationError[];
}

export class InvalidContentSyntaxError
  extends BaseError<InvalidContentSyntaxErrorDetails>
  implements CommonInvalidContentSyntaxError
{
  public static readonly ERROR_CODE = ErrorCode.Common_InvalidContentSyntaxError;

  public details: InvalidContentSyntaxErrorDetails | null;

  public constructor({ message, request, validationErrors }: InvalidContentSyntaxErrorData) {
    super({ message, request, errorCode: InvalidContentSyntaxError.ERROR_CODE });

    this.details = new InvalidContentSyntaxErrorDetails({ validationErrors });
  }
}
