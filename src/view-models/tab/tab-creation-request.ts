import ajv from '@utils/ajv-schema-validation';
import { JSONSchemaType } from 'ajv';

export type TabCreationRequest = {
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations?: string | null;
  tabBlockLength: number;
  title?: string | null;
};

const tabCreationRequestSchema: JSONSchemaType<TabCreationRequest> = {
  type: 'object',
  properties: {
    initialSpacing: { type: 'integer', minimum: 1 },
    instructions: { type: 'string', transform: ['trim'], minLength: 1 },
    numberOfStrings: { type: 'integer', minimum: 1, maximum: 12 },
    observations: { type: 'string', nullable: true },
    tabBlockLength: { type: 'integer', minimum: 15, maximum: 500 },
    title: { type: 'string', nullable: true },
  },
  required: ['initialSpacing', 'instructions', 'numberOfStrings', 'tabBlockLength'],
  additionalProperties: false,
};

export const validateTabCreationObject = ajv.compile(tabCreationRequestSchema);
