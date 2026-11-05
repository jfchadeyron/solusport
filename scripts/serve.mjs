import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../',import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const port = Number(process.env.PORT || 4173);
createServer(async(req,res)=>{
  try {
    let requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/solusport(?=\/|$)/,'') || '/';
    if(requested.endsWith('/')) requested+='index.html';
    const location=path.resolve(root,'.'+requested);
    const relative=path.relative(root,location);
    if(relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p=>p.startsWith('.')) || !mime[path.extname(location)]) {res.writeHead(403);res.end('Forbidden');return;}
    if(!(await stat(location)).isFile()) throw new Error('not found');
    res.writeHead(200,{'Content-Type':mime[path.extname(location)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(location));
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}
}).listen(port,'127.0.0.1',()=>console.log(`SoluSport preview: http://127.0.0.1:${port}/solusport/`));
