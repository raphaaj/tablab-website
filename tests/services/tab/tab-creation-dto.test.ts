import { TabCreationDTO } from '@services/tab/tab-creation-dto';

describe(TabCreationDTO.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const tabBlockLength = 15;

      const tabCreationData = new TabCreationDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        tabBlockLength,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(null);
      expect(tabCreationData.tabBlockLength).toBe(tabBlockLength);
      expect(tabCreationData.title).toBe(null);
    });

    it('should create an instance when the title field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const tabBlockLength = 15;
      const title = 'title';

      const tabCreationData = new TabCreationDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        tabBlockLength,
        title,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(null);
      expect(tabCreationData.tabBlockLength).toBe(tabBlockLength);
      expect(tabCreationData.title).toBe(title);
    });

    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const observations = 'observations';
      const tabBlockLength = 15;

      const tabCreationData = new TabCreationDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        observations,
        tabBlockLength,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(observations);
      expect(tabCreationData.tabBlockLength).toBe(tabBlockLength);
      expect(tabCreationData.title).toBe(null);
    });
  });
});
