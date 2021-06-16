import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { Session } from 'next-iron-session';

import { GuildData } from '../models/guilds';
import { RawEmoji, RawRole, RawUser } from './discord.object.typings';

export interface withSessionRequest extends NextApiRequest {
  session: Session;
}

export type withSessionGetServerSideProps = GetServerSidePropsContext & { req: { session: Session } };
export interface ApiUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  vanity: string;
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-structure
 */
export interface RawGuild {
  id: string;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region: string;
  afk_channel_id: string | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string | null;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: RawRole[];
  emojis: RawEmoji[];
  features: string[];
  mfa_level: number;
  application_id: string | null;
  system_channel_id: string | null;
  system_channel_flags: number;
  rules_channel_id: string | null;
  joined_at?: string;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  voice_states?: any[];
  members?: RawGuildMember[];
  channels?: any[];
  threads?: any[];
  presences?: any[];
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: string | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: any;
  nsfw_level: number;
  stage_instances?: number;
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-member-object
 */
export interface RawGuildMember {
  user?: RawUser;
  nick?: string | null;
  roles: string[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  pending: boolean;
  permissions?: string;
}

export interface RawUserGivenGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export type RawUserGuildIs = RawUserGivenGuild & GuildData;

export type sessionFetchedUser = ApiUser | null;
