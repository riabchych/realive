document.observe('dom:loaded', function () {

  core.reviews = {
    count: {
      hidden: 0,
      all: 0,
    },
    page: 2,
    isVisibleHiddenReviews: true,
  }
  core.review = {}
  core.dom = {}

  core.dom.profileMenu = $('profile-menu')
  if (Object.isElement(core.dom.profileMenu)) {
    core.dom.profileMenu.observe('click', function (e) {
      this.next().show()
      e.stopPropagation()
    })
    $(document).observe('click', function (e) {
      core.dom.profileMenu.next().hide()
      e.stopPropagation()
    })
  }

  core.dom.reviewForm = $('review-form-container')
  core.dom.showForm = $('show-form-link')
  core.dom.hideForm = $('hide-form-link')
  if (Object.isElement(core.dom.showForm) &&
    Object.isElement(core.dom.reviewForm) &&
    Object.isElement(core.dom.hideForm)) {
    (function () {
      var attach = function () {
        arguments[0].observe('click', function (e) {
          [core.dom.showForm, core.dom.reviewForm].invoke('toggle')
          e.stop()
        })
        return attach
      }
      return attach(arguments[0])(arguments[1])
    })(core.dom.showForm, core.dom.hideForm)
  }


  reviewItems && reviewItems.each(function (value) {
    (core.reviews.count.all++, core.reviews.count.hidden += +value.isHidden)
  })

  Object.isElement(core.dom.hideAnnonymous = $('hide-annonymous')) &&
  core.dom.hideAnnonymous.observe('click', function (e) {
    core.dom.hideAnnonymous.update(
      (core.reviews.isVisibleHiddenReviews = !core.reviews.isVisibleHiddenReviews)
        ? 'скрыть анонимные'
        : 'показать все')
    $$('article.review-hidden').each(Element.toggle)
  })

  updateWallTitle()
  updateEvents()

  core.showPhoto = function (e) {
    new MessageBox({
      caller: e.id,
      width: 640,
      title: 'Просмотр фотографии',
      body: '<img src="' + e.href + '" />',
    }).open(e.id)
    return false
  }
  core.reviews.load = function (e) {
    e.addClassName('loading').update('').removeClassName('light-link')
    new Ajax.Request('/review/list', {
      method: 'POST',
      parameters: {
        _csrf: core.csrfToken,
        uid: profile.id,
        page: core.reviews.page,
      },
      onSuccess: function (transport) {
        var data = transport.responseText.evalJSON()
        if (core.reviews.page += +data.success) {
          data.extras.reviews.each(function (rev) {
            e.insert({
              before: renderArticle(rev),
            })
            core.reviews.count.all++
            core.reviews.count.hidden += +rev.isHidden
          })
          core.reviews.count.all >= profile.meta.numberOfReviews && e.hide()
          reviewItems = [...reviewItems, ...data.extras.reviews]
          e.addClassName('light-link').
            update('Показать ещё').
            removeClassName('loading')
          updateWallTitle()
          updateEvents()
        }
      },
    })
  }

  core.review.remove = function (id) {
    new Ajax.Request('/review/remove', {
      method: 'POST',
      parameters: {
        _csrf: core.csrfToken,
        id: id,
      },
      onSuccess: function (transport) {
        var data = transport.responseText.evalJSON()
        if (data.success) {
          reviewItems.each(function (rev) {
            if (rev._id == data.extras.review_id) {
              $('review-' + rev._id).remove()
              reviewItems = reviewItems.without(rev)
              core.reviews.count.all--
              core.reviews.count.hidden -= +rev.isHidden
              $break
            }
          })
          $('p-count-reviews').update('' + --profile.meta.numberOfReviews)
          if (!core.reviews.count.all && profile.isOwner) {
            $('profile-reviews').insert(new Element('p', {
              'class': 'default-text',
              'style': 'margin: 5px 10px',
            }).update('О Вас ещё не оставляли отзывов'))
          }
          updateWallTitle()
        }
      },
    })
    return false
  }

  function updateEvents () {
    $$('#profile-reviews article').each(function (elem, i) {
      function act (e) {
        elem.select('.review-actions').first().toggle()
        e.stopPropagation()
      }

      elem.stopObserving().observe('mouseover', act).observe('mouseout', act)
    })

    $$('time.timeago').each(function (elem) {
      elem.update(timeAgo(elem.readAttribute('datetime')))
      setInterval(function () {
        elem.update(timeAgo(elem.readAttribute('datetime')))
      }, 30000)
    })
  }

  function updateWallTitle () {
    $('hide-annonymous').
      update(core.reviews.count.hidden > 0 ? 'скрыть анонимные' : '')
    $('wall-title').
      update(core.reviews.count.all > 0
        ? 'отзывов ' + core.reviews.count.all
        : 'отзывов нет')
  }

  function renderArticle (r) {
    return new Element('article', {
      'id': 'review-' + r._id,
      'class': r.isHidden ? 'review-hidden' : '',
    }).insert(new Element('div', {
        'class': 'small-profile-photo-envelope f-left',
      }).insert(new Element('img', {
        'src': '/images/userpics/thumbs_s/' +
        (r.from && 'photo' in r.from ? r.from.photo : 'no-avatar.gif'),
      })),
    ).insert(new Element('div', {
        'class': 'review-text',
      }).insert(new Element('div', {
        'class': 'review-info',
      }).update((r.from && 'name' in r.from && !r.isHidden) ? '<a href="/user/' +
      r.from.username + '"><b>' + r.from.name.first + '  ' + r.from.name.last +
      '</b></a>' : '<b>Анноним</b>').insert(new Element('time', {
        'class': 'f-right timeago',
        'datetime': (r.createdAt || ''),
      }))).insert(new Element('p').update(r.body || '')),
    ).insert(
      new Element('div', {
        'class': 'review-details',
      }).insert(
        new Element('div', {
          'class': 'review-actions f-right',
          'style': 'display:none;',
        }).insert(
          new Element('a', {
            'class': 'item icon_delete',
            'onclick': ('core.review.remove(\'' + (r._id || 0) + '\')'),
            'style': (!profile.isOwner ? 'display:none;' : ''),
          }).update('Удалить')).insert(
          new Element('a', {
            'class': 'item icon_reply',
          }).update('Комментировать')).insert(
          new Element('a', {
            'class': 'item icon_like',
          }).update('Мне нравится')),
      ),
    ).insert(
      new Element('div', {
        'class': 'clearfix',
      }),
    )
  }
})

function timeAgo (time) {
  time = Math.round((Date.now() - (Date.parse(time))) / 1000)
  if (time < 5) return 'только что'
  else if (time < 60) return 'меньше минуты назад'
  else if (time < 3600) return declOfNum((time - (time % 60)) / 60,
    ['минуту', 'минуты', 'минут']) + ' назад'
  else if (time < 86400) return declOfNum((time - (time % 3600)) / 3600,
    ['час', 'часа', 'часов']) + ' назад'
  else if (time < 2073600) return declOfNum((time - (time % 86400)) / 86400,
    ['день', 'дня', 'дней']) + ' назад'
  else if (time < 62208000) return declOfNum((time - (time % 2073600)) /
    2073600, ['месяц', 'месяца', 'месяцев']) + ' назад'
}

function declOfNum (number, titles) {
  var cases = [2, 0, 1, 1, 1, 2]
  return number + ' ' +
    titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5)
      ? number % 10
      : 5]]
}
