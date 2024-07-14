import { TablatureCreationResponse as CommonTablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';

export class TablatureCreationResponse implements CommonTablatureCreationResponse {
  public title: string | null;
  public observations: string | null;
  public numberOfStrings: number;
  public initialSpacing: number;
  public rowsLength: number;
  public instructions: string;
  public tablature: string[][];

  public constructor(tablatureCreationResult: CommonTablatureCreationResponse) {
    this.title = tablatureCreationResult.title || null;
    this.observations = tablatureCreationResult.observations || null;
    this.numberOfStrings = tablatureCreationResult.numberOfStrings;
    this.initialSpacing = tablatureCreationResult.initialSpacing;
    this.rowsLength = tablatureCreationResult.rowsLength;
    this.instructions = tablatureCreationResult.instructions;
    this.tablature = tablatureCreationResult.tablature;
  }
}
