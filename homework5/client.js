// Importing the built-in http module in Node.js
const http = require('http');

// Getting load balancer address from command line argument
const loadBalancerAddress = process.argv[2];

// Function to simulate client requests
function sendRequests() {
    setInterval(() => {
        // Making a request to the load balancer's /index endpoint
        const req = http.get(`${loadBalancerAddress}/index`, (res) => {
            console.log(`Response: ${res.statusCode}`);
        });

        // Handling errors
        req.on('error', (error) => {
            console.error('Error:', error.message);
        });

        // Ending the request
        req.end();
    }, Math.random() * 1000); // Random rate between 0 and 1 request per second
}

// Start sending requests
sendRequests();