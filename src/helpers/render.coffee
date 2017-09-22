#
#  render.js
#  realive
#
#  Created by Evgeny Ryabchich on 2012 - 08 - 29.
#  Copyright 2012 Evgeny Ryabchich.All rights reserved.
#

module.exports = (res, name, params) ->
  #res.etagify();
  res.render name, params
  return