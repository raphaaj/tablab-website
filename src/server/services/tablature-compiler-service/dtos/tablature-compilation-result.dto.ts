import { CompiledTablatureDTO } from '@server/services/tablature-compiler-service/dtos/compiled-tablature.dto';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';

abstract class TablatureCompilationBaseResultDTO {
  public tablatureCompiledSuccessfully: boolean;
  public abstract compiledTablature: CompiledTablatureDTO | null;
  public abstract compilationErrors: TablatureInstructionCompilationErrorDTO[] | null;

  protected constructor(tablatureCompiledSuccessfully: boolean) {
    this.tablatureCompiledSuccessfully = tablatureCompiledSuccessfully;
  }
}

export class SuccessfulTablatureCompilationResultDTO extends TablatureCompilationBaseResultDTO {
  public compiledTablature: CompiledTablatureDTO;
  public compilationErrors: null;

  public constructor(compiledTablature: CompiledTablatureDTO) {
    super(true);

    this.compiledTablature = compiledTablature;
    this.compilationErrors = null;
  }
}

export class FailedTablatureCompilationResultDTO extends TablatureCompilationBaseResultDTO {
  public compiledTablature: null;
  public compilationErrors: TablatureInstructionCompilationErrorDTO[];
  public constructor(compilationErrors: TablatureInstructionCompilationErrorDTO[]) {
    super(false);

    this.compiledTablature = null;
    this.compilationErrors = compilationErrors;
  }
}

export type TablatureCompilationResultDTO =
  | SuccessfulTablatureCompilationResultDTO
  | FailedTablatureCompilationResultDTO;
