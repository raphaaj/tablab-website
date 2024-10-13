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
import { NextApiRequest, NextApiResponse } from 'next';

import {
  ITablatureRowLabelService,
  ITablatureRowLabelServiceInjectionToken,
} from '@common/services/tablature-row-label-service/interfaces/tablature-row-label-service.interface';
import { container } from '@server/container';
import { TablaturePdfDocumentWriter } from '@server/entities/tablature-pdf-document-writer';
import { TablatureDownloadRequestValidator } from '@server/view-models/tablature/tablature-download-request-validator';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
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
  const tablatureRowLabelService = container.resolve<ITablatureRowLabelService>(
    ITablatureRowLabelServiceInjectionToken
  );

  let result: object;
  try {
    const locale = requestHelperService.getLocaleOptionOrDefaultLocale(request);
    response.setHeader('Content-Language', locale);

    if (request.method !== 'POST') {
      result = await tablatureErrorsProviderService.getInvalidHttpMethodError(request, ['POST']);
      return response.status(405).json(result);
    }

    const tablatureDownloadRequestValidator = new TablatureDownloadRequestValidator(locale);

    if (!tablatureDownloadRequestValidator.isTablatureDownloadRequestObjectValid(request.body)) {
      result = await tablatureErrorsProviderService.getInvalidContentSyntaxError(
        request,
        tablatureDownloadRequestValidator.validationErrors
      );
      return response.status(400).json(result);
    }

    const tablatureRowLabelLength = tablatureRowLabelService.getTablatureRowLabelLength(
      request.body.numberOfStrings
    );

    const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
      numberOfStrings: request.body.numberOfStrings,
      initialSpacing: request.body.initialSpacing,
      rowsLength: 84 - tablatureRowLabelLength,
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

    const compiledTablatureWithRowLabels =
      tablatureCompilationResult.compiledTablature.tablature.map((tablatureBlock) =>
        tablatureRowLabelService.addLabelToTablatureBlockRows(tablatureBlock)
      );

    response
      .status(200)
      .setHeader('Content-Disposition', 'attachment; filename=tablature.pdf')
      .setHeader('Content-Type', 'application/pdf');

    const tablatureTitle = request.body.title?.trim();
    const tablatureObservations = request.body.observations?.trim();

    const tablaturePdfDocument = new TablaturePdfDocumentWriter({
      title: tablatureTitle ?? '',
      outputStream: response,
    });

    if (tablatureTitle) tablaturePdfDocument.writeTitle(tablatureTitle);
    if (tablatureObservations) tablaturePdfDocument.writeObservations(tablatureObservations);

    tablaturePdfDocument
      .writeTablature(compiledTablatureWithRowLabels)
      .writeDefaultFooterOnAllPages()
      .close();
  } catch (error) {
    result = await tablatureErrorsProviderService.getInternalError(request);
    return response.status(500).json(result);
  }
}
