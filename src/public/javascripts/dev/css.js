var css = (function (window) {
    var css = function (elem) {

        var _ = this;
        this.get = function (name) {

            var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
                rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
                rposition = /^(top|right|bottom|left)$/,
                ropacity = /opacity=([^)]*)/,
                rmargin = /^margin/;

            if (typeof name != 'string') {
                return '';
            }
            name = name.replace(/\-(\w)/g, function () {
                return arguments[1].toUpperCase();
            });
            var getWidthOrHeight = function (elem, name) {

                var ret = name === "width" ? elem.clientWidth : elem.clientHeight,
                    pt = parseFloat(new css(elem).get('paddingTop')),
                    pb = parseFloat(new css(elem).get('paddingBottom')),
                    pl = parseFloat(new css(elem).get('paddingLeft')),
                    pr = parseFloat(new css(elem).get('paddingRight'));

                ret = (name === "width" ? ret - pl - pr : ret - pt - pb) + 'px';
                return ret;

            };
            var ret, style, computed;

            if (window.getComputedStyle) {
                var width,
                    minWidth,
                    maxWidth;

                computed = window.getComputedStyle(elem, null);
                style = elem.style;
                name = name === "float" ? "cssFloat" : name; //cssFloatиЋ·еЏ–float

                if (computed) {
                    ret = computed[name];
                    // A tribute to the "awesome hack by Dean Edwards"
                    // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                    // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                    // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                    if (rnumnonpx.test(ret) && rmargin.test(name)) {
                        width = style.width;
                        minWidth = style.minWidth;
                        maxWidth = style.maxWidth;

                        style.minWidth = style.maxWidth = style.width = ret;
                        ret = computed.width;

                        style.width = width;
                        style.minWidth = minWidth;
                        style.maxWidth = maxWidth;
                    }
                }

                return ret;
            } else if (document.documentElement.currentStyle) {

                var left,
                    rsLeft;

                style = elem.style;
                ret = elem.currentStyle && elem.currentStyle[name];
                name = name === "float" ? "styleFloat" : name;
                if (name === 'opacity') {

                    return ropacity.test((elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : 1;

                } else if (name === "width" || name === "height") {

                    if (elem.currentStyle[name] === "auto") {
                        ret = getWidthOrHeight(elem, name);
                        return ret;
                    }

                }

                // Avoid setting ret to empty string here
                // so we don't default to auto
                if (ret === null && style && style[name]) {
                    ret = style[name];
                }

                // From the awesome hack by Dean Edwards
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

                // If we're not dealing with a regular pixel number
                // but a number that has a weird ending, we need to convert it to pixels
                // but not position css attributes, as those are proportional to the parent element instead
                // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
                if (rnumnonpx.test(ret) && !rposition.test(name)) {

                    // Remember the original values
                    left = style.left;
                    rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                    // Put in the new values to get a computed value out
                    if (rsLeft) {
                        elem.runtimeStyle.left = elem.currentStyle.left;
                    }
                    style.left = name === "fontSize" ? "1em" : ret;
                    ret = style.pixelLeft + "px";

                    // Revert the changed values
                    style.left = left;
                    if (rsLeft) {
                        elem.runtimeStyle.left = rsLeft;
                    }
                }

                return ret === "" ? "auto" : ret;

            } else {
                return elem.style[name];
            }
        };
        this.set = function (name, value) {

            if (name && typeof name == "object" && value === undefined) {
                var tmpStyle = '';
                for (var pro in name) {
                    if (!window.getComputedStyle && pro == 'opacity') {
                        tmpStyle += "filter:alpha(opacity=" + 100 * name[pro] + ");";
                    } else {
                        tmpStyle += pro + ':' + name[pro] + ";";
                    }
                }
                elem.style.cssText += ";" + tmpStyle;
                return;
            }

            name = name.replace(/-([\w])/, function () {
                return arguments[1].toUpperCase();
            });
            if (window.getComputedStyle) {
                name = name === "float" ? "cssFloat" : name;
            } else {
                name = name === "float" ? "styleFloat" : name;
                if (name === "opacity") {
                    elem.style.filter = "alpha(opacity=" + 100 * value + ")";
                }
            }
            elem.style[name] = value;
        };
        
        this.hasClass = function(name) {
            return elem && (new RegExp('(\\s|^)' + name + '(\\s|$)')).test(elem.className);
        }
        
        this.addClass = function(name) {
            if (elem && !css(elem).hasClass(name)) {
                elem.className = (elem.className ? elem.className + ' ' : '') + name;
            }
        }
        
        this.removeClass = function(name) {
            if (elem && css(elem).hasClass(name)) {
                elem.className = trim((elem.className || '').replace((new RegExp('(\\s|^)' + name + '(\\s|$)')), ' '));
            }
        }
        
        this.replaceClass = function(oldName, newName) {
            css(elem).removeClass(oldName);
            css(elem).addClass(newName);
        }
        
        this.getSize = function(withoutBounds) {
            var s = [0, 0],
                de = document.documentElement;
            if (elem === document) {
                s = [Math.max(de.clientWidth,
                        bodyNode.scrollWidth,
                        de.scrollWidth,
                        bodyNode.offsetWidth,
                        de.offsetWidth),
                    Math.max(de.clientHeight,
                        bodyNode.scrollHeight,
                        de.scrollHeight,
                        bodyNode.offsetHeight,
                        de.offsetHeight)
                ];
            } else if (elem) {
                function getWH() {
                    s = [elem.offsetWidth, elem.offsetHeight];
                    if (!withoutBounds)
                        return;
                    each(s, function (i) {
                        var which = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
                        each(which, function () {
                            s[i] -= parseFloat(css(elem).get('padding' + this)) || 0;
                            s[i] -= parseFloat(css(elem).get('border' + this + 'Width')) || 0;
                        });
                    });
                    s = [Math.round(s[0]), Math.round(s[1])];
                }
        
                if (!isVisible(elem)) {
                    var props = {
                        position: 'absolute',
                        visibility: 'hidden',
                        display: 'block'
                    };
                    var old = {};
                    each(props, function (i, v) {
                        old[i] = elem.style[i];
                        elem.style[i] = v;
                    });
                    getWH();
                    each(props, function (i) {
                        elem.style[i] = old[i];
                    });
                } else
                    getWH();
            }
            return s;
        }
        return this;
    };

    return function (elem) {
        return new css(elem);
    };

})(window);

