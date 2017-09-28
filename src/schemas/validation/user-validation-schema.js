//
//  user-validation-schema.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-01-25.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

module.exports = {
     'name.first': { //
        optional: false, // won't validate if field is empty
        isLength: {
            options: [{ min: 2, max: 10 }],
            errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message
        },
        isName: {
            errorMessage: 'Invalid First Name'
        }

    },
    'name.last': { //
        optional: false, // won't validate if field is empty
        isLength: {
            options: [{ min: 2, max: 10 }],
            errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message
        },
        isName: {
            errorMessage: 'Invalid Last Name'
        }
    },
    'email': {
        notEmpty: {
            errorMessage: 'Missing E-Mail'
        },
        isEmail: {
            errorMessage: 'Invalid Email'
        },
        isEmailAvailable : {
            errorMessage: 'The email address you have entered is already registered'
        }
        
    },
    'password': {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: [{ min: 6, max: 20 }],
            errorMessage: 'Password must be between 2 and 20 chars long' // Error message for the validator, takes precedent over parameter message
        },
    },
    'repassword': {
        notEmpty: {
            errorMessage: 'Password Confirmation is required'
        }
    }
};