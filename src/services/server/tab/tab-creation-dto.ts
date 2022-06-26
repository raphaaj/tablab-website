export type TabCreationDTOData = {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  tabBlockLength: number;
  title?: string | null;
};

export class TabCreationDTO {
  public initialSpacing: number;
  public instructions: string;
  public numberOfStrings: number;
  public observations: string | null;
  public tabBlockLength: number;
  public title: string | null;

  public constructor(tabCreationData: TabCreationDTOData) {
    this.initialSpacing = tabCreationData.initialSpacing;
    this.instructions = tabCreationData.instructions;
    this.numberOfStrings = tabCreationData.numberOfStrings;
    this.observations = tabCreationData.observations || null;
    this.tabBlockLength = tabCreationData.tabBlockLength;
    this.title = tabCreationData.title || null;
  }
}
