function has(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function isEmpty(obj) {
    if (obj === null) {
        return true;
    }
    if (isArray(obj) || isString(obj)) {
        return obj.length === 0;
    }
    var key = 0;
    for (key in obj) {
        if (has(obj, key)) {
            return false;
        }
    }
    return true;
}

function trim(text) {
    return (text || '').replace(/^\s+|\s+$/g, '');
}

function parseJSON(obj) {
    return (window.JSON && JSON.parse) ? JSON.parse(obj) : eval('(' + obj + ')');
}

function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
}

function rand(mi, ma) {
    return Math.random() * (ma - mi + 1) + mi;
}

function irand(mi, ma) {
    return Math.floor(rand(mi, ma));
}

function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
}

function isArray(obj) {
    return toString.call(obj) === '[object Array]';
}

function isNodeList(obj) {
    return toString.call(obj) === '[object NodeList]';
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' ;
}

function isMouseEvent(obj) {
    return toString.call(obj) === '[object MouseEvent]';
}

function isArguments(obj) {
    return toString.call(obj) === '[object Arguments]';
}

function isHtmlDiv(obj) {
    return toString.call(obj) === '[object HTMLDivElement]';
}

function isString(obj) {
    return toString.call(obj) === '[object String]';
}

function isNumber(obj) {
    return toString.call(obj) === '[object Number]';
}

function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

function isDate(obj) {
    return toString.call(obj) === '[object Date]';
}

function isRegExp(obj) {
    return toString.call(obj) === '[object RegExp]';
}

function isNull(obj) {
    return obj === null;
}

function isUndefined(obj) {
    return obj === void 0;
}

function stringify(object) {
    return JSON.stringify(object);
}

function emptyFunction() {}

function unfilterJSON(str, filter) {
    return str.replace(filter || /^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1');
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeHTML(str) {
    return str.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function strip(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function stripTags(str) {
    return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
}

function stripScripts(str) {
    return str.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
}

function evalScripts(str) {
    var scripts;
    while (scripts = /<script[^>]*>([\s\S]+?)<\/script>/gi.exec(str)) {
        eval.call(window, scripts[1]);
    }
    return str;
}

function match(element, selector) {
    if (isString(selector)) {
        return Prototype.Selector.match(element, selector);
    }
    return selector.match(element);
}

function now() {
    return (new Date()).getTime();
}

function extend() {
    var a = arguments, target = a[0] || {}, i = 1, l = a.length, deep = false, options;

      if ( typeof target === 'boolean') {
         deep = target;
         target = a[1] || {};
         i = 2;
      }

      if ( typeof target !== 'object' && !isFunction(target))
         target = {};

      for (; i < l; ++i) {
         if (( options = a[i]) != null) {
            for (var name in options ) {
               var src = target[name], copy = options[name];

               if (target === copy)
                  continue;

               if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
                  target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
               } else if (copy !== undefined) {
                  target[name] = copy;
               }
            }
         }
      }

      return target;
}

function each(obj, iterator, context) {
    var nativeForEach = Array.prototype.forEach,
        i = 0,
        l = 0,
        key = {};
    if (obj === null) {
        return false;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else {
        if (obj.length === +obj.length) {
            for (i = 0, l = obj.length; i < l; i += 1) {
                if (has(obj, i) && isObject(iterator.call(context, obj[i], i, obj))) {
                    return false;
                }
            }
        } else {
            for (key in obj) {
                if (has(obj, key)) {
                    if (isObject(iterator.call(context, obj[key], key, obj))) {
                        return false;
                    }
                }
            }
        }
    }
}

function indexOf(arr, value, from) {
    var i = 0,
        l = arr.length;
    for (i = (from || 0); i < l; i += 1) {
        if (arr[i] === value) {
            return i;
        }
    }
    return -1;
}

function choice() {
    var returnValue = null,
        i = 0,
        lambda = 0;

    for (i = 0; i < arguments.length; i += 1) {
        lambda = arguments[i];
        try {
            returnValue = lambda();
            break;
        } catch (e) {
            console.log('Error: ' + e);
        }
    }

    return returnValue;
}

function getHostname() {
    return location.protocol + '//' + location.host;
}

function url2obj(hash) {
    var action,
        obj = {},
        properties = '',
        p = '';
    action = hash.substr(0, 3) === '#!/' ? hash.substr(2) : hash;
    obj.hash = action;
    if (indexOf(action, '?') > 0) {
        properties = action.split('?');
        obj.hash = properties[0];
        properties = properties[1].split(/&/);
        obj.params = {};
        each(properties, function (k) {
            p = k.split('=');
            obj.params[p[0]] = p[1];
        });
    }
    return obj;
}

function history(callback) {
    window.addEvent("hashchange", callback);
    return true;
}

/*function top() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}*/

function getWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function getHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function total(d) {
    var b = document.body,
        e = document.documentElement;
    return d ? Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight)) : Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth));
}

Object.prototype.addEvent = function(sEvent, fnHandler, bUseCapture) {
   if (this.attachEvent) {
      this.attachEvent('on' + sEvent, fnHandler, bUseCapture);
   } else {
      this.addEventListener(sEvent, fnHandler, bUseCapture);
   }
   return this;
};

Object.prototype.removeEvent = function(sEvent, fnHandler, bUseCapture) {
   if (this.detachEvent) {
      this.detachEvent('on' + sEvent, fnHandler, bUseCapture);
   } else {
      this.removeEventListener(sEvent, fnHandler, bUseCapture);
   }
   return this;
};

Function.prototype.bind = function(object) {
   var __method = this;
   return function() {
      return __method.apply(object, arguments);
   };
};

String.prototype.hashCode = function() {
   var hash = 0,
       c = '';
   if (this.length === 0) {
      return hash;
   }
   for (var i = 0; i < this.length; i += 1) {
      c = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash = hash & hash;
      // Convert to 32bit integer
   }
   return hash;
};