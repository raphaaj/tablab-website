import { BaseError, BaseErrorData } from '@common/models/errors/base-error';
import { TablatureInstructionCompilationErrorDetails } from '@common/view-models/tablature/tablature-compilation-error';

export interface TablatureCreationErrorData extends BaseErrorData {
  instructionsCompilationErrors?: TablatureInstructionCompilationErrorDetails[] | null;
}

export class TablatureCreationError extends BaseError {
  public instructionsCompilationErrors: TablatureInstructionCompilationErrorDetails[] | null;

  public constructor(errorData: TablatureCreationErrorData = {}) {
    super(errorData);

    this.instructionsCompilationErrors = errorData.instructionsCompilationErrors || null;
  }
}
