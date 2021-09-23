'use strict';

const DeviceRequirements = require('../models/DeviceRequirements')

module.exports.createUERequirements = function createUERequirments(req, res, next) {
  let newRequirement = req.body.requirements
  let pdu_data = {}
  newRequirement.forEach(requirement => {
      pdu_data[requirement] = DeviceRequirements.getPduTypeByRequirement(requirement)
  });
  res.status(200).send(pdu_data)
};

module.exports.getUERequirements = function getUERequirments(req, res, next) {
  res.status(200).send(Object.keys(DeviceRequirements.getActiveRequirementsAndSessionIds()))
};

module.exports.updateUERequirements = function updateUERequirments(req, res, next) {
  res.status(500).json("UPDATE REQUIRMENTS: not implemented");
};
