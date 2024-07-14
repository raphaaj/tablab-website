import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';

type CompiledTablatureData = {
  tablature: string[][];
  tablatureCompilationOptions: TablatureCompilationOptionsDTO;
};

export class CompiledTablatureDTO {
  public tablature: string[][];
  public tablatureCompilationOptions: TablatureCompilationOptionsDTO;

  public constructor({ tablature, tablatureCompilationOptions }: CompiledTablatureData) {
    this.tablature = tablature;
    this.tablatureCompilationOptions = tablatureCompilationOptions;
  }
}
