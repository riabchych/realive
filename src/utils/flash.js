//
//  flash.js
//  realive
//
//  Created by Yevhenii Riabchych on 2012-08-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

class FlashMessage {
  constructor (type, messages) {
    this.type = type
    this._messages = typeof messages === 'string' ? [messages] : messages
  }

  get messages () {
    return this._messages
  }

  set messages (value) {
    this._messages = value
  }

  getIcon () {
    switch (this.type) {
      case 'info':
        return 'ui-icon-info'
      case 'error':
        return 'ui-icon-alert'
    }
  }

  getStateClass () {
    switch (this.type) {
      case 'info':
        return 'success'
      case 'error':
        return 'error'
    }
  }

  toHTML () {
    let list = this.type === 'error'
      ? 'Пожалуйста, исправьте следующие ошибки:'
      : ''

    if (this._messages.length > 1 || this.type === 'error') {
      list += '<ol>'
      for (const msg of this._messages) {
        list += `<li>${msg}</li>`
      }
      list += '</ol>'
    } else {
      list += this._messages.pop()
    }

    return `<div class="flash ${this.getStateClass()}"><div>${list}</div></div>`
  }
}

export default function (req) {
  let html = ''
  for (const type of ['error', 'info']) {
    let messages = req.flash(type)
    if (messages.length > 0) {
      html += new FlashMessage(type, messages).toHTML()
    }
  }
  return html
}
