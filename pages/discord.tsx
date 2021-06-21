import Head from 'next/head';

const DiscordRedirect = () => {
	return (
		<Head>
			<title>Dmod Discord</title>
			<meta property="og:type" content="website" />
			<meta property="og:title" content="dmod.gg" />
			<meta
				property="og:description"
				content="Innovating the Moderation Community. Moderator & Server Profiles, Built-in Applications for Owners, Moderator Listings, Resources, and so much more!"
			/>
			<meta property="og:image" content="https://dmod.gg/logo.png" />
			<meta name="theme-color" content="#432891" />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:title" content="dmod.gg" />
			<meta
				name="twitter:description"
				content="Innovating the Moderation Community. Moderator & Server Profiles, Built-in Applications for Owners, Moderator Listings, Resources, and so much more!"
			/>
			<meta name="twitter:image" content="https://dmod.gg/logo.png" />
			<meta httpEquiv="refresh" content="0;url=https://discord.com/invite/429zwpugYf" />
		</Head>
	);
};

export default DiscordRedirect;
