onDomReady(function() {
    /*var notification = !sessionStorage.getItem("c_notification") ? io.connect('https://jeikaps-c9-riabchych.c9.io/notification') : null;
    var feed = !sessionStorage.getItem("c_feed") ? io.connect('https://jeikaps-c9-riabchych.c9.io/feed') : null;

    notification&&notification.on('connect', function() {
        sessionStorage.setItem("c_notification", "1");
        notification.emit('notification','hi!');
    });
    
    notification&&notification.on('notification', function(msg) {
        console.log(msg);
    });
    
    notification&&notification.on('disconnect', function() {
        sessionStorage.removeItem("c_notification");
        notification.emit('notification', 'goodbay!');
    });

    feed&&feed.on('connect', function() {
        sessionStorage.setItem("c_feed", "1");
        feed.emit('feed','woot');
    });
    
    feed&&feed.on('feed', function(msg) {
        console.log(msg);
    });
    
    feed&&feed.on('disconnect', function() {
        sessionStorage.removeItem("c_feed");
        feed.emit('feed','goodbay');
    });*/
});