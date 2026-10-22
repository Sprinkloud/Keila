// Servidor local para probar el sitio como en Vercel: aplica encabezados, cleanUrls, redirects y rewrites de vercel.json.
// Uso: node servidor-local.js y abrir http://localhost:8010/practica/ritmo
const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = __dirname;
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
const patron = s => new RegExp('^' + s.replace(/\./g, '\\.').replace(/:[a-z]+/g, '([^/]+)') + '$');
http.createServer((req, res) => {
  const v = JSON.parse(fs.readFileSync(RAIZ + '/vercel.json', 'utf8'));
  const [crudo, q] = req.url.split('?');
  let p = decodeURIComponent(crudo);
  const r = v.redirects.find(x => patron(x.source).test(p));
  const sinHtml = p.endsWith('.html') && p !== '/index.html';
  if (r || sinHtml) { res.statusCode = 308; res.setHeader('Location', (r ? r.destination : p.slice(0, -5)) + (q ? '?' + q : '')); return res.end(); }
  const w = v.rewrites.find(x => patron(x.source).test(p));
  if (w) p = w.destination;
  if (p.endsWith('/')) p += 'index.html';
  let f = path.join(RAIZ, p);
  if (!path.extname(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!f.startsWith(path.normalize(RAIZ)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('no'); }
  v.headers[0].headers.forEach(h => { if (h.key !== 'Strict-Transport-Security') res.setHeader(h.key, h.value.replace('; upgrade-insecure-requests', '')); });
  res.setHeader('Content-Type', tipos[path.extname(f).toLowerCase()] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(8010, () => console.log('listo en http://localhost:8010'));
