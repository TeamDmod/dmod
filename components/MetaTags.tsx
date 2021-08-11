import Head from 'next/head';

export default function Metatags({
	title = 'dmod.gg',
	description = 'Innovating the Moderation Community. Moderator & Server Profiles, Built-in Applications for Owners, Moderator Listings, Resources, and so much more!',
	image = '/logo-solid.png',
	color = '#0B172A',
}) {
	return (
		<Head>
			<title>{title}</title>

			<meta name='description' content={description} />
			<meta name='image' content={image} />
			<meta name='theme-color' content={color} />

			<meta name='twitter:card' content='summary' />
			<meta name='twitter:site' content='@dmod.gg' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={image} />

			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content={image} />
		</Head>
	);
}
