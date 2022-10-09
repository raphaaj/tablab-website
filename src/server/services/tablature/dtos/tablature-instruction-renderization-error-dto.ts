export class TablatureInstructionRenderizationErrorDTO {
  public childInstructionsRenderizationErrors: TablatureInstructionRenderizationErrorDTO[] | null;
  public instruction: string;
  public instructionEndIndex: number;
  public instructionStartIndex: number;
  public renderizationErrorMessage: string;
  public renderizationErrorType: string;

  public constructor(
    tablatureInstructionRenderizationErrorData: TablatureInstructionRenderizationErrorDTO
  ) {
    this.instruction = tablatureInstructionRenderizationErrorData.instruction;
    this.instructionStartIndex = tablatureInstructionRenderizationErrorData.instructionStartIndex;
    this.instructionEndIndex = tablatureInstructionRenderizationErrorData.instructionEndIndex;
    this.renderizationErrorType = tablatureInstructionRenderizationErrorData.renderizationErrorType;
    this.renderizationErrorMessage =
      tablatureInstructionRenderizationErrorData.renderizationErrorMessage;
    this.childInstructionsRenderizationErrors =
      tablatureInstructionRenderizationErrorData.childInstructionsRenderizationErrors || null;
  }
}
