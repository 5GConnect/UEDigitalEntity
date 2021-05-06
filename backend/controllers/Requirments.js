'use strict';

module.exports.createUERequirments = function createUERequirments(req, res, next) {
  res.status(200).json("CREATE REQUIRMENTS");
};


module.exports.getUERequirments = function getUERequirments(req, res, next) {
  res.status(200).json("GET REQUIRMENTS");
};

module.exports.updateUERequirments = function updateUERequirments(req, res, next) {
  res.status(200).json("UPDATE REQUIRMENTS");
};