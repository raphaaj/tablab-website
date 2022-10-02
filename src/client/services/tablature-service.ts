import { TablatureCreationError } from '@client/models/tablature/tablature-creation-error';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';
import { TablatureRenderizationError } from '@common/view-models/tablature/tablature-renderization-error';

export interface TablatureCreationOptions {
  acceptedLanguage?: string;
}

export class TablatureService {
  public static MIN_TABLATURE_ROWS_LENGTH = 20;

  public static async createTablature(
    tabCreationDTO: TablatureCreationRequest,
    options: TablatureCreationOptions = {}
  ): Promise<TablatureCreationResponse> {
    const headersObject: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.acceptedLanguage) {
      headersObject['Accept-Language'] = options.acceptedLanguage;
    }

    const headers = new Headers(headersObject);

    const tablatureCreationResponse = await fetch('/api/tabs', {
      method: 'POST',
      body: JSON.stringify(tabCreationDTO),
      headers: headers,
    });

    const tablatureCreationResponseBody = await tablatureCreationResponse.json();

    if (tablatureCreationResponse.status === 201) {
      return tablatureCreationResponseBody as TablatureCreationResponse;
    }

    if (tablatureCreationResponse.status === 422) {
      throw new TablatureCreationError({
        instructionsRenderizationErrors: (
          tablatureCreationResponseBody as TablatureRenderizationError
        ).details?.instructionsRenderizationErrors,
      });
    }

    throw new TablatureCreationError();
  }
}
