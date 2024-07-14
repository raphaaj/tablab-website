import { BaseError } from '@common/view-models/errors/base-error';

export interface TablatureInstructionCompilationErrorDetails {
  instruction: string;
  instructionStartIndex: number;
  instructionEndIndex: number;
  compilationErrorType: string;
  compilationErrorMessage: string;
  childInstructionsCompilationErrors: TablatureInstructionCompilationErrorDetails[] | null;
}

export interface TablatureCompilationErrorDetails {
  instructionsCompilationErrors: TablatureInstructionCompilationErrorDetails[];
}

export type TablatureCompilationError = BaseError<TablatureCompilationErrorDetails>;
