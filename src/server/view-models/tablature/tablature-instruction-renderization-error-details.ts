/* eslint-disable @typescript-eslint/member-ordering */
import { TablatureInstructionRenderizationErrorDetails as CommonTablatureInstructionRenderizationErrorDetails } from '@common/view-models/tablature/tablature-renderization-error';
import { FailedWriteResult } from 'tablab';

export class TablatureInstructionRenderizationErrorDetails
  implements CommonTablatureInstructionRenderizationErrorDetails
{
  public static createFromFailedWriteResult(
    failedWriteResult: FailedWriteResult
  ): TablatureInstructionRenderizationErrorDetails {
    const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

    let childInstructionsRenderizationErrors:
      | TablatureInstructionRenderizationErrorDetails[]
      | null = null;
    if (failedWriteResult.childResults) {
      childInstructionsRenderizationErrors =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
          failedWriteResult.childResults.filter((childWriteResult) => !childWriteResult.success)
        );
    }

    return new TablatureInstructionRenderizationErrorDetails({
      instruction: parsedInstruction.value,
      instructionStartIndex: parsedInstruction.readFromIndex,
      instructionEndIndex: parsedInstruction.readToIndex,
      renderizationErrorType: failedWriteResult.failureReasonIdentifier as string,
      renderizationErrorMessage: failedWriteResult.failureMessage as string,
      childInstructionsRenderizationErrors,
    });
  }

  public static createFromFailedWriteResults(
    failedWriteResults: FailedWriteResult[]
  ): TablatureInstructionRenderizationErrorDetails[] {
    return failedWriteResults.map((failedWriteResult) =>
      TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult(failedWriteResult)
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
