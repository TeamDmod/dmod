export const DESCRIPTION_MAX_DATA = { PREMIUM: 4000, NORMAL: 2000 };
export const SHORT_DESCRIPTION_MAX_DATA = { PREMIUM: 200, NORMAL: 100 };

export const SHORT_DESCRIPTION_MIN = 20;
export const DESCRIPTION_MIN = 80;

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

const passes = Object.create(null);
const pass = ['recruiting', 'look_types', 'tags', 'applyed', 'view', 'completed'];

pass.forEach(value => {
  passes[value] = () => {
    return { error: false };
  };
});

const validators = {
  ...passes,
  description({ value }) {
    if (value.length >= DESCRIPTION_MIN && value.length <= DESCRIPTION_MAX_DATA.NORMAL) return { error: false };

    const lengthError = value.length < DESCRIPTION_MIN ? 'to short' : value.length > DESCRIPTION_MAX_DATA.NORMAL ? 'to long' : 'unknow (failed to read proper length)';
    return {
      error: true,
      message: `Description length ${lengthError}`,
    };
  },
  short_description({ value }) {
    if (value.length >= SHORT_DESCRIPTION_MIN && value.length <= SHORT_DESCRIPTION_MAX_DATA.NORMAL) return { error: false };

    const lengthError = value.length < SHORT_DESCRIPTION_MIN ? 'to short' : value.length > SHORT_DESCRIPTION_MAX_DATA.NORMAL ? 'to long' : 'unknow (failed to read proper length)';
    return {
      error: true,
      message: `Short description length ${lengthError}`,
    };
  },
  async invite({ value, guildID }) {
    if (!/[a-zA-Z0-9\\-]{2,32}/.test(value)) return { error: true, message: 'Invalid invite dosent fit regex' };

    const data = await fetch(`${API_ENDPOINT}/invites/${value}?with_expiration=true&with_expiration=true`).then(json);

    if (data.message || (data.code && data.code === 10006)) return { error: true, message: 'Invalid invite code' };
    if (data.guild.id !== guildID) return { error: true, message: 'Invalid invite, invite is not form this guild' };
    // TODO: Figuer out a way to get the alowed max user count for a server.
    // if (!data.max_uses) return { error: true, message: 'Failed to fetch max users count' };

    const _expiresTimestamp = 'expires_at' in data ? new Date(data.expires_at).getTime() : null;
    const expiresTimestamp = _expiresTimestamp ?? (data.createdTimestamp && data.max_age ? this.createdTimestamp + this.max_age * 1000 : null);

    if (expiresTimestamp == null && expiresTimestamp !== 0) return { error: true, message: 'Falied to fetch expreation date' };
    if (expiresTimestamp !== 0 && data.max_uses !== 0) return { error: true, message: 'Invalid invite durations' };

    return { error: false };
  },
};

type ItypeValidator = { [key: string]: (input: any) => boolean };

// TODO: move to validotor to check length and use premium
const typeValidators: ItypeValidator = {
  description: input => typeof input === 'string',
  short_description: input => typeof input === 'string',
  recruiting: input => typeof input === 'number' && input > -1,
  look_types: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  tags: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  applyed: input => Array.isArray(input) && input.every(i => typeof i === 'string'),
  view: input => typeof input === 'boolean',
  completed: input => typeof input === 'boolean',
  invite: input => typeof input === 'string',
};

export { typeValidators, validators };
