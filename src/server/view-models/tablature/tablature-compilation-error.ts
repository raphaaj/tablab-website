import { ErrorCode } from '@common/enums/error-code';
import {
  TablatureCompilationError as CommonTablatureCompilationError,
  TablatureCompilationErrorDetails as CommonTablatureCompilationErrorDetails,
  TablatureInstructionCompilationErrorDetails as CommonTablatureInstructionCompilationErrorDetails,
} from '@common/view-models/tablature/tablature-compilation-error';

import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';

class TablatureCompilationErrorDetails implements CommonTablatureCompilationErrorDetails {
  public instructionsCompilationErrors: CommonTablatureInstructionCompilationErrorDetails[];

  public constructor(errorDetailsData: TablatureCompilationErrorDetails) {
    this.instructionsCompilationErrors = errorDetailsData.instructionsCompilationErrors;
  }
}

export interface TablatureCompilationErrorData extends CommonErrorData {
  instructionsCompilationErrors: CommonTablatureInstructionCompilationErrorDetails[];
}

export class TablatureCompilationError
  extends BaseError<TablatureCompilationErrorDetails>
  implements CommonTablatureCompilationError
{
  public static readonly ERROR_CODE = ErrorCode.Tablature_CompilationError;

  public details: TablatureCompilationErrorDetails | null;

  public constructor({
    instructionsCompilationErrors,
    message,
    request,
  }: TablatureCompilationErrorData) {
    super({ message, request, errorCode: TablatureCompilationError.ERROR_CODE });

    this.details = new TablatureCompilationErrorDetails({ instructionsCompilationErrors });
  }
}
