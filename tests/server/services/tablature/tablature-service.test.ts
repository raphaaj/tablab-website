import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureService } from '@server/services/tablature/tablature-service';

describe(TablatureService.name, () => {
  describe(TablatureService.prototype.createTablature.name, () => {
    it.each([
      ['without title and observations', undefined, undefined],
      ['without title, with observations', undefined, 'some observations'],
      ['with title, without observations', 'some title', undefined],
      ['with title and observations', 'some title', 'some observations'],
    ])(
      'should return a successful tab creation result on success (%s)',
      async (_, title, observations) => {
        expect.assertions(8);

        const tablatureToCreate = new TablatureCreationDataDTO({
          initialSpacing: 1,
          instructions: '1-0',
          numberOfStrings: 6,
          rowsLength: 15,
          observations,
          title,
        });

        const tabService = new TablatureService();
        const tabCreationResult = await tabService.createTablature(tablatureToCreate);

        if (tabService.isSuccessfulTablatureCreationResult(tabCreationResult)) {
          const createdTab = tabCreationResult.tablature;

          expect(tabCreationResult.success).toBe(true);
          expect(createdTab.initialSpacing).toBe(tablatureToCreate.initialSpacing);
          expect(createdTab.instructions).toBe(tablatureToCreate.instructions);
          expect(createdTab.numberOfStrings).toBe(tablatureToCreate.numberOfStrings);
          expect(createdTab.observations).toBe(tablatureToCreate.observations || null);
          expect(createdTab.renderedTab).toBeDefined();
          expect(createdTab.rowsLength).toBe(tablatureToCreate.rowsLength);
          expect(createdTab.title).toBe(tablatureToCreate.title || null);
        }
      }
    );

    it.each([
      ['without title and observations', undefined, undefined],
      ['without title, with observations', undefined, 'some observations'],
      ['with title, without observations', 'some title', undefined],
      ['with title and observations', 'some title', 'some observations'],
    ])(
      'should return a failed tab creation result on failure (%s)',
      async (_, title, observations) => {
        expect.assertions(2);

        const tablatureToCreate = new TablatureCreationDataDTO({
          initialSpacing: 1,
          instructions: '0-0',
          numberOfStrings: 6,
          rowsLength: 15,
          observations,
          title,
        });

        const tabService = new TablatureService();
        const tabCreationResult = await tabService.createTablature(tablatureToCreate);

        if (!tabService.isSuccessfulTablatureCreationResult(tabCreationResult)) {
          expect(tabCreationResult.success).toBe(false);
          expect(tabCreationResult.failedWriteResults).toBeDefined();
        }
      }
    );
  });

  describe(TablatureService.prototype.isSuccessfulTablatureCreationResult.name, () => {
    it('should return true if the tab creation result is a successful one', async () => {
      const tablatureToCreate = new TablatureCreationDataDTO({
        initialSpacing: 1,
        instructions: '1-0',
        numberOfStrings: 6,
        rowsLength: 15,
      });

      const tabService = new TablatureService();
      const tabCreationResult = await tabService.createTablature(tablatureToCreate);

      expect(tabService.isSuccessfulTablatureCreationResult(tabCreationResult)).toBe(true);
    });

    it('should return false if the tab creation result is a failed one', async () => {
      const tablatureToCreate = new TablatureCreationDataDTO({
        initialSpacing: 1,
        instructions: '0-0',
        numberOfStrings: 6,
        rowsLength: 15,
      });

      const tabService = new TablatureService();
      const tabCreationResult = await tabService.createTablature(tablatureToCreate);

      expect(tabService.isSuccessfulTablatureCreationResult(tabCreationResult)).toBe(false);
    });
  });
});
