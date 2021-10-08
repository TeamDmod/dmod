import list from 'lib/data/blackListwords.json';
import type { userData } from 'models/users';

import { isBannerResolvable, user_flags } from '../constants';

export interface dataPassed {
  value: any;
  user_premium: number;
  updater?: userData;
  user: userData;
  limited?: string;
}
type validatorFunctions = (
  args: dataPassed
) => Promise<{ error: boolean; message?: string; redis: boolean; redisARGS?: string[] }>;
type Ivalidators = { [key: string]: validatorFunctions };
interface vanityRateLimit {
  id: string;
  time: number;
  inc: number;
}

// const SECONDS_FOR_VANITY_RESET = 20; // test 20 seconds
const SECONDS_FOR_VANITY_RESET = 86400; // day
export const DESCRIPTION_MAX_DATA = { PREMIUM: 4000, NORMAL: 2000 };
export const DESCRIPTION_MIN = 30;

const VANITY_ALLOWED = ['_', '.', '\\-'];
const VANITY_FORBIDDEN_REGEXP = new RegExp(`[^${VANITY_ALLOWED}a-z\\d]`, 'g');
const VANITY_ALLOWED_REGEXP = new RegExp(`[${VANITY_ALLOWED}a-z\\d]{3,30}`);
// const VANITY_ALL_CHARACTER = new RegExp(`[${VANITY_ALLOWED}]`, 'g');
const VANITY_ALL_NONE_CHARACTER = new RegExp(`[a-z\\d]`, 'g');
const VANITY_LENGTH_NONE_CHARACTER = 3;

// Note: Removes function repeat
const validatorPasses = Object.create(null);
const byPassedProperties: string[] = ['active', 'pronouns', 'username', 'discriminator', 'avatar'];

byPassedProperties.forEach(value => {
  validatorPasses[value] = () => {
    return { error: false };
  };
});

const validators: Ivalidators = {
  ...validatorPasses,
  description({ value }) {
    const des = value as string;
    const validation = des.length >= DESCRIPTION_MIN && des.length <= DESCRIPTION_MAX_DATA.NORMAL;
    if (validation) {
      return {
        error: false,
      };
    }

    const lengthError =
      des.length < DESCRIPTION_MIN
        ? 'too short'
        : des.length > DESCRIPTION_MAX_DATA.NORMAL
        ? 'too long'
        : 'unknown (failed to get length)';
    return {
      error: true,
      message: `Description length ${lengthError}`,
    };
  },
  banner({ value }) {
    const bannerString = value as string;
    const resolvable = isBannerResolvable(bannerString);

    return {
      error: !resolvable,
      ...(resolvable ? {} : { message: 'Banner structure unresolvable.' }),
    };
  },
  site_flags({ value, user }) {
    const ERROR_MESSAGE = 'Admin user can not be deadmined, by the api nor can they be admined, by the api.';
    // The new flags trying to be updated to.
    const flags = value as number;
    // If the user is currently a admin/dev
    const userIsAdmin = (user.site_flags & user_flags.ADMIN) === user_flags.ADMIN;
    const userIdDev = (user.site_flags & user_flags.DEVELOPER) === user_flags.DEVELOPER;
    // Was admin/dev removed?
    const adminRemoved = (flags & user_flags.ADMIN) !== user_flags.ADMIN;
    const devRemoved = (flags & user_flags.DEVELOPER) !== user_flags.DEVELOPER;

    // Admin check
    if (userIsAdmin && adminRemoved)
      return {
        error: true,
        message: ERROR_MESSAGE,
      };

    // Dev(Admin like) check
    if (userIdDev && devRemoved)
      return {
        error: true,
        message: `${ERROR_MESSAGE} (DEV)`,
      };

    return {
      error: false,
    };
  },
  async vanity({ value, user, limited }) {
    const vanity = value as string;
    const allowedMatch = vanity.match(VANITY_ALLOWED_REGEXP);
    const forbiddenMatch = vanity.match(VANITY_FORBIDDEN_REGEXP);

    if ((forbiddenMatch || []).length > 0) return { error: true, message: 'Forbidden character(s) in value.' };
    if (!allowedMatch?.[0]) return { error: true, message: 'Vanity does not fit regex' };

    const noneCharacters = vanity.match(VANITY_ALL_NONE_CHARACTER) || [];
    if (noneCharacters.length < VANITY_LENGTH_NONE_CHARACTER)
      return { error: true, message: 'Vanity must include minimum of 3 not specially allowed characters' };

    if (
      (list as unknown as { matching: string[] }).matching.some(item => vanity.toLowerCase().includes(item))
    )
      return { error: true, message: 'Vanity contains ban term.' };

    if (
      (list as unknown as { exact: string[] }).exact.some(item => new RegExp(`^${item}$`, 'i').test(vanity))
    )
      return { error: true, message: 'Vanity name ban' };

    if (user.vanity === vanity) return { error: true, message: 'You already have this vanity' };
    const data: any[] = await fetch(`${process.env.BASE_URL}/kei/search_u?vanity=${vanity}`).then(d =>
      d.json()
    );
    if (data.length > 0) return { error: true, message: 'Vanity already taken' };

    if (limited) {
      const limitedData: vanityRateLimit = JSON.parse(limited);
      if (limitedData.inc >= 3) return { error: true, message: "You're changing your vanity too fast" };

      const timestamp =
        SECONDS_FOR_VANITY_RESET -
        (new Date(Date.now()).getSeconds() - new Date(limitedData.time).getSeconds());

      const limitData = {
        id: user._id,
        time: limitedData.time,
        inc: limitedData.inc + 1,
      };

      // Reinitialize the redis timeout to delete this limit, with the correct timestamp/time left
      return {
        error: false,
        redis: true,
        redisARGS: [`limited?type=vanitychange?id=${user._id}`, timestamp, JSON.stringify(limitData)],
      };
    }

    return {
      error: false,
      redis: true,
      redisARGS: [
        `limited?type=vanitychange?id=${user._id}`,
        SECONDS_FOR_VANITY_RESET,
        JSON.stringify({
          id: user._id,
          time: Date.now(),
          inc: 1,
        }),
      ],
    };
  },

  DEFAULT() {
    return {
      error: true,
      message: 'Property validator not found',
    };
  },
};

type ItypeValidators = { [key: string]: (...args1: any[]) => boolean };
// type ratingPropertyField = [string, (item: any) => boolean];

const typeValidators: ItypeValidators = {
  description: (text: string) => typeof text === 'string',
  active: (active: boolean) => typeof active === 'boolean',
  banner: (text: string) => typeof text === 'string',
  pronouns: (text: string) => typeof text === 'string',
  vanity: (text: string) => typeof text === 'string',
  site_flags: (flags: number) => typeof flags === 'number',
  // ratings: (ratings: ratingData[]) => {
  //   const isArray = Array.isArray(ratings);
  //   if (!isArray) return true;
  //   const properties: ratingPropertyField[] = [
  //     ['_id', input => typeof input === 'string'],
  //     ['createdAt', input => Object.prototype.toString.call(input) === '[object Date]'],
  //     ['comment', input => typeof input === 'string'],
  //     ['rating', input => typeof input === 'number'],
  //   ];

  //   const AllRatingData = ratings.every(rating => Object.entries(rating).every(([key, value]) => properties.find(prop => prop[0] === key)[1](value)));
  //   return isArray && AllRatingData;
  // },
  username: (text: string) => typeof text === 'string',
  discriminator: (text: string) => typeof text === 'string',
  avatar: (text: string) => typeof text === 'string',
};

export { validators, typeValidators };
