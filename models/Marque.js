const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var marqueSchema = new mongoose.Schema({
    _id:String,
    image:String
});
module.exports = mongoose.model('Marque',marqueSchema);