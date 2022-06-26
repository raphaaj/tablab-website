import { TabCreationDTO } from '@services/server/tab/tab-creation-dto';
import { BaseTabService, TabService } from '@services/server/tab/tab-service';
import { RequestUtils } from '@utils/request-utils';
import { ServerSideTranslationUtils } from '@utils/server-side-translation-utils';
import { InternalError } from '@view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@view-models/error/invalid-http-method-error';
import { validateTabCreationObject } from '@view-models/tab/tab-creation-request';
import { TabCreationResponse } from '@view-models/tab/tab-creation-response';
import { TabErrorsFactory } from '@view-models/tab/tab-errors-factory';
import { TabRenderizationError } from '@view-models/tab/tab-renderization-error';
import { NextApiRequest, NextApiResponse } from 'next';

export type TabCreationResult =
  | TabCreationResponse
  | TabRenderizationError
  | InvalidContentSyntaxError
  | InvalidHttpMethodError
  | InternalError;

export type TabsApiHandler = ApiHandler<TabCreationResult>;

export function createTabsHandler(tabService: BaseTabService): TabsApiHandler {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<TabCreationResult>
  ): Promise<void> {
    const tabErrorsFactory = new TabErrorsFactory({ request });

    let result: TabCreationResult;
    try {
      const requestUtils = new RequestUtils(request);
      const locale =
        requestUtils.getLocaleOption() || ServerSideTranslationUtils.getDefaultLocale();
      tabErrorsFactory.locale = locale;
      response.setHeader('Content-Language', locale);

      if (request.method !== 'POST') {
        result = await tabErrorsFactory.getInvalidHttpMethodError(['POST']);
        return response.status(405).json(result);
      }

      if (!validateTabCreationObject(request.body)) {
        const validationErrors = validateTabCreationObject.errors;

        result = await tabErrorsFactory.getInvalidContentSyntaxError(validationErrors);
        return response.status(400).json(result);
      }

      const tabCreationResult = await tabService.createTab(new TabCreationDTO(request.body));
      if (!tabService.isSuccessfulTabCreationResult(tabCreationResult)) {
        const failedWriteResults = tabCreationResult.failedWriteResults;

        result = await tabErrorsFactory.getTabRenderizationError(failedWriteResults);
        return response.status(422).json(result);
      }

      result = TabCreationResponse.createFromTabDTO(tabCreationResult.tab);

      return response.status(201).json(result);
    } catch (e) {
      result = await tabErrorsFactory.getInternalError();
      return response.status(500).json(result);
    }
  };
}

export default createTabsHandler(new TabService());
