const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Get port from command line arguments or use default
const args = process.argv.slice(2);
let PORT = 8000;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    PORT = parseInt(args[i + 1], 10);
    break;
  }
}

const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Get raw URL path (before parsing, to preserve encoding)
  const rawUrl = req.url.split('?')[0]; // Remove query string
  let filePath = rawUrl;
  
  // Remove leading slash
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }
  
  // If empty, serve index.html
  if (filePath === '' || filePath === '/') {
    filePath = 'index.html';
  }
  
  // Try both encoded and decoded paths
  // Files might be stored with either encoded or decoded names
  let fullPath = path.join(DIST_DIR, filePath);
  
  // First try the path as-is (encoded)
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // If encoded path doesn't exist, try decoded path
      try {
        const decodedPath = decodeURIComponent(filePath);
        const decodedFullPath = path.join(DIST_DIR, decodedPath);
        fs.access(decodedFullPath, fs.constants.F_OK, (decodedErr) => {
          if (decodedErr) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('404 - File not found');
            return;
          }
          serveFile(decodedFullPath, res);
        });
      } catch (e) {
        // If decoding fails, return 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('404 - File not found');
      }
      return;
    }
    serveFile(fullPath, res);
  });
  
  function serveFile(fullPath, res) {
    
    // Read and serve file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('500 - Internal Server Error');
        return;
      }
      
      const ext = path.extname(fullPath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
      res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

