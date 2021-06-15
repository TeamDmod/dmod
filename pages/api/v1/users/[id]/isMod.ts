import Users from '@models/users'; /* i think this correctly requires the users model */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const user = await Users.findOne({ id: req.query.id });
	await res.status(200).json(user); // dont send as "user: {}" but simply {}
	// also status 200 is sent automatically so you dont need to do it.
};
