//
//  app.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/util'
import AppView from './views/app-view'

// Initialize the application view
$(function () {
  window.app = {}
  window.app.socket = io('http://localhost:8080/user')
  window.app.socket.on('connect', function () {
    console.log('connected!')
  })
  Backbone.sync = function (method, model, options) {
    let socket = window.app.socket // grab active socket from global namespace; io.connect() was used to create socket

    /*
     * Create signature object that will emitted to server with every request.
     * This is used on the server to push an event back to the client listener.
     */

    let signature = function () {
      let sig = {}
      sig.endPoint = model.url + (model._id ? ('/' + model._id) : '')
      if (model.ctx) sig.ctx = model.ctx

      return sig
    }

    /*
     * Create an event listener for server push. The server notifies
     * the client upon success of CRUD operation.
     */
    let event = function (operation, sig) {
      let e = operation + ':'
      e += sig.endPoint
      if (sig.ctx) e += (':' + sig.ctx)

      return e
    }

    // Get a collection or model from the server.
    let read = function () {
      let sign = signature(model)
      let e = event('read', sign)
      socket.emit('read', {'signature': sign})
      socket.once(e, function (data) {
        options.success(data) // updates collection, model; fetch
      })
    }

    // entry point for method
    switch (method) {
      case 'read':
        read()
        break
    }
  }
  new AppView({el: 'body'})
})
