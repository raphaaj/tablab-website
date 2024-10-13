export class TablatureRowLabelService implements TablatureRowLabelService {
  public getTablatureRowLabelLength(numberOfStrings: number): number {
    const tablatureBlockRowLabelLength = Math.trunc(1 + numberOfStrings / 10) + 2;
    return tablatureBlockRowLabelLength;
  }

  public addLabelToTablatureBlockRows(tablatureBlock: string[]): string[] {
    const tablatureBlockRowLabelLength = this.getTablatureRowLabelLength(tablatureBlock.length - 2);

    return tablatureBlock.map((tablatureBlockRow, tablatureBlockRowIndex) => {
      const label =
        tablatureBlockRowIndex === 0 || tablatureBlockRowIndex === tablatureBlock.length - 1
          ? ''.padStart(tablatureBlockRowLabelLength, ' ')
          : `${tablatureBlockRowIndex}) `.padStart(tablatureBlockRowLabelLength, ' ');

      const tablatureBlockRowWithLabel = `${label}${tablatureBlockRow}`;

      return tablatureBlockRowWithLabel;
    });
  }
}
