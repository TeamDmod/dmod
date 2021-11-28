export {};
// TODO: rewrite search API

// import connectToDatabase from 'lib/mongodb.connection';
// import rateLimit from 'lib/rateLimiting';
// import redis from 'lib/redis';
// import GuildModule from 'models/guilds';
// import PreviewGuildModule, { PreviewGuildData } from 'models/preview_guilds';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const MAX_RETURN = 20;

// export default rateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== 'GET') {
//     res.setHeader('Allow', 'GET');
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
//   await connectToDatabase();

//   if (req.query.id && typeof req.query.id === 'string') {
//     const guild = await GuildModule.findOne({ _id: req.query.id as string });
//     if (guild && guild.completed) {
//       const banner = await redis.get(`guild:${req.query.id}:banner`);
//       const icon = await redis.get(`guild:${req.query.id}:icon`);
//       return res.json({
//         ...Object.fromEntries(
//           Object.entries(guild.toObject()).filter(d => !['applyed', 'sections', '_access_key'].includes(d[0]))
//         ),
//         banner,
//         icon,
//       });
//     }
//     return res.json({ code: 404, message: 'Guild not found' });
//   }
//   if (
//     req.query.max &&
//     typeof req.query.max !== 'string' &&
//     !Number.isNaN(+req.query.max) &&
//     +req.query.max > MAX_RETURN
//   )
//     return res.json({ code: 400, message: '"max" must be a valid number' });
//   if (req.query.q && typeof req.query.q !== 'string')
//     return res.json({ code: 400, message: '"q" must be string' });
//   if (req.query.all && !['true', 'false'].includes(req.query.all as string))
//     return res.json({ code: 400, message: '"all" invalid' });
//   const all = Boolean(req.query.all === 'true');

//   const str = req.query.q
//     ? decodeURIComponent(req.query.q as string).replace(/[^0-9a-zA-Z=\-_%'":; ]*/g, '')
//     : null;
//   const searchReg = str ? new RegExp(str, 'i') : null;
//   const st = Boolean(str && (req.query.q as string));

//   if ((str || '__').length <= 0 && !all) return res.json({ code: 400, message: 'Invalid "q"' });
//   if (!st && !all) return res.json({ code: 400, message: 'Invalid "q"' });

//   const guilds = await PreviewGuildModule.find({
//     // eslint-disable-next-line no-nested-ternary
//     ...(req.query.tags
//       ? {
//           tags: {
//             $in:
//               typeof req.query.tags === 'string'
//                 ? [req.query.tags]
//                 : Array.isArray(req.query.tags)
//                 ? req.query.tags
//                 : [],
//           },
//         }
//       : {}),
//     ...(req.query.look_types
//       ? // eslint-disable-next-line no-nested-ternary
//         {
//           look_types: {
//             $in:
//               typeof req.query.look_types === 'string'
//                 ? [req.query.look_types]
//                 : Array.isArray(req.query.look_types)
//                 ? req.query.look_types
//                 : [],
//           },
//         }
//       : {}),
//     ...(req.query.q && st && !all ? { name: { $regex: searchReg } } : {}),
//     completed: true,
//   }).limit(+req.query.max ?? MAX_RETURN);

//   const results = await guilds.reduce(async (past, current) => {
//     const reslove = await past;
//     if (!Array.isArray(reslove)) {
//       console.warn(
//         'Erroring "past" is not an array.',
//         past,
//         'attempted await resolve (ts suggested)',
//         reslove
//       );
//       return past;
//     }

//     return reslove.concat({
//       ...current.toObject(),
//       banner: await redis.get(`guild:${current._id}:banner`),
//       icon: await redis.get(`guild:${current._id}:icon`),
//     });
//   }, [] as unknown as Promise<(PreviewGuildData & { banner: string; icon: string })[]>);

//   res.json(results);
// });
