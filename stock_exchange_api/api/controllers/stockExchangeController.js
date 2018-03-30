'use strict';
var mongoose = require('mongoose'),
  Stock = mongoose.model('Stock');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('../stockExchageDebug.log', {flags : 'w'});
var log_stdout = process.stdout;

// Lets overload console.log() function to make it also write in og file
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};



exports.list_result = function(req, res) {
  // Get params from rerquest
  var country = req.params.countrycode,
      categ = req.params.Category,
      bid = req.params.BaseBid;


  Stock.find({}, {_id:1}, function(err,task){
    if(err)
      res.send(err);
    var Ids = [];
    for (var elem in task){
      Ids.push(String(task[elem]._id));
    };

    // Base Targeting
    Stock.find({coutries: country, category: categ},function(err, task) {
      if (err)
        res.send(err);
      console.log("Base Targeting: ");
      if(task.length > 0){
        // Log positive results
        for (var elem in task){
          console.log("{"+task[elem]._id+",Passed}");
          if (Ids.indexOf(String(task[elem]._id))!= -1)
            Ids.splice(Ids.indexOf(String(task[elem]._id)), 1);
        };
        // Log negative results
        for (var elem in Ids){
          console.log("{"+Ids[elem]+",Failed}");
        };

        // Budget Check
        Stock.find({coutries: country, category: categ, budget: {$gte: 0}},function(err, task) {
          if (err)
            res.send(err);
          console.log("Budget Check: ");
          if(task.length > 0){
            // Log positive results
            for (var elem in task){
              console.log("{"+task[elem]._id+",Passed}");
              if (Ids.indexOf(String(task[elem]._id))!= -1)
                Ids.splice(Ids.indexOf(String(task[elem]._id)), 1);
            };
            // Log negative results
            for (var elem in Ids){
              console.log("{"+Ids[elem]+",Failed}");
            };

            // BaseBid Check + Shortlisting
            Stock.find({coutries: country, category: categ, budget: {$gte: 0}, bId: {$lte: bid}},function(err, task) {
              if (err)
                res.send(err);
              console.log("BaseBid Check: ");
              if (task.length > 0){
                // Log positive results
                for (var elem in task){
                  console.log("{"+task[elem]._id+",Passed}");
                  if (Ids.indexOf(String(task[elem]._id))!= -1)
                    Ids.splice(Ids.indexOf(String(task[elem]._id)), 1);
                };
                // Log negative results
                for (var elem in Ids){
                  console.log("{"+Ids[elem]+",Failed}");
                };

                // Log Winner
                console.log("Winner = " + task[0]._id);
                var newBudget = task[0].budget - bid/100;
                console.log("newBudget: "+ newBudget);
                // Update Winner budget
                Stock.update({_id: task[0]._id},{$set:{budget: newBudget}}, function (err, result) {
                  if (err)
                    res.send(err);
                  res.json(task[0]._id);
                });

              } else {
                console.log("No Companies Passed from BaseBid check");
                res.json("No Companies Passed from BaseBid check");
              };

            }).sort({ bId: -1 });

          } else {
            console.log("No Companies Passed from Budget");
            res.json("No Companies Passed from Budget");
          }
        });

      } else {
        console.log("No Companies Passed from Targeting");
        res.json("No Companies Passed from Targeting");
      };
    });
  });
};
