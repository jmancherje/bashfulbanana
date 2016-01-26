var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db/index');
var cors = require('cors');

app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'client')));
app.use(cors()); 

require('./config/routes.js')(app, express);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = app;