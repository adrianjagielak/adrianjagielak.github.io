'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "11534218536b0b2a57f55b1a38eb0eca",
"index.html": "bcf40f3893123c2d470195366eb18ebd",
"/": "bcf40f3893123c2d470195366eb18ebd",
"manifest.json": "ee042ea1f4726a8c764cec9e949d5599",
"favicon.png": "d2a87161782a4567902923778c52d062",
"icons/Icon-192.png": "d6719d97be9eaa31a3cbd71f89acc5f9",
"icons/Icon-512.png": "c070cfe1eb14075d666f674380365fb6",
"assets/AssetManifest.json": "26e4bd7b9a218d84e91aa7b63ec96284",
"assets/FontManifest.json": "2350e3e1cf1e6db8d1150649835f41c6",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "571cdf3bcdca2c8a28d36cda802c2054",
"assets/packages/design_system/assets/1.5x/altera_logo_mobile.png": "20426c1fa398a60cb10b994b0b7be192",
"assets/packages/design_system/assets/1.5x/altera_logo.png": "00ad5b6b8c083bd5b4032b80c5b151c5",
"assets/packages/design_system/assets/altera_logo_white_195.png": "df253126f0d76787731165aa0a6ee49c",
"assets/packages/design_system/assets/flags/1.5x/de.png": "672ebe1a0149b695c9be077a225a2aa6",
"assets/packages/design_system/assets/flags/1.5x/eu.png": "213ab7a68c846d7e9447588eb569a50e",
"assets/packages/design_system/assets/flags/1.5x/uk.png": "e923c38fccdc8e2163ec383f743eaa17",
"assets/packages/design_system/assets/flags/1.5x/pl.png": "d7054fb64da767da36df4a69ebe30cb9",
"assets/packages/design_system/assets/flags/de.png": "99ca955561bd45fd773b57778803de76",
"assets/packages/design_system/assets/flags/eu.png": "e8a47582723acc124c52289b9ba2a4f5",
"assets/packages/design_system/assets/flags/2.0x/de.png": "d624aa2f54ac966748861a6fe9365570",
"assets/packages/design_system/assets/flags/2.0x/eu.png": "c198131052fd3c8632f82b4f7ef79670",
"assets/packages/design_system/assets/flags/2.0x/uk.png": "2ccdda0a801f40266dede6f5fb5a91f7",
"assets/packages/design_system/assets/flags/2.0x/pl.png": "5c14c82af508fdab4ee083c896801b5e",
"assets/packages/design_system/assets/flags/uk.png": "ceaa14c4d0ae8521610779fd0426e867",
"assets/packages/design_system/assets/flags/3.0x/de.png": "e8497366c8e7b6bb427d6ed3e2bf0d03",
"assets/packages/design_system/assets/flags/3.0x/eu.png": "f965cbd79c2a73d7719097527820fbd4",
"assets/packages/design_system/assets/flags/3.0x/uk.png": "8f63c4ee5bd62ff5dd03021cd8c168b9",
"assets/packages/design_system/assets/flags/3.0x/pl.png": "c3669f61f377852c472a8da26532b7e3",
"assets/packages/design_system/assets/flags/pl.png": "8defdeccca909e580e24f559c791e0d4",
"assets/packages/design_system/assets/flags/4.0x/de.png": "13aba2866dac4b257486208aa99c705c",
"assets/packages/design_system/assets/flags/4.0x/eu.png": "414c6e703fd2d1ddfd08245c82ba725d",
"assets/packages/design_system/assets/flags/4.0x/uk.png": "83a90307da4c231c08bb907ab5100c3d",
"assets/packages/design_system/assets/flags/4.0x/pl.png": "07565fff91ba60c26460baeb99cc1360",
"assets/packages/design_system/assets/gold_promo_graphic.png": "f37e9b578cfb2eb508c61d8f1cced074",
"assets/packages/design_system/assets/altera_logo_white_168.png": "1ad4815e49dff7fc071331d67f1251fa",
"assets/packages/design_system/assets/tabs/1.5x/tab_icon_finances.png": "2180f0723cfb3cbe2682c5afc6baff9f",
"assets/packages/design_system/assets/tabs/1.5x/tab_icon_expenses.png": "c6b69682bc0ce264d6d356581facf1d1",
"assets/packages/design_system/assets/tabs/1.5x/tab_icon_sales.png": "6756b6e479a31d5ce1fe81aa3c8f4bc4",
"assets/packages/design_system/assets/tabs/1.5x/tab_icon_payments.png": "cfe962cfc14312e33175fcd1cab846ac",
"assets/packages/design_system/assets/tabs/tab_icon_finances.png": "0348658220e1f2f43e6fb22975facd1e",
"assets/packages/design_system/assets/tabs/tab_icon_expenses.png": "b8c7b70f654de915404997d7d4d83f09",
"assets/packages/design_system/assets/tabs/2.0x/tab_icon_finances.png": "5016e652a6444135b5bff4886e877f36",
"assets/packages/design_system/assets/tabs/2.0x/tab_icon_expenses.png": "9756c2aec497aab24436d23445ec16ca",
"assets/packages/design_system/assets/tabs/2.0x/tab_icon_sales.png": "48ba9f465419d96fe0dc2e111a0d9f44",
"assets/packages/design_system/assets/tabs/2.0x/tab_icon_payments.png": "334641588d9aecaa9d8a2f75e6ad5fad",
"assets/packages/design_system/assets/tabs/tab_icon_sales.png": "ec75f08d2fa53c59822fce92240fb42c",
"assets/packages/design_system/assets/tabs/3.0x/tab_icon_finances.png": "611df082df4e60d231c66fb34514fb08",
"assets/packages/design_system/assets/tabs/3.0x/tab_icon_expenses.png": "7b410cbe23039018e1c31b0143139200",
"assets/packages/design_system/assets/tabs/3.0x/tab_icon_sales.png": "dc1a9bd8dcc9df10e3e7f916f81095a9",
"assets/packages/design_system/assets/tabs/3.0x/tab_icon_payments.png": "8e423751a7ee4beb7d2a7f49f4d82bd2",
"assets/packages/design_system/assets/tabs/tab_icon_payments.png": "f48efd9211487d63c3e1e7d1ded9c353",
"assets/packages/design_system/assets/tabs/4.0x/tab_icon_finances.png": "bb52e475976c5f2ba61de9cc5cbc650f",
"assets/packages/design_system/assets/tabs/4.0x/tab_icon_expenses.png": "93dc793946b5287ff12deae8f1fabc2f",
"assets/packages/design_system/assets/tabs/4.0x/tab_icon_sales.png": "1bbd93819a633fa4428fef4dec67e9fd",
"assets/packages/design_system/assets/tabs/4.0x/tab_icon_payments.png": "9c4b9a409c4963c439b9617466c39d5c",
"assets/packages/design_system/assets/noisy_background.jpg": "fe5b87f6c3fedbe733a16984d8b6f78f",
"assets/packages/design_system/assets/2.0x/altera_logo_white_195.png": "b5e32fd906ecbb32da06d0a448555c0b",
"assets/packages/design_system/assets/2.0x/gold_promo_graphic.png": "1f81be757ca29cd7a42ec9d360f98c99",
"assets/packages/design_system/assets/2.0x/altera_logo_white_168.png": "c07b128fc23dff7450af34448c1d472a",
"assets/packages/design_system/assets/2.0x/star_big.png": "41fe5c78ab0f2b3166c041b7e66400d4",
"assets/packages/design_system/assets/2.0x/star_small.png": "b39cceea1e70af2f1300aa36a9de7c38",
"assets/packages/design_system/assets/2.0x/altera_logo_mobile.png": "9ab3e7f0f7340cee1ed573f67d7fcc57",
"assets/packages/design_system/assets/2.0x/altera_logo.png": "9da037ea66091a2db2c3401e6232163f",
"assets/packages/design_system/assets/star_big.png": "05e0002d2f82065b99ff16bb7a2bc293",
"assets/packages/design_system/assets/star_small.png": "c27200fdae85f596a2e148159e773c78",
"assets/packages/design_system/assets/altera_logo_mobile.png": "02c63379adb68ccc6adac5dc1852c7ed",
"assets/packages/design_system/assets/3.0x/altera_logo_white_195.png": "fa9befbf4d25e718a8f8a4f7ea7e30d2",
"assets/packages/design_system/assets/3.0x/gold_promo_graphic.png": "53f495c79375dad8edd41d99b7022b5b",
"assets/packages/design_system/assets/3.0x/altera_logo_white_168.png": "d4324344ba34fe8b61c184a0f2de3c5f",
"assets/packages/design_system/assets/3.0x/star_big.png": "0c7ccf738398fa093b42776f4608ff2d",
"assets/packages/design_system/assets/3.0x/star_small.png": "96f89c3c2e0fc58ac534e68538d4e2f6",
"assets/packages/design_system/assets/3.0x/altera_logo_mobile.png": "08947656b6b55e5e1006e8521802cb81",
"assets/packages/design_system/assets/3.0x/altera_logo.png": "3b1e7c2feecfb3b2d58b9e534af7e696",
"assets/packages/design_system/assets/altera_logo.png": "7f80f4ac9b512f63d4061c05c4201fbf",
"assets/packages/design_system/assets/4.0x/altera_logo_mobile.png": "b0a87ba9adf66249a91cc2a80e3b0e0e",
"assets/packages/design_system/assets/4.0x/altera_logo.png": "242b009023c333063535e566357eb506",
"assets/packages/design_system/fonts/app_icons.ttf": "652f9167b3f2287b91bae6ff962ed3ba",
"assets/packages/design_system/fonts/Mulish/Mulish-ExtraBold.ttf": "30c4191f3c00b47981386f1bed88e3f7",
"assets/packages/design_system/fonts/Mulish/Mulish-ExtraLight.ttf": "9105ec56b65711a43a9bf58e2c2dd84a",
"assets/packages/design_system/fonts/Mulish/Mulish-Light.ttf": "9bc1b362902a1c3f5017caa59b0baa9a",
"assets/packages/design_system/fonts/Mulish/Mulish-Regular.ttf": "e128ac44faa84b2d59c10c016fad0778",
"assets/packages/design_system/fonts/Mulish/Mulish-SemiBold.ttf": "03335ece67543a71c104b93aede98885",
"assets/packages/design_system/fonts/Mulish/Mulish-Black.ttf": "792ce4b85b6f984387e238effc5d3899",
"assets/packages/design_system/fonts/Mulish/Mulish-Bold.ttf": "d182a4e3cece6a15375867f6efea9d9e",
"assets/packages/design_system/fonts/Mulish/Mulish-Medium.ttf": "389e4d23bccb213ca224d555fb69fb3e",
"version.json": "31ddd81e2b0020b7007c92c3d7a4893e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
