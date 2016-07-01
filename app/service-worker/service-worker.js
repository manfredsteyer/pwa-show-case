"use strict";
var core_1 = require('@angular/core');
var booking_service_1 = require('../booking.service');
console.debug("starting service-worker");
var PROVIDERS = [
    booking_service_1.BookingService
];
var injector = core_1.ReflectiveInjector.resolveAndCreate(PROVIDERS);
var bs = injector.get(booking_service_1.BookingService);
var context = self;
context.addEventListener('sync', function (event) {
    console.debug("Service Worker: sync, tag=" + event.tag);
    if (event.tag == 'upload') {
        event.waitUntil(bs.upload().then(function (_) { return console.debug('background-upload finished'); }));
    }
});
context.addEventListener('push', function (event) {
    console.log('Push message', event);
    var title = 'Your flight is delayed';
    event.waitUntil(bs.sync().then(function (p) { return context.registration.showNotification(title, {
        body: 'Your flight is delayed',
        icon: '/images/touch/icon-128x128.png',
        tag: 'my-tag'
    }); }));
});
self.addEventListener('notificationclick', function (event) {
    console.log('Notification click: tag ', event.notification.tag);
    event.notification.close();
    var url = 'http://localhost:8080';
    event.waitUntil(clients.matchAll({
        type: 'window'
    })
        .then(function (windowClients) {
        console.debug("win-count: " + windowClients.length);
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            console.debug(" > client-url: " + client.url + ", url: " + url);
            var clientUrl = client.url;
            if (clientUrl.startsWith(url) && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
    }));
});
var context = self;
toolbox.options.debug = true;
toolbox.precache([
    '/',
    '/app/flightsearch.component.css',
    '/app/flightsearch.component.html',
    '/app/flightsearch.component.js',
    '/app/bookings-doc.js',
    '/app/booking-status.pipe.js',
    '/app/booking.service.js',
    '/app/main.js',
    '/images/touch/icon-128x128.png'
]);
toolbox.router.get('/(.*)', toolbox.networkOnly, { origin: 'http://www.angular.at' });
toolbox.router.default = toolbox.cacheFirst;
// v3
//# sourceMappingURL=service-worker.js.map