/* eslint-disable @typescript-eslint/member-ordering */

export interface TablatureCreationResponse {
  title: string | null;
  observations: string | null;
  numberOfStrings: number;
  initialSpacing: number;
  rowsLength: number;
  instructions: string;
  renderedTab: string[][];
}
