import { BaseError } from '@common/view-models/errors/base-error';

export interface InvalidHttpMethodErrorDetails {
  path: string;
  receivedMethod: string;
  allowedMethods: string[];
}

export type InvalidHttpMethodError = BaseError<InvalidHttpMethodErrorDetails>;
