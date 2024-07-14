import { TablatureCompilationError as CommonTablatureCompilationError } from '@common/view-models/tablature/tablature-compilation-error';
import { CommonErrorsProviderService } from '@server/services/errors-provider-services/common-errors-provider-service/common-errors-provider-service';
import { ITablatureErrorsProviderService } from '@server/services/errors-provider-services/tablature-errors-provider-service/interfaces/tablature-errors-provider-service.interface';
import {
  IRequestHelperServiceInjectionToken,
  type IRequestHelperService,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';
import {
  ITranslationServiceInjectionToken,
  type ITranslationService,
} from '@server/services/translation-service/interfaces/translation-service.interface';
import { TablatureCompilationError } from '@server/view-models/tablature/tablature-compilation-error';
import { TablatureInstructionCompilationErrorDetails } from '@server/view-models/tablature/tablature-instruction-compilation-error-details';
import { NextApiRequest } from 'next';
import { inject, injectable } from 'tsyringe';

@injectable()
export class TablatureErrorsProviderService
  extends CommonErrorsProviderService
  implements ITablatureErrorsProviderService
{
  public constructor(
    @inject(ITranslationServiceInjectionToken)
    translationService: ITranslationService,
    @inject(IRequestHelperServiceInjectionToken)
    requestHelperService: IRequestHelperService
  ) {
    super(translationService, requestHelperService);
  }

  public async getTablatureCompilationError(
    request: NextApiRequest,
    tablatureInstructionsCompilationErrors: TablatureInstructionCompilationErrorDTO[]
  ): Promise<CommonTablatureCompilationError> {
    const t = await this._getTranslationFunction(request);

    const instructionsCompilationErrors =
      TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationErrors(
        tablatureInstructionsCompilationErrors
      );

    return new TablatureCompilationError({
      message: t(`errors:code2message.${TablatureCompilationError.ERROR_CODE}`),
      request,
      instructionsCompilationErrors,
    });
  }
}
