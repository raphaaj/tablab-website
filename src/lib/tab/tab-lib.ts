import { TabCreationError } from '@models/tab/tab-creation-error';
import { TabCreationRequest } from '@view-models/tab/tab-creation-request';
import { TabCreationResponse } from '@view-models/tab/tab-creation-response';

export type TabCreationOptions = {
  acceptedLanguage?: string;
};

export class TabLib {
  public static MIN_TAB_BLOCK_LENGTH = 20;

  public static async createTab(
    tabCreationDTO: TabCreationRequest,
    options: TabCreationOptions = {}
  ): Promise<TabCreationResponse> {
    const headersObject: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.acceptedLanguage) {
      headersObject['Accept-Language'] = options.acceptedLanguage;
    }

    const headers = new Headers(headersObject);

    const tabCreationResponse = await fetch('/api/tabs', {
      method: 'POST',
      body: JSON.stringify(tabCreationDTO),
      headers: headers,
    });

    const tabCreationResponseBody = await tabCreationResponse.json();

    if (tabCreationResponse.status === 201) {
      return tabCreationResponseBody;
    }

    if (tabCreationResponse.status === 422) {
      throw new TabCreationError({
        renderizationErrors: tabCreationResponseBody.details.renderizationErrors,
      });
    }

    throw new TabCreationError();
  }
}
