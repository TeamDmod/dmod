import crypto from "crypto-js";
import { connectToDatabase } from "lib/mongodb.connection";
import withSession from "lib/session";
import { credentialsData } from "models/credentials";
import { NextApiResponse } from "next";
import { withSessionRequest } from "typings/typings";

export function decryptToken(token: string, string: boolean = false) {
	const decript = crypto.AES.decrypt(token, process.env.ENCRIPT_KEY);
	return string ? decript.toString(crypto.enc.Utf8) : decript;
}
const API_ENDPOINT = "https://discord.com/api/v8";
const json = (res: Response) => res.json();

export default withSession(
	async (req: withSessionRequest, res: NextApiResponse) => {
		const user = req.session.get("user");

		if (!user) return res.json({ user: null });
		const connection = await connectToDatabase();
		const credentialsCollection =
			connection.db.collection<credentialsData>("credentials");

		const results = await credentialsCollection.findOne({ _id: user.id });
		// @ts-expect-error
		const decryptAccessToken = decryptToken(results.AccessToken, true);

		const fetchedUser = await fetch(`${API_ENDPOINT}/users/@me`, {
			headers: {
				Authorization: `Bearer ${decryptAccessToken}`,
			},
		}).then(json);

		return res.json({ user: fetchedUser });
	}
);
