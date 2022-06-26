import { TabDTO } from '@services/server/tab/tab-dto';

describe(TabDTO.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const renderedTab: string[][] = [[]];
      const tabBlockLength = 15;

      const tab = new TabDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        renderedTab,
        tabBlockLength,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(null);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.tabBlockLength).toBe(tabBlockLength);
      expect(tab.title).toBe(null);
    });

    it('should create an instance when the title field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const renderedTab: string[][] = [[]];
      const tabBlockLength = 15;
      const title = 'title';

      const tab = new TabDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        renderedTab,
        tabBlockLength,
        title,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(null);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.tabBlockLength).toBe(tabBlockLength);
      expect(tab.title).toBe(title);
    });

    it('should create an instance when the observations field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const observations = 'observations';
      const renderedTab: string[][] = [[]];
      const tabBlockLength = 15;

      const tab = new TabDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        observations,
        renderedTab,
        tabBlockLength,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(observations);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.tabBlockLength).toBe(tabBlockLength);
      expect(tab.title).toBe(null);
    });
  });
});
