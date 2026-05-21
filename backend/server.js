const express = require('express');
const ping = require('ping');
const db = require('./db');

const app = express();
let monitoringResults = [];

// Device metrics tracking
const deviceMetrics = {};

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

function initializeMetrics(deviceIp) {
   if (!deviceMetrics[deviceIp]) {
      deviceMetrics[deviceIp] = {
         latencySamples: [],
         successCount: 0,
         totalChecks: 0,
         consecutiveResponses: 0,
         lastCheckedTime: null
      };
   }
}

function calculateMetrics(deviceIp) {
   const metrics = deviceMetrics[deviceIp];
   if (!metrics || metrics.latencySamples.length === 0) {
      return {
         avgLatency: 0,
         minLatency: 0,
         maxLatency: 0,
         successRate: 0
      };
   }

   const samples = metrics.latencySamples;
   const avgLatency = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
   const minLatency = Math.min(...samples);
   const maxLatency = Math.max(...samples);
   const successRate = metrics.totalChecks > 0 
      ? Math.round((metrics.successCount / metrics.totalChecks) * 100) 
      : 0;

   return { avgLatency, minLatency, maxLatency, successRate };
}

async function monitorDevices() {

   const devices = await getDevices();

   const results = [];

   for (const device of devices) {
      initializeMetrics(device.ip);
      const metrics = deviceMetrics[device.ip];

      try {
         const pingResult = await ping.promise.probe(device.ip);

         // Update metrics
         metrics.totalChecks++;
         metrics.lastCheckedTime = new Date();

         if (pingResult.alive) {
            metrics.successCount++;
            metrics.consecutiveResponses++;
            // Keep only last 100 samples
            if (metrics.latencySamples.length >= 100) {
               metrics.latencySamples.shift();
            }
            metrics.latencySamples.push(pingResult.time);
         } else {
            metrics.consecutiveResponses = 0;
         }

         const calculatedMetrics = calculateMetrics(device.ip);

         results.push({
            name: device.name,
            ip: device.ip,
            type: device.type,
            alive: pingResult.alive,
            time: pingResult.time || 0,
            packetLoss: pingResult.packetLoss || 0,
            ...calculatedMetrics,
            consecutiveResponses: metrics.consecutiveResponses,
            totalChecks: metrics.totalChecks,
            lastCheckedTime: metrics.lastCheckedTime,
            sampleCount: metrics.latencySamples.length,
            latencyHistory: [...metrics.latencySamples],
            successCount: metrics.successCount,
            isMonitoring: true
         });

         console.log(`[${new Date().toLocaleTimeString()}] ✓ ${device.name} (${device.ip}): ${pingResult.alive ? 'ONLINE' : 'OFFLINE'} | Checks: ${metrics.totalChecks} | Success Rate: ${calculatedMetrics.successRate}% | Samples: ${metrics.latencySamples.length}`);
      } catch (err) {
         console.error(`Error pinging ${device.name} (${device.ip}):`, err.message);
         metrics.totalChecks++;
         metrics.lastCheckedTime = new Date();
         metrics.consecutiveResponses = 0;

         const calculatedMetrics = calculateMetrics(device.ip);

         results.push({
            name: device.name,
            ip: device.ip,
            type: device.type,
            alive: false,
            time: 0,
            packetLoss: 100,
            ...calculatedMetrics,
            consecutiveResponses: 0,
            totalChecks: metrics.totalChecks,
            lastCheckedTime: metrics.lastCheckedTime,
            sampleCount: metrics.latencySamples.length,
            latencyHistory: [...metrics.latencySamples],
            successCount: metrics.successCount,
            isMonitoring: true
         });
      }
   }

   monitoringResults = results;

   console.log(`Monitoring updated - ${results.length} device(s) checked\n`);
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

app.get('/debug/metrics', (req, res) => {
   res.json({
      monitoringResults,
      deviceMetrics,
      timestamp: new Date().toLocaleTimeString()
   });
});

app.listen(3000, () => {
   console.log('Server running on port 3000');
});