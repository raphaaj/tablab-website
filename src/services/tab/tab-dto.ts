export type TabDTOData = {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  renderedTab: string[][];
  tabBlockLength: number;
  title?: string | null;
};

export class TabDTO {
  public initialSpacing: number;
  public instructions: string;
  public numberOfStrings: number;
  public observations: string | null;
  public renderedTab: string[][];
  public tabBlockLength: number;
  public title: string | null;

  public constructor(tabData: TabDTOData) {
    this.initialSpacing = tabData.initialSpacing;
    this.instructions = tabData.instructions;
    this.numberOfStrings = tabData.numberOfStrings;
    this.observations = tabData.observations || null;
    this.renderedTab = tabData.renderedTab;
    this.tabBlockLength = tabData.tabBlockLength;
    this.title = tabData.title || null;
  }
}
