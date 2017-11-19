//
//  user-view.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-11-06.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

class UserView extends Backbone.View {
  initialize () {
    this.headerBarTpl = 'pug-loader!../templates/header-bar.pug'
    this.profileStatsTpl = 'pug-loader!../templates/profile-stats.pug'

    this.$profileName = this.$('#profile-name')
    this.$pageHeader = this.$('#page-header')
    this.$profileActivities = this.$('#profile-activities')
    this.$profileStats = this.$('#mini-profile-stats')

    this.listenTo(this.model, 'change', this.render)
    this.listenTo(this.model, 'destroy', this.remove)
  }

  render () {
    let _model = this.model.toJSON()
    this.$pageHeader.html(this.headerBarTpl(_model))
    this.$profileName.text(`${_model.name.first} ${_model.name.last}`)
    this.$profileActivities.text(_model.about)
    this.$profileStats.html(this.profileStatsTpl(_model))
    return this
  }

  // Remove the item, destroy the model from *localStorage* and delete its view.
  remove () {
    this.model.destroy()
  }
}

export default UserView
