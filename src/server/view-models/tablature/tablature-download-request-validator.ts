import { TablatureDownloadRequest } from '@common/view-models/tablature/tablature-download-request';
import ajv from '@server/utils/ajv-schema-validation';
import { DefinedError, JSONSchemaType } from 'ajv';
import AjvLocalizeEn from 'ajv-i18n/localize/en';
import AjvLocalizePtBr from 'ajv-i18n/localize/pt-BR';
import { Localize } from 'ajv-i18n/localize/types';

export class TablatureDownloadRequestValidator {
  private static readonly DEFAULT_AJV_LOCALIZE = AjvLocalizeEn;

  private static readonly LOCALE_TO_AJV_LOCALIZE_MAP: Map<string, Localize> = new Map([
    ['en-US', AjvLocalizeEn],
    ['pt-BR', AjvLocalizePtBr],
  ]);

  private static readonly tablatureDownloadRequestObjectSchema: JSONSchemaType<TablatureDownloadRequest> =
    {
      type: 'object',
      properties: {
        initialSpacing: { type: 'integer', minimum: 1 },
        instructions: { type: 'string', transform: ['trim'], minLength: 1 },
        numberOfStrings: { type: 'integer', minimum: 1, maximum: 12 },
        observations: { type: 'string', nullable: true },
        title: { type: 'string', nullable: true },
      },
      required: ['initialSpacing', 'instructions', 'numberOfStrings'],
      additionalProperties: false,
    };

  private static readonly validateTablatureDownloadRequestObject = ajv.compile(
    TablatureDownloadRequestValidator.tablatureDownloadRequestObjectSchema
  );

  public locale: string;
  public validationErrors: DefinedError[];

  public constructor(locale: string) {
    this.locale = locale;
    this.validationErrors = [];
  }

  public isTablatureDownloadRequestObjectValid(
    tablatureDownloadRequestObject: unknown
  ): tablatureDownloadRequestObject is TablatureDownloadRequest {
    if (
      TablatureDownloadRequestValidator.validateTablatureDownloadRequestObject(
        tablatureDownloadRequestObject
      )
    ) {
      return true;
    } else {
      const validationErrors =
        TablatureDownloadRequestValidator.validateTablatureDownloadRequestObject.errors;

      let ajvLocalize = TablatureDownloadRequestValidator.LOCALE_TO_AJV_LOCALIZE_MAP.get(
        this.locale
      );
      if (!ajvLocalize) ajvLocalize = TablatureDownloadRequestValidator.DEFAULT_AJV_LOCALIZE;

      ajvLocalize(validationErrors);

      this.validationErrors = validationErrors as DefinedError[];

      return false;
    }
  }
}
