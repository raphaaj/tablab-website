import { ErrorCode } from '@common/enums/error-code';
import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import tabsApiHandler from '@pages/api/tabs';
import {
  ITablatureErrorsProviderService,
  ITablatureErrorsProviderServiceInjectionToken,
} from '@server/services/errors-provider-services/tablature-errors-provider-service/interfaces/tablature-errors-provider-service.interface';
import {
  IRequestHelperService,
  IRequestHelperServiceInjectionToken,
} from '@server/services/request-helper-service/interfaces/request-helper-service.interface';
import { CompiledTablatureDTO } from '@server/services/tablature-compiler-service/dtos/compiled-tablature.dto';
import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  FailedTablatureCompilationResultDTO,
  SuccessfulTablatureCompilationResultDTO,
} from '@server/services/tablature-compiler-service/dtos/tablature-compilation-result.dto';
import {
  ITablatureCompilerService,
  ITablatureCompilerServiceInjectionToken,
} from '@server/services/tablature-compiler-service/interfaces/tablature-compiler-service.interface';
import { InternalError } from '@server/view-models/error/internal-error';
import { InvalidContentSyntaxError } from '@server/view-models/error/invalid-content-syntax-error';
import { InvalidHttpMethodError } from '@server/view-models/error/invalid-http-method-error';
import { TablatureCompilationError } from '@server/view-models/tablature/tablature-compilation-error';
import { container } from '@tests/container';
import { mock, mockReset } from 'jest-mock-extended';
import { NextApiRequest, NextApiResponse } from 'next';
import httpMocks, { RequestMethod } from 'node-mocks-http';

const DEFAULT_TEST_LOCALE = 'zz-ZZ';

const requestHelperServiceMock = mock<IRequestHelperService>();
const tablatureErrorsProviderServiceMock = mock<ITablatureErrorsProviderService>();
const tablatureCompilerServiceMock = mock<ITablatureCompilerService>();

container.register<IRequestHelperService>(IRequestHelperServiceInjectionToken, {
  useValue: requestHelperServiceMock,
});
container.register<ITablatureErrorsProviderService>(ITablatureErrorsProviderServiceInjectionToken, {
  useValue: tablatureErrorsProviderServiceMock,
});
container.register<ITablatureCompilerService>(ITablatureCompilerServiceInjectionToken, {
  useValue: tablatureCompilerServiceMock,
});

jest.mock('@server/container', () => {
  return {
    get container() {
      return container;
    },
  };
});

const URL = '/api/tabs';

beforeEach(() => {
  mockReset(requestHelperServiceMock);
  mockReset(tablatureErrorsProviderServiceMock);
  mockReset(tablatureCompilerServiceMock);

  requestHelperServiceMock.getLocaleOptionOrDefaultLocale.mockImplementationOnce(
    () => DEFAULT_TEST_LOCALE
  );
});

function buildValidTablatureCreationRequest(
  customOptions: Partial<TablatureCreationRequest> = {}
): TablatureCreationRequest {
  return {
    initialSpacing: 1,
    instructions: '1-0',
    numberOfStrings: 6,
    rowsLength: 30,
    ...customOptions,
  };
}

function buildUnknownTablatureCreationRequest(
  customOptions: Record<string, unknown> = {}
): Record<string, unknown> {
  const baseTablatureCreationRequest = buildValidTablatureCreationRequest();

  return {
    ...baseTablatureCreationRequest,
    ...customOptions,
  };
}

describe(URL, () => {
  describe('http methods handling', () => {
    it.each<RequestMethod>(['GET', 'PUT', 'PATCH', 'DELETE'])(
      'should return a 405 if HTTP method is %s',
      async (method) => {
        const request = httpMocks.createRequest<NextApiRequest>({ method, url: URL });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidHttpMethodError = new InvalidHttpMethodError({
          request,
          message: 'Invalid HTTP method test message',
          acceptedMethods: ['POST'],
        });
        tablatureErrorsProviderServiceMock.getInvalidHttpMethodError.mockResolvedValueOnce(
          invalidHttpMethodError
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(405);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidHttpMethodError);
        expect(responseBody.message).toBe(invalidHttpMethodError.message);
        expect(responseBody.details.path).toBe(request.url);
        expect(responseBody.details.receivedMethod).toBe(method);
        expect(responseBody.details.allowedMethods).toEqual(
          invalidHttpMethodError.details?.allowedMethods
        );
        expect(responseHeaders['content-type']).toBe('application/json');
      }
    );
  });

  describe('request body validation', () => {
    it('should return 400 if no request body is sent', async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const invalidContentSyntaxErrorMessage = 'Invalid content test message';
      tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
        (request, validationErrors) =>
          Promise.resolve(
            new InvalidContentSyntaxError({
              request,
              message: invalidContentSyntaxErrorMessage,
              validationErrors,
            })
          )
      );

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(400);
      expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
      expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
      expect(responseBody.details.validationErrors).toBeDefined();
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    describe('initialSpacing', () => {
      it.each([
        ['not set', undefined],
        ['null', null],
        ['a string', 'some text'],
        ['an array', []],
        ['an object', {}],
        ['a number smaller than 1', 0],
        ['a decimal number', 1.23],
      ])('should return 400 if the initialSpacing field is %s', async (_, initialSpacing) => {
        const requestBody = buildUnknownTablatureCreationRequest({ initialSpacing });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - initialSpacing';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('instructions', () => {
      it.each([
        ['not set', undefined],
        ['null', null],
        ['an array', []],
        ['an object', {}],
        ['a number', 1],
        ['a decimal number', 1.23],
        ['an empty string', ''],
        ['a string with spaces', ' '],
      ])('should return 400 if the instructions field is %s', async (_, instructions) => {
        const requestBody = buildUnknownTablatureCreationRequest({ instructions });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - instructions';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('numberOfStrings', () => {
      it.each([
        ['not set', undefined],
        ['null', null],
        ['a string', 'some text'],
        ['an array', []],
        ['an object', {}],
        ['a number smaller than 1', 0],
        ['a number greater than 12', 13],
        ['a decimal number', 1.23],
      ])('should return 400 if the numberOfStrings field is %s', async (_, numberOfStrings) => {
        const requestBody = buildUnknownTablatureCreationRequest({ numberOfStrings });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - numberOfStrings';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('observations', () => {
      it.each([
        ['an array', []],
        ['an object', {}],
        ['a number', 1],
        ['a decimal number', 1.23],
      ])('should return 400 if the observations field is %s', async (_, observations) => {
        const requestBody = buildUnknownTablatureCreationRequest({ observations });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - observations';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('rowsLength', () => {
      it.each([
        ['not set', undefined],
        ['null', null],
        ['a string', 'some text'],
        ['an array', []],
        ['an object', {}],
        ['a number smaller than 15', 14],
        ['a number greater than 500', 501],
        ['a decimal number', 15.67],
      ])('should return 400 if the rowsLength field is %s', async (_, rowsLength) => {
        const requestBody = buildUnknownTablatureCreationRequest({ rowsLength });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - rowsLength';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('title', () => {
      it.each([
        ['an array', []],
        ['an object', {}],
        ['a number', 1],
        ['a decimal number', 1.23],
      ])('should return 400 if the title field is %s', async (_, title) => {
        const requestBody = buildUnknownTablatureCreationRequest({ title });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - title';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('unknown fields', () => {
      it('should return 400 if any unknwon field is set', async () => {
        const requestBody = buildUnknownTablatureCreationRequest({ unknownField: 'some value' });
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const invalidContentSyntaxErrorMessage = 'Invalid content test message - unknown fields';
        tablatureErrorsProviderServiceMock.getInvalidContentSyntaxError.mockImplementationOnce(
          (request, validationErrors) =>
            Promise.resolve(
              new InvalidContentSyntaxError({
                request,
                message: invalidContentSyntaxErrorMessage,
                validationErrors,
              })
            )
        );

        await tabsApiHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.message).toBe(invalidContentSyntaxErrorMessage);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });
  });

  describe('tab creation', () => {
    it('should return 201 when only the required fields are given and a tab is successfully created', async () => {
      const requestBody = buildValidTablatureCreationRequest();
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tablature: string[][] = [['']];
      tablatureCompilerServiceMock.compileTablaure.mockImplementationOnce(
        (_, tablatureCompilationOptions) =>
          Promise.resolve(
            new SuccessfulTablatureCompilationResultDTO(
              new CompiledTablatureDTO({ tablature, tablatureCompilationOptions })
            )
          )
      );
      tablatureCompilerServiceMock.isSuccessfulTablatureCompilationResult.mockImplementationOnce(
        () => true
      );

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledTimes(1);
      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledWith(
        requestBody.instructions,
        new TablatureCompilationOptionsDTO({
          numberOfStrings: request.body.numberOfStrings,
          initialSpacing: request.body.initialSpacing,
          rowsLength: request.body.rowsLength,
          locale: DEFAULT_TEST_LOCALE,
        })
      );

      expect(response.statusCode).toBe(201);
      expect(responseBody.title).toBe(null);
      expect(responseBody.observations).toBe(null);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.tablature).toEqual(tablature);
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 201 when a title is given with the required fields and a tab is successfully created', async () => {
      const title = 'a test title';
      const requestBody = buildValidTablatureCreationRequest({ title });
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tablature: string[][] = [['']];
      tablatureCompilerServiceMock.compileTablaure.mockImplementationOnce(
        (_, tablatureCompilationOptions) =>
          Promise.resolve(
            new SuccessfulTablatureCompilationResultDTO(
              new CompiledTablatureDTO({ tablature, tablatureCompilationOptions })
            )
          )
      );
      tablatureCompilerServiceMock.isSuccessfulTablatureCompilationResult.mockImplementationOnce(
        () => true
      );

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledTimes(1);
      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledWith(
        requestBody.instructions,
        new TablatureCompilationOptionsDTO({
          numberOfStrings: request.body.numberOfStrings,
          initialSpacing: request.body.initialSpacing,
          rowsLength: request.body.rowsLength,
          locale: DEFAULT_TEST_LOCALE,
        })
      );

      expect(response.statusCode).toBe(201);
      expect(responseBody.title).toBe(title);
      expect(responseBody.observations).toBe(null);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.tablature).toEqual(tablature);
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 201 when some observations are given with the required fields and a tab is successfully created', async () => {
      const observations = 'some test observations';
      const requestBody = buildValidTablatureCreationRequest({ observations });
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tablature: string[][] = [['']];
      tablatureCompilerServiceMock.compileTablaure.mockImplementationOnce(
        (_, tablatureCompilationOptions) =>
          Promise.resolve(
            new SuccessfulTablatureCompilationResultDTO(
              new CompiledTablatureDTO({ tablature, tablatureCompilationOptions })
            )
          )
      );
      tablatureCompilerServiceMock.isSuccessfulTablatureCompilationResult.mockImplementationOnce(
        () => true
      );

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledTimes(1);
      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledWith(
        requestBody.instructions,
        new TablatureCompilationOptionsDTO({
          numberOfStrings: request.body.numberOfStrings,
          initialSpacing: request.body.initialSpacing,
          rowsLength: request.body.rowsLength,
          locale: DEFAULT_TEST_LOCALE,
        })
      );

      expect(response.statusCode).toBe(201);
      expect(responseBody.title).toBe(null);
      expect(responseBody.observations).toBe(observations);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.tablature).toEqual(tablature);
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 422 when the required fields are given and valid, but a tab cannot be created with it', async () => {
      const requestBody = buildValidTablatureCreationRequest();
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      tablatureCompilerServiceMock.compileTablaure.mockResolvedValueOnce(
        new FailedTablatureCompilationResultDTO([])
      );
      tablatureCompilerServiceMock.isSuccessfulTablatureCompilationResult.mockImplementationOnce(
        () => false
      );

      const tablatureCompilationError = new TablatureCompilationError({
        request,
        message: 'Tablature compilation error message',
        instructionsCompilationErrors: [],
      });
      tablatureErrorsProviderServiceMock.getTablatureCompilationError.mockResolvedValueOnce(
        tablatureCompilationError
      );

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledTimes(1);
      expect(tablatureCompilerServiceMock.compileTablaure).toHaveBeenCalledWith(
        requestBody.instructions,
        new TablatureCompilationOptionsDTO({
          numberOfStrings: request.body.numberOfStrings,
          initialSpacing: request.body.initialSpacing,
          rowsLength: request.body.rowsLength,
          locale: DEFAULT_TEST_LOCALE,
        })
      );

      expect(response.statusCode).toBe(422);
      expect(responseBody.errorCode).toBe(ErrorCode.Tablature_CompilationError);
      expect(responseBody.message).toBe(tablatureCompilationError.message);
      expect(responseBody.details.instructionsCompilationErrors).toEqual(
        tablatureCompilationError.details?.instructionsCompilationErrors
      );
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 500 when an unknown error occurs', async () => {
      const requestBody = buildValidTablatureCreationRequest();
      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      tablatureCompilerServiceMock.compileTablaure.mockRejectedValueOnce(new Error('Test error'));

      const internalErrorMessage = 'Internal error message';
      const internalError = new InternalError({
        request,
        message: internalErrorMessage,
      });
      tablatureErrorsProviderServiceMock.getInternalError.mockResolvedValueOnce(internalError);

      await tabsApiHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(500);
      expect(responseBody.errorCode).toBe(ErrorCode.Common_UnknownError);
      expect(responseBody.message).toBe(internalErrorMessage);
      expect(responseBody.details).toBe(null);
      expect(responseHeaders['content-type']).toBe('application/json');
    });
  });

  describe('headers', () => {
    describe('content-language', () => {
      it('should set the content-language header', async () => {
        const requestBody = buildValidTablatureCreationRequest();
        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        await tabsApiHandler(request, response);

        const responseHeaders = response._getHeaders();
        expect(responseHeaders['content-language']).toBe(DEFAULT_TEST_LOCALE);
      });
    });
  });
});
