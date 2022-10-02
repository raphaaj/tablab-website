import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';

describe(TablatureDTO.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const renderedTab: string[][] = [[]];
      const rowsLength = 15;

      const tab = new TablatureDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        renderedTab,
        rowsLength,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(null);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.rowsLength).toBe(rowsLength);
      expect(tab.title).toBe(null);
    });

    it('should create an instance when the title field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const renderedTab: string[][] = [[]];
      const rowsLength = 15;
      const title = 'title';

      const tab = new TablatureDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        renderedTab,
        rowsLength,
        title,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(null);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.rowsLength).toBe(rowsLength);
      expect(tab.title).toBe(title);
    });

    it('should create an instance when the observations field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const observations = 'observations';
      const renderedTab: string[][] = [[]];
      const rowsLength = 15;

      const tab = new TablatureDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        observations,
        renderedTab,
        rowsLength,
      });

      expect(tab.initialSpacing).toBe(initialSpacing);
      expect(tab.instructions).toBe(instructions);
      expect(tab.numberOfStrings).toBe(numberOfStrings);
      expect(tab.observations).toBe(observations);
      expect(tab.renderedTab).toBe(renderedTab);
      expect(tab.rowsLength).toBe(rowsLength);
      expect(tab.title).toBe(null);
    });
  });
});
