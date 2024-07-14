import { ErrorCode } from '@common/enums/error-code';
import {
  InvalidHttpMethodError as CommonInvalidHttpMethodError,
  InvalidHttpMethodErrorDetails as CommonInvalidHttpMethodErrorDetails,
} from '@common/view-models/errors/invalid-http-method-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';

class InvalidHttpMethodErrorDetails implements CommonInvalidHttpMethodErrorDetails {
  public path: string;
  public receivedMethod: string;
  public allowedMethods: string[];

  public constructor(errorDetailsData: InvalidHttpMethodErrorDetails) {
    this.path = errorDetailsData.path;
    this.receivedMethod = errorDetailsData.receivedMethod;
    this.allowedMethods = errorDetailsData.allowedMethods;
  }
}

export interface InvalidHttpMethodErrorData extends CommonErrorData {
  acceptedMethods: string[];
}

export class InvalidHttpMethodError
  extends BaseError<InvalidHttpMethodErrorDetails>
  implements CommonInvalidHttpMethodError
{
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
