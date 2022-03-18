import { NextApiRequest } from 'next';

export type CommonErrorData = {
  message: string;
  request: NextApiRequest;
};

export type BaseErrorData = CommonErrorData & {
  errorCode: number;
};

export abstract class BaseError<T> {
  public errorCode: number;
  public errorType: string;
  public message: string;
  public abstract details: T | null;

  public constructor({ errorCode, message }: BaseErrorData) {
    this.errorCode = errorCode;
    this.errorType = new.target.name;
    this.message = message;
  }
}
