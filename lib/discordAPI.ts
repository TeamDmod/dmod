import type { IncomingHttpHeaders } from 'http';
import https from 'https';

const noop = () => {};
const methods = ['get', 'post', 'delete', 'patch', 'put'];
type options = { query?: any; data?: any };
type methodCall = <T extends Object>(
  ops?: options
) => Promise<{
  body: T;
  raw: string;
  headers: null | { [key in keyof IncomingHttpHeaders]: string };
  status: number;
  statusText: string;
  ok: boolean;
}>;

interface API {
  [key: string]: route;
}
interface APII {
  [key: string]: (...args0: string[]) => route;
}

export type route = API &
  APII & {
    get: methodCall;
    post: methodCall;
    delete: methodCall;
    patch: methodCall;
    put: methodCall;
  };

export default function discordAPI({ v = 8, auth = false, authToken = null, tokenType = 'Bot' } = {}): route {
  let route = [''];
  if (typeof window !== 'undefined')
    throw Error('Oops cant use this in the browser. must be used server sided.');

  const handler: ProxyHandler<any> = {
    get(target, name) {
      if (typeof name !== 'string') return;

      if (methods.includes(name)) {
        return ({ query = '', data }: options = {}) => {
          const q = new URLSearchParams(query).toString();

          return new Promise((resolve, reject) => {
            const response: {
              raw: string;
              body: null | string;
              headers: null | { [key in keyof IncomingHttpHeaders]: string };
              status: number;
              statusText?: string;
              ok?: boolean;
              route: string;
            } = {
              raw: '',
              body: null,
              status: null,
              headers: null,
              route: route.join('/'),
            };

            const options = {
              hostname: 'discord.com',
              path: `/api/v${v}/${route.join('/')}`,
              headers: {} as any,
              method: name,
            };
            route = ['']; // clear the routes to stop route stacking

            if (auth) options.headers.authorization = `${tokenType} ${authToken ?? process.env.CLIENT_TOKEN}`;
            if (data && name === 'post') options.headers['content-type'] = 'application/json';
            if (data && name === 'get') options.path += `?${q}`;

            const request = https.request(options, res => {
              response.status = res.statusCode;
              // @ts-expect-error
              response.headers = res.headers;
              response.ok = res.statusCode >= 200 && res.statusCode < 300;
              response.statusText = res.statusMessage;
              res.on('data', chunk => (response.raw += chunk));

              res.on('end', () => {
                response.body = res.headers['content-type'].includes('application/json')
                  ? JSON.parse(response.raw)
                  : response.raw;
                resolve(response);
              });
            });

            request.on('error', error => reject(error));

            if (data && name === 'post') request.write(JSON.stringify(data));
            request.end();
          });
        };
      }
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      route.push(...args.filter(x => x != null));
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}

/**
 * @warn This should only be used for one time request.
 * Request routes stack.
 */
export const discordAuthApi = discordAPI({ auth: true });
