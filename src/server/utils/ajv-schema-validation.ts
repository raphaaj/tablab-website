import Ajv from 'ajv';
import AjvKeywords from 'ajv-keywords';

const ajv = new Ajv({ allErrors: true, messages: false });
AjvKeywords(ajv);

export default ajv;
