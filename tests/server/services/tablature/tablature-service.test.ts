import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureService } from '@server/services/tablature/tablature-service';

const tablabLocalizeEnUSMock = jest.fn();
const tablabLocalizePtBRMock = jest.fn();
jest.mock('tablab-i18n', () => ({
  localizeEnUs: () => tablabLocalizeEnUSMock(),
  localizePtBr: () => tablabLocalizePtBRMock(),
}));

interface BaseTestSet {
  description: string;
  observations?: string;
  title?: string;
}

interface LocaleTestSet {
  expectedLocalizationMock: jest.Mock<any, any>;
  locale: string;
}

type FullTestSet = BaseTestSet & LocaleTestSet;

const TITLE_AND_OBSERVATIONS_TEST_SET: BaseTestSet[] = [
  {
    description: 'without title and observations',
  },
  {
    description: 'without title, with observations',
    observations: 'some observations',
  },
  {
    description: 'with title, without observations',
    title: 'some title',
  },
  {
    description: 'with title and observations',
    title: 'some title',
    observations: 'some observations',
  },
];

const LOCALES_TEST_SET: LocaleTestSet[] = [
  {
    locale: 'en-US',
    expectedLocalizationMock: tablabLocalizeEnUSMock,
  },
  { locale: 'pt-BR', expectedLocalizationMock: tablabLocalizePtBRMock },
  { locale: 'other', expectedLocalizationMock: tablabLocalizeEnUSMock },
];

const TITLE_OBSERVATIONS_AND_LOCALE_TEST_SET: FullTestSet[] =
  TITLE_AND_OBSERVATIONS_TEST_SET.flatMap((baseTestSet) =>
    LOCALES_TEST_SET.map((localeTestSet) => ({
      ...baseTestSet,
      ...localeTestSet,
    }))
  );

afterEach(() => {
  tablabLocalizeEnUSMock.mockClear();
  tablabLocalizePtBRMock.mockClear();
});

describe(TablatureService.name, () => {
  describe(TablatureService.prototype.createTablature.name, () => {
    it.each(TITLE_AND_OBSERVATIONS_TEST_SET)(
      'should return a successful tab creation result on success ($description)',
      async ({ title, observations }) => {
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

    it.each(TITLE_OBSERVATIONS_AND_LOCALE_TEST_SET)(
      'should return a failed tab creation result on failure ($description - $locale)',
      async ({ title, observations, locale, expectedLocalizationMock }) => {
        expect.assertions(3);

        const tablatureToCreate = new TablatureCreationDataDTO({
          initialSpacing: 1,
          instructions: '0-0 r(2) { t }',
          numberOfStrings: 6,
          rowsLength: 15,
          observations,
          title,
        });

        const tabService = new TablatureService();
        const tabCreationResult = await tabService.createTablature(tablatureToCreate, { locale });

        if (!tabService.isSuccessfulTablatureCreationResult(tabCreationResult)) {
          expect(tabCreationResult.success).toBe(false);
          expect(tabCreationResult.instructionsRenderizationErrors).toBeDefined();
          expect(expectedLocalizationMock).toHaveBeenCalled();
        }
      }
    );
  });
});
