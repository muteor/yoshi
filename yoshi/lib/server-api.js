'use strict';

const express = require('express');
const projectConfig = require('../config/project');
const https = require('https');
const fs = require('fs');
const path = require('path');

function sslCredentials(keyPath, certificatePath, passphrase) {
  keyPath = keyPath || path.join(__dirname, '../config/key.pem');
  certificatePath = certificatePath || path.join(__dirname, '../config/cert.pem');
  passphrase = passphrase || '1234';

  const privateKey = fs.readFileSync(path.resolve(keyPath), 'utf8');
  const certificate = fs.readFileSync(path.resolve(certificatePath), 'utf8');

  if (!privateKey) {
    throw new Error('Failed to create SSL credentials - missing private key');
  }

  if (!certificate) {
    throw new Error('Failed to create SSL credentials - missing certificate');
  }

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
  const sslKey = projectConfig.servers.cdn.sslKey();
  const sslCert = projectConfig.servers.cdn.sslCert();
  const sslPassphrase = projectConfig.servers.cdn.sslPassphrase();
  const files = projectConfig.clientFilesPath();
  const app = express();

  [corsMiddleware(), express.static(files), ...middlewares]
    .forEach(mw => app.use(mw));

  return new Promise((resolve, reject) => {
    const serverFactory = ssl ? httpsServer(app, sslKey, sslCert, sslPassphrase) : app;
    const server = serverFactory.listen(port, host, err =>
      err ? reject(err) : resolve(server));
  });
}

function httpsServer(app, key, cert, passphrase) {
  const credentials = sslCredentials(key, cert, passphrase);
  return https.createServer(credentials, app);
}

module.exports = {start};
