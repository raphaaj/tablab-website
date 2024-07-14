type TablatureCompilationOptionsData = {
  numberOfStrings: number;
  initialSpacing: number;
  rowsLength: number;
  locale?: string | null;
};

export class TablatureCompilationOptionsDTO {
  public numberOfStrings: number;
  public initialSpacing: number;
  public rowsLength: number;
  public locale: string | null;

  public constructor({
    numberOfStrings,
    initialSpacing,
    rowsLength,
    locale,
  }: TablatureCompilationOptionsData) {
    this.numberOfStrings = numberOfStrings;
    this.initialSpacing = initialSpacing;
    this.rowsLength = rowsLength;
    this.locale = locale ?? null;
  }
}
