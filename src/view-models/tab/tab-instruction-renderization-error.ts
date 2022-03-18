/* eslint-disable @typescript-eslint/member-ordering */
import { FailedWriteResult } from 'tablab';

export class TabInstructionRenderizationError {
  public static createFromFailedWriteResult(
    failedWriteResult: FailedWriteResult
  ): TabInstructionRenderizationError {
    const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

    let childErrors: TabInstructionRenderizationError[] | null = null;
    if (failedWriteResult.childResults) {
      childErrors = TabInstructionRenderizationError.createFromFailedWriteResults(
        failedWriteResult.childResults.filter((childWriteResult) => !childWriteResult.success)
      );
    }

    return new TabInstructionRenderizationError({
      instruction: parsedInstruction.value,
      startIndex: parsedInstruction.readFromIndex,
      endIndex: parsedInstruction.readToIndex,
      errorType: failedWriteResult.failureReasonIdentifier,
      errorMessage: failedWriteResult.failureMessage,
      childErrors,
    });
  }

  public static createFromFailedWriteResults(
    failedWriteResults: FailedWriteResult[]
  ): TabInstructionRenderizationError[] {
    return failedWriteResults.map((failedWriteResult) =>
      TabInstructionRenderizationError.createFromFailedWriteResult(failedWriteResult)
    );
  }

  public instruction: string;
  public startIndex: number;
  public endIndex: number;
  public errorType: string | null;
  public errorMessage: string | null;
  public childErrors: TabInstructionRenderizationError[] | null;

  public constructor(renderizationErrorData: TabInstructionRenderizationError) {
    this.instruction = renderizationErrorData.instruction;
    this.startIndex = renderizationErrorData.startIndex;
    this.endIndex = renderizationErrorData.endIndex;
    this.errorType = renderizationErrorData.errorType;
    this.errorMessage = renderizationErrorData.errorMessage;
    this.childErrors = renderizationErrorData.childErrors;
  }
}
