import { TablatureInstructionCompilationErrorDetails as CommonTablatureInstructionCompilationErrorDetails } from '@common/view-models/tablature/tablature-compilation-error';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';

export class TablatureInstructionCompilationErrorDetails
  implements CommonTablatureInstructionCompilationErrorDetails
{
  public static createFromTablatureInstructionCompilationError(
    tablatureInstructionCompilationError: TablatureInstructionCompilationErrorDTO
  ): TablatureInstructionCompilationErrorDetails {
    return new TablatureInstructionCompilationErrorDetails({
      instruction: tablatureInstructionCompilationError.instruction,
      instructionStartIndex: tablatureInstructionCompilationError.instructionStartIndex,
      instructionEndIndex: tablatureInstructionCompilationError.instructionEndIndex,
      compilationErrorType: tablatureInstructionCompilationError.compilationErrorType,
      compilationErrorMessage: tablatureInstructionCompilationError.compilationErrorMessage,
      childInstructionsCompilationErrors:
        tablatureInstructionCompilationError.childInstructionsCompilationErrors?.map(
          (childInstructionsCompilationError) =>
            TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationError(
              childInstructionsCompilationError
            )
        ) ?? null,
    });
  }

  public static createFromTablatureInstructionCompilationErrors(
    tablatureInstructionCompilationErrors: TablatureInstructionCompilationErrorDTO[]
  ): TablatureInstructionCompilationErrorDetails[] {
    return tablatureInstructionCompilationErrors.map((tablatureInstructionCompilationError) =>
      TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationError(
        tablatureInstructionCompilationError
      )
    );
  }

  public instruction: string;
  public instructionStartIndex: number;
  public instructionEndIndex: number;
  public compilationErrorType: string;
  public compilationErrorMessage: string;
  public childInstructionsCompilationErrors: TablatureInstructionCompilationErrorDetails[] | null;

  public constructor(
    instructionRenderizationErrorData: TablatureInstructionCompilationErrorDetails
  ) {
    this.instruction = instructionRenderizationErrorData.instruction;
    this.instructionStartIndex = instructionRenderizationErrorData.instructionStartIndex;
    this.instructionEndIndex = instructionRenderizationErrorData.instructionEndIndex;
    this.compilationErrorType = instructionRenderizationErrorData.compilationErrorType;
    this.compilationErrorMessage = instructionRenderizationErrorData.compilationErrorMessage;
    this.childInstructionsCompilationErrors =
      instructionRenderizationErrorData.childInstructionsCompilationErrors || null;
  }
}
