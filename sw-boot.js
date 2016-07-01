// Libs
importScripts('node_modules/sw-toolbox/sw-toolbox.js');
importScripts('node_modules/pouchdb/dist/pouchdb.js');
// Reflect & SystemJS
importScripts('node_modules/reflect-metadata/Reflect.js');
importScripts('node_modules/systemjs/dist/system.src.js');
importScripts('systemjs.config.js');
importScripts('/node_modules/sw-toolbox/sw-toolbox.js');
var context = self;
context.addEventListener('install', function (event) { return event.waitUntil(context.skipWaiting()); });
context.addEventListener('activate', function (event) { return event.waitUntil(context.clients.claim()); });
System.import('app/service-worker/service-worker')
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=sw-boot.js.map