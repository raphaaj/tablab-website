import { InstructionExample } from '@common/view-models/instruction-example/instruction-example';

export interface InstructionExamplesSetupDTOData<TInstructionExample extends InstructionExample> {
  initialSpacing: number;
  instructionExamples: TInstructionExample[];
  numberOfStrings: number;
  rowsLenght: number;
}

export class InstructionExamplesSetupDTO<TInstructionExample extends InstructionExample> {
  public initialSpacing: number;
  public instructionExamples: TInstructionExample[];
  public numberOfStrings: number;
  public rowsLenght: number;

  public constructor({
    initialSpacing,
    instructionExamples,
    numberOfStrings,
    rowsLenght,
  }: InstructionExamplesSetupDTOData<TInstructionExample>) {
    this.initialSpacing = initialSpacing;
    this.instructionExamples = instructionExamples;
    this.numberOfStrings = numberOfStrings;
    this.rowsLenght = rowsLenght;
  }
}
