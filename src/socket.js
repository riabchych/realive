//
//  socket.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-11-05.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import socketio from 'socket.io'
import reviewCtrl from './controllers/reviewCtrl'

export default (http, config) => {
  let io = socketio(http)
  io.use(config)

  io.of('/app').on('connection', function (socket) {
    socket.emit('a message', {
      that: 'only',
      '/app': 'will get'
    })
    user.emit('a message', {
      everyone: 'in',
      '/app': 'will get'
    })
  })

  let user = io.of('/user').on('connection', function (socket) {
    // creates the event to push to listening clients
    let event = function (operation, sig) {
      let e = operation + ':'
      e += sig.endPoint
      if (sig.ctx) e += (':' + sig.ctx)

      return e
    }

    let read = function (socket, signature) {
      let e = event('read', signature)
      console.log(e)
      if (e === 'read:user') {
        socket.emit(e, socket.request.user)
      } else {
        let _data = {}
        _data.uid = socket.request.user._id
        _data.page = 1
        reviewCtrl('read', _data).then(data => {
          socket.emit(e, data.extras.reviews)
        })
      }
    }

    socket.on('read', function (data) {
      read(socket, data.signature)
      // reviewCtrl('read', data).then(data => { console.log(data.extras.reviews)});
    })
    socket.on('update', function (data) {
      reviewCtrl(socket, data.signature)
    })
    socket.on('delete', function (data) {
      reviewCtrl(socket, data.signature)
    })
  })
}
