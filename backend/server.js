const express = require('express');
const ping = require('ping');
const db = require('./db');

const app = express();
let monitoringResults = [];

// Enable CORS for frontend requests
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
});

app.use(express.json());

async function getDevices() {

   const [rows] = await db.query('SELECT * FROM devices');

   return rows;
}

async function monitorDevices() {

   const devices = await getDevices();

   const results = [];

   for (const device of devices) {

      const pingResult = await ping.promise.probe(device.ip);

      results.push({
         name: device.name,
         ip: device.ip,
         alive: pingResult.alive,
         time: pingResult.time
      });
   }

   monitoringResults = results;

   console.log('Monitoring updated');
}

async function testDatabase() {

   const [rows] = await db.query('SELECT NOW() as time');

   console.log(rows);
}

testDatabase();

monitorDevices();

setInterval(() => {
   monitorDevices();
}, 5000);

app.get('/', (req, res) => {
   res.send('Monitoring Server Running');
});

app.get('/devices', async (req, res) => {

   const devices = await getDevices();
   res.json(devices);

});

app.post('/devices', async (req, res) => {

   const { name, ip } = req.body;

   await db.query(
      'INSERT INTO devices (name, ip) VALUES (?, ?)',
      [name, ip]
   );

   res.json({
      message: 'Device added successfully'
   });

});

app.get('/ping', (req, res) => {

   res.json(monitoringResults);

});

app.listen(3000, () => {
   console.log('Server running on port 3000');
});