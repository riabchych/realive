//
//  testCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

module.exports = (req, res) => {
    res.render("test", {
        locals: {
            title: "test"
        }
    });
};
