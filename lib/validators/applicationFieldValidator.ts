import { FieldTypes } from 'models/guilds';

const ApplicationFieldValidator = {
  postition: input => typeof input === 'number' && input > 0,
  title: input => typeof input === 'string' && input.length > 1,
  description: input => typeof input === 'string',
  length: input => Array.isArray(input) && input.every(l => typeof l === 'number'),
  required: input => typeof input === 'boolean',
  type: input => typeof input === 'number' && FieldTypes[input] !== undefined,
};

export { ApplicationFieldValidator };
