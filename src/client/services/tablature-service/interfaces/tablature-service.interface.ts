import { TablatureCreationOptionsDTO } from '@client/services/tablature-service/dtos/tablature-creation-options.dto';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';

export const ITablatureServiceInjectionToken = 'ITablatureService';

export interface ITablatureService {
  createTablature(
    tablatureCreationRequest: TablatureCreationRequest,
    tablatureCreationOptions?: TablatureCreationOptionsDTO
  ): Promise<TablatureCreationResponse>;

  getMinTablatureRowsLength(): number;
}
