import { TablatureCreationError } from '@client/models/tablature/tablature-creation-error';
import { TablatureCreationOptionsDTO } from '@client/services/tablature-service/dtos/tablature-creation-options.dto';
import { ITablatureService } from '@client/services/tablature-service/interfaces/tablature-service.interface';
import { TablatureCompilationError } from '@common/view-models/tablature/tablature-compilation-error';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';

export class TablatureService implements ITablatureService {
  public static MIN_TABLATURE_ROWS_LENGTH = 20;

  public async createTablature(
    tablatureCreationRequest: TablatureCreationRequest,
    tablatureCreationOptions: TablatureCreationOptionsDTO = {}
  ): Promise<TablatureCreationResponse> {
    const headerKeyToHeaderValueDictionary: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (tablatureCreationOptions.acceptedLanguage) {
      headerKeyToHeaderValueDictionary['Accept-Language'] =
        tablatureCreationOptions.acceptedLanguage;
    }

    const tablatureCreationResponse = await fetch('/api/tabs', {
      method: 'POST',
      body: JSON.stringify(tablatureCreationRequest),
      headers: new Headers(headerKeyToHeaderValueDictionary),
    });

    const tablatureCreationResponseBody = await tablatureCreationResponse.json();

    if (tablatureCreationResponse.status === 201) {
      return tablatureCreationResponseBody as TablatureCreationResponse;
    }

    if (tablatureCreationResponse.status === 422) {
      throw new TablatureCreationError({
        instructionsCompilationErrors: (
          tablatureCreationResponseBody as TablatureCompilationError
        ).details?.instructionsCompilationErrors,
      });
    }

    throw new TablatureCreationError();
  }

  public getMinTablatureRowsLength(): number {
    return TablatureService.MIN_TABLATURE_ROWS_LENGTH;
  }
}
