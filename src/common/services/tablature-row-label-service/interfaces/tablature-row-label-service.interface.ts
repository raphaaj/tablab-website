export const ITablatureRowLabelServiceInjectionToken = 'ITablatureRowLabelService';

export interface ITablatureRowLabelService {
  getTablatureRowLabelLength(numberOfStrings: number): number;
  addLabelToTablatureBlockRows(tablatureBlock: string[]): string[];
}
