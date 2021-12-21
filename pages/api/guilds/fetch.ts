import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const endpoint = 'https://discord.com/api/users/@me/guilds';

// GET users/sync - sync user data with Discord
export default async (req: NextApiRequest, res: NextApiResponse) => {
	// Get session
	const session = await getSession({ req });

	// Check if user is logged in
	if (!session) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	// Get access token for the session from the database
	const { access_token } = await prisma.account.findFirst({
		where: {
			userId: session.user.id,
		},
		select: {
			access_token: true,
		},
	});

	// Get guilds from Discord
	const discord_guilds = await fetch(endpoint, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	}).then((r) => r.json());

	// Get guilds from the database
	const db_guilds = await prisma.guild.findMany({
		where: {
			members: {
				some: {
					userId: session.user.id,
				},
			}
		},
		select: {
			id: true,
			name: true,
			icon: true,
		},
	});

	// Filter discord guilds where the user does not have MANAGE_GUILD permissions
	const filtered_guilds = discord_guilds.filter((guild) => {
		return (guild.permissions & (1 << 5)) === 1 << 5 ? guild : false;
	});

	// Get Discord guilds that are in the database
	const included = filtered_guilds.filter((guild) => {
		return db_guilds.find((db_guild) => {
			return db_guild.id === guild.id;
		});
	});

	// Get Discord guilds that are not in the database
	const excluded = filtered_guilds.filter((guild) => {
		return !included.find((included_guild) => {
			return included_guild.id === guild.id;
		});
	});

	// Return guilds
	res.status(200).json({ included, excluded });
};