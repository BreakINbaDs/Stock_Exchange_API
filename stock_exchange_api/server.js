// Include the cluster module
const cluster = require('cluster');
// Count the machine's CPUs
const cpuCount = require('os').cpus().length;

// Code to run if we're in the master process
if (cluster.isMaster) {
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });

// Splitting clients
} else {
    var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Stock = require('./api/models/stockExchangeModel'), //created model loading here
    bodyParser = require('body-parser');

    // mongoose instance connection url connection
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/stockDB', function(err){
      console.log(err);
    });


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


    var routes = require('./api/routes/stockExchangeRoutes'); //importing route
    routes(app); //register the route


    app.listen(port);


    console.log('stock exchange RESTful API server started on: ' + port + ' Worker id: ' + cluster.worker.id);
}
