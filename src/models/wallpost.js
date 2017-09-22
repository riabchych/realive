/**
 * Model: WallPost
 */

(function() {

    var mongoose = require("mongoose");
    var convertBasicMarkup = require("../utils/basicMarkup");
    
    var WallPost = new mongoose.Schema({
        friend_id: String,
        preview: String,
        body: String,
        //rsstext: String,
        slug: String,
        created: Date,
        modified: Date,
        //tags: [String],
        user_id: mongoose.Schema.ObjectId,
        posted_on_user_id: mongoose.Schema.ObjectId,
        //comments: [Comment]
    });

    var monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
        'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    var monthNamesShort = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul',
        'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
    ];

    // define virtual getter method for id (readable string)
    WallPost.virtual('id')
        .get(function() {
            return this._id.toHexString();
        });

    WallPost.virtual('url')
        .get(function() {
            // build url for current post
            var year = this.created.getFullYear();
            var month = this.created.getMonth() + 1;
            var day = this.created.getDate();
            return '/' + year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day) + '/' + this.slug + '/';
        });

    WallPost.virtual('rfc822created')
        .get(function() {
            return this.created.toGMTString();
        });

    WallPost.virtual('readabledate')
        .get(function() {
            var year = this.created.getFullYear();
            var month = monthNames[this.created.getMonth()];
            var day = this.created.getDate();
            return (day < 10 ? '0' + day : day) + '. ' + month + ' ' + year;
        });

    WallPost.virtual('readableday')
        .get(function() {
            var day = this.created.getDate();
            return (day < 10 ? '0' + day : day);
        });

    WallPost.virtual('readablemonth')
        .get(function() {
            return monthNamesShort[this.created.getMonth()];
        });

    WallPost.virtual('previewParsed')
        .get(function() {
            return convertBasicMarkup(this.preview, true);
        });

    WallPost.virtual('bodyParsed')
        .get(function() {
            return convertBasicMarkup(this.body, true);
        });

    // register validators
    /*WallPost.path('title').validate(function(val) {
          return val.length > 0;
        }, 'TITLE_MISSING');
      
        WallPost.path('preview').validate(function(val) {
          return val.length > 0;
        }, 'PREVIEW_MISSING');
      
        WallPost.path('rsstext').validate(function(val) {
          return val.length > 0;
        }, 'RSSTEXT_MISSING');*/

    WallPost.path('body').validate(function(val) {
        return val.length > 0;
    }, 'BODY_MISSING');

    // generate a proper slug value for Wallpost
    function slugGenerator(options) {
        options = options || {};
        var key = options.key || 'body';
        return function slugGenerator(schema) {
            schema.path(key).set(function(v) {
                this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/\++/g, '');
                return v;
            });
        };
    }

    // attach slugGenerator plugin to Wallpost schema
    WallPost.plugin(slugGenerator());

    module.exports = mongoose.model('WallPost', WallPost);

}).call(this);