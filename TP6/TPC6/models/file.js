var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    date: Date,
    description: String,
    name: String,
    file: String,
    size: Number,
    type: String
});

module.exports = mongoose.model('file', fileSchema);