import { TablatureInstructionRenderizationErrorDTO } from '@server/services/tablature/dtos/tablature-instruction-renderization-error-dto';

describe(TablatureInstructionRenderizationErrorDTO.name, () => {
  it('should create an instance when all the required fields are given', () => {
    const instruction = 'instruction';
    const instructionEndIndex = instruction.length - 1;
    const instructionStartIndex = 0;
    const renderizationErrorMessage = 'Renderization Error Test';
    const renderizationErrorType = 'RENDERIZATION_ERROR_TEST';

    const tablatureInstructionRenderizationError = new TablatureInstructionRenderizationErrorDTO({
      instruction,
      instructionEndIndex,
      instructionStartIndex,
      renderizationErrorMessage,
      renderizationErrorType,
      childInstructionsRenderizationErrors: null,
    });

    expect(tablatureInstructionRenderizationError.instruction).toBe(instruction);
    expect(tablatureInstructionRenderizationError.instructionEndIndex).toBe(instructionEndIndex);
    expect(tablatureInstructionRenderizationError.instructionStartIndex).toBe(
      instructionStartIndex
    );
    expect(tablatureInstructionRenderizationError.renderizationErrorMessage).toBe(
      renderizationErrorMessage
    );
    expect(tablatureInstructionRenderizationError.renderizationErrorType).toBe(
      renderizationErrorType
    );
    expect(tablatureInstructionRenderizationError.childInstructionsRenderizationErrors).toBeNull();
  });

  it('should create an instance when the childInstructionsRenderizationErrors field is given with all the required fields', () => {
    const instruction = '1-0';
    const instructionEndIndex = instruction.length;
    const instructionStartIndex = 0;
    const renderizationErrorMessage = 'Renderization Error Test';
    const renderizationErrorType = 'RENDERIZATION_ERROR_TEST';

    const childInstruction = 'childInstruction';
    const childInstructionsRenderizationErrors = [
      new TablatureInstructionRenderizationErrorDTO({
        instruction: childInstruction,
        instructionEndIndex: childInstruction.length - 1,
        instructionStartIndex: 0,
        renderizationErrorMessage: 'Renderization Error Test - Child Instruction',
        renderizationErrorType: 'RENDERIZATION_ERROR_TEST_CHILD_INSTRUCTION',
        childInstructionsRenderizationErrors: null,
      }),
    ];

    const tablatureInstructionRenderizationError = new TablatureInstructionRenderizationErrorDTO({
      instruction,
      instructionEndIndex,
      instructionStartIndex,
      renderizationErrorMessage,
      renderizationErrorType,
      childInstructionsRenderizationErrors,
    });

    expect(tablatureInstructionRenderizationError.instruction).toBe(instruction);
    expect(tablatureInstructionRenderizationError.instructionEndIndex).toBe(instructionEndIndex);
    expect(tablatureInstructionRenderizationError.instructionStartIndex).toBe(
      instructionStartIndex
    );
    expect(tablatureInstructionRenderizationError.renderizationErrorMessage).toBe(
      renderizationErrorMessage
    );
    expect(tablatureInstructionRenderizationError.renderizationErrorType).toBe(
      renderizationErrorType
    );
    expect(tablatureInstructionRenderizationError.childInstructionsRenderizationErrors).toBe(
      childInstructionsRenderizationErrors
    );
  });
});
