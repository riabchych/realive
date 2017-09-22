(function() {

    var mongoose = require("mongoose");

    var Post = new mongoose.Schema({
        filename: {
            type: String,
            index: true
        },
        file: String,
        created_at: Date,
        user_id: mongoose.Schema.ObjectId
    });

    Post.virtual('id')
        .get(function() {
            return this._id.toHexString();
        });

    module.exports = mongoose.model('Post', Post);

}).call(this);