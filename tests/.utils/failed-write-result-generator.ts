import { BaseInstructionWriter, BaseWriteResult, FailedWriteResult, Tab } from 'tablab';

export class NullInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

export type FailedWriteResultGenerationOptions = {
  childResults?: BaseWriteResult[];
  instruction?: string;
  failureMessage?: string;
  failureReasonIdentifier?: string;
};

export function getTestFailedWriteResult(
  generationOptions: FailedWriteResultGenerationOptions = {}
): FailedWriteResult {
  let instruction = generationOptions.instruction;
  if (!instruction) instruction = '1-0';

  let failureReasonIdentifier = generationOptions.failureReasonIdentifier;
  if (!failureReasonIdentifier) failureReasonIdentifier = 'TEST_FAILURE_REASON';

  let failureMessage = generationOptions.failureMessage;
  if (!failureMessage) failureMessage = 'test failure message';

  const childResults = generationOptions.childResults;

  const parsedInstruction = {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
  const instructionWriter = new NullInstructionWriter({ parsedInstruction });
  const tab = new Tab();

  const failedWriteResult = new FailedWriteResult({
    childResults,
    failureMessage,
    failureReasonIdentifier,
    instructionWriter,
    tab,
  });

  return failedWriteResult;
}
