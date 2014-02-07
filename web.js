var express = require("express"),
  logfmt = require("logfmt"),
  through = require('through'),
  request = require('request'),
  pictureTube = require('picture-tube');

var url = 'http://pixelfies.us/selfies/';

var app = express();
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {

  res.send('USAGE: curl http://pixelfies-curl.herokuapp.com/<babe>\n\nFind Available Pixelfies at http://pixelfies.us\n');
});

app.get('/:babe', function(req, res) {
  request(url + req.params.babe + '.png').on('response', function (resp) {
    if (resp.statusCode == 200) {

      resp.pipe(pictureTube({cols: 40}))
      .pipe(through(null, function () {
        this.queue('by @h0ke | inspired by http://pixelfies.us & http://ihmage.com\n');
        this.queue(null);
      }))
      .pipe(res);
    } else {

      res.send('404: Babe Not Found.\n');
    }
  })
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
