import { BaseError, BaseErrorData } from '@common/models/errors/base-error';

export class TablatureDownloadError extends BaseError {
  public constructor(errorData: BaseErrorData = {}) {
    super(errorData);
  }
}
