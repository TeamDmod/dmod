// @ts-check

const { createServer } = require('http');
const next = require('next').default;
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT) || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // const time = new Date('Sat Aug 7 2021 12:00:00 GMT-0500 (Central Daylight Time)').getTime() < new Date().getTime();
    // const { pathname } = parsedUrl;

    // if (pathname.startsWith('/api')) {
    //   return app.render404(req, res, parsedUrl);
    // }

    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err;
  });
});
