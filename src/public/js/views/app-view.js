//
//  app-view.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import Reviews from '../collections/reviews'
import User from '../models/user'
import ReviewView from '../views/review-view'
import UserView from '../views/user-view'

class AppView extends Backbone.View {
  constructor () {
    super(arguments[0])
  }

  static changeUser () {
    let view = new UserView({model: User})
    view.render()
  }

  initialize () {
    this.$list = this.$('#profile-reviews')
    this.$header = this.$('#page-header')
    this.$hideReviews = this.$('#hide-annonymous')
    this.$wallTitle = this.$('#wall-title')
    this.countOfHiddenReviews = 0

    this.listenTo(Reviews, 'add', this.addReview)
    this.listenTo(Reviews, 'reset', this.resetReviews)

    this.listenTo(User, 'change', this.changeUser)

    User.fetch({reset: true})
    Reviews.fetch({reset: true})
  }

  addReview (review) {
    let view = new ReviewView({model: review})
    review = review.toJSON()
    if (review.isHidden) { this.countOfHiddenReviews++ }
    this.$list.append(view.render().el)
  }

  resetReviews () {
    this.$list.html('')
    Reviews.each(this.addReview, this)
    this.$hideReviews.text(
      this.countOfHiddenReviews > 0 ? 'скрыть анонимные' : '')

    this.$wallTitle.text(
      Reviews.length > 0 ? 'отзывов ' + Reviews.length : 'отзывов нет')
  }
}

export default AppView
