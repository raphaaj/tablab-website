/* eslint-disable @typescript-eslint/member-ordering */
import { ErrorCode } from '@common/enums/error-code';
import { BaseError as CommonBaseError } from '@common/view-models/errors/base-error';
import { NextApiRequest } from 'next';

export interface CommonErrorData {
  message: string;
  request: NextApiRequest;
}

export interface BaseErrorData extends CommonErrorData {
  errorCode: number;
}

export abstract class BaseError<T> implements CommonBaseError<T> {
  public errorCode: ErrorCode;
  public errorType: string;
  public message: string;
  public abstract details: T | null;

  public constructor({ errorCode, message }: BaseErrorData) {
    this.errorCode = errorCode;
    this.errorType = new.target.name;
    this.message = message;
  }
}
