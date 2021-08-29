import guildPermissionsCheck from 'lib/middelware/guildPermissions.middelware';
import rateLimit from 'lib/middelware/rateLimiting';
import { ApplicationFieldValidator } from 'lib/validators/applicationFieldValidator';

const allowed = ['PATCH', 'GET', 'DELETE'];
export default rateLimit(
  guildPermissionsCheck(async (req, res) => {
    if (!allowed.includes(req.method)) {
      res.setHeader('Allow', allowed);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sectionID, fieldID } = req.query;

    switch (req.method) {
      case 'GET': {
        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });
        const field = section.fields.find(f => f._id === fieldID);
        if (!field) return res.status(404).json({ message: 'Field not found', code: 404 });

        res.json(field);
        break;
      }

      case 'DELETE': {
        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });
        const field = section.fields.find(f => f._id === fieldID);
        if (!field) return res.status(404).json({ message: 'Field not found', code: 404 });

        await req.application.updateOne(
          { $pull: { 'sections.$[elm].fields': { _id: fieldID } } },
          { arrayFilters: [{ 'elm._id': sectionID }] }
        );

        res.json({ field });
        break;
      }

      case 'PATCH': {
        // TODO: add "postition" but validation is required to push the rest of the field positions.
        // as of now it will be added to the bottom. by default / only option
        const propertys = ['title', 'description', 'type', 'length', 'required'];
        const section = req.application.sections.find(s => s._id === sectionID);
        if (!section) return res.status(404).json({ message: 'Section not found', code: 404 });
        const field = section.fields.find(f => f._id === fieldID);
        if (!field) return res.status(404).json({ message: 'Field not found', code: 404 });

        const body = JSON.parse(req.body);
        if (Object.keys(body).length <= 0)
          return res.status(400).json({ message: 'Nothing to update', code: 400 });

        for (const [name, value] of Object.entries(body)) {
          if (!propertys.includes(name))
            return res.status(400).json({ message: 'Invalid body property found', code: 400 });

          const validators = ApplicationFieldValidator[name];
          if (validators) {
            if (!validators(value))
              return res.status(400).json({ message: `"${name}" value unexpected`, code: 400 });
          } else {
            return res.status(400).json({ message: `"${name}" validator not found`, code: 400 });
          }
        }

        const newField = {
          ...field,
          ...Object.fromEntries(Object.entries(body)),
        };

        await req.application.updateOne(
          { 'sections.$[elm].fields.$[element]': newField },
          { arrayFilters: [{ 'elm._id': sectionID }, { 'element._id': fieldID }] }
        );

        res.json({ field: newField });
        break;
      }

      default:
        break;
    }
  })
);
