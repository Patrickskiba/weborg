/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundle.js",
    "revision": "a4f4c16b6f5e08e95863d67b40f68723"
  },
  {
    "url": "dropbox.svg",
    "revision": "5ba9a2a229b94c98c6ac3eb9c75daead"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "d70e3a9eafc4fb68373271576901e144"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "5b5fee8c8dbca82ccd74fd8d496ef4b1"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "5d5499395f2bf278130d76010e35400e"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "ad4c5b937156e986908096da50045b9d"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "ec0da70932abf4b54bab24f42b7839ca"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "d92665da5eaf96e55d435a6ebcbee340"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "e5cbb6a1b6d06ae1befb9b162bbd2aca"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "e3db110bfddfb2786ea413629930952f"
  },
  {
    "url": "index.html",
    "revision": "b1a846f97d27eb9c8cad54cda7c47bbd"
  },
  {
    "url": "manifest.json",
    "revision": "2223738708018fc98c2f07f677fb1dfa"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
