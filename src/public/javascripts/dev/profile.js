onDomReady(function () {
    
    jeikaps.ddmenuitem = null;
    jeikaps.utime = setInterval(updateTime, 30000);
    updateTime();

    document.onclick = jeikaps.dropdown;

    jeikaps.opinion = {
        actionStatus: false,
        showedOnlyAnonymous: false
    };

    var opinions = getByTag('article', getById('profile-opinions'));
    jeikaps.opinion.countAll = opinions.length;

    opinions && each(opinions, function (o) {
        o.addEvent('mouseover', function () {
            var qa = getByClass('opinion-actions', this)[0];
            css(qa).set('opacity', 1);
        });
    });

    opinions && each(opinions, function (o) {
        o.addEvent('mouseout', function () {
            var qa = getByClass('opinion-actions', this)[0];
            css(qa).set('opacity', 0);
        });
    });

    jeikaps.opinion.toggleForm = function () {
        if (!jeikaps.opinion.showedForm) {
            hide(getById('show-form-link'));
            show(getById('opinion-form-container'));
            jeikaps.opinion.showedForm = true;
        }
        else {
            show(getById('show-form-link'));
            hide(getById('opinion-form-container'));
            jeikaps.opinion.showedForm = false;
        }

    };

    jeikaps.opinion.toggleActions = function (el) {
        var qa = getByClass('opinion-actions', el, 'div');
        if (qa && qa.length) {
            qa = qa[0];
            if (jeikaps.opinion.actionStatus) {
                css(qa).set('visibility', 'hidden');
                css(qa).set('opacity', 0);
                jeikaps.opinion.actionStatus = false;
            }
            else {
                css(qa).set('visibility', 'visible');
                css(qa).set('opacity', 1);
                jeikaps.opinion.actionStatus = true;
            }

        }
    };

    jeikaps.opinion.toggleOpinions = function (e) {
        var self = e;
        var data = getByClass('opinion-unknown');
        var title = getById('wall-title');
        if (!jeikaps.opinion.showedOnlyAnonymous) {
            self.innerHTML = 'РїРѕРєР°Р·Р°С‚СЊ РІСЃРµ';
            title.innerHTML = jeikaps.opinion.countAll - data.length + ' РјРЅРµРЅРёСЏ';
            each(data, function (o) {
                hide(o);
            });
            jeikaps.opinion.showedOnlyAnonymous = true;
        }
        else {
            self.innerHTML = 'СЃРєСЂС‹С‚СЊ Р°РЅРѕРЅРёРјРЅС‹Рµ';
            title.innerHTML = jeikaps.opinion.countAll + ' РјРЅРµРЅРёСЏ';
            each(data, function (o) {
                show(o);
            });
            jeikaps.opinion.showedOnlyAnonymous = false;
        }
    };

    var opinionText = getById('opinion-text');
    var wordCounter = getById('opinion-word-counter');

    opinionText && opinionText.addEvent('keydown', function () {
        var l = parseInt(this.value.length + 1);
        if (l < 255) {
            wordCounter.innerHTML = 255 - l;
        }

    });
});

jeikaps.dropdown = function (id) {
    if (jeikaps.ddmenuitem) {
        hide(jeikaps.ddmenuitem);
        jeikaps.ddmenuitem = null;
    }
    else {
        if (id) {
            jeikaps.ddmenuitem = getById(id);
            show(jeikaps.ddmenuitem);
        }
    }
    event.stopPropagation();
}

jeikaps.profile = {};

jeikaps.profile.showPhoto = function (e) {
    messageBox.init({
        caller: e,
        width: 640,
        title: 'РџСЂРѕСЃРјРѕС‚СЂ С„РѕС‚РѕРіСЂР°С„РёРё',
        body: '<img src="' + e.href + '" />'
    });
    messageBox.show(e);
    return false;
};

jeikaps.profile.changePhoto = function (c) {
    var caller = c;
    var el = getById('dropbox');
    if (el) {
        show(caller);
    }
    else {
        majaX({
            url: '/user/upload',
            type: 'html',
            method: 'GET',
        }, function (data) {
            messageBox.init({
                caller: c,
                title: 'Р—Р°РіСЂСѓР·РєР° С„РѕС‚РѕРіСЂР°С„РёРё',
                body: data,
                width: 450
            });
            
            messageBox.show(c);
            var dropbox = getById('dropbox');
            
            var previewContainer, 
                imageHolder, 
                uploadedBadge,
                uploadProgressHolder,
                uploadProgressBar,
                image,
                messageContainer;

            uploadProgressHolder = createElement('div', {
                id: 'upload-progress-holder',
                innerHTML : '<div ></div>'
            });
            
            uploadProgressBar = createElement('div', {
                id : 'upload-progress'
            });
            uploadProgressHolder.appendChild(uploadProgressBar);
            
            previewContainer = createElement('div', {
                className: 'preview'
            });
            imageHolder = createElement('span', {
                className: 'imageHolder'
            });
            uploadedBadge = createElement('span', {
                className: 'uploaded'
            });
            messageContainer = createElement('div', {
                className: 'message'
            });
            previewContainer.appendChild(imageHolder);
            previewContainer.appendChild(uploadProgressHolder)
            previewContainer.appendChild(messageContainer);
            
            image = createElement('img');
            Uploader.init({
                dropBox: 'dropbox',
                imageFile: 'image-file',
                paramname: 'image',
                csrf: jeikaps.csrfToken,
                url: '/user/upload',
                onBeforeUpload: function(file) {
                    dropbox.innerHTML = '';
                    dropbox.appendChild(previewContainer);
                    show(uploadedBadge);
                    messageContainer.innerHTML = 'Р’Р°С€Р° С„РѕС‚РѕРіСЂР°С„РёСЏ СѓСЃРїРµС€РЅРѕ РѕР±РЅРѕРІР»РµРЅР°';

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        image = createElement('img', {
                            src: e.target.result,
                        });
                        imageHolder.appendChild(image);
                    }
                    reader.readAsDataURL(file);
                    
                    messageContainer.innerHTML = 'РџРѕРґРѕР¶РґРёС‚Рµ, РёРґРµС‚ Р·Р°РіСЂСѓР·РєР°...';
                    show(uploadProgressHolder);
                },
                onProgress: function (e) {
                    css(uploadProgressBar).set('width', (e.loaded / e.total) * 100 + "%");
                },
                onLoad: function (data) {
                    imageHolder.appendChild(uploadedBadge);
                    getById('current-profile-image').src = '/uploads/' + data.files[0].name;
                    getById('current-profile-image').parentNode.href = '/uploads/' + data.files[0].name;
                    show(uploadedBadge);
                    hide(uploadProgressHolder);
                    messageContainer.innerHTML = 'Р’Р°С€Р° С„РѕС‚РѕРіСЂР°С„РёСЏ СѓСЃРїРµС€РЅРѕ РѕР±РЅРѕРІР»РµРЅР°';
                    // $("#header-notifier").removeClass("error").addClass("info").html('Р’Р°С€Р°
                    // С„РѕС‚РѕРіСЂР°С„РёСЏ СѓСЃРїРµС€РЅРѕ РѕР±РЅРѕРІР»РµРЅР°');
                }
            });
        });
    }
};

jeikaps.profile.follow = function(o) {
    majaX({
        url: '/user/follow',
        type: 'json',
        method: 'POST',
        data: {
            '_csrf': encodeURIComponent(jeikaps.csrfToken),
            'uid': jeikaps.uid
        }
    }, function (a) {
        if (a.status == 1) {
          o.innerHTML = 'РћС‚РїРёСЃР°С‚СЊСЃСЏ';
          o.setAttribute('onclick', 'jeikaps.profile.unfollow(this)');
        }
    });
};

jeikaps.profile.unfollow = function(o) {
    majaX({
        url: '/user/unfollow',
        type: 'json',
        method: 'POST',
        data: {
            '_csrf': encodeURIComponent(jeikaps.csrfToken),
            'uid': jeikaps.uid
        }
    }, function (a) {
        if (a.status == 1) {
          o.innerHTML = 'РџРѕРґРїРёСЃР°С‚СЊСЃСЏ';
          o.setAttribute('onclick', 'jeikaps.profile.follow(this)');
        }
    });
};

function updateTime() {
    var qa = getByClass('timeago', document.body);
    each(qa, function (k) {
        k.innerHTML = timeAgo(parseInt(k.getAttribute('datetime') || k.getAttribute('title')));
    });
}

function getCsrfTokenString() {
    return '' + jeikaps.csrfToken.name + '=' + '';
}

function timeAgo(time) {
    time = Math.round((Date.now() - (time)) / 1000);
    if (time < 5) return "С‚РѕР»СЊРєРѕ С‡С‚Рѕ";
    else if (time < 60) return 'РјРµРЅСЊС€Рµ РјРёРЅСѓС‚С‹ РЅР°Р·Р°Рґ';
    else if (time < 3600) return declOfNum((time - (time % 60)) / 60, ['РјРёРЅСѓС‚Сѓ', 'РјРёРЅСѓС‚С‹', 'РјРёРЅСѓС‚']) + ' РЅР°Р·Р°Рґ';
    else if (time < 86400) return declOfNum((time - (time % 3600)) / 3600, ['С‡Р°СЃ', 'С‡Р°СЃР°', 'С‡Р°СЃРѕРІ']) + ' РЅР°Р·Р°Рґ';
    else if (time < 2073600) return declOfNum((time - (time % 86400)) / 86400, ['РґРµРЅСЊ', 'РґРЅСЏ', 'РґРЅРµР№']) + ' РЅР°Р·Р°Рґ';
    else if (time < 62208000) return declOfNum((time - (time % 2073600)) / 2073600, ['РјРµСЃСЏС†', 'РјРµСЃСЏС†Р°', 'РјРµСЃСЏС†РµРІ']) + ' РЅР°Р·Р°Рґ';
}

function declOfNum(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}