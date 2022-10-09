import { ErrorCode } from '@common/enums/error-code';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

describe(TablatureRenderizationError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();

      const instruction = 'instruction';
      const instructionRenderizationError = new TablatureInstructionRenderizationErrorDetails({
        instruction,
        instructionStartIndex: 0,
        instructionEndIndex: instruction.length - 1,
        renderizationErrorType: 'RENDERIZATION_ERROR_TYPE',
        renderizationErrorMessage: 'Renderization Error Message',
        childInstructionsRenderizationErrors: null,
      });
      const instructionsRenderizationErrors = [instructionRenderizationError];

      const error = new TablatureRenderizationError({
        message,
        request,
        instructionsRenderizationErrors,
      });

      expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
      expect(error.message).toBe(message);
      expect(error.details?.instructionsRenderizationErrors).toEqual(
        instructionsRenderizationErrors
      );
    });
  });
});
