export interface HeaderSectionData {
  htmlAnchorElement?: HTMLAnchorElement | null;
  id: string;
  parent?: HeaderSection | null;
  textContentTranslationKey: string;
}

export class HeaderSection {
  public htmlAnchorElement: HTMLAnchorElement | null;
  public id: string;
  public parent: HeaderSection | null;
  public textContentTranslationKey: string;

  public constructor(headerSectionData: HeaderSectionData) {
    this.id = headerSectionData.id;
    this.htmlAnchorElement = headerSectionData.htmlAnchorElement ?? null;
    this.parent = headerSectionData.parent ?? null;
    this.textContentTranslationKey = headerSectionData.textContentTranslationKey;
  }

  public getHierarchyLevel(): number {
    let hierarchyLevel = 0;

    let parent = this.parent;
    while (parent !== null) {
      hierarchyLevel++;
      parent = parent.parent;
    }

    return hierarchyLevel;
  }
}
