type TablatureInstructionCompilationErrorData = {
  instruction: string;
  instructionStartIndex: number;
  instructionEndIndex: number;
  compilationErrorType: string;
  compilationErrorMessage: string;
  childInstructionsCompilationErrors: TablatureInstructionCompilationErrorData[] | null;
};

export class TablatureInstructionCompilationErrorDTO {
  public instruction: string;
  public instructionStartIndex: number;
  public instructionEndIndex: number;
  public compilationErrorType: string;
  public compilationErrorMessage: string;
  public childInstructionsCompilationErrors: TablatureInstructionCompilationErrorDTO[] | null;

  public constructor({
    instruction,
    instructionStartIndex,
    instructionEndIndex,
    compilationErrorType,
    compilationErrorMessage,
    childInstructionsCompilationErrors,
  }: TablatureInstructionCompilationErrorData) {
    this.instruction = instruction;
    this.instructionStartIndex = instructionStartIndex;
    this.instructionEndIndex = instructionEndIndex;
    this.compilationErrorType = compilationErrorType;
    this.compilationErrorMessage = compilationErrorMessage;
    this.childInstructionsCompilationErrors =
      childInstructionsCompilationErrors?.map(
        (x) => new TablatureInstructionCompilationErrorDTO(x)
      ) ?? null;
  }
}
