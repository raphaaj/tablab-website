import { ErrorCode } from '@common/enums/error-code';
import { InternalError as CommonInternalError } from '@common/view-models/errors/internal-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';

export type InternalErrorData = CommonErrorData;

export class InternalError extends BaseError<null> implements CommonInternalError {
  public static readonly ERROR_CODE = ErrorCode.Common_UnknownError;

  public details: null;

  public constructor(errorData: InternalErrorData) {
    super({ ...errorData, errorCode: InternalError.ERROR_CODE });

    this.details = null;
  }
}
