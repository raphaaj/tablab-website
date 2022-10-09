import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { TablatureCreationRequestValidator } from '@server/view-models/tablature/tablature-creation-request-validator';

const ajvLocalizeEnUSMock = jest.fn();
jest.mock('ajv-i18n/localize/en', () => ({
  __esModule: true,
  default: () => ajvLocalizeEnUSMock(),
}));

const ajvLocalizePtBRMock = jest.fn();
jest.mock('ajv-i18n/localize/pt-BR', () => ({
  __esModule: true,
  default: () => ajvLocalizePtBRMock(),
}));

afterEach(() => {
  ajvLocalizeEnUSMock.mockClear();
  ajvLocalizePtBRMock.mockClear();
});

describe(TablatureCreationRequestValidator.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const locale = 'en-US';
      const tablatureCreationRequestValidator = new TablatureCreationRequestValidator(locale);

      expect(tablatureCreationRequestValidator.locale).toBe(locale);
      expect(tablatureCreationRequestValidator.validationErrors).toEqual([]);
    });
  });

  describe(
    TablatureCreationRequestValidator.prototype.isTablatureCreationRequestObjectValid.name,
    () => {
      it('should return true when the given object is a valid TablatureCreationRequest', () => {
        const locale = 'en-US';
        const tablatureCreationRequestValidator = new TablatureCreationRequestValidator(locale);

        const tablatureCreationRequestObject: TablatureCreationRequest = {
          initialSpacing: 1,
          instructions: '1-0',
          numberOfStrings: 6,
          rowsLength: 20,
        };

        const isTablatureCreationRequestObjectValid =
          tablatureCreationRequestValidator.isTablatureCreationRequestObjectValid(
            tablatureCreationRequestObject
          );

        expect(isTablatureCreationRequestObjectValid).toBe(true);
        expect(tablatureCreationRequestValidator.validationErrors).toEqual([]);
      });

      it.each([
        ['en-US', ajvLocalizeEnUSMock],
        ['pt-BR', ajvLocalizePtBRMock],
        ['other', ajvLocalizeEnUSMock],
      ])(
        'should return false and set the validationErrors field when the given object is not a valid TablatureCreationRequest (%s)',
        (locale, expectedLocalizationMock) => {
          const tablatureCreationRequestValidator = new TablatureCreationRequestValidator(locale);

          const tablatureCreationRequestObject = {};

          const isTablatureCreationRequestObjectValid =
            tablatureCreationRequestValidator.isTablatureCreationRequestObjectValid(
              tablatureCreationRequestObject
            );

          expect(isTablatureCreationRequestObjectValid).toBe(false);
          expect(tablatureCreationRequestValidator.validationErrors).toBeDefined();
          expect(tablatureCreationRequestValidator.validationErrors.length).toBeGreaterThan(0);
          expect(expectedLocalizationMock).toHaveBeenCalled();
        }
      );
    }
  );
});
