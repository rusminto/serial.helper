# serial.helper

A simple promise-based helper/wrapper for the excellent [node-serialport](https://serialport.io/) library. This helper simplifies common use cases like auto-reconnection, request-response patterns, and event handling.

This version has been updated to use `serialport` v12.

## Installation

This helper is not on NPM. To use it, you can clone it and link to it locally.

```bash
# In your main project directory
npm install path/to/serial.helper
```

Or add it to your `package.json`:
```json
"dependencies": {
  "serial.helper": "file:path/to/serial.helper"
}
```

## Usage

```javascript
const SerialHelper = require('serial.helper');

// --- 1. List available ports (optional) ---
async function findPorts() {
    try {
        const ports = await SerialHelper.list();
        console.log('Available ports:', ports);
    } catch (err) {
        console.error('Error listing ports:', err);
    }
}

findPorts();

// --- 2. Configure and Instantiate ---
const config = {
    port: '/dev/ttyUSB0', // Change to your port
    baud: 9600,
    
    // auto-reconnect if the connection is lost (default: true)
    autoreconnect: true, 

    // interval, in milliseconds, between reconnect attempts (default: 3000)
    reconnectInterval: 3000, 

    // open port immediately when creating instance (default: true)
    autoopen: true,

    // show debug messages in the console (default: false)
    debug: true,

    // Optional: configure a parser. Defaults to Readline ('\n').
    parser: {
        type: 'Readline', // or 'InterByteTimeout' or 'ByteLength'
        delimiter: '\r\n'
    }
};

const serial = new SerialHelper(config);

// --- 3. Handle Events ---

serial.on('open', (message) => {
    console.log(message); // "Connected to: /dev/ttyUSB0 [9600bps]"
    
    // Now you can write data
    serial.println('GET_STATUS'); // sends "GET_STATUS\n"
});

serial.on('data', (data) => {
    // `data` is automatically parsed as JSON if possible
    console.log('Data received:', data);
});

serial.on('error', (err) => {
    console.error('An error occurred:', err);
});

serial.on('close', (message) => {
    console.log(message); // "/dev/ttyUSB0 is closed"
});
```
