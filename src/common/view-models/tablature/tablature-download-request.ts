export interface TablatureDownloadRequest {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  title?: string | null;
}
