import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';

describe(TablatureCreationDataDTO.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const rowsLength = 15;

      const tabCreationData = new TablatureCreationDataDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        rowsLength,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(null);
      expect(tabCreationData.rowsLength).toBe(rowsLength);
      expect(tabCreationData.title).toBe(null);
    });

    it('should create an instance when the title field is given with all the required fields', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const rowsLength = 15;
      const title = 'title';

      const tabCreationData = new TablatureCreationDataDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        rowsLength,
        title,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(null);
      expect(tabCreationData.rowsLength).toBe(rowsLength);
      expect(tabCreationData.title).toBe(title);
    });

    it('should create an instance when all the required fields are given', () => {
      const initialSpacing = 1;
      const instructions = 'instruction';
      const numberOfStrings = 6;
      const observations = 'observations';
      const rowsLength = 15;

      const tabCreationData = new TablatureCreationDataDTO({
        initialSpacing,
        instructions,
        numberOfStrings,
        observations,
        rowsLength,
      });

      expect(tabCreationData.initialSpacing).toBe(initialSpacing);
      expect(tabCreationData.instructions).toBe(instructions);
      expect(tabCreationData.numberOfStrings).toBe(numberOfStrings);
      expect(tabCreationData.observations).toBe(observations);
      expect(tabCreationData.rowsLength).toBe(rowsLength);
      expect(tabCreationData.title).toBe(null);
    });
  });
});
