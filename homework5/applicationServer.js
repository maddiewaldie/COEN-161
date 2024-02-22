// Importing the built-in http and url modules in Node.js
const http = require('http');
const url = require('url');

// Creating an HTTP server
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);

    // Variable to track server overload status
    let overloaded = false;

    // Endpoint to check server status
    if (pathname === '/heartbeat') {
        if (overloaded) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server is overloaded');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Server is healthy');
        }
    }

    // Endpoint to handle client requests
    else if (pathname === '/index') {
        if (overloaded) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server is overloaded');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain', 'Date': new Date().toUTCString() });
            res.end('Hello from the server!');
            console.log('Date:', new Date().toUTCString());
        }
    }
});

// Function to periodically check and update server overload status
function checkOverload() {
    setInterval(() => {
        const random = Math.random();
        overloaded = random < 0.1; // 10% chance of being overloaded
        console.log(`Server is ${overloaded ? 'overloaded' : 'not overloaded'}`);
    }, 10000); // Every 10 seconds
}

// Start the server on port specified in the command line argument
const port = process.argv[2];
server.listen(port, () => {
    console.log(`Application server is running on port ${port}`);
    checkOverload();
});