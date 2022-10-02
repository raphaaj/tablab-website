import { BaseError } from '@common/view-models/errors/base-error';
import { DefinedError } from 'ajv';

export interface InvalidContentSyntaxErrorDetails {
  validationErrors: DefinedError[];
}

export type InvalidContentSyntaxError = BaseError<InvalidContentSyntaxErrorDetails>;
