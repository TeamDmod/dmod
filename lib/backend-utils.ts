import crypto from 'crypto-js';
import { RawGuild, RawGuildMember } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export async function hasBetaAccess(id: string): Promise<boolean> {
  const DMOD_SERVER_ID = '791278367960858635';
  const ACCESS_GRANT_ROLES = ['867846891185242152', '867846891185242152', '801746227712622593'];

  const Member = await fetch(`${API_ENDPOINT}/guilds/${DMOD_SERVER_ID}/members/${id}`, { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } });
  // eslint-disable-next-line no-new
  if (Member.headers.get('x-ratelimit-remaining') === '0') {
    return new Promise(reslove =>
      setTimeout(async () => {
        reslove(await hasBetaAccess(id));
      }, 2000)
    );
  }
  const member: RawGuildMember = await Member.json();
  // @ts-expect-error
  if (member.code || member.message) return false;
  const filtered = member.roles.filter(r => ACCESS_GRANT_ROLES.includes(r));

  return filtered.length > 0;
}

export interface Embed {
  fields?: field[];
  color?: number;
  description?: string;
  title?: string;
}

export interface field {
  name: string;
  value: string;
}

export function sendToWebhook(embed: Embed) {
  const body = {
    embeds: [
      {
        color: parseInt('#ec2f2f'.replace('#', ''), 16),
        ...embed,
      },
    ],
  };

  return fetch(`${API_ENDPOINT}/webhooks/${process.env.HOOKID}/${process.env.HOOK_KEY}?wait=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(json);
}

export function decryptToken(token: string, string: boolean = false) {
  const decript = crypto.AES.decrypt(token, process.env.ENCRYPT_KEY);
  return string ? decript.toString(crypto.enc.Utf8) : decript;
}

export function isSnowflake(str: string) {
  return !Number.isNaN(+str) && str.length >= 16 && /^([0-9]*)$/.test(str);
}

/**
 * https://discord.com/developers/docs/topics/permissions
 */
export const discord_permission_flags = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,
  ADD_REACTIONS: 1 << 6,
  VIEW_AUDIT_LOG: 1 << 7,
  PRIORITY_SPEAKER: 1 << 8,
  STREAM: 1 << 9,
  VIEW_CHANNEL: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  SEND_TTS_MESSAGES: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  USE_EXTERNAL_EMOJIS: 1 << 18,
  VIEW_GUILD_INSIGHTS: 1 << 19,
  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,
  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES: 1 << 28,
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS: 1 << 30,
  USE_APPLICATION_COMMANDS: 1 << 31,
  REQUEST_TO_SPEAK: 1 << 32,
};

const ALL = Object.values(discord_permission_flags).reduce((all, p) => all | p, 0);

/**
 * https://discord.com/developers/docs/topics/permissions
 */
export function resolveGuildMemberPerms(guild: RawGuild, member: RawGuildMember): number {
  if (guild.owner_id === member.user?.id) return ALL;

  const role_everyone = guild.roles.find(role => role.name === '@everyone');
  let permissions = Number(role_everyone.permissions);

  const getRole = (id: string) => guild.roles.find(role => role.id === id);

  for (const id of member.roles) {
    const role = getRole(id);
    permissions |= Number(role.permissions);
  }

  if ((permissions & discord_permission_flags.ADMINISTRATOR) === discord_permission_flags.ADMINISTRATOR) return ALL;

  return permissions;
}
