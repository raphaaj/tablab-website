import { InstructionExampleWithDescription } from '@common/view-models/instruction-example/instruction-example-with-description';

export class InstructionExampleWithDescriptionDTO implements InstructionExampleWithDescription {
  public description: string;
  public instruction: string;

  public constructor(instruction: string, description: string) {
    this.description = description;
    this.instruction = instruction;
  }
}
