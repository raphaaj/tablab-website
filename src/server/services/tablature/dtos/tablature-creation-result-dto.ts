import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';
import { FailedWriteResult } from 'tablab';

export interface SuccessfulTablatureCreationResultDTO {
  success: true;
  tablature: TablatureDTO;
}

export interface FailedTablatureCreationResultDTO {
  failedWriteResults: FailedWriteResult[];
  success: false;
}

export type TablatureCreationResultDTO =
  | SuccessfulTablatureCreationResultDTO
  | FailedTablatureCreationResultDTO;
