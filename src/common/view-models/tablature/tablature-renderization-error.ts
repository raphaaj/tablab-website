/* eslint-disable @typescript-eslint/member-ordering */
import { BaseError } from '@common/view-models/errors/base-error';

export interface TablatureInstructionRenderizationErrorDetails {
  instruction: string;
  instructionStartIndex: number;
  instructionEndIndex: number;
  renderizationErrorType: string;
  renderizationErrorMessage: string;
  childInstructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[] | null;
}

export interface TablatureRenderizationErrorDetails {
  instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDetails[];
}

export type TablatureRenderizationError = BaseError<TablatureRenderizationErrorDetails>;
