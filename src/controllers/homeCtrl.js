//
//  homeCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

module.exports = (req, res) => {
    res.render("home", {
        locals: {
            title: "Home"
        }
    })
}
