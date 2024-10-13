import { TablatureCreationError } from '@client/models/tablature/tablature-creation-error';
import { TablatureDownloadError } from '@client/models/tablature/tablature-download-error';
import { TablatureRequestOptionsDTO } from '@client/services/tablature-service/dtos/tablature-request-options.dto';
import { ITablatureService } from '@client/services/tablature-service/interfaces/tablature-service.interface';
import { TablatureCompilationError } from '@common/view-models/tablature/tablature-compilation-error';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';
import { TablatureDownloadRequest } from '@common/view-models/tablature/tablature-download-request';

export class TablatureService implements ITablatureService {
  public static MIN_TABLATURE_ROWS_LENGTH = 20;

  public async createTablature(
    tablatureCreationRequest: TablatureCreationRequest,
    tablatureRequestOptions: TablatureRequestOptionsDTO = {}
  ): Promise<TablatureCreationResponse> {
    const headerKeyToHeaderValueDictionary: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const headers = this.createRequestHeaders(
      headerKeyToHeaderValueDictionary,
      tablatureRequestOptions
    );

    const tablatureCreationResponse = await fetch('/api/tablature', {
      method: 'POST',
      body: JSON.stringify(tablatureCreationRequest),
      headers: headers,
    });

    const tablatureCreationResponseBody = await tablatureCreationResponse.json();

    if (tablatureCreationResponse.status === 201) {
      return tablatureCreationResponseBody as TablatureCreationResponse;
    }

    if (tablatureCreationResponse.status === 422) {
      throw new TablatureCreationError({
        instructionsCompilationErrors: (tablatureCreationResponseBody as TablatureCompilationError)
          .details?.instructionsCompilationErrors,
      });
    }

    throw new TablatureCreationError();
  }

  public getMinTablatureRowsLength(): number {
    return TablatureService.MIN_TABLATURE_ROWS_LENGTH;
  }

  public async downloadTablatureAsPdfDocument(
    tablatureDownloadRequest: TablatureDownloadRequest,
    tablatureRequestOptions: TablatureRequestOptionsDTO = {}
  ): Promise<Blob> {
    const headerKeyToHeaderValueDictionary: Record<string, string> = {
      Accept: 'application/pdf',
      'Content-Type': 'application/json',
    };

    const headers = this.createRequestHeaders(
      headerKeyToHeaderValueDictionary,
      tablatureRequestOptions
    );

    const tablatureDownloadResponse = await fetch('/api/tablature/download', {
      method: 'POST',
      body: JSON.stringify(tablatureDownloadRequest),
      headers,
    });

    if (tablatureDownloadResponse.status === 200) {
      return await tablatureDownloadResponse.blob();
    }

    throw new TablatureDownloadError();
  }

  private createRequestHeaders(
    headerKeyToHeaderValueDictionary: Record<string, string>,
    tablatureRequestOptions: TablatureRequestOptionsDTO
  ): Headers {
    if (tablatureRequestOptions.acceptedLanguage) {
      headerKeyToHeaderValueDictionary['Accept-Language'] =
        tablatureRequestOptions.acceptedLanguage;
    }

    return new Headers(headerKeyToHeaderValueDictionary);
  }
}
