//
//  validator.js
//  realive
//
//  Created by Yevheii Riabchych on 2012-04-21.
//  Copyright 2012 Yevheii Riabchych. All rights reserved.
//
(function() {

    var validate = require("validate.js");

    function success(attributes) {
        console.log("Success!", attributes);
    }

    function error(errors) {
        if (errors instanceof Error) {
            // This means an exception was thrown from a validator
            console.err("An error ocurred", errors);
        } else {
            console.log("Validation errors", errors);
        }
    }

    var constraints = {

        first_name: {
            presence: true,
            /*format: {
                pattern: "[a-z]+",
                flags: "i",
                message: "can only contain a-z"
            },*/
            length: {
                minimum: 2,
                message: "must be at least 2 characters"
            }
        },

        last_name: {
            presence: true,
            /*format: {
                pattern: "[a-z]+",
                flags: "i",
                message: "can only contain a-z"
            },*/

            length: {
                minimum: 2,
                message: "must be at least 2 characters"
            }
        },

        email: {
            //presence: true,
            email: true,
            //message: "doesn't look like a valid email"
        },

        password: {
            presence: true,
            length: {
                minimum: 6,
                message: "must be at least 6 characters"
            }
        },

        confirmPassword: {
            presence: true,
            equality: "password",
            message: "must be at least 6 characters"
        }
    };

    var checkUser = function(data){
        console.log(data);
        var s =  validate({
            first_name: data.name.first,
            last_name: data.name.last,
            email: data.email,
            password:data.password,
            confirmPassword: data.repassword
        }, constraints, {format: "flat"});
        return s;
    };

    module.exports.checkUser = checkUser;

}).call(this);