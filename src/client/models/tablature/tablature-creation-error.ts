import { BaseError, BaseErrorData } from '@common/models/errors/base-error';
import { TablatureInstructionRenderizationErrorDetails } from '@common/view-models/tablature/tablature-renderization-error';

export interface TablatureCreationErrorData extends BaseErrorData {
  instructionsRenderizationErrors?: TablatureInstructionRenderizationErrorDetails[] | null;
}

export class TablatureCreationError extends BaseError {
  public instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[] | null;

  public constructor(errorData: TablatureCreationErrorData = {}) {
    super(errorData);

    this.instructionsRenderizationErrors = errorData.instructionsRenderizationErrors || null;
  }
}
