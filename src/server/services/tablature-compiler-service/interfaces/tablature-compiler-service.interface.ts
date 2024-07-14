import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  SuccessfulTablatureCompilationResultDTO,
  TablatureCompilationResultDTO,
} from '@server/services/tablature-compiler-service/dtos/tablature-compilation-result.dto';

export const ITablatureCompilerServiceInjectionToken = 'ITablatureCompilerService';

export interface ITablatureCompilerService {
  compileTablaure(
    instructions: string,
    compilationOptions: TablatureCompilationOptionsDTO
  ): Promise<TablatureCompilationResultDTO>;

  isSuccessfulTablatureCompilationResult(
    tablatureCompilationResult: TablatureCompilationResultDTO
  ): tablatureCompilationResult is SuccessfulTablatureCompilationResultDTO;
}
