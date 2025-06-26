
// クリックでWebページを開く
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    let url = "/";
    if (event.notification.data.url) {
        url = event.notification.data.url
    }

    let pathname = location.pathname;
    let webroot = pathname.substr(0, pathname.indexOf('/', 1) +1);

    event.waitUntil(
        clients.matchAll({type: 'window'}).then(function(clist) {
            for(let i=0; i<clist.length; i++) {
                let c = clist[i];
                console.log(c.url);
                if ( c.url.indexOf(webroot) ) {
                    if ( c.frameType === 'top-level' ) {
                        c.navigate(url);
                        return c.focus();
                    }
                }
            }
            clients.openWindow(url);
        })
    );
});

self.addEventListener('notificationshow', function(event) {
    setTimeout(function() {
        event.notification.close();
    }, 5000);
});

self.addEventListener('error', function() {
    // 表示終了 FireFoxでは表示終了しないと表示できない
});
