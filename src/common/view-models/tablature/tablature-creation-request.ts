export interface TablatureCreationRequest {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  rowsLength: number;
  title?: string | null;
}
