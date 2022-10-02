/* eslint-disable @typescript-eslint/member-ordering */
import { ErrorCode } from '@common/enums/error-code';

export interface BaseError<T> {
  errorCode: ErrorCode;
  errorType: string;
  message: string;
  details: T | null;
}
