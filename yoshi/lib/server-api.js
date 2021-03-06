'use strict';

const express = require('express');
const projectConfig = require('../config/project');
const https = require('https');
const fs = require('fs');
const path = require('path');

function sslCredentials(keyPath, certificatePath, passphrase) {
  const privateKey = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
  const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath), 'utf8');

  return {
    key: privateKey,
    cert: certificate,
    passphrase
  };
}

function corsMiddleware() {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  };
}

function start({middlewares = [], host}) {
  const port = projectConfig.servers.cdn.port();
  const ssl = projectConfig.servers.cdn.ssl();
  const files = projectConfig.clientFilesPath();
  const app = express();

  [corsMiddleware(), express.static(files), ...middlewares]
    .forEach(mw => app.use(mw));

  return new Promise((resolve, reject) => {
    const serverFactory = ssl ? httpsServer(app) : app;
    const server = serverFactory.listen(port, host, err =>
      err ? reject(err) : resolve(server));
  });
}

function httpsServer(app) {
  const credentials = sslCredentials('../config/key.pem', '../config/cert.pem', '1234');
  return https.createServer(credentials, app);
}

module.exports = {start};
