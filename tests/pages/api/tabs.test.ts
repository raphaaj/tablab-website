import { ErrorCode } from '@common/enums/error-code';
import { createTabsApiHandler } from '@pages/api/tabs';
import { BaseTablatureService } from '@server/services/tablature/base-tablature-service';
import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureCreationResultDTO } from '@server/services/tablature/dtos/tablature-creation-result-dto';
import { TablatureDTO } from '@server/services/tablature/dtos/tablature-dto';
import { getTestFailedWriteResult } from '@test-utils/failed-write-result-generator';
import { NextApiRequest, NextApiResponse } from 'next';
import httpMocks, { RequestMethod } from 'node-mocks-http';
import { FailedWriteResult } from 'tablab';

const URL = '/api/tabs';

class SuccessfulTablatureCreationTabService extends BaseTablatureService {
  public createTablature(
    tablatureCreationData: TablatureCreationDataDTO
  ): Promise<TablatureCreationResultDTO> {
    const tablature = new TablatureDTO({
      initialSpacing: tablatureCreationData.initialSpacing,
      instructions: tablatureCreationData.instructions,
      numberOfStrings: tablatureCreationData.numberOfStrings,
      renderedTab: [[]],
      rowsLength: tablatureCreationData.rowsLength,
      observations: tablatureCreationData.observations,
      title: tablatureCreationData.title,
    });

    return Promise.resolve({ success: true, tablature });
  }
}

class FailedTabCreationTabService extends BaseTablatureService {
  public failedWriteResults: FailedWriteResult[];

  public constructor(failedWriteResults: FailedWriteResult[]) {
    super();

    this.failedWriteResults = failedWriteResults;
  }

  public createTablature(): Promise<TablatureCreationResultDTO> {
    return Promise.resolve({ failedWriteResults: this.failedWriteResults, success: false });
  }
}

type TablatureCreationRequest = {
  initialSpacing?: any;
  instructions?: any;
  numberOfStrings?: any;
  observations?: any;
  rowsLength?: any;
  title?: any;
  unknownField?: any;
};

function getRequestBody(customOptions: TablatureCreationRequest = {}): TablatureCreationRequest {
  return {
    initialSpacing: 1,
    instructions: '1-0',
    numberOfStrings: 6,
    rowsLength: 30,
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

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(405);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidHttpMethodError);
        expect(responseBody.details.path).toBe(request.url);
        expect(responseBody.details.receivedMethod).toBe(method);
        expect(responseBody.details.allowedMethods).toEqual(['POST']);
        expect(responseHeaders['content-type']).toBe('application/json');
      }
    );
  });

  describe('request body validation', () => {
    it('should return 400 if no request body is sent', async () => {
      const requestBody = {};

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(400);
      expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ initialSpacing });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ instructions });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ numberOfStrings });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ observations });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ rowsLength: rowsLength });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
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
        const requestBody = getRequestBody({ title });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });

    describe('unknown fields', () => {
      it('should return 400 if any unknwon field is set', async () => {
        const unknownField = 'some value';
        const requestBody = getRequestBody({ unknownField: unknownField });

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseBody = response._getJSONData();
        const responseHeaders = response._getHeaders();

        expect(response.statusCode).toBe(400);
        expect(responseBody.errorCode).toBe(ErrorCode.Common_InvalidContentSyntaxError);
        expect(responseBody.details.validationErrors).toBeDefined();
        expect(responseHeaders['content-type']).toBe('application/json');
      });
    });
  });

  describe('tab creation', () => {
    it('should return 201 when only the required fields are given and a tab is successfully created', async () => {
      const requestBody = getRequestBody();

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tabService = new SuccessfulTablatureCreationTabService();
      const createTabSpy = jest.spyOn(tabService, 'createTablature');
      const tabsHandler = createTabsApiHandler(tabService);
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(201);
      expect(createTabSpy).toHaveBeenCalledTimes(1);
      expect(createTabSpy).toHaveBeenCalledWith(new TablatureCreationDataDTO(request.body));
      expect(responseBody.title).toBe(null);
      expect(responseBody.observations).toBe(null);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.renderedTab).toBeDefined();
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 201 when a title is given with the required fields and a tab is successfully created', async () => {
      const title = 'a test title';
      const requestBody = getRequestBody({ title });

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tabService = new SuccessfulTablatureCreationTabService();
      const createTabSpy = jest.spyOn(tabService, 'createTablature');
      const tabsHandler = createTabsApiHandler(tabService);
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(201);
      expect(createTabSpy).toHaveBeenCalledTimes(1);
      expect(createTabSpy).toHaveBeenCalledWith(new TablatureCreationDataDTO(request.body));
      expect(responseBody.title).toBe(title);
      expect(responseBody.observations).toBe(null);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.renderedTab).toBeDefined();
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 201 when some observations are given with the required fields and a tab is successfully created', async () => {
      const observations = 'a test title';
      const requestBody = getRequestBody({ observations });

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tabService = new SuccessfulTablatureCreationTabService();
      const createTabSpy = jest.spyOn(tabService, 'createTablature');
      const tabsHandler = createTabsApiHandler(tabService);
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(201);
      expect(createTabSpy).toHaveBeenCalledTimes(1);
      expect(createTabSpy).toHaveBeenCalledWith(new TablatureCreationDataDTO(request.body));
      expect(responseBody.title).toBe(null);
      expect(responseBody.observations).toBe(observations);
      expect(responseBody.numberOfStrings).toBe(requestBody.numberOfStrings);
      expect(responseBody.initialSpacing).toBe(requestBody.initialSpacing);
      expect(responseBody.rowsLength).toBe(requestBody.rowsLength);
      expect(responseBody.instructions).toBe(requestBody.instructions);
      expect(responseBody.renderedTab).toBeDefined();
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 422 when the required fields are given and valid, but a tab cannot be created with it', async () => {
      const requestBody = getRequestBody();

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const failedWriteResult = getTestFailedWriteResult();
      const tabService = new FailedTabCreationTabService([failedWriteResult]);
      const createTabSpy = jest.spyOn(tabService, 'createTablature');
      const tabsHandler = createTabsApiHandler(tabService);
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(422);
      expect(createTabSpy).toHaveBeenCalledTimes(1);
      expect(createTabSpy).toHaveBeenCalledWith(new TablatureCreationDataDTO(request.body));
      expect(responseBody.errorCode).toBe(ErrorCode.Tab_RenderizationError);
      expect(responseBody.details.instructionsRenderizationErrors).toBeDefined();
      expect(responseHeaders['content-type']).toBe('application/json');
    });

    it('should return 500 when an unknown error occurs', async () => {
      const requestBody = getRequestBody();

      const request = httpMocks.createRequest<NextApiRequest>({
        method: 'POST',
        url: URL,
        body: requestBody,
      });
      const response = httpMocks.createResponse<NextApiResponse>();

      const tabService = new SuccessfulTablatureCreationTabService();
      const createTabSpy = jest
        .spyOn(tabService, 'createTablature')
        .mockRejectedValue(new Error('test'));
      const tabsHandler = createTabsApiHandler(tabService);
      await tabsHandler(request, response);

      const responseBody = response._getJSONData();
      const responseHeaders = response._getHeaders();

      expect(response.statusCode).toBe(500);
      expect(createTabSpy).toHaveBeenCalledTimes(1);
      expect(createTabSpy).toHaveBeenCalledWith(new TablatureCreationDataDTO(request.body));
      expect(responseBody.errorCode).toBe(ErrorCode.Common_UnknownError);
      expect(responseBody.details).toBe(null);
      expect(responseHeaders['content-type']).toBe('application/json');
    });
  });

  describe('headers', () => {
    describe('content-language', () => {
      it('should set the content-language header to en-US when no language preference indication is given', async () => {
        const requestBody = getRequestBody();

        const request = httpMocks.createRequest<NextApiRequest>({
          method: 'POST',
          url: URL,
          body: requestBody,
        });
        const response = httpMocks.createResponse<NextApiResponse>();

        const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
        await tabsHandler(request, response);

        const responseHeaders = response._getHeaders();

        expect(responseHeaders['content-language']).toBe('en-US');
      });

      it.each([
        ['en-US', 'en-US'],
        ['pt-BR', 'pt-BR'],
        ['en-US', 'de-DE'],
        ['en-US', 'en-US;q=0.9, pt-BR;q=0.8'],
        ['pt-BR', 'en-US;q=0.8, pt-BR;q=0.9'],
        ['en-US', 'de-DE;q=0.9, en-US;q=0.8, pt-BR;q=0.7'],
        ['pt-BR', 'de-DE;q=0.9, en-US;q=0.7, pt-BR;q=0.8'],
      ])(
        'should set the content-language header to %s when the accept-language is set to %s',
        async (expectedContentLanguage, acceptLanguage) => {
          const requestBody = getRequestBody();
          const requestHeaders = { 'accept-language': acceptLanguage };

          const request = httpMocks.createRequest<NextApiRequest>({
            method: 'POST',
            url: URL,
            body: requestBody,
            headers: requestHeaders,
          });
          const response = httpMocks.createResponse<NextApiResponse>();

          const tabsHandler = createTabsApiHandler(new SuccessfulTablatureCreationTabService());
          await tabsHandler(request, response);

          const responseHeaders = response._getHeaders();

          expect(responseHeaders['content-language']).toBe(expectedContentLanguage);
        }
      );
    });
  });
});
