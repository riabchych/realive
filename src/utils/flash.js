// 
//  flash.js
//  realive
//  
//  Created by Yevhenii Riabchych on 2012-08-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
// 

function FlashMessage(type, messages) {
    this.type = type;
    this.messages = typeof messages === 'string' ? [messages] : messages;
}

FlashMessage.prototype = {
    getIcon: function() {
        switch (this.type) {
            case 'info':
                return 'ui-icon-info';
            case 'error':
                return 'ui-icon-alert';
        }
    },

    getStateClass: function() {
        switch (this.type) {
            case 'info':
                return 'success';
            case 'error':
                return 'error';
        }
    },

    toHTML: function() {
        let list = this.type == 'error' ? 'Пожалуйста, исправьте следующие ошибки:' : '';

        if (this.messages.length > 1 || this.type == 'error') {
            list += '<ol>';
            this.messages.forEach(function(msg) {
                list += '<li>' + msg + '</li>';
            });
            list += '</ol>';
        }
        else {
            list += this.messages.pop();
        }

        return '<div class="flash ' + this.getStateClass() + '">' + '<div>' + list + '</div>' + '</div>';
    }
};

module.exports = function(req, res) {
    let html = '';
    ['error', 'info'].forEach(function(type) {
        let messages = req.flash(type);
        if (messages.length > 0) {
            html += new FlashMessage(type, messages).toHTML();
        }
    });
    return html;
};