import { createID } from 'lib/backend-utils';
import guildPermissionsCheck from 'lib/middelware/guildPermissions.middelware';
import rateLimit from 'lib/middelware/rateLimiting';
import { ApplicationFieldValidator } from 'lib/validators/applicationFieldValidator';

const allowed = ['PATCH', 'GET'];
export default rateLimit(
  guildPermissionsCheck(async (req, res) => {
    if (!allowed.includes(req.method)) {
      res.setHeader('Allow', allowed);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sectionID, nonce: _nonce } = req.query;
    const nonce = (Array.isArray(_nonce) ? _nonce[0] : _nonce) ?? null;
    if (typeof nonce !== 'string' && nonce !== null)
      return res.status(400).json({ message: 'Invalid nonce', code: 400 });

    switch (req.method) {
      case 'GET': {
        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });

        res.json(section.fields);
        break;
      }

      case 'PATCH': {
        // TODO: add "postition" but validation is required to push the rest of the field positions.
        // as of now it will be added to the bottom. by default / only option
        const propertys = ['title', 'description', 'type', 'length', 'required'];
        const required = ['title', 'description', 'type'];

        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });
        if (section.fields.length >= 60)
          return res.status(400).json({ message: 'Max field reached', code: 400 });

        const body = JSON.parse(req.body);
        const { hasOwnProperty: has } = Object.prototype;

        for (const [name, value] of Object.entries(body)) {
          if (!propertys.includes(name))
            return res.status(400).json({ message: 'Invalid body property found', code: 400 });

          if (!ApplicationFieldValidator[name](value))
            return res.status(400).json({ message: `"${name}" value unexpected`, code: 400 });
        }
        if (!required.every(prop => has.call(body, prop)))
          return res.status(400).json({ message: 'required property missing', code: 400 });

        const fieldID = createID();
        const field = {
          _id: fieldID,
          section_id: sectionID,
          postition: section.fields.length,
          title: body.title,
          description: body.description,
          type: body.type,
          required: body.required ?? false,
          length: [-1, -1],
        };

        await req.application.updateOne(
          { $push: { 'sections.$[elm].fields': field } },
          { arrayFilters: [{ 'elm._id': sectionID }] }
        );

        res.json({ field, nonce });
        break;
      }

      default:
        break;
    }
  })
);
