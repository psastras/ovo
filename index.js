#!/usr/bin/env node

const express = require('express');
const request = require('request');
const process = require('process');
const program = require('commander');

program
  .version('1.0.5')
  .option('-p, --port <port>', 'Port number (navigate to localhost:port to view the web page)')
  .option('-h, --host <host>', 'Zipkin host (default is http://localhost:9411)')
  .parse(process.argv);


const zipkinHost = program.host || 'http://localhost:9411';
const serverPort = program.port || 8080;

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ' + err);
});

const app = express();

// proxies api requests to zipkin
app.use('/api/', (req, res) => {
  const url = `${zipkinHost}${req.url}`;
  req.pipe(request[req.method.toLowerCase()]({ url, json: req.body })).pipe(res);
});


app.use(express.static('dist'));

app.listen(serverPort, () => {
  console.log(`Listening on port ${serverPort}`);
});