function createElement(tagName, attr, style) {

    var el = document.createElement(tagName);
    if (attr) {
        extend(el, attr);
    }
    if (style) {
        css(el).set(style);
    }
    return el;
}

function createFragment(doc) {
    doc = doc || document;
    var frag = doc.createDocumentFragment(),
        elem = doc.createElement('div'),
        range = doc.createRange;

    frag.appendChild(elem);
    if (range) {
        range.selectNodeContents(elem);
        return range.createContextualFragment ? function (html) {
            if (!html) {
                return doc.createDocumentFragment();
            }
            return range.createContextualFragment(html);
        } : function (html) {
            if (!html) {
                return doc.createDocumentFragment();
            }
            elem.innerHTML = html;
            while (elem.firstChild) {
                frag.appendChild(elem.firstChild);
            }
            return frag;
        };
    }
}

function show(elem) {
    if (!elem || !elem.style) {
        return false;
    }
    var i = 0,
        l = 0,
        old = elem.olddisplay,
        newStyle = 'block',
        tag = elem.tagName.toLowerCase();

    if (arguments.length > 1) {
        for (l = arguments.length; i < l; i += 1) {
            show(arguments[i]);
        }
        return true;
    }
    css(elem).set('display', old || '');

    if (css(elem).get('display') === 'none') {
        if (css(elem).hasClass('inline')) {
            newStyle = 'inline';
        }
        else {
            if (tag === 'tr' && !browser.msie) {
                newStyle = 'table-row';
            }
            else {
                if (tag === 'table' && !browser.msie) {
                    newStyle = 'table';
                }
                else {
                    newStyle = 'block';
                }
            }
        }
        elem.olddisplay = newStyle;
        css(elem).set('display', newStyle);
    }
}

function hide(elem) {
    if (!elem || !elem.style) {
        return false;
    }
    var l = arguments.length,
        i = 0,
        d = 0;
    if (l > 1) {
        for (i = 0; i < l; i += 1) {
            hide(arguments[i]);
        }
        return true;
    }
    d = css(elem).get('display');
    elem.olddisplay = (d !== 'none') ? d : '';
    css(elem).set('display', 'none');
}

function isVisible(elem) {
    if (!elem || !elem.style) {
        return false;
    }
    return css(elem).get('display') !== 'none';
}

function toggle(elem, v) {
    if (v === undefined) {
        v = !isVisible(elem);
    }
    if (v) {
        show(elem);
    }
    else {
        hide(elem);
    }
}

function getById(element) {
    return (typeof element === 'string' || typeof element === 'number') ? document.getElementById(element) : Object;
}

function getByTag(searchTag, node) {
    return (node || document).getElementsByTagName(searchTag);
}

function getByClass(searchClass, node, tag) {
    node = node || document;
    tag = tag || '*';
    var classElements = [],
        nodes = '',
        i = 0,
        l = 0,
        els = 0,
        pattern = 0;

    if (!browser.msie8 && node.querySelectorAll && tag !== '*') {
        return node.querySelectorAll(tag + '.' + searchClass);
    }
    if (node.getElementsByClassName) {
        nodes = node.getElementsByClassName(searchClass);
        if (tag !== '*') {
            tag = tag.toUpperCase();
            for (l = nodes.length; i < l; i += 1) {
                if (nodes[i].tagName.toUpperCase() === tag) {
                    classElements.push(nodes[i]);
                }
            }
        }
        else {
            classElements = Array.prototype.slice.call(nodes);
        }
        return classElements;
    }

    els = getByTag(tag, node);
    pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
    for (l = els.length; i < l; i += 1) {
        if (pattern.test(els[i].className)) {
            classElements.push(els[i]);
        }
    }
    return classElements;
}

function getByTagOne(searchTag, node) {
    node = node || document;
    return node.querySelector(searchTag) || getByTag(searchTag, node)[0];
}

function insertAfter(parent, node, referenceNode) {
    return parent.insertBefore(node, referenceNode.nextSibling);
}

function insertBefore(parent, node, referenceNode) {
    return parent.insertBefore(node, referenceNode);
}

function getByAttrVal(searchTag, attr, value, node) {
    var el = getByTag(searchTag, node),
        tagElements = [];
    each(el, function (o) {
        if (o.getAttribute(attr) === value) {
            tagElements.push(o);
        }
    });
    return tagElements;
}

function getX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (true) {
            curleft += obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
        }
    }
    else {
        if (obj.x) {
            curleft += obj.x;
        }
    }
    return curleft;
}

function getY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (true) {
            curtop += obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
        }
    }
    else {
        if (obj.y) {
            curtop += obj.y;
        }
    }
    return curtop;
}

function remove(object) {
    if (object.length > 0) {
        each(object, function (k) {
            k.parentNode.removeChild(k);
        });
    }
    else {
        if (object && object.parentNode) {
            return object.parentNode.removeChild(object);
        }
    }
}

function replace(object, content) {
    if (object && object.parentNode) {
        return object.parentNode.replaceChild(content, object);
    }
    return object;
}
