// Libs
importScripts('node_modules/sw-toolbox/sw-toolbox.js');
importScripts('node_modules/pouchdb/dist/pouchdb.js');

// Reflect & SystemJS
importScripts('node_modules/reflect-metadata/Reflect.js');
importScripts('node_modules/systemjs/dist/system.src.js');
importScripts('systemjs.config.js');
importScripts('/node_modules/sw-toolbox/sw-toolbox.js');

var context: any = self;
context.addEventListener('install', event => event.waitUntil(context.skipWaiting()));
context.addEventListener('activate', event => event.waitUntil(context.clients.claim()));

System.import('app/service-worker/service-worker')
      .catch(err => console.error(err));