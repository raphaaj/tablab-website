import { TablatureErrorsProviderService } from '@server/services/errors-provider-services/tablature-errors-provider-service/tablature-errors-provider-service';
import {
  IRequestHelperService,
  IRequestHelperServiceInjectionToken,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';
import {
  ITranslationService,
  ITranslationServiceInjectionToken,
} from '@server/services/translation-service/interfaces/translation-service.interface';
import { TablatureCompilationError } from '@server/view-models/tablature/tablature-compilation-error';
import { container } from '@tests/container';
import { mock, mockReset } from 'jest-mock-extended';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

const requestHelperServiceMock = mock<IRequestHelperService>();
const translationServiceMock = mock<ITranslationService>();

container.register<IRequestHelperService>(IRequestHelperServiceInjectionToken, {
  useValue: requestHelperServiceMock,
});
container.register<ITranslationService>(ITranslationServiceInjectionToken, {
  useValue: translationServiceMock,
});

container.register(TablatureErrorsProviderService.name, TablatureErrorsProviderService);

let tablatureErrorsProviderService: TablatureErrorsProviderService;

beforeEach(() => {
  mockReset(requestHelperServiceMock);
  mockReset(translationServiceMock);

  tablatureErrorsProviderService = container.resolve<TablatureErrorsProviderService>(
    TablatureErrorsProviderService.name
  );
});

describe(TablatureErrorsProviderService.name, () => {
  describe(TablatureErrorsProviderService.prototype.getTablatureCompilationError.name, () => {
    it('should return a tablature compilation error object with a translated message', async () => {
      const request = httpMocks.createRequest<NextApiRequest>({ method: 'GET', url: '/test' });
      const tablatureInstructionsCompilationError = new TablatureInstructionCompilationErrorDTO({
        instruction: 'test',
        instructionStartIndex: 0,
        instructionEndIndex: 4,
        compilationErrorType: 'compilation error test type',
        compilationErrorMessage: 'compilation error test message',
        childInstructionsCompilationErrors: null,
      });

      const locale = 'zz-ZZ';
      requestHelperServiceMock.getLocaleOptionOrDefaultLocale.mockReturnValueOnce(locale);

      const translatedMessage = 'tablature compilation error test message';
      const translationFunction = jest.fn(() => translatedMessage);
      translationServiceMock.getTranslationFunction.mockResolvedValueOnce(translationFunction);

      const tablatureCompilationError =
        await tablatureErrorsProviderService.getTablatureCompilationError(request, [
          tablatureInstructionsCompilationError,
        ]);

      expect(tablatureCompilationError.errorCode).toBe(TablatureCompilationError.ERROR_CODE);
      expect(tablatureCompilationError.errorType).toBe(TablatureCompilationError.name);
      expect(tablatureCompilationError.message).toBe(translatedMessage);
      expect(tablatureCompilationError.details?.instructionsCompilationErrors.length).toBe(1);
      expect(tablatureCompilationError.details?.instructionsCompilationErrors[0].instruction).toBe(
        tablatureInstructionsCompilationError.instruction
      );
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].instructionStartIndex
      ).toBe(tablatureInstructionsCompilationError.instructionStartIndex);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].instructionEndIndex
      ).toBe(tablatureInstructionsCompilationError.instructionEndIndex);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].compilationErrorType
      ).toBe(tablatureInstructionsCompilationError.compilationErrorType);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].compilationErrorMessage
      ).toBe(tablatureInstructionsCompilationError.compilationErrorMessage);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0]
          .childInstructionsCompilationErrors
      ).toBe(tablatureInstructionsCompilationError.childInstructionsCompilationErrors);

      expect(translationFunction).toHaveBeenCalled();
    });
  });
});
