// Importing the built-in http module in Node.js
const http = require('http');

// Creating an HTTP server for the load balancer
const server = http.createServer((req, res) => {
    // Array of application servers
    const servers = [
        'http://localhost:4000',
        'http://localhost:4001',
        'http://localhost:4002',
        'http://localhost:4003',
    ];

    // Set to keep track of overloaded servers
    const overloadedServers = new Set();

    // Function to check server health
    function checkServerHealth(server) {
        const req = http.get(`${server}/heartbeat`, (res) => {
            if (res.statusCode === 200) {
                overloadedServers.delete(server);
                console.log(`Server ${server} is no longer overloaded`);
            }
        });

        req.on('error', () => {
            overloadedServers.add(server);
        });

        req.end();
    }

    // Function to handle load balancing
    function handleLoadBalancing() {
        const availableServers = servers.filter((server) => !overloadedServers.has(server));
        const server = availableServers.shift(); // Round-robin selection

        // Check server health before forwarding the request
        checkServerHealth(server);

        // Making a request to the selected server
        const req = http.get(`${server}${req.url}`, (response) => {
            res.writeHead(response.statusCode, response.headers);
            response.pipe(res, { end: true });
        });

        // Handling errors
        req.on('error', () => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });

        // Ending the request
        req.end();
    }

    // Handling load balancing
    handleLoadBalancing();
});

// Start the load balancer on port 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Load balancer is running on port ${port}`);
});