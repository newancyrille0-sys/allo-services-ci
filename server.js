const { createServer } = require('https');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('\n🔒 HTTPS Server running at https://localhost:3000');
    console.log('📦 Allo Services CI - Ready!\n');
  });
});
