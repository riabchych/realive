MessageBox = Class.create({

    initialize: function (options) {
        this.options = {
            title: '',
            width: 410,
            height: 'auto',
        };
        this.options = Object.extend(options);

        this.boxContainer = new Element('div', {
            'class': 'box-container',
            'style': 'display:none'
        });
        this.boxTitleWrap = new Element('div', {
            'class': 'box-title-wrap'
        });
        this.boxTitle = new Element('div', {
            'class': 'box-title'
        }).update(this.options.title);
        this.boxCloseButton = new Element('div', {
            'class': 'box-close-button',
        });
        this.boxBody = new Element('div', {
            'class': 'box-body'
        });
        this.boxControls = new Element('div', {
            'class': 'box-controls'
        });
        this.boxButton = new Element('div', {
            'class': 'blue-button f-right'
        }).update('Закрыть');
        this.overlay = new Element('div');

        Object.extend(this.overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
            width: '100%',
            backgroundColor: '#000',
            display: 'none',
            opacity: '0.7'
        });
        var patern = new RegExp("<img([^>]*)\/>", "gi");

        if (patern.test(this.options.body)) {
            this.options.body = this.options.body.replace(patern, '<img$1 data-preloader="1" />');
            this.boxBody.addClassName('loading');
        }

        if (typeof this.options.body == 'object') {
            this.boxBody.insert(this.options.body)
        } else {
            this.boxBody.update(this.options.body);
        }

        this.boxTitleWrap.insert(this.boxTitle);
        this.boxTitleWrap.insert(this.boxCloseButton);
        this.boxControls.insert(this.boxButton);

        this.boxContainer.insert(this.boxTitleWrap);
        this.boxContainer.insert(this.boxBody);
        this.boxContainer.insert(this.boxControls);

        document.body.insert(this.boxContainer);
        document.body.insert(this.overlay);

        var self = this;
        $$('img[data-preloader="1"]').each(function (element) {
            element.observe('load', function () {
                element.show();
                self.boxBody.removeClassName('loading');
                self.refreshBox();
            });
        });

        this.overlay.observe('click', this.close.bind(this));
        this.boxCloseButton.observe('click', this.close.bind(this));
        this.boxButton.observe('click', this.close.bind(this));
        document.observe('keyup', this.esc.bind(this));
        Event.observe(window, 'resize', this.boxRefreshCoords.bind(this));

        this.boxContainer.open = this.open.bind(this);
        this.boxContainer.close = this.close.bind(this);

        return this.boxContainer;
    },

    open: function () {
        this.enableOverlay();
        this.boxContainer.show();
        this.refreshBox();
    },

    close: function () {
        this.boxContainer.hide();
        this.disableOverlay();
        this.boxContainer.remove();
        this.overlay.remove();
    },

    esc: function (e) {
        e = e || window.event;
        if (e.keyCode == 27) {
            this.close()
        }
    },

    refreshBox: function () {
        // Set title
        if (this.options.title) {
            this.boxTitle.update(this.options.title);
            this.boxBody.removeClassName('box-no-title');
            this.boxTitleWrap.show();
        } else {
            this.boxBody.addClassName('box-no-title');
            this.boxTitleWrap.hide();
        }
        // Set box dimensions
        this.boxContainer.setStyle({
            'width': typeof (this.options.height) == 'string' ? this.options.height : this.options.height + 'px'
        });
        this.boxRefreshCoords();
    },

    boxRefreshCoords: function (cont) {
        var e_dims = Element.getDimensions(this.boxContainer);
        var b_dims = Element.getDimensions(this.overlay);
        var height = document.viewport.getDimensions().height;
        this.overlay.style.height = height + 'px';
        this.boxContainer.style.left = ((b_dims.width / 2) - (e_dims.width / 2)) + 'px';
        this.boxContainer.style.top = (height - e_dims.height) / 5 + 'px';
    },

    enableOverlay: function () {
        this.overlay.show();
    },

    disableOverlay: function () {
        this.overlay.hide();
    }
});