var db = require('../db');

module.exports = {
  getUsersInHouse: function(params, callback) {
    var queryStr="SELECT users.name, users.id from users WHERE houseId = ?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }, 
  findUserByVenmoId: function(params, callback) {
    var queryStr = "SELECT * FROM users WHERE venmoid=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  postUser: function(params, callback) {
    var queryStr = "INSERT INTO Users (name, houseId, venmoName, username, email, provider, venmo, balance, access_token, refresh_token, venmoid ) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ? )"
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
}