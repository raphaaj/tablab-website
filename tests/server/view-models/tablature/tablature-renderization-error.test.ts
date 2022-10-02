import { ErrorCode } from '@common/enums/error-code';
import { TablatureInstructionRenderizationErrorDetails } from '@server/view-models/tablature/tablature-instruction-renderization-error-details';
import { TablatureRenderizationError } from '@server/view-models/tablature/tablature-renderization-error';
import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';
import { localizeEnUs, localizePtBr } from 'tablab-i18n';

jest.mock('tablab-i18n', () => {
  return {
    __esModule: true,
    localizeEnUs: jest.fn(),
    localizePtBr: jest.fn(),
  };
});

describe(TablatureRenderizationError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const locale = 'en-US';
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();
      const failedWriteResult = getTestFailedWriteResult();
      const failedWriteResults = [failedWriteResult];

      const expectedRenderizationErrors =
        TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
          failedWriteResults
        );

      const error = new TablatureRenderizationError({
        locale,
        message,
        request,
        failedWriteResults,
      });

      expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
      expect(error.message).toBe(message);
      expect(error.details?.instructionsRenderizationErrors).toEqual(expectedRenderizationErrors);
    });

    describe('localization', () => {
      it.each([
        ['en-US', localizeEnUs],
        ['pt-BR', localizePtBr],
      ])(
        'should localize the renderization errors based on the given locale - %s',
        (locale, expectedLocalizationFunction) => {
          const message = 'test message';
          const request = httpMocks.createRequest<NextApiRequest>();
          const failedWriteResult = getTestFailedWriteResult();
          const failedWriteResults = [failedWriteResult];

          const expectedRenderizationErrors =
            TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
              failedWriteResults
            );

          const error = new TablatureRenderizationError({
            locale,
            message,
            request,
            failedWriteResults,
          });

          expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
          expect(error.message).toBe(message);
          expect(error.details?.instructionsRenderizationErrors).toEqual(
            expectedRenderizationErrors
          );
          expect(expectedLocalizationFunction).toHaveBeenCalledWith(failedWriteResults);
        }
      );

      it('should fallback to the default localization function when no localization function is identified for the given locale', () => {
        const locale = '?';
        const message = 'test message';
        const request = httpMocks.createRequest<NextApiRequest>();
        const failedWriteResult = getTestFailedWriteResult();
        const failedWriteResults = [failedWriteResult];

        const expectedRenderizationErrors =
          TablatureInstructionRenderizationErrorDetails.createFromFailedWriteResults(
            failedWriteResults
          );

        const error = new TablatureRenderizationError({
          locale,
          message,
          request,
          failedWriteResults,
        });

        expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
        expect(error.message).toBe(message);
        expect(error.details?.instructionsRenderizationErrors).toEqual(expectedRenderizationErrors);
        expect(localizeEnUs).toHaveBeenCalledWith(failedWriteResults);
      });
    });
  });
});
