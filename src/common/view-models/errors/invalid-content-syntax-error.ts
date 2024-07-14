import { BaseError } from '@common/view-models/errors/base-error';
import { DefinedError } from 'ajv';

export type ValidationError = DefinedError;

export interface InvalidContentSyntaxErrorDetails {
  validationErrors: ValidationError[];
}

export type InvalidContentSyntaxError = BaseError<InvalidContentSyntaxErrorDetails>;
