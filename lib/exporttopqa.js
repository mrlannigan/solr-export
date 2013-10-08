exports.createQuery = function (client) {
  var query = client.createQuery()
    .q('qid:* AND question:*')
    .fl('question,categories,qid');

  return query;
};

exports.getTotal = function (client, callback) {
  var query = exports.createQuery(client);

  query.rows(0);

  client.search(query, function (err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result.response.numFound);
  });
};

exports.processQuery = function (results, callback) {
  if (!results || !results.response || !results.response.docs) {
    return callback();
  }

  var docs = results.response.docs;

  if (docs.length < 1) {
    return callback();
  }

  docs.forEach(function (doc) {
    if (!doc.categories || !doc.categories[0]) {
      doc.categories = [''];
    }
    console.log(doc.question.replace(/\n|\r/g, ' ') + '\t' + doc.categories[0] + '\t' + doc.qid);
  });

  callback();
}