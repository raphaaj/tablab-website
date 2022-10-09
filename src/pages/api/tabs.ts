import { BaseTablatureService } from '@server/services/tablature/base-tablature-service';
import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureService } from '@server/services/tablature/tablature-service';
import { RequestUtils } from '@server/utils/request-utils';
import { ServerSideTranslationUtils } from '@server/utils/translation-utils';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { TablatureCreationRequestValidator } from '@server/view-models/tablature/tablature-creation-request-validator';
import { TablatureCreationResponse } from '@server/view-models/tablature/tablature-creation-response';
import { TablatureErrorsFactory } from '@server/view-models/tablature/tablature-errors-factory';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';
import { NextApiRequest, NextApiResponse } from 'next';

export type TablatureCreationResult =
  | TablatureCreationResponse
  | TablatureRenderizationError
  | InvalidContentSyntaxError
  | InvalidHttpMethodError
  | InternalError;

export type TabsApiHandler = ApiHandler<TablatureCreationResult>;

export function createTabsApiHandler(tablatureService: BaseTablatureService): TabsApiHandler {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<TablatureCreationResult>
  ): Promise<void> {
    const tablatureErrorsFactory = new TablatureErrorsFactory({ request });

    let result: TablatureCreationResult;
    try {
      const requestUtils = new RequestUtils(request);
      const locale =
        requestUtils.getLocaleOption() || ServerSideTranslationUtils.getDefaultLocale();
      tablatureErrorsFactory.locale = locale;
      response.setHeader('Content-Language', locale);

      if (request.method !== 'POST') {
        result = await tablatureErrorsFactory.getInvalidHttpMethodError(['POST']);
        return response.status(405).json(result);
      }

      const tablatureCreationRequestValidator = new TablatureCreationRequestValidator(locale);

      if (!tablatureCreationRequestValidator.isTablatureCreationRequestObjectValid(request.body)) {
        const validationErrors = tablatureCreationRequestValidator.validationErrors;

        result = await tablatureErrorsFactory.getInvalidContentSyntaxError(validationErrors);
        return response.status(400).json(result);
      }

      const tablatureCreationResult = await tablatureService.createTablature(
        new TablatureCreationDataDTO(request.body),
        { locale }
      );

      if (!tablatureService.isSuccessfulTablatureCreationResult(tablatureCreationResult)) {
        const instructionsRenderizationErrors =
          tablatureCreationResult.instructionsRenderizationErrors;

        result = await tablatureErrorsFactory.getTablatureRenderizationError(
          instructionsRenderizationErrors
        );
        return response.status(422).json(result);
      }

      result = TablatureCreationResponse.createFromTablature(tablatureCreationResult.tablature);

      return response.status(201).json(result);
    } catch (e) {
      result = await tablatureErrorsFactory.getInternalError();
      return response.status(500).json(result);
    }
  };
}

export default createTabsApiHandler(new TablatureService());
