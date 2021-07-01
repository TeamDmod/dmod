export const user_flags = {
  STAFF: 1 << 0, // 1
  EARLY_SUPPORTER: 1 << 1, // 2
  VERIFYED: 1 << 2, // 4
  TOP_RANKING: 1 << 3, // 8
  ADMIN: 1 << 4, // 16
  SITE_MOD: 1 << 5, // 32
  DEVELOPER: 1 << 6, // 64

  // // FIVE_STAR: 1 << 5, // 32
  // // FOUR_STAR: 1 << 6, // 64
  // // THREE_STAR: 1 << 7, // 128
};

export const DEFAULT_FLAGS = 2;

export function evalFlags(flags: number): { [key: string]: boolean } {
  return Object.keys(user_flags).reduce((all, nameFlag) => {
    return { ...all, [nameFlag]: (flags & user_flags[nameFlag]) === user_flags[nameFlag] };
  }, {});
}

export const user_badges = {
  STAFF: (
    <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.81131 6.15381L5.76904 10.1244L25.9575 30L29.9998 26.0294L9.81131 6.15381Z' fill='#37ADAD' />
      <path d='M15.8964 0L11.9229 3.84688L19.8723 11.5385L23.8459 7.69158L15.8964 0Z' fill='#37ADAD' />
      <path d='M3.97436 11.5386L0 15.6411L7.94872 23.8463L11.9231 19.7437L3.97436 11.5386Z' fill='#37ADAD' />
    </svg>
  ),
  EARLY_SUPPORTER: null,
  ADMIN: null,
  SITE_MOD: null,
  DEVELOPER: null,
  VERIFYED: (
    <svg width='30' height='30' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M39.9419 19.9772L35.512 14.669L36.1292 7.6484L29.5752 6.08828L26.1438 0L19.971 2.77778L13.7981 0L10.3667 6.06925L3.81264 7.61035L4.42992 14.65L0 19.9772L4.42992 25.2854L3.81264 32.3249L10.3667 33.8851L13.7981 39.9543L19.971 37.1575L26.1438 39.9353L29.5752 33.866L36.1292 32.3059L35.512 25.2854L39.9419 19.9772ZM16.5033 28.9574L9.60418 21.7085L12.2912 18.8927L16.5033 23.3258L27.1242 12.1575L29.8112 14.9733L16.5033 28.9574Z'
        fill='#0680C5'
      />
    </svg>
  ),
  TOP_RANKING: (
    <svg width='30' height='30' viewBox='0 0 28 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M16.5001 0.116699C16.5001 0.116699 17.7334 4.53336 17.7334 8.11669C17.7334 11.55 15.4834 14.3334 12.0501 14.3334C8.60008 14.3334 6.00008 11.55 6.00008 8.11669L6.05008 7.5167C2.68341 11.5167 0.666748 16.7001 0.666748 22.3334C0.666748 29.7001 6.63341 35.6667 14.0001 35.6667C21.3667 35.6667 27.3334 29.7001 27.3334 22.3334C27.3334 13.35 23.0167 5.33336 16.5001 0.116699ZM13.5167 30.6667C10.5501 30.6667 8.15008 28.3334 8.15008 25.4334C8.15008 22.7334 9.90008 20.8334 12.8334 20.2334C15.7834 19.6334 18.8334 18.2167 20.5334 15.9334C21.1834 18.0834 21.5167 20.3501 21.5167 22.6667C21.5167 27.0834 17.9334 30.6667 13.5167 30.6667Z'
        fill='url(#paint0_linear)'
      />
      <defs>
        <linearGradient id='paint0_linear' x1='14.0001' y1='0.116699' x2='14.0001' y2='35.6667' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FF0000' />
          <stop offset='1' stopColor='#7513F1' />
        </linearGradient>
      </defs>
    </svg>
  ),

  // SITE_MOD: <></>,
  // DEVELOPER: <></>,
  // EARLY_SUPPORTER: <></>,
  // MOD: <></>,
};

export const PERMIUM_TIER = ['None', 'Tier 1', 'Tier 2', 'Tier 3'];
export const VERIFACTION_LEVEL = ['None', 'Low', 'Medium', 'High', 'Vary High'];

export const DEFAULT_BANNER_COLOR = 'rgb(76,29,149)';

const user_badges_display_name = {
  STAFF: 'Staff',
  VERIFYED: 'Verifed',
  TOP_RANKING: 'Top rank',
};

export function evalBadges(resoloved: { [key: string]: boolean }): [JSX.Element, string][] {
  return Object.entries(resoloved).reduce((past, [key, has]) => (has ? [[user_badges[key], user_badges_display_name[key]]].concat(past) : past), []);
}

export function clsx(...args: string[]) {
  return args.filter(Boolean).join(' ');
}

export type bannerTypes = 'color' | 'img' | 'unknown';

export interface reslovedBanner {
  type: bannerTypes;
  color: string | null;
  image: string | null;
}

export const bannerResloverRegExps = {
  COLOR_RGB: /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,
  COLOR_HEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IMAGE: /^https:\/\/.*\.(gif|png|jpg)$/,
};

/**
 * Resolve the string based banner to an object data form
 * * Color banner: "color:rgb()" or "color:#hex"
 * * Image banner: "img:https:/--"
 */
export function bannerReslover(bannerResolvable: string): reslovedBanner {
  const type = bannerResolvable.slice(0, bannerResolvable.indexOf(':'));
  const data = bannerResolvable.slice(bannerResolvable.indexOf(':') + 1);
  if (!['color', 'img'].includes(type)) return { type: 'unknown', color: null, image: null };

  if (type === 'img') {
    if (bannerResloverRegExps.IMAGE.test(data)) return { type: 'img', color: null, image: data };
    return { type: 'unknown', color: null, image: null };
  }

  if (type === 'color') {
    if (!bannerResloverRegExps.COLOR_HEX.test(data) && !bannerResloverRegExps.COLOR_RGB.test(data)) return { type: 'color', color: DEFAULT_BANNER_COLOR, image: null };
    return { type: 'color', color: data, image: null };
  }

  return { type: 'unknown', color: null, image: null };
}

export function isBannerResolvable(bannerResolvable: string): boolean {
  const type = bannerResolvable.slice(0, bannerResolvable.indexOf(':'));
  const data = bannerResolvable.slice(bannerResolvable.indexOf(':') + 1);
  if (!['color', 'img'].includes(type)) return false;
  if (data.length <= 0) return false;
  if (type === 'img') return bannerResloverRegExps.IMAGE.test(data);
  if (type === 'color') return bannerResloverRegExps.COLOR_HEX.test(data) || bannerResloverRegExps.COLOR_RGB.test(data);
  return false;
}

/**
 * Flatten the object back into a resolvable banner string
 */
export function bannerFlatten(banner: reslovedBanner): string {
  if (banner.type === 'unknown' || !['color', 'img'].includes(banner.type)) return `color:${DEFAULT_BANNER_COLOR}`;
  const color = banner.color == null ? DEFAULT_BANNER_COLOR : banner.color;
  return `${banner.type}:${banner.type === 'img' ? banner.image : color}`;
}

export function NormilizeSearchQ(searchFlat: string): string {
  let search = `q=${searchFlat}`;
  const mu = (str: string) => str.replace(/\s+/g, '%20');

  console.log(searchFlat);

  if (searchFlat.match(/^tags:*/i)) {
    const t = [];
    const [, tags] = search.split('tags:');
    tags.split(',').forEach(tag => t.push(mu(tag).replace(/,/g, '')));
    search = `tags=${t.join(',')}`;
  }

  return search;
}
