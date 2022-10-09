import { ErrorCode } from '@common/enums/error-code';
import {
  TablatureRenderizationError as CommonTablatureRenderizationError,
  TablatureRenderizationErrorDetails as CommonTablatureRenderizationErrorDetails,
} from '@common/view-models/tablature/tablature-renderization-error';
import { BaseError, CommonErrorData } from '@server/view-models/error/base-error';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';

class TablatureRenderizationErrorDetails implements CommonTablatureRenderizationErrorDetails {
  public instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[];

  public constructor(errorDetailsData: TablatureRenderizationErrorDetails) {
    this.instructionsRenderizationErrors = errorDetailsData.instructionsRenderizationErrors;
  }
}

export interface TablatureRenderizationErrorData extends CommonErrorData {
  instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[];
}

export class TablatureRenderizationError
  extends BaseError<TablatureRenderizationErrorDetails>
  implements CommonTablatureRenderizationError
{
  public static readonly ERROR_CODE = ErrorCode.Tab_RenderizationError;

  public details: TablatureRenderizationErrorDetails | null;

  public constructor({
    instructionsRenderizationErrors,
    message,
    request,
  }: TablatureRenderizationErrorData) {
    super({ message, request, errorCode: TablatureRenderizationError.ERROR_CODE });

    this.details = new TablatureRenderizationErrorDetails({ instructionsRenderizationErrors });
  }
}
