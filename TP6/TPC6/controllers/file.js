const mongoose = require('mongoose');
var File = require('../models/file');

module.exports.list = function () {
    return File
        .find()
        .sort({date: -1})
        .exec();
}

module.exports.lookUp = function (id) {
    return File
        .findOne({_id: mongoose.Types.ObjectId(id)})
        .exec();
}

module.exports.insert = function (file) {
    var newFile = new File(file);
    return newFile.save();
}

module.exports.remove = function (id) {
    return File
        .remove({_id: mongoose.Types.ObjectId(id)})
        .exec();
}