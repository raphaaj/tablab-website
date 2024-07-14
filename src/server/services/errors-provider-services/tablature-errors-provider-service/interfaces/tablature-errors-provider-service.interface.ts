import { TablatureCompilationError as CommonTablatureCompilationError } from '@common/view-models/tablature/tablature-compilation-error';
import { ICommonErrorsProviderService } from '@server/services/errors-provider-services/common-errors-provider-service/interfaces/common-errors-provider-service.interface';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';
import { NextApiRequest } from 'next';

export const ITablatureErrorsProviderServiceInjectionToken = 'ITablatureErrorsProviderService';

export interface ITablatureErrorsProviderService extends ICommonErrorsProviderService {
  getTablatureCompilationError(
    request: NextApiRequest,
    tablatureInstructionsCompilationErrors: TablatureInstructionCompilationErrorDTO[]
  ): Promise<CommonTablatureCompilationError>;
}
