const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

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
