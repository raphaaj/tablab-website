import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';
import { TablatureCreationResponse } from '@server/view-models/tablature/tablature-creation-response';

describe(TablatureCreationResponse.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const title: string | null = null;
      const observations: string | null = null;
      const numberOfStrings = 6;
      const initialSpacing = 1;
      const rowsLength = 15;
      const instructions = '1-0';
      const renderedTab: string[][] = [[]];

      const tablatureCreationResponse = new TablatureCreationResponse({
        title,
        observations,
        numberOfStrings,
        initialSpacing,
        rowsLength,
        instructions,
        renderedTab,
      });

      expect(tablatureCreationResponse.title).toBe(title);
      expect(tablatureCreationResponse.observations).toBe(observations);
      expect(tablatureCreationResponse.numberOfStrings).toBe(numberOfStrings);
      expect(tablatureCreationResponse.initialSpacing).toBe(initialSpacing);
      expect(tablatureCreationResponse.rowsLength).toBe(rowsLength);
      expect(tablatureCreationResponse.instructions).toBe(instructions);
      expect(tablatureCreationResponse.renderedTab).toBe(renderedTab);
    });

    it('should create an instance when the field title is given with all the required fields', () => {
      const title = 'some title';
      const observations: string | null = null;
      const numberOfStrings = 6;
      const initialSpacing = 1;
      const rowsLength = 15;
      const instructions = '1-0';
      const renderedTab: string[][] = [[]];

      const tablatureCreationResponse = new TablatureCreationResponse({
        title,
        observations,
        numberOfStrings,
        initialSpacing,
        rowsLength,
        instructions,
        renderedTab,
      });

      expect(tablatureCreationResponse.title).toBe(title);
      expect(tablatureCreationResponse.observations).toBe(observations);
      expect(tablatureCreationResponse.numberOfStrings).toBe(numberOfStrings);
      expect(tablatureCreationResponse.initialSpacing).toBe(initialSpacing);
      expect(tablatureCreationResponse.rowsLength).toBe(rowsLength);
      expect(tablatureCreationResponse.instructions).toBe(instructions);
      expect(tablatureCreationResponse.renderedTab).toBe(renderedTab);
    });

    it('should create an instance when the field observations is given with all the required fields', () => {
      const title: string | null = null;
      const observations = 'some observations';
      const numberOfStrings = 6;
      const initialSpacing = 1;
      const rowsLength = 15;
      const instructions = '1-0';
      const renderedTab: string[][] = [[]];

      const tablatureCreationResponse = new TablatureCreationResponse({
        title,
        observations,
        numberOfStrings,
        initialSpacing,
        rowsLength,
        instructions,
        renderedTab,
      });

      expect(tablatureCreationResponse.title).toBe(title);
      expect(tablatureCreationResponse.observations).toBe(observations);
      expect(tablatureCreationResponse.numberOfStrings).toBe(numberOfStrings);
      expect(tablatureCreationResponse.initialSpacing).toBe(initialSpacing);
      expect(tablatureCreationResponse.rowsLength).toBe(rowsLength);
      expect(tablatureCreationResponse.instructions).toBe(instructions);
      expect(tablatureCreationResponse.renderedTab).toBe(renderedTab);
    });
  });

  describe(TablatureCreationResponse.createFromTablature.name, () => {
    it(`should create an instance from a ${TablatureDTO.name}`, () => {
      const tablature = new TablatureDTO({
        initialSpacing: 1,
        instructions: '1-0',
        numberOfStrings: 6,
        renderedTab: [[]],
        rowsLength: 15,
      });

      const tablatureCreationResponse = TablatureCreationResponse.createFromTablature(tablature);

      expect(tablatureCreationResponse.title).toBe(tablature.title);
      expect(tablatureCreationResponse.observations).toBe(tablature.observations);
      expect(tablatureCreationResponse.numberOfStrings).toBe(tablature.numberOfStrings);
      expect(tablatureCreationResponse.initialSpacing).toBe(tablature.initialSpacing);
      expect(tablatureCreationResponse.rowsLength).toBe(tablature.rowsLength);
      expect(tablatureCreationResponse.instructions).toBe(tablature.instructions);
      expect(tablatureCreationResponse.renderedTab).toBe(tablature.renderedTab);
    });
  });
});
