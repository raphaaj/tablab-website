import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';
import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';

describe(TablatureInstructionRenderizationErrorDetails.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const instruction = '1-0';
      const instructionStartIndex = 0;
      const instructionEndIndex = instruction.length;
      const renderizationErrorType = 'SOME_ERROR_TYPE';
      const renderizationErrorMessage = 'some error description';
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

  describe(TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult.name, () => {
    it('should create an instance from a failed write result', () => {
      const failedWriteResult = getTestFailedWriteResult();
      const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

      const tabInstructionRenderizationError =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult(
          failedWriteResult
        );

      expect(tabInstructionRenderizationError.instruction).toBe(parsedInstruction.value);
      expect(tabInstructionRenderizationError.instructionStartIndex).toBe(
        parsedInstruction.readFromIndex
      );
      expect(tabInstructionRenderizationError.instructionEndIndex).toBe(
        parsedInstruction.readToIndex
      );
      expect(tabInstructionRenderizationError.renderizationErrorType).toBe(
        failedWriteResult.failureReasonIdentifier
      );
      expect(tabInstructionRenderizationError.renderizationErrorMessage).toBe(
        failedWriteResult.failureMessage
      );
      expect(tabInstructionRenderizationError.childInstructionsRenderizationErrors).toBe(null);
    });

    it('should create an instance from a failed write result with child results', () => {
      const childResult = getTestFailedWriteResult();
      const failedWriteResult = getTestFailedWriteResult({ childResults: [childResult] });
      const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

      const tabInstructionRenderizationError =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult(
          failedWriteResult
        );

      const tabInstructionRenderizationChildError =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult(childResult);

      expect(tabInstructionRenderizationError.instruction).toBe(parsedInstruction.value);
      expect(tabInstructionRenderizationError.instructionStartIndex).toBe(
        parsedInstruction.readFromIndex
      );
      expect(tabInstructionRenderizationError.instructionEndIndex).toBe(
        parsedInstruction.readToIndex
      );
      expect(tabInstructionRenderizationError.renderizationErrorType).toBe(
        failedWriteResult.failureReasonIdentifier
      );
      expect(tabInstructionRenderizationError.renderizationErrorMessage).toBe(
        failedWriteResult.failureMessage
      );
      expect(tabInstructionRenderizationError.childInstructionsRenderizationErrors).toEqual([
        tabInstructionRenderizationChildError,
      ]);
    });
  });

  describe(TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults.name, () => {
    it('should create instances for each failed write result', () => {
      expect.assertions(3);

      const failedWriteResult1 = getTestFailedWriteResult();
      const failedWriteResult2 = getTestFailedWriteResult();

      const failedWriteResults = [failedWriteResult1, failedWriteResult2];
      const expectedTabInstructionRenderizationErrors = failedWriteResults.map(
        (failedWriteResult) =>
          TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResult(
            failedWriteResult
          )
      );

      const createFromFailedWriteResultSpy = jest.spyOn(
        TablatureInstructionRenderizationErrorDetails,
        'createFromFailedWriteResult'
      );

      const tabInstructionRenderizationErrors =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
          failedWriteResults
        );

      expect(tabInstructionRenderizationErrors).toEqual(expectedTabInstructionRenderizationErrors);
      failedWriteResults.forEach((failedWriteResult, i) => {
        expect(createFromFailedWriteResultSpy).toHaveBeenNthCalledWith(i + 1, failedWriteResult);
      });

      createFromFailedWriteResultSpy.mockRestore();
    });
  });
});
