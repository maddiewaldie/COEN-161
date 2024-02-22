// [5] What is the difference in implementation between a fixed and a sliding window?
    // In a fixed window implementation, the server resets the count of allowed requests at regular intervals,
    // regardless of when the last request was made, while in a sliding window implementation,
    // the server maintains a moving time window that continuously adjusts based on the timing of each request.

// Using built-in http and url modules in Node.js
const http = require('http');
const url = require('url');

// Dictionary to store request counts & timestamps for each IP
const requestCount = {};

// Rate Limiting Constants
const LIMIT = 20;
const WINDOW_SIZE = 10; // in seconds

// Creating an HTTP server using the http module
const server = http.createServer((req, res) => {
    // Parsing the URL to extract pathname and query parameters
    const { pathname, query } = url.parse(req.url, true);

    // To test, I'm gonna have this format:
        // curl http://localhost:3000/?algorithm=fixed
        // curl http://localhost:3000/?algorithm=sliding
    
    // Extracting the IP address from the request headers or connection information
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Determining the rate-limiting algorithm from query parameters or defaulting to 'fixed'
    const algorithm = query.algorithm || 'fixed';

    try {
        // Checking if the request is within the rate limit
        checkRateLimit(ip, algorithm);
        
        // Setting the HTTP status code to 200 (OK)
        res.statusCode = 200;
        
        // Setting the response headers
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        
        // Sending a success response
        res.end(`Hello, ${ip}! Your request is within the rate limit.`);
    } catch (error) {
        // Setting the HTTP status code to 429 (Too Many Requests)
        res.statusCode = 429;
        
        // Setting the response headers
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        
        // Sending a rate limit exceeded response
        res.end('Rate limit exceeded');
    }
});

// Check if a request is within the rate limit based on the specified algorithm
function checkRateLimit(ip, algorithm) {
    // Getting the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Checking if there is no record for the current IP
    if (!requestCount[ip]) {
        // Creating a new record with a count of 1 and the current timestamp
        requestCount[ip] = { count: 1, timestamp: currentTime };
    } else {
        // Checking the rate-limiting algorithm specified
        if (algorithm === 'fixed') {
            // Resetting count if the window has passed
            if (currentTime - requestCount[ip].timestamp > WINDOW_SIZE) {
                requestCount[ip] = { count: 1, timestamp: currentTime };
            } else {
                // Incrementing the count if within the window
                requestCount[ip].count += 1;
            }
        } else if (algorithm === 'sliding') {
            // Removing timestamps that are outside the current window
            while (requestCount[ip].timestamp && currentTime - requestCount[ip].timestamp > WINDOW_SIZE) {
                requestCount[ip].timestamp += 1;
                requestCount[ip].count -= 1;
            }

            // Checking if the count is within the limit
            if (requestCount[ip].count < LIMIT) {
                // Incrementing the count and updating the timestamp if within the limit
                requestCount[ip].count += 1;
                requestCount[ip].timestamp = currentTime;
            } else {
                // Throwing an error if exceeding the limit
                throw new Error('Rate limit exceeded');
            }
        }
    }
}

// Setting the port for the server to run, using the specified port or defaulting to 3000
const port = process.env.PORT || 3000;

// Starting the server and logging the port information
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
