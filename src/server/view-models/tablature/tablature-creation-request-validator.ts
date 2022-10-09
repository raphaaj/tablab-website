import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import ajv from '@server/utils/ajv-schema-validation';
import { DefinedError, JSONSchemaType } from 'ajv';
import AjvLocalizeEn from 'ajv-i18n/localize/en';
import AjvLocalizePtBr from 'ajv-i18n/localize/pt-BR';
import { Localize } from 'ajv-i18n/localize/types';

export class TablatureCreationRequestValidator {
  private static readonly DEFAULT_AJV_LOCALIZE = AjvLocalizeEn;

  private static readonly LOCALE_TO_AJV_LOCALIZE_MAP: Map<string, Localize> = new Map([
    ['en-US', AjvLocalizeEn],
    ['pt-BR', AjvLocalizePtBr],
  ]);

  private static readonly tablatureCreationRequestObjectSchema: JSONSchemaType<TablatureCreationRequest> =
    {
      type: 'object',
      properties: {
        initialSpacing: { type: 'integer', minimum: 1 },
        instructions: { type: 'string', transform: ['trim'], minLength: 1 },
        numberOfStrings: { type: 'integer', minimum: 1, maximum: 12 },
        observations: { type: 'string', nullable: true },
        rowsLength: { type: 'integer', minimum: 15, maximum: 500 },
        title: { type: 'string', nullable: true },
      },
      required: ['initialSpacing', 'instructions', 'numberOfStrings', 'rowsLength'],
      additionalProperties: false,
    };

  private static readonly validateTablaturaCreationRequestObject = ajv.compile(
    TablatureCreationRequestValidator.tablatureCreationRequestObjectSchema
  );

  public locale: string;
  public validationErrors: DefinedError[];

  public constructor(locale: string) {
    this.locale = locale;
    this.validationErrors = [];
  }

  public isTablatureCreationRequestObjectValid(
    tablatureCreationRequestObject: unknown
  ): tablatureCreationRequestObject is TablatureCreationRequest {
    if (
      TablatureCreationRequestValidator.validateTablaturaCreationRequestObject(
        tablatureCreationRequestObject
      )
    ) {
      return true;
    } else {
      const validationErrors =
        TablatureCreationRequestValidator.validateTablaturaCreationRequestObject.errors;

      let ajvLocalize = TablatureCreationRequestValidator.LOCALE_TO_AJV_LOCALIZE_MAP.get(
        this.locale
      );
      if (!ajvLocalize) ajvLocalize = TablatureCreationRequestValidator.DEFAULT_AJV_LOCALIZE;

      ajvLocalize(validationErrors);

      this.validationErrors = validationErrors as DefinedError[];

      return false;
    }
  }
}
