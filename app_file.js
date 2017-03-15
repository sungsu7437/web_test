/**
 * Created by sss on 2017-03-09.
 */
var express = require('express');
var app = express();

app.set('views', './views_file');
app.set('view engine', 'jade');


app.get('/topic/new', function (req, res, next) {
    res.render('file');
})


app.listen(3000, function () {
    console.log('Connectes, 3000 port');
})