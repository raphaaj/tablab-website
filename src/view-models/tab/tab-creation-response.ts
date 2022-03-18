/* eslint-disable @typescript-eslint/member-ordering */

import { TabDTO } from '@services/tab/tab-dto';

export class TabCreationResponse {
  public static createFromTabDTO(tab: TabDTO): TabCreationResponse {
    return new TabCreationResponse({
      title: tab.title,
      observations: tab.observations,
      numberOfStrings: tab.numberOfStrings,
      initialSpacing: tab.initialSpacing,
      tabBlockLength: tab.tabBlockLength,
      instructions: tab.instructions,
      renderedTab: tab.renderedTab,
    });
  }

  public title?: string | null;
  public observations?: string | null;
  public numberOfStrings: number;
  public initialSpacing: number;
  public tabBlockLength: number;
  public instructions: string;
  public renderedTab: string[][];

  public constructor(tabCreatedResultData: TabCreationResponse) {
    this.title = tabCreatedResultData.title || null;
    this.observations = tabCreatedResultData.observations || null;
    this.numberOfStrings = tabCreatedResultData.numberOfStrings;
    this.initialSpacing = tabCreatedResultData.initialSpacing;
    this.tabBlockLength = tabCreatedResultData.tabBlockLength;
    this.instructions = tabCreatedResultData.instructions;
    this.renderedTab = tabCreatedResultData.renderedTab;
  }
}
