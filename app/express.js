module.exports = function () {
    'use strict';

    var express = require('express');
    var cons = require('consolidate');
    var path = require('path');
    var bodyParser = require('body-parser');

    // console.log(store.store);

    var exp = express();
    var publicPath = path.resolve(__dirname, 'dist');
    // console.log(publicPath);
    var port = 3003;

    // point for static assets
    exp.use(express.static(publicPath));

    //view engine setup
    exp.engine('html', cons.handlebars);
    exp.set('view engine', 'html');
    exp.set('views', __dirname + '/views'); //Maybe change this for dist?

    exp.use(bodyParser.json());
    exp.use(bodyParser.urlencoded({
        extended:true
    }));

    //home view
    exp.get('/', function(req, res) {
        res.render('home');
    });

    var server = exp.listen(port, function () {
        console.log('Express server listening on port ' + server.address().port);
    });

    return exp;

};
