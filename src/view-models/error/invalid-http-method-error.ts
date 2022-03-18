/* eslint-disable @typescript-eslint/member-ordering */

import { ErrorCode } from '@enums/error-code';
import { BaseError, CommonErrorData } from '@view-models/error/base-error';

class InvalidHttpMethodErrorDetails {
  public path: string;
  public receivedMethod: string;
  public allowedMethods: string[];

  public constructor(errorDetailsData: InvalidHttpMethodErrorDetails) {
    this.path = errorDetailsData.path;
    this.receivedMethod = errorDetailsData.receivedMethod;
    this.allowedMethods = errorDetailsData.allowedMethods;
  }
}

export type InvalidHttpMethodErrorData = CommonErrorData & {
  acceptedMethods: string[];
};

export class InvalidHttpMethodError extends BaseError<InvalidHttpMethodErrorDetails> {
  public static readonly ERROR_CODE = ErrorCode.Common_InvalidHttpMethodError;

  public details: InvalidHttpMethodErrorDetails | null;

  public constructor({ acceptedMethods, message, request }: InvalidHttpMethodErrorData) {
    super({ message, request, errorCode: InvalidHttpMethodError.ERROR_CODE });

    this.details = new InvalidHttpMethodErrorDetails({
      path: request.url as string,
      receivedMethod: request.method as string,
      allowedMethods: acceptedMethods,
    });
  }
}
