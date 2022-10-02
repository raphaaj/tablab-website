import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import {
  SuccessfulTablatureCreationResultDTO,
  TablatureCreationResultDTO,
} from '@server/services/tablature/dtos/tablature-creation-result-dto';

export abstract class BaseTablatureService {
  public isSuccessfulTablatureCreationResult(
    tablatureCreationResult: TablatureCreationResultDTO
  ): tablatureCreationResult is SuccessfulTablatureCreationResultDTO {
    return tablatureCreationResult.success;
  }

  public abstract createTablature(
    tablatureCreationData: TablatureCreationDataDTO
  ): Promise<TablatureCreationResultDTO>;
}
