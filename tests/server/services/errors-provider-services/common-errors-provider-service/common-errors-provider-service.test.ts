import { ValidationError } from '@common/view-models/errors/invalid-content-syntax-error';
import { CommonErrorsProviderService } from '@server/services/errors-provider-services/common-errors-provider-service/common-errors-provider-service';
import {
  IRequestHelperService,
  IRequestHelperServiceInjectionToken,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import {
  ITranslationService,
  ITranslationServiceInjectionToken,
} from '@server/services/translation-service/interfaces/translation-service.interface';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { container } from '@tests/container';
import { mock, mockReset } from 'jest-mock-extended';
import { NextApiRequest } from 'next';
import httpMocks from 'node-mocks-http';

const requestHelperServiceMock = mock<IRequestHelperService>();
const translationServiceMock = mock<ITranslationService>();

container.register<IRequestHelperService>(IRequestHelperServiceInjectionToken, {
  useValue: requestHelperServiceMock,
});
container.register<ITranslationService>(ITranslationServiceInjectionToken, {
  useValue: translationServiceMock,
});

container.register(CommonErrorsProviderService.name, CommonErrorsProviderService);

let commonErrorsProviderService: CommonErrorsProviderService;

beforeEach(() => {
  mockReset(requestHelperServiceMock);
  mockReset(translationServiceMock);

  commonErrorsProviderService = container.resolve<CommonErrorsProviderService>(
    CommonErrorsProviderService.name
  );
});

describe(CommonErrorsProviderService.name, () => {
  describe(CommonErrorsProviderService.prototype.getInternalError.name, () => {
    it('should return an internal error object with a translated message', async () => {
      const request = httpMocks.createRequest<NextApiRequest>({ method: 'GET', url: '/test' });

      const locale = 'zz-ZZ';
      requestHelperServiceMock.getLocaleOptionOrDefaultLocale.mockReturnValueOnce(locale);

      const translatedMessage = 'internal error test message';
      const translationFunction = jest.fn(() => translatedMessage);
      translationServiceMock.getTranslationFunction.mockResolvedValueOnce(translationFunction);

      const internalError = await commonErrorsProviderService.getInternalError(request);

      expect(internalError.errorCode).toBe(InternalError.ERROR_CODE);
      expect(internalError.errorType).toBe(InternalError.name);
      expect(internalError.message).toBe(translatedMessage);
      expect(internalError.details).toBeNull();

      expect(translationFunction).toHaveBeenCalled();
    });
  });

  describe(CommonErrorsProviderService.prototype.getInvalidContentSyntaxError.name, () => {
    it('should return an invalid content syntax error object with a translated message', async () => {
      const request = httpMocks.createRequest<NextApiRequest>({ method: 'GET', url: '/test' });
      const validationErrors: ValidationError[] = [];

      const locale = 'zz-ZZ';
      requestHelperServiceMock.getLocaleOptionOrDefaultLocale.mockReturnValueOnce(locale);

      const translatedMessage = 'invalid content syntax error test message';
      const translationFunction = jest.fn(() => translatedMessage);
      translationServiceMock.getTranslationFunction.mockResolvedValueOnce(translationFunction);

      const invalidContentSyntaxError =
        await commonErrorsProviderService.getInvalidContentSyntaxError(request, validationErrors);

      expect(invalidContentSyntaxError.errorCode).toBe(InvalidContentSyntaxError.ERROR_CODE);
      expect(invalidContentSyntaxError.errorType).toBe(InvalidContentSyntaxError.name);
      expect(invalidContentSyntaxError.message).toBe(translatedMessage);
      expect(invalidContentSyntaxError.details?.validationErrors).toBe(validationErrors);

      expect(translationFunction).toHaveBeenCalled();
    });
  });

  describe(CommonErrorsProviderService.prototype.getInvalidHttpMethodError.name, () => {
    it('should return an invalid http method error object with a translated message', async () => {
      const request = httpMocks.createRequest<NextApiRequest>({ method: 'GET', url: '/test' });
      const acceptedMethods: string[] = ['PUT', 'PATCH'];

      const locale = 'zz-ZZ';
      requestHelperServiceMock.getLocaleOptionOrDefaultLocale.mockReturnValueOnce(locale);

      const translatedMessage = 'invalid http method error test message';
      const translationFunction = jest.fn(() => translatedMessage);
      translationServiceMock.getTranslationFunction.mockResolvedValueOnce(translationFunction);

      const invalidHttpMethodError = await commonErrorsProviderService.getInvalidHttpMethodError(
        request,
        acceptedMethods
      );

      expect(invalidHttpMethodError.errorCode).toBe(InvalidHttpMethodError.ERROR_CODE);
      expect(invalidHttpMethodError.errorType).toBe(InvalidHttpMethodError.name);
      expect(invalidHttpMethodError.message).toBe(translatedMessage);
      expect(invalidHttpMethodError.details?.path).toBe(request.url);
      expect(invalidHttpMethodError.details?.receivedMethod).toBe(request.method);
      expect(invalidHttpMethodError.details?.allowedMethods).toBe(acceptedMethods);

      expect(translationFunction).toHaveBeenCalled();
    });
  });
});
