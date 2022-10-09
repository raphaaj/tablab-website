import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';
import { TablatureInstructionRenderizationErrorDTO } from '@server/services/tablature/dtos/tablature-instruction-renderization-error-dto';

export interface SuccessfulTablatureCreationResultDTO {
  success: true;
  tablature: TablatureDTO;
}

export interface FailedTablatureCreationResultDTO {
  instructionsRenderizationErrors: TablatureInstructionRenderizationErrorDTO[];
  success: false;
}

export type TablatureCreationResultDTO =
  | SuccessfulTablatureCreationResultDTO
  | FailedTablatureCreationResultDTO;
