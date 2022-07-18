import { TabCreationDTO } from '@services/tab/tab-creation-dto';
import { TabService } from '@services/tab/tab-service';

describe(TabService.name, () => {
  describe(TabService.prototype.createTab.name, () => {
    it.each([
      ['without title and observations', undefined, undefined],
      ['without title, with observations', undefined, 'some observations'],
      ['with title, without observations', 'some title', undefined],
      ['with title and observations', 'some title', 'some observations'],
    ])(
      'should return a successful tab creation result on success (%s)',
      async (_, title, observations) => {
        expect.assertions(8);

        const tabToCreate = new TabCreationDTO({
          initialSpacing: 1,
          instructions: '1-0',
          numberOfStrings: 6,
          tabBlockLength: 15,
          observations,
          title,
        });

        const tabService = new TabService();
        const tabCreationResult = await tabService.createTab(tabToCreate);

        if (tabService.isSuccessfulTabCreationResult(tabCreationResult)) {
          const createdTab = tabCreationResult.tab;

          expect(tabCreationResult.success).toBe(true);
          expect(createdTab.initialSpacing).toBe(tabToCreate.initialSpacing);
          expect(createdTab.instructions).toBe(tabToCreate.instructions);
          expect(createdTab.numberOfStrings).toBe(tabToCreate.numberOfStrings);
          expect(createdTab.observations).toBe(tabToCreate.observations || null);
          expect(createdTab.renderedTab).toBeDefined();
          expect(createdTab.tabBlockLength).toBe(tabToCreate.tabBlockLength);
          expect(createdTab.title).toBe(tabToCreate.title || null);
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

        const tabToCreate = new TabCreationDTO({
          initialSpacing: 1,
          instructions: '0-0',
          numberOfStrings: 6,
          tabBlockLength: 15,
          observations,
          title,
        });

        const tabService = new TabService();
        const tabCreationResult = await tabService.createTab(tabToCreate);

        if (!tabService.isSuccessfulTabCreationResult(tabCreationResult)) {
          expect(tabCreationResult.success).toBe(false);
          expect(tabCreationResult.failedWriteResults).toBeDefined();
        }
      }
    );
  });

  describe(TabService.prototype.isSuccessfulTabCreationResult.name, () => {
    it('should return true if the tab creation result is a successful one', async () => {
      const tabToCreate = new TabCreationDTO({
        initialSpacing: 1,
        instructions: '1-0',
        numberOfStrings: 6,
        tabBlockLength: 15,
      });

      const tabService = new TabService();
      const tabCreationResult = await tabService.createTab(tabToCreate);

      expect(tabService.isSuccessfulTabCreationResult(tabCreationResult)).toBe(true);
    });

    it('should return false if the tab creation result is a failed one', async () => {
      const tabToCreate = new TabCreationDTO({
        initialSpacing: 1,
        instructions: '0-0',
        numberOfStrings: 6,
        tabBlockLength: 15,
      });

      const tabService = new TabService();
      const tabCreationResult = await tabService.createTab(tabToCreate);

      expect(tabService.isSuccessfulTabCreationResult(tabCreationResult)).toBe(false);
    });
  });
});
