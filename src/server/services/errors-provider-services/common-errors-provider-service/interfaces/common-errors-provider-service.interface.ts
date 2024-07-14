import { InternalError } from '@common/view-models/errors/internal-error';
import {
  InvalidContentSyntaxError,
  ValidationError,
} from '@common/view-models/errors/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@common/view-models/errors/invalid-http-method-error';
import { NextApiRequest } from 'next';

export const ICommonErrorsProviderServiceInjectionToken = 'ICommonErrorsProviderService';

export interface ICommonErrorsProviderService {
  getInternalError(request: NextApiRequest): Promise<InternalError>;

  getInvalidContentSyntaxError(
    request: NextApiRequest,
    validationErrors: ValidationError[]
  ): Promise<InvalidContentSyntaxError>;

  getInvalidHttpMethodError(
    request: NextApiRequest,
    acceptedMethods: string[]
  ): Promise<InvalidHttpMethodError>;
}
