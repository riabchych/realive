//
//  review-view.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import template from '../templates/review.pug'

class ReviewView extends Backbone.View {
  constructor () {
    super(arguments[0])
    this.tagName = 'article'
  }

  initialize () {
    this.listenTo(this.model, 'change', this.render)
    this.listenTo(this.model, 'destroy', this.remove)
  }

  render () {
    let _model = this.model.toJSON()
    this.$el.attr({
      'id': `review-${_model._id}`,
      'class': `${_model.isHidden ? 'hidden-review' : ''}`
    }).html(template(_model))
    return this
  }

  remove () {
    this.model.destroy()
  }
}

export default ReviewView
