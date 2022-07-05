'use strict';

const fs = require('fs');
const lodash = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

const rootDir = './src/__recordings__/';

const entries = [];
fs.readdirSync(rootDir).forEach((dir) => {
  const raw = JSON.parse(fs.readFileSync(`${rootDir}${dir}/recording.har`)).log
    .entries;
  raw.forEach((data) => {
    const status = data.response.status;
    if (entries.every((entry) => !lodash.isEqual(entry.request, data.request)))
      if (argv.error && status >= 400 && status < 500) entries.push(data);
      else if (!argv.error && status >= 200 && status < 300) entries.push(data);
  });
});

const harBody = {
  log: {
    _recordingName: 'merged-recordings',
    creator: {
      comment: 'persister:JupiterOneIntegationFSPersister',
      name: 'Polly.JS',
      version: '5.1.1',
    },
    entries,
    pages: [],
    version: '1.2',
  },
};

fs.writeFileSync('mergedRecordings.har', JSON.stringify(harBody));
