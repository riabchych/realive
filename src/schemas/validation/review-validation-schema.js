//
//  review-validation-schema.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-01-25.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

export default {
    'to': {
        isMongoId: {
            errorMessage: 'Invalid to User ID'
        }
    },
    'from': {
        isMongoId: {
            errorMessage: 'Invalid from User ID',
            optional: {
                options: { checkFalsy: true }
            }
        }
    },
    'body': {
        notEmpty: {
            errorMessage: 'Missing review text'
        },
        isLength: {
            options: [{ min: 1, max: 500 }],
            errorMessage: 'Review text must be between 1 and 500 chars long'
        }

    },
    'isPrivate': {
        isBoolean: {
            errorMessage: 'should be a boolean',
            optional: {
                options: { checkFalsy: true }
            }
        }
    },
    'isHidden': {
        isBoolean: {
            errorMessage: 'should be a boolean',
            optional: {
                options: { checkFalsy: true }
            }
        }

    }
};
