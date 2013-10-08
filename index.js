'use strict';

var config = require('./lib/config'),
  async = require('async'),
  solr = require('solr-client'),
  client,
  func,
  pagesize = 100,
  queue,
  totalRecords = 0;

client = solr.createClient({
  host: config.get('host'),
  port: config.get('port'),
  core: config.get('core'),
  path: config.get('path')
});

switch (config.get('func')) {
  case 'exporttopqa':
    func = require('./lib/exporttopqa');
    break; 
}

if (!func) {
  console.log('Invalid function');
  process.exit(1);
}

queue = async.queue(function (task, callback) {
  var query = func.createQuery(client);

  query.start(task.start)
    .rows(pagesize);

  process.stderr.write('\x1b[2K\rStatus: ' + (task.start / totalRecords * 100).toFixed(2) + '% - ' + task.start + ' of ' + totalRecords);

  client.search(query, function (err, results) {
    if (err) {
      return callback(err);
    }

    func.processQuery(results, callback);
  });
}, 1);



async.waterfall([
  function (callback) {
    func.getTotal(client, function (err, count) {
      totalRecords = count;
      callback(err, count);
    });
  },

  function (count, callback) {
    var start = 0;

    while (start < count) {
      queue.push({
        start: start
      });

      start += pagesize;
    }

    callback();
  }
], function (err) {
  if (err) {
    return console.log(err);
  }
});