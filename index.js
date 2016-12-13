#!/usr/bin/env node

const express = require('express');
const request = require('request');
const process = require('process');
const program = require('commander');
const path = require('path');

program
  .version('1.0.7')
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
  const url = `${zipkinHost}/api${req.url}`;
  req.pipe(request[req.method.toLowerCase()]({ url, json: req.body })).pipe(res);
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(serverPort, () => {
  console.log(`Listening on port ${serverPort}`);
});