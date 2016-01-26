var messageModel = require('../models/messageModel.js');

module.exports = {
  get: function(req, res) {
    var params = [req.params.houseId];

    messageModel.get(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  },
  post: function(req, res) {
    console.log('req is', req.body);
    var params = [req.body.userId, req.body.text, req.body.houseId]

    messageModel.post(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  }
}