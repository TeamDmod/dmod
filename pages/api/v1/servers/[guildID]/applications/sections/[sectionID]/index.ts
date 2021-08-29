import guildPermissionsCheck from 'lib/middelware/guildPermissions.middelware';
import rateLimit from 'lib/middelware/rateLimiting';

const allowed = ['PATCH', 'GET'];
export default rateLimit(
  guildPermissionsCheck(async (req, res) => {
    if (!allowed.includes(req.method)) {
      res.setHeader('Allow', allowed);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sectionID } = req.query;
    switch (req.method) {
      case 'GET': {
        const withFields = req.query.withfields === 'true';
        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });
        res.json({
          _id: section._id,
          postition: section.postition,
          title: section.title,
          description: section.description,
          ...(withFields ? { fields: section.fields } : {}),
        });
        break;
      }

      case 'PATCH': {
        // "postition" will be added once applications are ready
        const proprtys = ['title', 'description'];
        const { hasOwnProperty: has } = Object.prototype;
        const body = JSON.parse(req.body);
        if (!proprtys.some(prop => has.call(body, prop)))
          return res.status(400).json({ message: 'Invalid body no property to update', code: 400 });

        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });

        await req.application.updateOne(
          {
            ...(body.title ? { 'sections.$[elm].title': body.title } : {}),
            ...(body.description ? { 'sections.$[elm].description': body.description } : {}),
          },
          { arrayFilters: [{ 'elm._id': sectionID }], new: true }
        );

        res.json({
          section: {
            _id: section._id,
            postition: section.postition,
            title: body.title ?? section.title,
            description: body.description ?? section.description,
          },
        });
        break;
      }

      default: {
        break;
      }
    }
  })
);
