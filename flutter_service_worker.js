'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "588274d7a5aadb4d1747925bd7fcd25f",
"index.html": "aa66102004e42d5529f422841a398db3",
"/": "aa66102004e42d5529f422841a398db3",
"manifest.json": "b3f2a425bb12282d90710d14d74dd1e2",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"assets/AssetManifest.json": "a5d43524b5e941cb435b27ac352ffa02",
"assets/FontManifest.json": "2350e3e1cf1e6db8d1150649835f41c6",
"assets/fonts/MaterialIcons-Regular.otf": "27206588da6d3d24f71ec64067b75eb0",
"assets/NOTICES": "736ab8bf1e11f7c00f799ab802564f3e",
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
"assets/packages/design_system/assets/noisy_background.jpg": "fe5b87f6c3fedbe733a16984d8b6f78f",
"assets/packages/design_system/assets/2.0x/altera_logo_white_195.png": "b5e32fd906ecbb32da06d0a448555c0b",
"assets/packages/design_system/assets/2.0x/gold_promo_graphic.png": "1f81be757ca29cd7a42ec9d360f98c99",
"assets/packages/design_system/assets/2.0x/altera_logo_white_168.png": "c07b128fc23dff7450af34448c1d472a",
"assets/packages/design_system/assets/2.0x/star_big.png": "41fe5c78ab0f2b3166c041b7e66400d4",
"assets/packages/design_system/assets/2.0x/star_small.png": "b39cceea1e70af2f1300aa36a9de7c38",
"assets/packages/design_system/assets/2.0x/altera_logo.png": "9da037ea66091a2db2c3401e6232163f",
"assets/packages/design_system/assets/star_big.png": "05e0002d2f82065b99ff16bb7a2bc293",
"assets/packages/design_system/assets/star_small.png": "c27200fdae85f596a2e148159e773c78",
"assets/packages/design_system/assets/3.0x/altera_logo_white_195.png": "fa9befbf4d25e718a8f8a4f7ea7e30d2",
"assets/packages/design_system/assets/3.0x/gold_promo_graphic.png": "53f495c79375dad8edd41d99b7022b5b",
"assets/packages/design_system/assets/3.0x/altera_logo_white_168.png": "d4324344ba34fe8b61c184a0f2de3c5f",
"assets/packages/design_system/assets/3.0x/star_big.png": "0c7ccf738398fa093b42776f4608ff2d",
"assets/packages/design_system/assets/3.0x/star_small.png": "96f89c3c2e0fc58ac534e68538d4e2f6",
"assets/packages/design_system/assets/3.0x/altera_logo.png": "3b1e7c2feecfb3b2d58b9e534af7e696",
"assets/packages/design_system/assets/altera_logo.png": "7f80f4ac9b512f63d4061c05c4201fbf",
"assets/packages/design_system/assets/4.0x/altera_logo.png": "242b009023c333063535e566357eb506",
"assets/packages/design_system/fonts/app_icons.ttf": "3e2bff27371a5b45b800283e489909a1",
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
