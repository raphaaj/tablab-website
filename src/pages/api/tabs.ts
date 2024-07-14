import 'reflect-metadata';

import {
  ITablatureErrorsProviderService,
  ITablatureErrorsProviderServiceInjectionToken,
} from '@server/services/errors-provider-services/tablature-errors-provider-service/interfaces/tablature-errors-provider-service.interface';
import {
  IRequestHelperService,
  IRequestHelperServiceInjectionToken,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  ITablatureCompilerService,
  ITablatureCompilerServiceInjectionToken,
} from '@server/services/tablature-compiler-service/interfaces/tablature-compiler-service.interface';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { TablatureCompilationError } from '@server/view-models/tablature/tablature-compilation-error';
import { TablatureCreationRequestValidator } from '@server/view-models/tablature/tablature-creation-request-validator';
import { TablatureCreationResponse } from '@server/view-models/tablature/tablature-creation-response';
import { NextApiRequest, NextApiResponse } from 'next';

import { container } from '@server/container';

type TablatureResponseData =
  | TablatureCreationResponse
  | TablatureCompilationError
  | InvalidContentSyntaxError
  | InvalidHttpMethodError
  | InternalError;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<TablatureResponseData>
): Promise<void> {
  const requestHelperService = container.resolve<IRequestHelperService>(
    IRequestHelperServiceInjectionToken
  );
  const tablatureErrorsProviderService = container.resolve<ITablatureErrorsProviderService>(
    ITablatureErrorsProviderServiceInjectionToken
  );
  const tablatureCompilerService = container.resolve<ITablatureCompilerService>(
    ITablatureCompilerServiceInjectionToken
  );

  let result: TablatureResponseData;
  try {
    const locale = requestHelperService.getLocaleOptionOrDefaultLocale(request);
    response.setHeader('Content-Language', locale);

    if (request.method !== 'POST') {
      result = await tablatureErrorsProviderService.getInvalidHttpMethodError(request, ['POST']);
      return response.status(405).json(result);
    }

    const tablatureCreationRequestValidator = new TablatureCreationRequestValidator(locale);

    if (!tablatureCreationRequestValidator.isTablatureCreationRequestObjectValid(request.body)) {
      result = await tablatureErrorsProviderService.getInvalidContentSyntaxError(
        request,
        tablatureCreationRequestValidator.validationErrors
      );
      return response.status(400).json(result);
    }

    const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
      numberOfStrings: request.body.numberOfStrings,
      initialSpacing: request.body.initialSpacing,
      rowsLength: request.body.rowsLength,
      locale,
    });

    const tablatureCompilationResult = await tablatureCompilerService.compileTablaure(
      request.body.instructions,
      tablatureCompilationOptions
    );

    if (
      !tablatureCompilerService.isSuccessfulTablatureCompilationResult(tablatureCompilationResult)
    ) {
      result = await tablatureErrorsProviderService.getTablatureCompilationError(
        request,
        tablatureCompilationResult.compilationErrors
      );
      return response.status(422).json(result);
    }

    result = new TablatureCreationResponse({
      title: request.body.title ?? null,
      observations: request.body.observations ?? null,
      numberOfStrings:
        tablatureCompilationResult.compiledTablature.tablatureCompilationOptions.numberOfStrings,
      initialSpacing:
        tablatureCompilationResult.compiledTablature.tablatureCompilationOptions.initialSpacing,
      rowsLength:
        tablatureCompilationResult.compiledTablature.tablatureCompilationOptions.rowsLength,
      instructions: request.body.instructions,
      tablature: tablatureCompilationResult.compiledTablature.tablature,
    });

    return response.status(201).json(result);
  } catch (e) {
    result = await tablatureErrorsProviderService.getInternalError(request);
    return response.status(500).json(result);
  }
}
