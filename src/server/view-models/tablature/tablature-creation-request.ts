import { TablatureCreationRequest } from '@common/view-models/tablature/tablature-creation-request';
import { JSONSchemaType } from 'ajv';
import ajv from '@server/utils/ajv-schema-validation';

const tablatureCreationRequestSchema: JSONSchemaType<TablatureCreationRequest> = {
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

export const validateTablatureCreationObject = ajv.compile(tablatureCreationRequestSchema);
