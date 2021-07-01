export const DESCRIPTION_MAX_DATA = { PREMIUM: 4000, NORMAL: 2000 };
export const SHOR_DESCRIPTION_MAX_DATA = { PREMIUM: 200, NORMAL: 100 };

export const SHOR_DESCRIPTION_MIN = 20;
export const DESCRIPTION_MIN = 80;

type ItypeValidator = { [key: string]: (input: any) => boolean };

// TODO: move to validotor to check length and use premium
const typeValidators: ItypeValidator = {
  description: input => typeof input === 'string' && input.length >= DESCRIPTION_MIN && input.length <= DESCRIPTION_MAX_DATA.NORMAL,
  short_description: input => typeof input === 'string' && input.length >= SHOR_DESCRIPTION_MIN && input.length <= SHOR_DESCRIPTION_MAX_DATA.NORMAL,
  recruiting: input => typeof input === 'number' && input > -1,
  look_types: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  tags: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  applyed: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  view: input => typeof input === 'boolean',
  completed: input => typeof input === 'boolean',
  invite: input => typeof input === 'string',
};

export { typeValidators };
