import type { NextApiRequest, NextApiResponse } from 'next'
var Users = require("../../../../models/users.ts"); /*i think this correctly requires the users model*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
 const user = await Users.findOne({id: req.params.id});
	 await res.json(user); //dont send as "user: {}" but simply {}
	 //also status 200 is sent automatically so you dont need to do it.
}