'use strict';

var convict = require('convict');

var conf = convict({
  host: {
    doc: "Solr host",
    format: String,
    default: "127.0.0.1",
    arg: "host"
  },
  port: {
    doc: "Solr port",
    format: Number,
    default: "8983",
    arg: "port"
  },
  core: {
    doc: "Solr core",
    format: String,
    default: "",
    arg: "core"
  },
  path: {
    doc: "Solr path",
    format: String,
    default: "/solr",
    arg: "path"
  },
  func: {
  	doc: "Function to run",
  	format: String,
  	default: "exporttopqa",
  	arg: "func"
  }
});

// perform validation
conf.validate();

module.exports = conf;