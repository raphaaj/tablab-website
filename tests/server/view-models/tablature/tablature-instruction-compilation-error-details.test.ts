import { TablatureInstructionCompilationErrorDetails } from '@server/view-models/tablature/tablature-instruction-compilation-error-details';
import { TablatureInstructionCompilationErrorDTO } from '@server/services/tablature-compiler-service/dtos/tablature-instruction-compilation-error.dto';

describe(TablatureInstructionCompilationErrorDetails.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const instruction = '1-0';
      const instructionStartIndex = 0;
      const instructionEndIndex = instruction.length - 1;
      const compilationErrorType = 'COMPILATION_ERROR_TYPE';
      const compilationErrorMessage = 'Compilation Error Message';
      const childInstructionsCompilationErrors = null;

      const tablatureInstructionCompilationErrorDetails =
        new TablatureInstructionCompilationErrorDetails({
          instruction,
          instructionStartIndex,
          instructionEndIndex,
          compilationErrorType,
          compilationErrorMessage,
          childInstructionsCompilationErrors,
        });

      expect(tablatureInstructionCompilationErrorDetails.instruction).toBe(instruction);
      expect(tablatureInstructionCompilationErrorDetails.instructionStartIndex).toBe(
        instructionStartIndex
      );
      expect(tablatureInstructionCompilationErrorDetails.instructionEndIndex).toBe(
        instructionEndIndex
      );
      expect(tablatureInstructionCompilationErrorDetails.compilationErrorType).toBe(
        compilationErrorType
      );
      expect(tablatureInstructionCompilationErrorDetails.compilationErrorMessage).toBe(
        compilationErrorMessage
      );
      expect(tablatureInstructionCompilationErrorDetails.childInstructionsCompilationErrors).toBe(
        childInstructionsCompilationErrors
      );
    });
  });

  describe(
    TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationError.name,
    () => {
      it('should create an instance from a TablatureInstructionCompilationErrorDTO instance', () => {
        const instruction = 'instruction';
        const tablatureInstructionCompilationError = new TablatureInstructionCompilationErrorDTO({
          instruction,
          instructionStartIndex: 0,
          instructionEndIndex: instruction.length - 1,
          compilationErrorType: 'COMPILATION_ERROR_TYPE',
          compilationErrorMessage: 'Compilation Error Message',
          childInstructionsCompilationErrors: null,
        });

        const tablatureInstructionCompilationErrorDetails =
          TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationError(
            tablatureInstructionCompilationError
          );

        expect(tablatureInstructionCompilationErrorDetails.instruction).toBe(
          tablatureInstructionCompilationError.instruction
        );
        expect(tablatureInstructionCompilationErrorDetails.instructionStartIndex).toBe(
          tablatureInstructionCompilationError.instructionStartIndex
        );
        expect(tablatureInstructionCompilationErrorDetails.instructionEndIndex).toBe(
          tablatureInstructionCompilationError.instructionEndIndex
        );
        expect(tablatureInstructionCompilationErrorDetails.compilationErrorType).toBe(
          tablatureInstructionCompilationError.compilationErrorType
        );
        expect(tablatureInstructionCompilationErrorDetails.compilationErrorMessage).toBe(
          tablatureInstructionCompilationError.compilationErrorMessage
        );
        expect(tablatureInstructionCompilationErrorDetails.childInstructionsCompilationErrors).toBe(
          tablatureInstructionCompilationError.childInstructionsCompilationErrors
        );
      });
    }
  );

  describe(
    TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationErrors
      .name,
    () => {
      it('should create instances from an array of TablatureInstructionCompilationErrorDTO instances', () => {
        const instruction = 'instruction';
        const tablatureInstructionCompilationError = new TablatureInstructionCompilationErrorDTO({
          instruction,
          instructionStartIndex: 0,
          instructionEndIndex: instruction.length - 1,
          compilationErrorType: 'COMPILATION_ERROR_TYPE',
          compilationErrorMessage: 'Compilation Error Message',
          childInstructionsCompilationErrors: null,
        });

        const tablatureInstructionsCompilationErrorsDetails =
          TablatureInstructionCompilationErrorDetails.createFromTablatureInstructionCompilationErrors(
            [tablatureInstructionCompilationError]
          );

        const tablatureInstructionCompilationErrorDetails =
          tablatureInstructionsCompilationErrorsDetails[0];

        expect(tablatureInstructionCompilationErrorDetails.instruction).toBe(
          tablatureInstructionCompilationError.instruction
        );
        expect(tablatureInstructionCompilationErrorDetails.instructionStartIndex).toBe(
          tablatureInstructionCompilationError.instructionStartIndex
        );
        expect(tablatureInstructionCompilationErrorDetails.instructionEndIndex).toBe(
          tablatureInstructionCompilationError.instructionEndIndex
        );
        expect(tablatureInstructionCompilationErrorDetails.compilationErrorType).toBe(
          tablatureInstructionCompilationError.compilationErrorType
        );
        expect(tablatureInstructionCompilationErrorDetails.compilationErrorMessage).toBe(
          tablatureInstructionCompilationError.compilationErrorMessage
        );
        expect(tablatureInstructionCompilationErrorDetails.childInstructionsCompilationErrors).toBe(
          tablatureInstructionCompilationError.childInstructionsCompilationErrors
        );
      });
    }
  );
});
