import { TablatureInstructionRenderizationErrorDTO } from '@server/services/tablature/dtos/tablature-instruction-renderization-error-dto';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';

describe(TablatureInstructionRenderizationErrorDetails.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const instruction = '1-0';
      const instructionStartIndex = 0;
      const instructionEndIndex = instruction.length - 1;
      const renderizationErrorType = 'SOME_ERROR_TYPE';
      const renderizationErrorMessage = 'Renderization Error Message';
      const childInstructionsRenderizationErrors = null;

      const tabInstructionRenderizationError = new TablatureInstructionRenderizationErrorDetails({
        instruction,
        instructionStartIndex,
        instructionEndIndex,
        renderizationErrorType,
        renderizationErrorMessage,
        childInstructionsRenderizationErrors,
      });

      expect(tabInstructionRenderizationError.instruction).toBe(instruction);
      expect(tabInstructionRenderizationError.instructionStartIndex).toBe(instructionStartIndex);
      expect(tabInstructionRenderizationError.instructionEndIndex).toBe(instructionEndIndex);
      expect(tabInstructionRenderizationError.renderizationErrorType).toBe(renderizationErrorType);
      expect(tabInstructionRenderizationError.renderizationErrorMessage).toBe(
        renderizationErrorMessage
      );
      expect(tabInstructionRenderizationError.childInstructionsRenderizationErrors).toBe(
        childInstructionsRenderizationErrors
      );
    });
  });

  describe(
    TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationError
      .name,
    () => {
      it('should create an instance from a TablatureInstructionRenderizationErrorDTO instance', () => {
        const instruction = 'instruction';
        const tablatureInstructionRenderizationError =
          new TablatureInstructionRenderizationErrorDTO({
            instruction,
            instructionStartIndex: 0,
            instructionEndIndex: instruction.length - 1,
            renderizationErrorType: 'RENDERIZATION_ERROR_TYPE',
            renderizationErrorMessage: 'Renderization Error Message',
            childInstructionsRenderizationErrors: null,
          });

        const tablatureInstructionRenderizationErrorDetails =
          TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationError(
            tablatureInstructionRenderizationError
          );

        expect(tablatureInstructionRenderizationErrorDetails.instruction).toBe(
          tablatureInstructionRenderizationError.instruction
        );
        expect(tablatureInstructionRenderizationErrorDetails.instructionStartIndex).toBe(
          tablatureInstructionRenderizationError.instructionStartIndex
        );
        expect(tablatureInstructionRenderizationErrorDetails.instructionEndIndex).toBe(
          tablatureInstructionRenderizationError.instructionEndIndex
        );
        expect(tablatureInstructionRenderizationErrorDetails.renderizationErrorType).toBe(
          tablatureInstructionRenderizationError.renderizationErrorType
        );
        expect(tablatureInstructionRenderizationErrorDetails.renderizationErrorMessage).toBe(
          tablatureInstructionRenderizationError.renderizationErrorMessage
        );
        expect(
          tablatureInstructionRenderizationErrorDetails.childInstructionsRenderizationErrors
        ).toBe(tablatureInstructionRenderizationError.childInstructionsRenderizationErrors);
      });
    }
  );

  describe(
    TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationErrors
      .name,
    () => {
      it('should create instances from an array of TablatureInstructionRenderizationErrorDTO instances', () => {
        const instruction = 'instruction';
        const tablatureInstructionRenderizationError =
          new TablatureInstructionRenderizationErrorDTO({
            instruction,
            instructionStartIndex: 0,
            instructionEndIndex: instruction.length - 1,
            renderizationErrorType: 'RENDERIZATION_ERROR_TYPE',
            renderizationErrorMessage: 'Renderization Error Message',
            childInstructionsRenderizationErrors: null,
          });

        const tablatureInstructionsRenderizationErrorsDetails =
          TablatureInstructionRenderizationErrorDetails.createFromTablatureInstructionRenderizationErrors(
            [tablatureInstructionRenderizationError]
          );

        const tablatureInstructionRenderizationErrorDetails =
          tablatureInstructionsRenderizationErrorsDetails[0];

        expect(tablatureInstructionRenderizationErrorDetails.instruction).toBe(
          tablatureInstructionRenderizationError.instruction
        );
        expect(tablatureInstructionRenderizationErrorDetails.instructionStartIndex).toBe(
          tablatureInstructionRenderizationError.instructionStartIndex
        );
        expect(tablatureInstructionRenderizationErrorDetails.instructionEndIndex).toBe(
          tablatureInstructionRenderizationError.instructionEndIndex
        );
        expect(tablatureInstructionRenderizationErrorDetails.renderizationErrorType).toBe(
          tablatureInstructionRenderizationError.renderizationErrorType
        );
        expect(tablatureInstructionRenderizationErrorDetails.renderizationErrorMessage).toBe(
          tablatureInstructionRenderizationError.renderizationErrorMessage
        );
        expect(
          tablatureInstructionRenderizationErrorDetails.childInstructionsRenderizationErrors
        ).toBe(tablatureInstructionRenderizationError.childInstructionsRenderizationErrors);
      });
    }
  );
});
