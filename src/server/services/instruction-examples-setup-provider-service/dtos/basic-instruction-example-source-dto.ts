export class BasicInstructionExampleSourceDTO {
  public fret: string;
  public string: number;

  public constructor(string: number, fret: string) {
    this.string = string;
    this.fret = fret;
  }
}
