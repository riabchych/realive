//
//  custom-validators.js
//  realive
//
//  Created by Yevhenii Riabchych on 2016-10-25.
//  Copyright 2012 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));

module.exports = {
    isEmailAvailable: function(email) {
      return new Promise(function(resolve, reject) {
        UserModel.findOne({ email: email })
        .then(function(user) {
          if (user) {
            reject(user);
          }
          else {
            resolve(user);
          }
        })
        .catch(function(error){
          if (error) {
            reject(error);
          }
        });
      });
    },
    isName: function (value) {
        let regexp = /^[a-z,A-Z,а-яіїєґ,А-ЯІЇЄҐ]{2,}$/i;
        return regexp.test(value);
    }
};