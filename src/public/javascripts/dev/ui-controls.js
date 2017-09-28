messageBox = {
    options: {
        caller: false,
        title: '',
        width: 410,
        height: 'auto',
    },
    boxContainer: false,
    boxTitleWrap: false,
    boxTitle: false,
    boxCloseButton: false,
    boxBody: false,
    boxControls: false,
    boxButton: false,
    overlay: false
};
messageBox.boxes = {};

messageBox.init = function (options) {
    this.options = extend(this.options, options);

    this.boxContainer = createElement('div', {
        className: 'box-container'
    });
    this.boxTitleWrap = createElement('div', {
        className: 'box-title-wrap'
    });
    this.boxTitle = createElement('div', {
        className: 'box-title',
        innerHTML: this.options.title
    });
    this.boxCloseButton = createElement('div', {
        className: 'box-close-button'
    });
    this.boxBody = createElement('div', {
        className: 'box-body'
    });
    this.boxControls = createElement('div', {
        className: 'box-controls'
    });
    this.boxButton = createElement('button', {
        className: 'blue-button f-right',
        innerHTML: 'Р—Р°РєСЂС‹С‚СЊ'
    });
    this.overlay = createElement('div', {
        className: 'overlay'
    });
    var patern = new RegExp("<img([^>]*)\/>", "gi");
    if (patern.test(this.options.body)) {
        this.options.body = this.options.body.replace(patern, '<img$1 onload="messageBox.afterLoad(this)" />');
        css(this.boxBody).addClass('loading');
    }
    if (typeof this.options.body == 'object') {
        this.boxBody.appendChild(this.options.body)
    } else {
        this.boxBody.innerHTML = this.options.body;
    }

    this.boxTitleWrap.appendChild(this.boxTitle);
    this.boxTitleWrap.appendChild(this.boxCloseButton);
    this.boxControls.appendChild(this.boxButton);

    this.boxContainer.appendChild(this.boxTitleWrap);
    this.boxContainer.appendChild(this.boxBody);
    this.boxContainer.appendChild(this.boxControls);

    document.body.appendChild(this.boxContainer);
    document.body.appendChild(this.overlay);

    this.overlay.addEvent('click', this.hide);
    this.boxCloseButton.addEvent('click', this.hide);
    this.boxButton.addEvent('click', this.hide);
    document.addEvent('keyup', this.esc);
    window.addEvent('resize', this.resize);
    this.boxes[this.options.caller] = this.boxContainer;
    return messageBox.boxContainer;
};

messageBox.show = function (caller) {
    messageBox.boxContainer = messageBox.boxes[caller];
    show(messageBox.boxContainer);
    messageBox.enableOverlay();
    messageBox.refreshBox();
};

messageBox.hide = function () {
    hide(messageBox.boxContainer);
    messageBox.disableOverlay();
    remove(messageBox.boxContainer);
    remove(messageBox.overlay);
};

messageBox.esc = function (e) {
    e = e || window.event;
    if (e.keyCode == 27) {
        messageBox.hide()
    }
};

messageBox.resize = function () {
    messageBox.boxRefreshCoords();
};
messageBox.afterLoad = function (el) {
    show(el);
    css(messageBox.boxBody).removeClass('loading');
    messageBox.refreshBox();
};

messageBox.refreshBox = function () {
    // Set title
    if (messageBox.options.title) {
        messageBox.boxTitle.innerHTML = messageBox.options.title;
        css(messageBox.boxBody).removeClass('box-no-title');
        show(messageBox.boxTitleWrap);
    } else {
        css(messageBox.boxBody).addClass('box-no-title');
        hide(messageBox.boxTitleWrap);
    }
    // Set box dimensions
    css(messageBox.boxContainer).set('width', typeof (messageBox.options.width) == 'string' ? messageBox.options.width : messageBox.options.width + 'px');
    css(messageBox.boxContainer).set('height', typeof (messageBox.options.height) == 'string' ? messageBox.options.height : messageBox.options.height + 'px');
    messageBox.boxRefreshCoords();
};

messageBox.boxRefreshCoords = function (cont) {
    var height = getHeight();
    var width = getWidth();
    var top = browser.mobile ? intval(window.pageYOffset) : 0;
    var containerSize = css(messageBox.boxContainer).getSize();

    css(messageBox.boxContainer).set('top', Math.max(0, top + (height - containerSize[1]) / 3) + 'px');
    css(messageBox.boxContainer).set('left', (width / 2) - (containerSize[0] / 2) + 'px');

    css(messageBox.overlay).set('height', height + 'px');
    css(messageBox.overlay).set('width', width + 'px');
};

messageBox.enableOverlay = function () {
    show(messageBox.overlay);
};

messageBox.disableOverlay = function () {
    hide(messageBox.overlay);
};