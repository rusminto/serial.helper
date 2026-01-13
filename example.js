const SerialHelper = require('./');

// --- Basic Usage ---

// Configuration for the serial port
const config = {
    port: '/dev/ttyUSB0', // <-- IMPORTANT: Change this to your actual serial port
    baud: 9600,
    autoopen: true,
    debug: true,
};

// Create a new instance of the helper
const serial = new SerialHelper(config);

// --- Event Handling ---

// 'open' event is fired when the port is successfully opened
serial.on('open', (message) => {
    console.log(`Event 'open': ${message}`);
    
    // Now that the port is open, you can write to it
    console.log("Writing 'hello' to the serial port...");
    serial.println('hello'); // Writes 'hello\n'
});

// 'data' event is fired when new data is received from the serial port
// The helper automatically tries to parse it as JSON.
serial.on('data', (data) => {
    console.log("Event 'data':", data);
});

// 'close' event is fired when the port is closed
serial.on('close', (message) => {
    console.log(`Event 'close': ${message}`);
});

// 'error' event is fired when an error occurs
serial.on('error', (error) => {
    console.error("Event 'error':", error);
});


// --- Static Methods ---

// The `list` method can be called directly on the class to find available ports
async function listPorts() {
    console.log('Available serial ports:');
    try {
        const ports = await SerialHelper.list();
        console.log(ports);
    } catch (error) {
        console.error("Error listing ports:", error);
    }
}

// --- Running the Example ---

// List the ports first
listPorts();

// This example will automatically try to connect based on the config above.
// To close the program, press Ctrl+C.
console.log('Serial helper example started. Press Ctrl+C to exit.');

// Example of using the request/response feature after 5 seconds
setTimeout(async () => {
    if (serial.isOpen) {
        console.log("Sending request 'battery\n' and waiting for a single response...");
        const response = await serial.request('battery\n');
        console.log("Response received from request:", response);
    }
}, 5000);