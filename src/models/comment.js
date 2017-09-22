/**
 * Comment model
 * 
 * Used for persisting user comments
 */

(function() {

    var mongoose = require("mongoose");
    var convertBasicMarkup = require("../utils/basicMarkup");

    var monthNamesShort = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul',
        'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
    ];

    var Comment = new mongoose.Schema({
        user_id: mongoose.Schema.ObjectId,
        //photo:String,
        date: Date,
        body: String,
        post_id: mongoose.Schema.ObjectId,
    });

    // register virtual members
    Comment.virtual('readableday')
        .get(function() {
            var day = this.date.getDate();
            return (day < 10 ? '0' + day : day);
        });

    Comment.virtual('readablemonth')
        .get(function() {
            return monthNamesShort[this.date.getMonth()];
        });

    Comment.virtual('readabletime')
        .get(function() {
            var hour = this.date.getHours();
            var minute = this.date.getMinutes();
            return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute);
        });

    Comment.virtual('bodyParsed')
        .get(function() {
            return convertBasicMarkup(this.body, false);
        });

    // register validators
    /*Comment.path('author').validate(function(val) {
      return val.length > 0;
    }, 'AUTHOR_MISSING');*/

    Comment.path('body').validate(function(val) {
        return val.length > 0;
    }, 'BODY_MISSING');

    module.exports = mongoose.model('Comment', Comment);

}).call(this);