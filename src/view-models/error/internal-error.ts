import { ErrorCode } from '@enums/error-code';
import { BaseError, CommonErrorData } from '@view-models/error/base-error';

export type InternalErrorData = CommonErrorData;

export class InternalError extends BaseError<null> {
  public static readonly ERROR_CODE = ErrorCode.Common_UnknownError;

  public details: null;

  public constructor(errorData: InternalErrorData) {
    super({ ...errorData, errorCode: InternalError.ERROR_CODE });

    this.details = null;
  }
}
