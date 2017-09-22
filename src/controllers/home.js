//
//  home.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
module.exports = function (req, res) {
    res.render("home", {
        locals: {
            title: "Home"
        }
    });

};
