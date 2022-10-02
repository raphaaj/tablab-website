export interface TablatureCreationDataDTOData {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  rowsLength: number;
  title?: string | null;
}

export class TablatureCreationDataDTO implements TablatureCreationDataDTOData {
  public initialSpacing: number;
  public instructions: string;
  public numberOfStrings: number;
  public observations: string | null;
  public rowsLength: number;
  public title: string | null;

  public constructor(tablatureCreationData: TablatureCreationDataDTOData) {
    this.initialSpacing = tablatureCreationData.initialSpacing;
    this.instructions = tablatureCreationData.instructions;
    this.numberOfStrings = tablatureCreationData.numberOfStrings;
    this.observations = tablatureCreationData.observations || null;
    this.rowsLength = tablatureCreationData.rowsLength;
    this.title = tablatureCreationData.title || null;
  }
}
