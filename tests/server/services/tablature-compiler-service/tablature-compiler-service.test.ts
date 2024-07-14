import { CompiledTablatureDTO } from '@server/services/tablature-compiler-service/dtos/compiled-tablature.dto';
import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  FailedTablatureCompilationResultDTO,
  SuccessfulTablatureCompilationResultDTO,
} from '@server/services/tablature-compiler-service/dtos/tablature-compilation-result.dto';
import { TablatureCompilerService } from '@server/services/tablature-compiler-service/tablature-compiler-service';
import { container } from '@tests/container';

const tablabLocalizeEnUSMock = jest.fn();
const tablabLocalizePtBRMock = jest.fn();
jest.mock('tablab-i18n', () => ({
  localizeEnUs: () => tablabLocalizeEnUSMock(),
  localizePtBr: () => tablabLocalizePtBRMock(),
}));

container.register(TablatureCompilerService.name, TablatureCompilerService);

let tablatureCompilerService: TablatureCompilerService;

beforeEach(() => {
  tablatureCompilerService = container.resolve<TablatureCompilerService>(
    TablatureCompilerService.name
  );
});

describe(TablatureCompilerService.name, () => {
  describe(TablatureCompilerService.prototype.compileTablaure.name, () => {
    it('should return a successful compiled tablature on success', async () => {
      const instructions = '1-0';
      const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
        initialSpacing: 1,
        numberOfStrings: 6,
        rowsLength: 15,
      });

      const tablatureCompilationResult = await tablatureCompilerService.compileTablaure(
        instructions,
        tablatureCompilationOptions
      );

      expect(tablatureCompilationResult.tablatureCompiledSuccessfully).toBe(true);
      expect(tablatureCompilationResult.compiledTablature).not.toBeNull();
      expect(tablatureCompilationResult.compiledTablature?.tablature).toBeDefined();
      expect(tablatureCompilationResult.compiledTablature?.tablatureCompilationOptions).toBe(
        tablatureCompilationOptions
      );
      expect(tablatureCompilationResult.compilationErrors).toBe(null);
    });

    it.each([
      ['en-US', tablabLocalizeEnUSMock],
      ['pt-BR', tablabLocalizePtBRMock],
      ['zz-ZZ', tablabLocalizeEnUSMock],
      [null, tablabLocalizeEnUSMock],
    ])(
      'should return a failed tablature compilation result with localizaed messages on failure - %s',
      async (locale, expectedLocalizationMock) => {
        const instructions = '0-0 r(2) { t }';
        const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
          initialSpacing: 1,
          numberOfStrings: 6,
          rowsLength: 15,
          locale,
        });

        const tablatureCompilationResult = await tablatureCompilerService.compileTablaure(
          instructions,
          tablatureCompilationOptions
        );

        expect(tablatureCompilationResult.tablatureCompiledSuccessfully).toBe(false);
        expect(tablatureCompilationResult.compiledTablature).toBeNull();
        expect(tablatureCompilationResult.compilationErrors).not.toBeNull();
        expect(expectedLocalizationMock).toHaveBeenCalledTimes(1);

        tablabLocalizeEnUSMock.mockReset();
        tablabLocalizePtBRMock.mockReset();
      }
    );
  });

  describe(TablatureCompilerService.prototype.isSuccessfulTablatureCompilationResult.name, () => {
    it('should return true if the given tablature compilation result is a sucessful one', () => {
      const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
        initialSpacing: 1,
        numberOfStrings: 6,
        rowsLength: 15,
      });
      const tablature: string[][] = [];

      const tablatureCompilationResult = new SuccessfulTablatureCompilationResultDTO(
        new CompiledTablatureDTO({ tablature, tablatureCompilationOptions })
      );

      expect(
        tablatureCompilerService.isSuccessfulTablatureCompilationResult(tablatureCompilationResult)
      ).toBe(true);
    });

    it('should return false if the given tablature compilation result is a failed one', () => {
      const failedTablatureCompilationResult = new FailedTablatureCompilationResultDTO([]);

      expect(
        tablatureCompilerService.isSuccessfulTablatureCompilationResult(
          failedTablatureCompilationResult
        )
      ).toBe(false);
    });
  });
});
