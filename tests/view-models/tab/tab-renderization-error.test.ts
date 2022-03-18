import { ErrorCode } from '@enums/error-code';
import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { TabInstructionRenderizationError } from '@view-models/tab/tab-instruction-renderization-error';
import { TabRenderizationError } from '@view-models/tab/tab-renderization-error';
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

describe(TabRenderizationError.name, () => {
  describe('constructor', () => {
    it('should create an instance when all the required fields are given', () => {
      const locale = 'en-US';
      const message = 'test message';
      const request = httpMocks.createRequest<NextApiRequest>();
      const failedWriteResult = getTestFailedWriteResult();
      const failedWriteResults = [failedWriteResult];

      const expectedRenderizationErrors =
        TabInstructionRenderizationError.createFromFailedWriteResults(failedWriteResults);

      const error = new TabRenderizationError({
        locale,
        message,
        request,
        failedWriteResults,
      });

      expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
      expect(error.message).toBe(message);
      expect(error.details?.renderizationErrors).toEqual(expectedRenderizationErrors);
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
            TabInstructionRenderizationError.createFromFailedWriteResults(failedWriteResults);

          const error = new TabRenderizationError({
            locale,
            message,
            request,
            failedWriteResults,
          });

          expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
          expect(error.message).toBe(message);
          expect(error.details?.renderizationErrors).toEqual(expectedRenderizationErrors);
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
          TabInstructionRenderizationError.createFromFailedWriteResults(failedWriteResults);

        const error = new TabRenderizationError({
          locale,
          message,
          request,
          failedWriteResults,
        });

        expect(error.errorCode).toBe(ErrorCode.Tab_RenderizationError);
        expect(error.message).toBe(message);
        expect(error.details?.renderizationErrors).toEqual(expectedRenderizationErrors);
        expect(localizeEnUs).toHaveBeenCalledWith(failedWriteResults);
      });
    });
  });
});
