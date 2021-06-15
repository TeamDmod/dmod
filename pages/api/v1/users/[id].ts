import Users from "@models/users"; /* i think this correctly requires the users model */
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { id },
		body,
		headers,
		method,
	} = req;

	switch (method) {
		case "GET":
			const user = await Users.findOne({ id: req.query.id });
			await res.status(200).json(user);
			break;

		case "POST":
			// wait a min, why are you going to update data here? lemme make auto sync for you then
			// Create/Update data in database
			break;

		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};
