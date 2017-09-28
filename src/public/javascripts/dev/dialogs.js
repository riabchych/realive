MessageBox = {
   options: {
   	caller : false,
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
MessageBox.boxes = {};

MessageBox.init = function(options) {
   this.options = Base.extend(this.options, options);

   this.boxContainer = DOM.createElement('div', {
      className: 'box-container'
   });
   this.boxTitleWrap = DOM.createElement('div', {
      className: 'box-title-wrap'
   });
   this.boxTitle = DOM.createElement('div', {
      className: 'box-title',
      innerHTML: this.options.title
   });
   this.boxCloseButton = DOM.createElement('div', {
      className: 'box-close-button'
   });
   this.boxBody = DOM.createElement('div', {
      className: 'box-body'
   });
   this.boxControls = DOM.createElement('div', {
      className: 'box-controls'
   });
   this.boxButton = DOM.createElement('button', {
      className: 'blue-button f-right',
      innerHTML: 'Р—Р°РєСЂС‹С‚СЊ'
   });
   this.overlay = DOM.createElement('div', {
      className: 'overlay'
   });
   var patern = new RegExp("<img([^>]*)\/>","gi");
   if(patern.test(this.options.body)) {
   	this.options.body = this.options.body.replace(patern, '<img$1 onload="MessageBox.afterLoad(this)" />');
   	CSS.addClass(this.boxBody, 'loading');
   }
   if ( typeof this.options.body == 'object') {
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
   return MessageBox.boxContainer;
};

MessageBox.show = function(caller) {
   MessageBox.boxContainer = MessageBox.boxes[caller];
   DOM.show(MessageBox.boxContainer);
   MessageBox.enableOverlay();
   MessageBox.refreshBox();
};

MessageBox.hide = function() {
   DOM.hide(MessageBox.boxContainer);
   MessageBox.disableOverlay();
   DOM.remove(MessageBox.boxContainer);
   DOM.remove(MessageBox.overlay);
};

MessageBox.esc = function(e) {
   e = e || window.event;
   if (e.keyCode == 27) {
      MessageBox.hide()
   }
};

MessageBox.resize = function() {
   MessageBox.boxRefreshCoords();
};
MessageBox.afterLoad = function(el) {
   DOM.show(el);
   CSS.removeClass(MessageBox.boxBody, 'loading');
   MessageBox.refreshBox();
};

MessageBox.refreshBox = function() {
   // Set title
   if (MessageBox.options.title) {
      MessageBox.boxTitle.innerHTML = MessageBox.options.title;
      CSS.removeClass(MessageBox.boxBody, 'box-no-title');
      DOM.show(MessageBox.boxTitleWrap);
   } else {
      CSS.addClass(MessageBox.boxBody, 'box-no-title');
      DOM.hide(MessageBox.boxTitleWrap);
   }
   // Set box dimensions
   MessageBox.boxContainer.style.width = typeof (MessageBox.options.width) == 'string' ? MessageBox.options.width : MessageBox.options.width + 'px';
   MessageBox.boxContainer.style.height = typeof (MessageBox.options.height) == 'string' ? MessageBox.options.height : MessageBox.options.height + 'px';
   MessageBox.boxRefreshCoords();
};

MessageBox.boxRefreshCoords = function(cont) {
   var height = Base.height();
   var width = Base.width();
   var top = browser.mobile ? intval(window.pageYOffset) : 0;
   var containerSize = CSS.getSize(MessageBox.boxContainer);

   MessageBox.boxContainer.style.top = Math.max(0, top + (height - containerSize[1]) / 3) + 'px';
   MessageBox.boxContainer.style.left = (width / 2) - (containerSize[0] / 2) + 'px';

   MessageBox.overlay.style.height = height + 'px';
   MessageBox.overlay.style.width = width + 'px';
};

MessageBox.enableOverlay = function() {
   DOM.show(MessageBox.overlay);
};

MessageBox.disableOverlay = function() {
   DOM.hide(MessageBox.overlay);
};