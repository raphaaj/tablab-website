import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { TabInstructionRenderizationError } from '@view-models/tab/tab-instruction-renderization-error';

describe(TabInstructionRenderizationError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const instruction = '1-0';
      const startIndex = 0;
      const endIndex = instruction.length;
      const errorType = 'SOME_ERROR_TYPE';
      const errorMessage = 'some error description';
      const childErrors = null;

      const tabInstructionRenderizationError = new TabInstructionRenderizationError({
        instruction,
        startIndex,
        endIndex,
        errorType,
        errorMessage,
        childErrors,
      });

      expect(tabInstructionRenderizationError.instruction).toBe(instruction);
      expect(tabInstructionRenderizationError.startIndex).toBe(startIndex);
      expect(tabInstructionRenderizationError.endIndex).toBe(endIndex);
      expect(tabInstructionRenderizationError.errorType).toBe(errorType);
      expect(tabInstructionRenderizationError.errorMessage).toBe(errorMessage);
      expect(tabInstructionRenderizationError.childErrors).toBe(childErrors);
    });
  });

  describe(TabInstructionRenderizationError.createFromFailedWriteResult.name, () => {
    it('should create an instance from a failed write result', () => {
      const failedWriteResult = getTestFailedWriteResult();
      const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

      const tabInstructionRenderizationError =
        TabInstructionRenderizationError.createFromFailedWriteResult(failedWriteResult);

      expect(tabInstructionRenderizationError.instruction).toBe(parsedInstruction.value);
      expect(tabInstructionRenderizationError.startIndex).toBe(parsedInstruction.readFromIndex);
      expect(tabInstructionRenderizationError.endIndex).toBe(parsedInstruction.readToIndex);
      expect(tabInstructionRenderizationError.errorType).toBe(
        failedWriteResult.failureReasonIdentifier
      );
      expect(tabInstructionRenderizationError.errorMessage).toBe(failedWriteResult.failureMessage);
      expect(tabInstructionRenderizationError.childErrors).toBe(null);
    });

    it('should create an instance from a failed write result with child results', () => {
      const childResult = getTestFailedWriteResult();
      const failedWriteResult = getTestFailedWriteResult({ childResults: [childResult] });
      const parsedInstruction = failedWriteResult.instructionWriter.parsedInstruction;

      const tabInstructionRenderizationError =
        TabInstructionRenderizationError.createFromFailedWriteResult(failedWriteResult);

      const tabInstructionRenderizationChildError =
        TabInstructionRenderizationError.createFromFailedWriteResult(childResult);

      expect(tabInstructionRenderizationError.instruction).toBe(parsedInstruction.value);
      expect(tabInstructionRenderizationError.startIndex).toBe(parsedInstruction.readFromIndex);
      expect(tabInstructionRenderizationError.endIndex).toBe(parsedInstruction.readToIndex);
      expect(tabInstructionRenderizationError.errorType).toBe(
        failedWriteResult.failureReasonIdentifier
      );
      expect(tabInstructionRenderizationError.errorMessage).toBe(failedWriteResult.failureMessage);
      expect(tabInstructionRenderizationError.childErrors).toEqual([
        tabInstructionRenderizationChildError,
      ]);
    });
  });

  describe(TabInstructionRenderizationError.createFromFailedWriteResults.name, () => {
    it('should create instances for each failed write result', () => {
      expect.assertions(3);

      const failedWriteResult1 = getTestFailedWriteResult();
      const failedWriteResult2 = getTestFailedWriteResult();

      const failedWriteResults = [failedWriteResult1, failedWriteResult2];
      const expectedTabInstructionRenderizationErrors = failedWriteResults.map(
        (failedWriteResult) =>
          TabInstructionRenderizationError.createFromFailedWriteResult(failedWriteResult)
      );

      const createFromFailedWriteResultSpy = jest.spyOn(
        TabInstructionRenderizationError,
        'createFromFailedWriteResult'
      );

      const tabInstructionRenderizationErrors =
        TabInstructionRenderizationError.createFromFailedWriteResults(failedWriteResults);

      expect(tabInstructionRenderizationErrors).toEqual(expectedTabInstructionRenderizationErrors);
      failedWriteResults.forEach((failedWriteResult, i) => {
        expect(createFromFailedWriteResultSpy).toHaveBeenNthCalledWith(i + 1, failedWriteResult);
      });

      createFromFailedWriteResultSpy.mockRestore();
    });
  });
});
