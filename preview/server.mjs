import http from 'node:http';
import { readFile, watch } from 'node:fs';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('.', import.meta.url));
const clients = new Set();
const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    res.write(': connected\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  const file = files[path];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  readFile(directory + file[0], (error, content) => {
    if (error) { res.writeHead(500); res.end('Unable to read preview source'); return; }
    res.writeHead(200, { 'Content-Type': file[1] + '; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(content);
  });
}).listen(3000, '0.0.0.0', () => console.log('Isolated preview serving live source on port 3000'));
let pending;
watch(directory, (_event, file) => {
  if (!['index.html', 'app.js', 'style.css'].includes(file)) return;
  clearTimeout(pending); pending = setTimeout(() => { for (const client of clients) client.write('data: refresh\n\n'); }, 150);
});
