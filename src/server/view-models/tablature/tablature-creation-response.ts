/* eslint-disable @typescript-eslint/member-ordering */
import { TablatureCreationResponse as CommonTablatureCreationResponse } from '@common/view-models/tablature/tablature-creation-response';
import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';

export class TablatureCreationResponse implements CommonTablatureCreationResponse {
  public static createFromTablature(tablature: TablatureDTO): TablatureCreationResponse {
    return new TablatureCreationResponse({
      title: tablature.title,
      observations: tablature.observations,
      numberOfStrings: tablature.numberOfStrings,
      initialSpacing: tablature.initialSpacing,
      rowsLength: tablature.rowsLength,
      instructions: tablature.instructions,
      renderedTab: tablature.renderedTab,
    });
  }

  public title: string | null;
  public observations: string | null;
  public numberOfStrings: number;
  public initialSpacing: number;
  public rowsLength: number;
  public instructions: string;
  public renderedTab: string[][];

  public constructor(tablatureCreationResult: CommonTablatureCreationResponse) {
    this.title = tablatureCreationResult.title || null;
    this.observations = tablatureCreationResult.observations || null;
    this.numberOfStrings = tablatureCreationResult.numberOfStrings;
    this.initialSpacing = tablatureCreationResult.initialSpacing;
    this.rowsLength = tablatureCreationResult.rowsLength;
    this.instructions = tablatureCreationResult.instructions;
    this.renderedTab = tablatureCreationResult.renderedTab;
  }
}
