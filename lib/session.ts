import { Handler, withIronSession } from "next-iron-session";

export default function withSession(handler: Handler) {
	return withIronSession(handler, {
		cookieName: "dmod_gg",
		password: process.env.SECRET_SESSION_PASSCODE,
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	});
}
