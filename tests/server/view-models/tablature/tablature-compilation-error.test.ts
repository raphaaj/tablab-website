import { ErrorCode } from '@common/enums/error-code';
import { TablatureCompilationError } from '@server/view-models/tablature/tablature-compilation-error';
import { TablatureInstructionCompilationErrorDetails } from '@server/view-models/tablature/tablature-instruction-compilation-error-details';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(TablatureCompilationError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();

      const instruction = 'instruction';
      const tablatureInstructionCompilationErrorDetails =
        new TablatureInstructionCompilationErrorDetails({
          instruction,
          instructionStartIndex: 0,
          instructionEndIndex: instruction.length - 1,
          compilationErrorType: 'COMPILATION_ERROR_TYPE',
          compilationErrorMessage: 'Compilation Error Message',
          childInstructionsCompilationErrors: null,
        });
      const instructionsCompilationErrors = [tablatureInstructionCompilationErrorDetails];

      const tablatureCompilationError = new TablatureCompilationError({
        message,
        request,
        instructionsCompilationErrors,
      });

      expect(tablatureCompilationError.errorCode).toBe(ErrorCode.Tablature_CompilationError);
      expect(tablatureCompilationError.message).toBe(message);
      expect(tablatureCompilationError.details?.instructionsCompilationErrors).toEqual(
        instructionsCompilationErrors
      );
      expect(tablatureCompilationError.details?.instructionsCompilationErrors.length).toBe(1);
      expect(tablatureCompilationError.details?.instructionsCompilationErrors[0].instruction).toBe(
        tablatureInstructionCompilationErrorDetails.instruction
      );
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].instructionStartIndex
      ).toBe(tablatureInstructionCompilationErrorDetails.instructionStartIndex);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].instructionEndIndex
      ).toBe(tablatureInstructionCompilationErrorDetails.instructionEndIndex);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].compilationErrorType
      ).toBe(tablatureInstructionCompilationErrorDetails.compilationErrorType);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0].compilationErrorMessage
      ).toBe(tablatureInstructionCompilationErrorDetails.compilationErrorMessage);
      expect(
        tablatureCompilationError.details?.instructionsCompilationErrors[0]
          .childInstructionsCompilationErrors
      ).toBe(tablatureInstructionCompilationErrorDetails.childInstructionsCompilationErrors);
    });
  });
});
