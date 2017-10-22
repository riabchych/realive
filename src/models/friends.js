(function() {

    var mongoose = require("mongoose");

    var Friends = new mongoose.Schema({
        requestor: String,
        acceptor: String,
        date_requested: Date,
        status: Number
    });

    Friends.virtual('id')
        .get(function() {
            return this._id.toHexString();
        });

    module.exports = mongoose.model('Friends', Friends);

}).call(this);