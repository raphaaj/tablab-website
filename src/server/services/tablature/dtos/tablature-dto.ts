export interface TablatureDTOData {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  renderedTab: string[][];
  rowsLength: number;
  title?: string | null;
}

export class TablatureDTO implements TablatureDTOData {
  public initialSpacing: number;
  public instructions: string;
  public numberOfStrings: number;
  public observations: string | null;
  public renderedTab: string[][];
  public rowsLength: number;
  public title: string | null;

  public constructor(tablatureData: TablatureDTOData) {
    this.initialSpacing = tablatureData.initialSpacing;
    this.instructions = tablatureData.instructions;
    this.numberOfStrings = tablatureData.numberOfStrings;
    this.observations = tablatureData.observations || null;
    this.renderedTab = tablatureData.renderedTab;
    this.rowsLength = tablatureData.rowsLength;
    this.title = tablatureData.title || null;
  }
}
