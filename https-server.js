const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load certificates
const certPath = path.join(__dirname, 'certificates');
const options = {
  key: fs.readFileSync(path.join(certPath, 'key.pem')),
  cert: fs.readFileSync(path.join(certPath, 'cert.pem'))
};

// Create HTTPS server that proxies to Next.js
const server = https.createServer(options, (req, res) => {
  // Proxy to Next.js
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (e) => {
    console.error('Proxy error:', e.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxy);
});

const PORT = 3443;
server.listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
  console.log(`Proxying to Next.js at http://localhost:3000`);
});

// Also create HTTP redirect server
http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  res.writeHead(301, { Location: `https://${host.replace(/:\d+$/, `:${PORT}`)}${req.url}` });
  res.end();
}).listen(3080, () => {
  console.log('HTTP redirect server running on port 3080');
});
