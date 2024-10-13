import { TablatureRequestOptionsDTO } from '@client/services/tablature-service/dtos/tablature-request-options.dto';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';
import { TablatureDownloadRequest } from '@common/view-models/tablature/tablature-download-request';

export const ITablatureServiceInjectionToken = 'ITablatureService';

export interface ITablatureService {
  createTablature(
    tablatureCreationRequest: TablatureCreationRequest,
    tablatureCreationOptions?: TablatureRequestOptionsDTO
  ): Promise<TablatureCreationResponse>;

  downloadTablatureAsPdfDocument(
    tablatureDownloadRequest: TablatureDownloadRequest,
    tablatureRequestOptions?: TablatureRequestOptionsDTO
  ): Promise<Blob>;

  getMinTablatureRowsLength(): number;
}
