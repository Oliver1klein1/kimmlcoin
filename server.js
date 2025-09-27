const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Incoming request: ${req.url}`);
    
    // Default to index.html
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Remove any query parameters
    filePath = filePath.split('?')[0];

    console.log(`Attempting to serve: ${filePath}`);

    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set content type based on file extension
    switch (extname) {
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                console.log('File not found:', filePath);
                // List available files
                fs.readdir('.', (err, files) => {
                    if (!err) {
                        console.log('Available files:', files);
                    }
                });
                res.writeHead(404);
                res.end(`File not found: ${filePath}`);
            } else {
                console.log('Server error:', error);
                res.writeHead(500);
                res.end(`Server error: ${error.code}`);
            }
        } else {
            console.log(`Successfully serving ${filePath} as ${contentType}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 5000;
server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Current directory: ${process.cwd()}`);
    // List files in current directory
    fs.readdir('.', (err, files) => {
        if (err) {
            console.log('Error reading directory:', err);
        } else {
            console.log('Files in current directory:', files);
        }
    });
});