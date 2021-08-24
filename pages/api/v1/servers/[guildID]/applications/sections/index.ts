import { createID } from 'lib/backend-utils';
import guildPermissionsCheck from 'lib/middelware/guildPermissions.middelware';
import rateLimit from 'lib/middelware/rateLimiting';

const allowed = ['PATCH', 'GET'];
export default rateLimit(
  guildPermissionsCheck(async (req, res) => {
    if (!allowed.includes(req.method)) {
      res.setHeader('Allow', allowed);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    switch (req.method) {
      case 'GET': {
        const withFields = req.query.withfields === 'true';
        const flat = req.application.sections.map(section => {
          return {
            _id: section._id,
            postition: section.postition,
            title: section.title,
            description: section.description,
            ...(withFields ? { fields: section.fields } : {}),
          };
        });

        res.json(flat);
        break;
      }

      case 'PATCH': {
        const body = JSON.parse(req.body);
        const { hasOwnProperty: has } = Object.prototype;
        if (!has.call(body, 'title')) return res.status(400).json({ message: 'Invalid body', code: 400 });

        if (typeof body.title !== 'string')
          return res.status(400).json({ message: 'Invalid proporty type', code: 400 });

        console.log(body);

        if (body.title.length <= 0)
          return res.status(400).json({ message: 'Invalid proporty length', code: 400 });

        if (req.application.sections.length >= 1)
          return res.json({ message: 'Currenlty only allowed 1 section as under development', code: 200 });

        const sectionID = createID();
        const section = {
          _id: sectionID,
          postition: req.application.sections.length,
          title: body.title,
          description: body.description ?? '',
          fields: [],
        };
        await req.application.updateOne({ $push: { sections: section } });
        res.json(section);
        break;
      }

      default:
        break;
    }
  })
);
