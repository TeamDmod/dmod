/**
 * https://discord.com/developers/docs/topics/permissions#role-object
 */
export interface RawRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tag?: {
    bot_id?: string;
    integration_id: string;
    premium_subscriber: null;
  };
}

/**
 * https://discord.com/developers/docs/resources/user#user-object
 */
export interface RawUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verifyed?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: 0 | 1 | 2;
  public_flags?: number;
}

/**
 * https://discord.com/developers/docs/resources/emoji#emoji-object
 */
export interface RawEmoji {
  id: string;
  name: string;
  roles?: string[];
  user?: RawUser;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}
