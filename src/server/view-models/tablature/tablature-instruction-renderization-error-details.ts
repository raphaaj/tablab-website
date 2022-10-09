/* eslint-disable @typescript-eslint/member-ordering */
import { TablatureInstructionRenderizationErrorDetails as CommonTablatureInstructionRenderizationErrorDetails } from '@common/view-models/tablature/tablature-renderization-error';
import { TablatureInstructionRenderizationErrorDTO } from '@server/services/tablature/dtos/tablature-instruction-renderization-error-dto';

export class TablatureInstructionRenderizationErrorDetails
  implements CommonTablatureInstructionRenderizationErrorDetails
{
  public static createFromTablatureInstructionRenderizationError(
    tablatureInstructionRenderizationError: TablatureInstructionRenderizationErrorDTO
  ): TablatureInstructionRenderizationErrorDetails {
    return new TablatureInstructionRenderizationErrorDetails({
      instruction: tablatureInstructionRenderizationError.instruction,
      instructionStartIndex: tablatureInstructionRenderizationError.instructionStartIndex,
      instructionEndIndex: tablatureInstructionRenderizationError.instructionEndIndex,
      renderizationErrorType: tablatureInstructionRenderizationError.renderizationErrorType,
      renderizationErrorMessage: tablatureInstructionRenderizationError.renderizationErrorMessage,
      childInstructionsRenderizationErrors:
        tablatureInstructionRenderizationError.childInstructionsRenderizationErrors,
    });
  }

  public static createFromTablatureInstructionRenderizationErrors(
    tablatureInstructionRenderizationErrors: TablatureInstructionRenderizationErrorDTO[]
  ): TablatureInstructionRenderizationErrorDetails[] {
    return tablatureInstructionRenderizationErrors.map((tablatureInstructionRenderizationError) =>
      TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationError(
        tablatureInstructionRenderizationError
      )
    );
  }

  public instruction: string;
  public instructionStartIndex: number;
  public instructionEndIndex: number;
  public renderizationErrorType: string;
  public renderizationErrorMessage: string;
  public childInstructionsRenderizationErrors:
    | TablatureInstructionRenderizationErrorDetails[]
    | null;

  public constructor(
    instructionRenderizationErrorData: TablatureInstructionRenderizationErrorDetails
  ) {
    this.instruction = instructionRenderizationErrorData.instruction;
    this.instructionStartIndex = instructionRenderizationErrorData.instructionStartIndex;
    this.instructionEndIndex = instructionRenderizationErrorData.instructionEndIndex;
    this.renderizationErrorType = instructionRenderizationErrorData.renderizationErrorType;
    this.renderizationErrorMessage = instructionRenderizationErrorData.renderizationErrorMessage;
    this.childInstructionsRenderizationErrors =
      instructionRenderizationErrorData.childInstructionsRenderizationErrors || null;
  }
}
