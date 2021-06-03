import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { Session } from 'next-iron-session';

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

export type sessionFetchedUser = ApiUser | null;
