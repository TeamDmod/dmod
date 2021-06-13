import type { NextApiRequest, NextApiResponse } from 'next'
const path = require("path");
var Users = require("../../../../models/users.ts"); /*i think this correctly requires the users model*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
 const user = await Users.findOne({id: req.params.id});
	res.status(200).json(user); //dont send as "user: {}" but simply {}
}