import { TechniqueType } from '@common/enums/technique-type';
import { BasicInstructionExampleSourceDTO } from '@server/services/instructions-examples-setup-provider-service/dtos/basic-instruction-example-source-dto';

export class BasicInstructionWithTechniqueExampleSourceDTO extends BasicInstructionExampleSourceDTO {
  public techniqueType: TechniqueType;

  public constructor(string: number, fret: string, techniqueType: TechniqueType) {
    super(string, fret);

    this.techniqueType = techniqueType;
  }
}
