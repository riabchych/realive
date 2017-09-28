if (!window.domain) {
   var domain = Base.getHostname();
}

if (!window._ua) {
   var _ua = navigator.userAgent.toLowerCase();
}
browser = {
   version: (_ua.match(/.+(?:me|ox|on|rv|it|era|ie)[\/: ]([\d.]+)/) || [ 0, '0' ])[1],
   opera: /opera/i.test(_ua),
   msie: (/msie/i.test(_ua) && !/opera/i.test(_ua)),
   msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
   msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
   msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
   msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
   mozilla: /firefox/i.test(_ua),
   chrome: /chrome/i.test(_ua),
   safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
   iphone: /iphone/i.test(_ua),
   ipod: /ipod/i.test(_ua),
   iphone4: /iphone.*OS 4/i.test(_ua),
   ipod4: /ipod.*OS 4/i.test(_ua),
   ipad: /ipad/i.test(_ua),
   android: /android/i.test(_ua),
   bada: /bada/i.test(_ua),
   mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile/i.test(_ua),
   msie_mobile: /iemobile/i.test(_ua),
   safari_mobile: /iphone|ipod|ipad/i.test(_ua),
   opera_mobile: /opera mini|opera mobi/i.test(_ua),
   mac: /mac/i.test(_ua)
};
