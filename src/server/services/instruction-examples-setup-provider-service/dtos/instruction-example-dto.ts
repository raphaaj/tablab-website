import { InstructionExample } from '@common/view-models/instruction-example/instruction-example';

export class InstructionExampleDTO implements InstructionExample {
  public instruction: string;

  public constructor(instruction: string) {
    this.instruction = instruction;
  }
}
