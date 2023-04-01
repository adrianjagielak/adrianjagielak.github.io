if (typeof NextclickCrawlerBlocker == 'undefined') {
  var NextclickCrawlerBlocker = {
    /**
     * list of popular search robots
     */
    crawlerList:       ['googlebot','googlebot-mobile','bingbot','slurp','msnbot','java','wget','curl'],

    /**
     * Check if user is robot
     *
     * @param {String} userAgent
     */
    isCrawler: function(userAgent) {
      var
        result = false,
        searchRobotName;

      for (searchRobotName in this.crawlerList) {
        result = result || userAgent.indexOf(this.crawlerList[searchRobotName]) != -1;
      }

      return result;
    }
  }
}

if(typeof NextclickWidgetManager == 'undefined'){
  var NextclickWidgetManager = {
    /**
    * lock for libraries load
    */
    lock:         false,
    /**
     * enable lazy loading for images
     */
    lazy:         false,
    /**
    * list of loaded libraries
    */
    libraries:    {},
    /**
    * array of inited widgets
    */
    widgets:      {},
    /**
    * array of widget advertisements
    */
    advertisements:    {},
    /**
     * widget jquery instance
     */
    j:            null,
    /**
     * additional data for creators
     */
    previewData:  {},
    /**
     * additional data for creators
     */
    previewDefaults:  {},
    /**
     * is page already collected
     */
    collected:    false,
    /**
     * is page already updated
     */
    updated:      false,
    /**
     * is referer reported
     */
    reported:      false,
    /**
     * number of core requests
     */
    coreRequests: 0,
    coreRequesters: [],
    /**
     * number of core requests
     */
    regenerateSession: false,
    /**
     * viewability observers
     */
    observedWidgets: new Set(),
    observedAds: new Set(),
    widgetIntervalId: 0,
    adsIntervalId: 0,
    viewabilityObserver: ("IntersectionObserver" in window) ? new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        let container = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          __nc_j(container).data('viewStart', entry.time);
          __nc_j(container).data('isVisible', true);
        } else {
          __nc_j(container).data('viewStart', 0);
          __nc_j(container).data('isVisible', false);
        }
      });
    }, {root: null,rootMargin: "0px",threshold: [0.0, 0.5]}) : null,

    /**
     * array of user predefined page values
     */
    websitePredefinedCollectData: {
      'url':          (typeof __nc_page_url != 'undefined' && __nc_page_url.length && /^https?:\/\//.test(__nc_page_url)) ? __nc_page_url : '',
      'image':        (typeof __nc_page_image_url != 'undefined' && (__nc_page_image_url === null || __nc_page_image_url.length)) ? __nc_page_image_url : '',
      'title':        (typeof __nc_page_title != 'undefined' && __nc_page_title.length) ? __nc_page_title : '',
      'origin_date':  (typeof __nc_page_created_at != 'undefined') ? __nc_page_created_at : '',
      'external_id':  (typeof __nc_page_external_id != 'undefined') ? __nc_page_external_id : '',
      'status':       (typeof __nc_page_status != 'undefined') ? __nc_page_status : 0,
      'description':  (typeof __nc_page_description != 'undefined' && __nc_page_description.length) ? __nc_page_description : '',
      'tags':         (typeof __nc_page_keywords != 'undefined') ? __nc_page_keywords : ''
    },

    defaultEvents: {
      // after all libraries ready
      NC_librariesReady: function(event) {NextclickWidgetManager.makeWidgets()},
      // after each widget data shift
      NC_loadWidget: function(event, key, domain, renderer, version, collect, isMobile, language) {NextclickWidgetManager.loadWidget(key, domain, renderer, version, collect, isMobile, language)},
      // after widget object create
      NC_initWidget: function(event, key) {NextclickWidgetManager.widgets[key].init()},
      // after core load finish
      NC_coreLoaded: function(event, key, sessionData) {NextclickWidgetManager.widgets[key].checkSession(sessionData)},
      // after core ready
      NC_coreReady: function(event, key, status, path) {NextclickWidgetManager.widgets[key].checkStatus(status, path)},
      // after items ready
      NC_itemsReady: function(event, key, data) {NextclickWidgetManager.widgets[key].checkItems(data)},
      // after widget data set
      NC_readyToRender: function(event, key) {NextclickWidgetManager.widgets[key].render()},
      // after new page detect
      NC_renderDone: function(event, key) {NextclickWidgetManager.widgets[key].bindStatsEvents();if (typeof jQuery == 'function') {jQuery(document).trigger('ncWidgetReady', [key]);}NextclickWidgetManager.widgets[key].checkItemChanges();},
      // after new page detect
      NC_collectOgImage: function(event, key, update) {NextclickWidgetManager.widgets[key].loadOgImage(update)},
      // after og:image load
      NC_collectItemData: function(event, key, update) {NextclickWidgetManager.widgets[key].collectItemData(update)},
      // after collect item data
      NC_readyToCollect: function(event, key, update) {NextclickWidgetManager.widgets[key].sendItem(update)},
      // after collect ready
      NC_collectDone: function(event, key, update) {},
      // after widget item click
      NC_itemClick: function(event, key, index) {NextclickWidgetManager.widgets[key].itemClick(index)}
    },

    /**
    * trigger whole flow
    */
    init: function() {
      if (!NextclickCrawlerBlocker.isCrawler(navigator.userAgent.toLowerCase())) {
        if (!this.lock) {
          if (this.libraries['jquery'] != true) {
            this.lock = true;

            this.checkCookie();

            // Check if jQuery object has been already passed from an external source
            if ((typeof __nc_j !== "undefined") && __nc_j && __nc_j.fn && __nc_j.fn.jquery) {
              NextclickWidgetManager.libraries['jquery'] = true;
              NextclickWidgetManager.lock = false;

              NextclickWidgetManager.bindEvents();

              __nc_j('body').trigger('NC_librariesReady');
            } else if((typeof jQuery !== "undefined") && jQuery && jQuery.fn && jQuery.fn.jquery && jQuery.fn.jquery >= '1.7.1') {
              __nc_j = jQuery;

              NextclickWidgetManager.libraries['jquery'] = true;
              NextclickWidgetManager.lock = false;

              NextclickWidgetManager.bindEvents();

              __nc_j('body').trigger('NC_librariesReady');
          } else {
              this.load(NextclickWidgetConfiguration.url.jquery, true, function() {
                __nc_j = jQuery.noConflict(true);

                NextclickWidgetManager.libraries['jquery'] = true;
                NextclickWidgetManager.lock = false;

                NextclickWidgetManager.bindEvents();

                __nc_j('body').trigger('NC_librariesReady');
              });
            }
          } else {
            __nc_j('body').trigger('NC_librariesReady');
          }
        }
      }
    },

    /**
     * If cookie not exists check in avaliable storages to recreate.
     */
    checkCookie: function() {
      var
        cookie = __nc_ms ? __nc_ms : null,
        avaliableStorages = [
          'globalStorage',
          'localStorage',
          'sessionStorage'
        ],
        storages = {};

        for (var i = 0, len = avaliableStorages.length; i < len; i++) {
          var storageName = avaliableStorages[i];

          try {
            var storage = window[storageName];

            if (storage) {
              storages[storageName] = storage;
            }
          } catch(e) {}
        }

        if (Object.keys(storages).length) {
          try {
            if (!cookie || __nc_which !== 'c') {
              for (storage in storages) {
                if (storages[storage]['__nc_ms']) {
                  cookie = storages[storage]['__nc_ms'];

                  break;
                }
              }

              if (cookie !== __nc_ms) {
                __nc_ms = cookie;
              }
            }

            for (storage in storages) {
              storages[storage]['__nc_ms'] = __nc_ms;
            }
          } catch(e) {}
        }
    },

    /**
    * Bind all events
    */
    bindEvents: function() {
      var events = {};

      __nc_j.each(this.defaultEvents, function (name, event) {
        if (typeof __nc_event_handlers != 'undefined' && typeof __nc_event_handlers[name] != 'undefined') {
          events[name] = __nc_event_handlers[name];
        } else {
          events[name] = event;
        }
      });

      __nc_j('body').on(events);
    },

    /**
     * Trigger default event
     *
     * @param {string} name
     * @param {array} args
     */
    triggerDefaultEvent: function (name, args) {
      this.defaultEvents[name].apply(this, args);
    },

    /**
    * Start making widgets
    */
    makeWidgets: function() {
      for (var i = 0, length = __nc_widgets.length; i < length; i++) {
        __nc_j('body').trigger('NC_loadWidget', __nc_widgets.shift());
      }
    },

    /**
    * Create widget object
    *
    * @param key String
    * @param domain String
    * @param renderer String
    * @param version int
    * @param collect boolean
    * @param isMobile boolean
    * @param language String
    */
    loadWidget: function(key, domain, renderer, version, collect, isMobile, language) {
      var cls = 'NextclickWidgetRenderer' + renderer.ucfirst() + version;

      if (typeof window[cls] != 'undefined') {
        NextclickWidgetManager.widgets[key] = new window[cls](key, domain, collect, isMobile, language);

        if (typeof NextclickWidgetManager.widgets[key] == 'object') {
          __nc_j('body').trigger('NC_initWidget', [key]);
        }
      } else {
        __nc_widgets.push([
          key,
          domain,
          renderer,
          version,
          collect,
          isMobile,
          language
        ]);
      }
    },

    /**
    * Load script and trigger callback function with additional params
    *
    * @param url String
    * @param async boolean
    * @param callback function
    * @param params array
    */
    load: function(url, async, callback, params) {
      var container = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0];

      if (container) {
        var script = document.createElement("script");
        var lock = false;

        script.src = url;
        script.type = "text/javascript";

        if (async === true) {
          script.async = true;
        }

        script.onload = script.onreadystatechange = function () {
          if (!lock && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            lock = true;

            if(!params){
              callback && callback();
            }else{
              callback(params);
            }
          }
        };

        container.appendChild(script);
      }
    },

    /**
    * Set cookie value
    *
    * @param {String} name
    * @param {String} value
    * @param {int} seconds
    * @param {String} domain
    */
    setCookie: function (name, value, seconds, domain) {
      var expires = "";

      if (seconds) {
        var date = new Date();

        date.setTime(date.getTime() + (seconds * 1000));

        expires = "; expires="+date.toGMTString();
      }

      document.cookie = name+"="+value+expires+";secure; path=/" + (domain ? "; domain=" + domain + ";" : "");
    },

    /**
    * Get cookie value
    *
    * @param name String
    */
    getCookie: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');

      for(var i=0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }

      return null;
    },

    /**
    * Small fix for preview widget
    *
    * @param {String} type
    * @param {Object} form
    * @param {Object} defaults
    */
    enablePreviewDataCollect: function(type, form, defaults){
      this.previewData = this.previewData || {};

      this.previewData['livePreview' + type.ucfirst()] = form;
      this.previewDefaults['livePreview' + type.ucfirst()] = {info: defaults};
    },

    /**
     * Count all widgets having status 2 //emmission
     */
    countActiveWidgets: function() {
      var count = 0;

      __nc_j.each(this.widgets, function(key, widget) {
        if (widget.widget.status == 2) {
          count++;
        }
      });

      return count;
    }
  }
}

if(typeof NextclickUrlUtils == 'undefined'){
  var NextclickUrlUtils = {
    /**
    * Image url cannot contain this patterns
    */
    advertisementImagePatterns: [
      "reklama",
      "advertisement"
    ],

    /**
    * Clean up url
    *
    * @param {String} url
    */
    cleanUpUrl: function(url) {
      url = url.replace(/(sessid|phpsessid|jsessionid|aspsessionid|sid|zenid|osCsid|sesja_gratka|gclid|showPoll|fb_xd_fragment|utm_[^=]+)=[^&]*[&]{0,1}/gi,"");

      if(url.charAt(url.length - 1) == '&' || url.charAt(url.length - 1) == '?'){
        url = url.substr(0, url.length - 1)
      }

      return url;
    },

    /**
    * Fix absolute url
    *
    * @param {String} url
    */
    composeAbsoluteUrl: function(url) {
      if (!url.match('^(https?:)?//.*')) {
        var base = __nc_j('base');

        if (!base.length || url.charAt(0) == '/') {
          var pathname = '';

          if (url.charAt(0) != '/') {
            pathname = window.location.pathname;

            if (pathname.charAt(-1) != '/') {
              pathname = pathname.replace(/[^\/]*$/, "");
            }
          }

          base = window.location.protocol + '//' + window.location.host + pathname;
        }else{
          base = base.attr('href').replace(/\/[^\/]*$/, "") + '/';
        }

        url = base + url;
      } else if(url.match('^//.*')) {
        url = window.location.protocol + url;
      }

      return url;
    },

    /**
     * Return og:${property} value if exists
     *
     * @param {String} property
     */
    getOgProperty: function(property) {
      var metaObjs = document.getElementsByTagName('meta'),
          content = null;

      for (var i = 0; i < metaObjs.length; i++) {
         if (new RegExp('^(?:http://ogp.me/ns#' + property + ')$|^(?:og:' + property + ')$', 'i').test(metaObjs[i].getAttribute('property'))) {
           content = metaObjs[i].content;

           break;
         }
      }

      return content;
    },

    /**
    * Check if image is from domain
    *
    * @param src String
    * @param domain String
    */
    isImageValid: function(src, domain) {
      var domainPattern = new RegExp('[^=]' + domain, 'i');

      return (!/^http/.test(src) || domainPattern.test(src));
    },

    /**
    * Check if image is advertisement
    *
    * @param img
    */
    isAdvertisementImageValid: function(img) {
      var
        result = false,
        horizontalProportions = 2 / 1,
        verticalProportions = 1 / 2,
        src = img.attr('src'),
        width = img.width(),
        height = img.height();

      if ((width > height && width / height < horizontalProportions) || (height > width && width / height > verticalProportions)) {
        __nc_j.each(this.advertisementImagePatterns, function(k, pattern){
          result = result || new RegExp(pattern, 'i').test(src);
        });
      }

      return result;
    },

    /**
    * Check if given url is of valid format
    *
    * @param url String
    */
    isUrlValid: function(url) {
      return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
    }
  };
}

if(typeof NextclickItemBuilder == 'undefined'){
  var NextclickItemBuilder = new function() {
    this.domain         = '';
    this.title          = '';
    this.description    = '';
    this.url            = '';
    this.image          = '';
    this.origin_date    = '';
    this.external_id    = '';
  }
}

if(typeof NextclickWidgetConfiguration == 'undefined'){
  var NextclickWidgetConfiguration = new function (){
    /**
    * widget domain
    */
    this.widgetDomain = document.getElementById('Nextclick_Manager').src.match(/https?:\/\/([^\/]+)/)[1],
    /**
    * base widget domain
    */
    this.mainDomain = this.widgetDomain.replace(/static\./,'');
    /**
    * basic urls array
    */
    var ogUrl = NextclickUrlUtils.getOgProperty('url');
    /**
    * requested protocol
    */
    this.protocol = location.protocol == "https:" ? "https://" : "http://";
    /**
     * is Dmp lib loaded
     */
    this.dmpJsLoaded = false;
    
    this.url =  {
      // dmp:          this.protocol + "track.adform.net/serving/scripts/trackpoint/async/",
      jquery:       this.protocol + "ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",
      core:         this.protocol + this.widgetDomain + "/widget/core.js",
      trackingImg:  this.protocol + this.widgetDomain + "/widget/s.gif",
      redirectImg:  this.protocol + this.widgetDomain + "/widget/r.gif",
      counterImg:   this.protocol + this.widgetDomain + "/widget/c.gif",
      refererImg:   this.protocol + this.widgetDomain + "/widget/js/x.gif"
    };

    NextclickItemBuilder.url =
      NextclickUrlUtils.cleanUpUrl(
        NextclickWidgetManager.websitePredefinedCollectData['url'] ?
        NextclickWidgetManager.websitePredefinedCollectData['url'] :
        ogUrl && NextclickUrlUtils.isUrlValid(ogUrl) ?
          ogUrl :
          NextclickUrlUtils.composeAbsoluteUrl(window.location.href)
      );
  };
}

if(typeof NextclickBase64 == 'undefined'){
  var NextclickBase64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
      var
        output = "",
        chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0;

      input = NextclickBase64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        NextclickBase64._keyStr.charAt(enc1) + NextclickBase64._keyStr.charAt(enc2) +
        NextclickBase64._keyStr.charAt(enc3) + NextclickBase64._keyStr.charAt(enc4);
      }

      return output;
    },

    // public method for decoding
    decode : function (input) {
      var
        output = "",
        chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {
        enc1 = NextclickBase64._keyStr.indexOf(input.charAt(i++));
        enc2 = NextclickBase64._keyStr.indexOf(input.charAt(i++));
        enc3 = NextclickBase64._keyStr.indexOf(input.charAt(i++));
        enc4 = NextclickBase64._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }

        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }

      output = NextclickBase64._utf8_decode(output);

      return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
      var utftext = "";

      string = string.replace(/\r\n/g,"\n");

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
      var
        string = "",
        i = 0,
        c = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;

      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }

      return string;
    }
  }
}

if(typeof NextclickWidgetRenderer == 'undefined'){
  var NextclickWidgetRenderer = function(key, domain, collect, isMobile, language) {
    /**
    * widget key
    */
    this.key                = key;
    /**
    * widget domain
    */
    this.domain             = domain;
    /**
    * is widget collecting
    */
    this.collect            = Boolean(collect);
    /**
    * is mobile widget
    */
    this.isMobile           = Boolean(isMobile);
    /**
    * widget language
    */
    this.language           = language;
    /**
    * user path (full)
    */
    this.path               = null;
    /**
    * current user page
    */
    this.currentPage        = '';
    /**
    * items and advertisements data
    */
    this.data               = {};
    /**
    * user session data
    */
    this.sessionData        = {};
    /**
    * user recsys data
    */
    this.recsysData        = {};
    /**
    * widget additional configuration
    */
    this.widget             = {};
    /**
    * is already second items sended
    */
    this.itemsCacheOffSent  = false;
    /**
    * statistics data
    */
    this.statsData          = {items: [], advs:[], autos: []};
    /**
    * rendered items redirect data
    */
    this.redirectData       = {};
    /**
    * styles array
    */
    this.styles             = {};
    /**
    * templates array
    */
    this.templates          = {};
    /**
    * container DOM element
    */
    this.container          = null;
    /**
     * is already event bound
     */
    this.eventBound         = false;
    /**
     * item data for update
     */
    this.item               = null;
    /**
     * advertisement manager
     */
    this.advertisementManager = {};
    /**
     * widget can display images
     */
    this.displayImages = true;
    /**
     *
     */
    this.disableItems = false;
    /**
     *
     */
    this.page = 0;
    /**
     *
     */
    this.pages = 0;
    /**
     *
     */
    this.pagerPlacementSelector = '.ncWidget';
    /**
     * 
     */
    this.blockedRender = false;

    /**
    * Initialize widget
    */
    this.init = function() {
      var that = this;

      __nc_j.each(this.sessionData, function(k){
        var data = NextclickWidgetManager.getCookie('__nc_' + k);

        that.sessionData[k] = data;
      });

      var refr = document.referrer || window.parent.location.href;

      this.lazy = ["47F8-E293-312B-AED0-1iXje3","B792-6FC7-7C73-D7F4-1mH2yp"].includes(this.key) && ("IntersectionObserver" in window);

      var url = {
        'key': this.key,
        'type': this.numericType,
        'domain': this.domain,
        'loc': (this.sessionData['l'] ? this.sessionData['l'] : ''),
        'url': NextclickItemBuilder.url,
        'is_mobile': this.isMobile,
        'lang': this.language,
        'cnt': ++NextclickWidgetManager.coreRequests,
        'cntk': NextclickWidgetManager.coreRequesters.slice(),
        'ts': new Date().getTime(),
        'referer': refr,
        'status' : NextclickWidgetManager.websitePredefinedCollectData.status,
        'live_preview_hash' : window.location.hash.substring(1).split("&")[0],
        'ms': __nc_ms ? __nc_ms : null
      }

      NextclickWidgetManager.coreRequesters.push(this.key);
      if (typeof __nc_page_external_id != 'undefined' && __nc_page_external_id) {
        url.external_id = __nc_page_external_id;
      }

      if (typeof __nc_page_external_id != 'undefined' && __nc_page_external_id) {
        url.external_id = __nc_page_external_id;
      }

      NextclickWidgetManager.load(
        NextclickWidgetConfiguration.url.core + '?' + __nc_j.param(url) + '&' + (NextclickWidgetManager.previewData[this.key] ? NextclickWidgetManager.previewData[this.key].serialize() + '&' + __nc_j.param(NextclickWidgetManager.previewDefaults[this.key]) : ''),
        true,
        function(key){
          if (__nc_data && __nc_data[key] && __nc_data[key]['session']) {
            if (__nc_data[key]['advertisments']) {
              that.data['advertisements'] = __nc_data[key]['advertisments'];
            }

            if (__nc_data[key]["autopromotions"]) {
              that.data["autopromotions"] = __nc_data[key]["autopromotions"]
            }

            if (__nc_data[key]['items']) {
              that.data['items'] = __nc_data[key]['items'];
            }

            if (__nc_data[key]['exchange_items']) {
              that.data['exchange_items'] = __nc_data[key]['exchange_items'];
            }

            if (__nc_data[key]['item']) {
              that.item = __nc_data[key]['item'];
            }
            
            if (__nc_data[key]['additional']) {
              if (__nc_data[key]['additional']['placements']) {
                that.data['ad_placements'] = __nc_data[key]['additional']['placements'];
              }
            }
            //console.log(__nc_data[key]);
            // if (__nc_data[key]['session']['dmp']) {
            //   that.dmp = __nc_data[key]['session']['dmp'];
            // }

            __nc_j('body').trigger('NC_coreLoaded', [key, __nc_data[key]['session']]);
          }
        },
        this.key
      );
    };

    /**
    * Check session data
    *
    * @param session object
    */
    this.checkSession = function(session) {
      var
        that = this,
        expires = null;
        
      if(typeof session['data'] != 'undefined'){
        __nc_j.each(session['data'], function (k, v){
          switch (k) {
            case 'l':
              expires = 7200;
              break;

            default:
              expires = null;
              break;
          }

          that.sessionData[k] = v;

          if (session['widget']) {
            NextclickWidgetManager.setCookie(
              '__nc_' + k,
              v,
              expires,
              session['widget']['wildcard_cookie'] ? session['widget']['domain'] : false
            );
            NextclickWidgetManager.setCookie(
              '__nc_' + k,
              v,
              -1,
              session['widget']['wildcard_cookie'] ? false : session['widget']['domain']
            );
          }
        });
      }

      if (typeof session['widget'] != 'undefined') {
        if (typeof session['widget'].options != 'undefined') {
          this.displayImages = __nc_j.inArray(2, session['widget'].options) == -1;
        }

        this.widget = session['widget'];

        that.advertisementManager = new NextclickAdvertisementManager(that, that.key, that.type);
      }

      if (typeof session['recsys'] != 'undefined') {
        this.recsysData = session['recsys'];
      }

      if (session['status']) {
        var
          widgetSettingsCookie = NextclickWidgetManager.getCookie('__nc_ws'),
          widgetSettings = widgetSettingsCookie ? __nc_j.parseJSON(NextclickBase64.decode(widgetSettingsCookie)) : null;

        if (!widgetSettings) {
          widgetSettings = {};
        }

        if (!widgetSettings[this.key]) {
          widgetSettings[this.key] = {
            vc: 0
          }
        }

        widgetSettings[this.key]['vc']++;

        NextclickWidgetManager.setCookie('__nc_ws', NextclickBase64.encode(JSON.stringify(widgetSettings)));

        __nc_j('body').trigger('NC_coreReady', [this.key, session['status'], session['path']]);
      }
      
      // if (this.key == '31DB-F2FB-B24F-9792-1aXrTh' || this.key == 'A70B-6B63-392A-722A-1asQAG' || this.key == '8658-4B96-6D92-92E6-1avhwb') {
      //   var nextclickUid = (__nc_ms ? __nc_ms : null);
      //       if (nextclickUid) {
      //           var img = document.createElement('img');
      //           img.src = '//sync.clickonometrics.pl/nextclick/set-cookie?uid='+nextclickUid;
      //       }
      //   }
    };

    /**
    * Check status and set path
    *
    * @param status String
    * @param path String
    */
    this.checkStatus = function (status, path) {
      var key = this.key;

      this.setPath(path);
      
      switch(status){
        case 'OK':
          this.assignCurrentPage();
          break;

        case 'NEW':
          if (this.collect) {
            NextclickWidgetManager.updated = true;

            __nc_j(document).ready(function() {
              if (!NextclickWidgetManager.collected) {
                NextclickWidgetManager.collected = true;

                __nc_j('body').trigger('NC_collectOgImage', [key, false]);
              }
            });
          }

          break;

        default:
          return;
          break;
      }

      __nc_j('body').trigger('NC_itemsReady', [this.key, this.data['items']]);
    };

    /**
    * diff items with already seen pages
    */
    this.checkItems = function(items) {
      if (items) {
        var
          result = [],
          current_element = this.path.split(',').splice(-1);

        __nc_j.each(items, function (key, item) {
          if (current_element != item.id.toString()) {
            result.push(item);
          }
        });

        this.data['items'] = result;

        // widget.status = 2 => emission
        if (this.widget.status == 2 && this.data['items']) {
          this.fixMobile();

          delete __nc_data[key];

          __nc_j('body').trigger('NC_readyToRender', [this.key]);
        }
      } else if (this.disableItems || (this.data.exchange_items && this.data.exchange_items.length)) {
        this.fixMobile();

        __nc_j('body').trigger('NC_readyToRender', [this.key]);
      }
    };

    /**
    * Render widget
    */
    this.render = function() {
      var
        // not to overwrite origin widget items, a clone is being provided to be rendered
        items = this.data.items ? __nc_j.extend(true, [], this.data.items) : [],
        script = __nc_j('script[data-key=' + this.key + ']')[0];

      if (this.data.exchange_items){
        var itemsWithoutExchangeGroupItemsCount = (((this.hasOption(256) ? this.widget.pages : 1) * this.widget.items_count) - this.data.exchange_items.length);

        if (items.length > itemsWithoutExchangeGroupItemsCount && (itemsWithoutExchangeGroupItemsCount + this.data.exchange_items.length) >= this.widget.items_count) {
          items = items.slice(0, itemsWithoutExchangeGroupItemsCount);
        }
      }

      if (script && (this.disableItems || (items && items.length) || (this.data.exchange_items && this.data.exchange_items.length))) {
        var
          renderedItems = __nc_j(),
          page = 0;

        this.container = __nc_j('<div>')
          .insertAfter(script)
          .addClass('Nextclick_Widget_Container');

        // widget has pages
        if (this.hasOption(256)) {
          var
            itemsPerPage = this.widget.items_count,
            exchangeGroupItemsPerPage,
            exchangeGroupItems,
            renderedPage,
            pagedItems;

          // count number of exchange group items that can be equally placed on each page
          if (this.data.exchange_items) {
            exchangeGroupItemsPerPage = this.data.exchange_items.length / this.widget.pages;
          }

          for (page; page < this.widget.pages; page++) {
            if (!this.disableItems) {
              if (this.data.exchange_items) {
                // prepare exchange group items to be placed on a page
                exchangeGroupItems = this.data.exchange_items.slice(exchangeGroupItemsPerPage * page, exchangeGroupItemsPerPage * (page + 1));
                // add to exchange group items original items in amount decreased by exchangeGroupItemsPerPage value (per each page)
                pagedItems = exchangeGroupItems.sort(function() {return 0.5 - Math.random()}).concat(items.slice((itemsPerPage - exchangeGroupItemsPerPage) * page, (itemsPerPage * (page + 1)) - (exchangeGroupItemsPerPage * (page + 1))));

                if (this.hasOption(16384)){
                  // preserve original item on first position and shuffle the rest
                  pagedItems = this.preserveFirstPositionItem(pagedItems);
                }
              } else {
                pagedItems = items.slice(itemsPerPage * page, itemsPerPage * (page + 1));
              }
            }

            if (this.disableItems || pagedItems.length == itemsPerPage) {
              renderedPage = this.renderItems(pagedItems, this.data.advertisements || null, page);

              renderedItems = renderedItems.add(renderedPage);
            }
          }
        } else {
          if (this.data.exchange_items) {
            items = this.data.exchange_items.sort(function() {return 0.5 - Math.random()}).concat(items);

            if (this.hasOption(16384)){
              // preserve original item on first position and shuffle the rest
              items = this.preserveFirstPositionItem(items);
            }
          }

          renderedItems = this.renderItems(items, this.data.advertisements || null, page, this.recsysData['re'] == 1, this.data.autopromotions);
        }

        if (renderedItems) {
          this.widget['items_wrapper'] = __nc_j('<div>').append(renderedItems).html();

          var widget = __nc_j(this.templateItem(this.templates[this.widget.version]['widget'], this.widget));

          if(this.lazy) this.widget['items_wrapper'] = this.widget['items_wrapper'].replaceAll(" src=", " data-nc-src=");
          this.container.append(this.getStylesheets());
          this.container.append(this.fixStyles(widget));

          if(this.lazy) {
            this.enableLazyLoading();
          }
          // widget has pages
          if (this.hasOption(256)) {
            this.addPager(this.container);
          }
          
          if (this.widget.custom_script) {
            this.container.append('<script>' + this.widget.custom_script + '</script>');
          }
          this.addWidgetToObserver(this.container.find('.ncWidget').get(0) || this.container.get(0), this.key);
          let self = this;
          this.container.find('.ncwAdCommon').each(function(i, ad){
            self.addAdvertisementToObserver(ad, self.key, self.getAdvertisementIdFromElement(ad));
          });
        }
        if (this.container.length && this.container[0].getElementsByClassName('ncwAdCommon').length && !this.blockedRender &&
        getComputedStyle(this.container[0].getElementsByClassName('ncwAdCommon')[0],null).display == "none") {
					this.container.parent().find(".Nextclick_Widget_Container").remove();
					this.widget.advertisments_count = 0;
					this.blockedRender = true;
					__nc_j('body').trigger('NC_readyToRender', [this.key]);
				} else {
				  __nc_j('body').trigger('NC_renderDone', [this.key]);
				}
        if(!this.widget.is_live_preview) {
          this.startWidgetVisibilityCheck();
          this.startAdvertsVisibilityCheck();
        }
        if(this.data.ad_placements && this.data.ad_placements[0]) this.generateAdvertisementPlacements(this.container, this.data.ad_placements);
      }
    };
    
    this.enableLazyLoading = function() {
      const __nc_imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.ncSrc;
              lazyImage.removeAttribute('data-nc-src');
              imgObserver.unobserve(lazyImage);
          }
        });
      });
      document.querySelectorAll('[data-nc-src]').forEach((i) => {
        __nc_imageObserver.observe(i);
      });
    };
    
    this.addWidgetToObserver = function(container, key) {
      if(!NextclickWidgetManager.viewabilityObserver) return;
      __nc_j(container).data('keyname',key);
      __nc_j(container).data('viewStart',0);
      __nc_j(container).data('isVisible',false);
      NextclickWidgetManager.viewabilityObserver.observe(container);
      NextclickWidgetManager.observedWidgets.add(container);
    };
    this.addAdvertisementToObserver = function(container, key, id) {
      if(!NextclickWidgetManager.viewabilityObserver) return;
      __nc_j(container).data('keyname',key);
      __nc_j(container).data('ad-id',id);
      __nc_j(container).data('viewStart',0);
      __nc_j(container).data('isVisible',false);
      NextclickWidgetManager.viewabilityObserver.observe(container);
      NextclickWidgetManager.observedAds.add(container);
    };

    this.startWidgetVisibilityCheck = function() {
      if(!NextclickWidgetManager.viewabilityObserver || NextclickWidgetManager.widgetIntervalId!=0) return;
      function updateViewTimer() {
        NextclickWidgetManager.observedWidgets.forEach(function(container) {
          if(!__nc_j(container).data('isVisible')) return;
          let lastStarted = __nc_j(container).data('viewStart');
          let current = performance.now();
          if (lastStarted) {
            let diff = current - lastStarted;
            if(diff >= 1000) {
              let vwidgetImg = __nc_j('<img>');
              let wkey = __nc_j(container).data('keyname');
              let imgUrl = {
                'key': __nc_j(container).data('keyname'),
                'domain': NextclickWidgetManager.widgets[wkey].domain,
                'id': NextclickWidgetManager.widgets[wkey].currentPage,
                'cnt': 1,
                'mode': 'vwidget',
                'ts': new Date().getTime(),
                'session': NextclickWidgetManager.widgets[wkey].sessionData['s'],
                'v': NextclickWidgetManager.widgets[wkey].widget.version,
                'ms': __nc_ms ? __nc_ms : null
              }
              vwidgetImg.attr('src', NextclickWidgetConfiguration.url.trackingImg + '?' + __nc_j.param(imgUrl)).css('display', 'none');
              
              NextclickWidgetManager.observedWidgets.delete(container);
              NextclickWidgetManager.viewabilityObserver.unobserve(container);
            }
          }
        });
        if(NextclickWidgetManager.observedWidgets.size <= 0) {
          window.clearInterval(NextclickWidgetManager.widgetIntervalId);
          NextclickWidgetManager.widgetIntervalId = 0;
        }
      }

      NextclickWidgetManager.widgetIntervalId = window.setInterval(updateViewTimer, 200);
    }
    this.startAdvertsVisibilityCheck = function() {
      if(!NextclickWidgetManager.viewabilityObserver || NextclickWidgetManager.adsIntervalId!=0) return;
      function updateViewTimer() {
        NextclickWidgetManager.observedAds.forEach(function(container) {
          if(!__nc_j(container).data('isVisible')) return;
          let lastStarted = __nc_j(container).data('viewStart');
          let current = performance.now();
          if (lastStarted) {
            let diff = current - lastStarted;
            if(diff >= 1000) {
              let vadImg = __nc_j('<img>');
              let wkey = __nc_j(container).data('keyname');
              let imgUrl = {
                'key': __nc_j(container).data('keyname'),
                'domain': NextclickWidgetManager.widgets[wkey].domain,
                'id': NextclickWidgetManager.widgets[wkey].currentPage,
                'cnt': 1,
                'ads': __nc_j(container).data('ad-id'),
                'mode': 'vadv',
                'ts': new Date().getTime(),
                'session': NextclickWidgetManager.widgets[wkey].sessionData['s'],
                'v': NextclickWidgetManager.widgets[wkey].widget.version,
                'ms': __nc_ms ? __nc_ms : null
              }
              vadImg.attr('src', NextclickWidgetConfiguration.url.trackingImg + '?' + __nc_j.param(imgUrl)).css('display', 'none');
              
              NextclickWidgetManager.observedAds.delete(container);
              NextclickWidgetManager.viewabilityObserver.unobserve(container);
            }
          }
        });
        if(NextclickWidgetManager.observedAds.size <= 0) {
          window.clearInterval(NextclickWidgetManager.adsIntervalId);
          NextclickWidgetManager.adsIntervalId = 0;
        }
      }

      NextclickWidgetManager.adsIntervalId = window.setInterval(updateViewTimer, 200);
    }
    this.generateAdvertisementPlacements = function(container, placements) {
      try {
        let placementId = false;
        if(container.width() >= 728) placementId = placements[1];
        else if(container.width() >= 300) placementId = placements[2];
        if(!placementId) return;
        if(!document.getElementById(placementId)) {
          container.append('<div class="spolecznoscinet" id="'+placementId+'" style="display: flex; place-content: flex-start space-around;"></div>');
          window._qasp = window._qasp || [];
          window._qasp.push(['setPAID']);
        }
        if(!document.querySelector("script[src='"+placements[0]+"']")) {
          let s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = placements[0];
          let a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(s, a)
        }
    } catch (ex) {
        console.log(ex);
    }
    }
    this.bindStatsEvents = function () {
      var
        that = this,
        key = this.key,
        domain = this.domain,
        source = this.currentPage;

      if (this.container == null) {
        this.container = __nc_j('body');
      }

      __nc_j(this.redirectItemSelector, this.container).each(function(i, link) {
        link = __nc_j(link);

        var target = link.attr('class').replace(/([a-zA-Z0-9 ]+Item)/g, '');

        that.redirectData[target] = {
          'target_url': link.attr('href'),
          'track_url': NextclickWidgetConfiguration.url.redirectImg + '?' + [
            'key=' + key,
            'domain=' + domain,
            'target=' + target,
            'source=' + source,
            'loc=' + that.sessionData.l,
            'pv=' + that.recsysData.pv,
            're=' + that.recsysData.re,
            'ms=' + (__nc_ms ? __nc_ms : null)
          ].join('&')
        };

        link.click(function() {
          __nc_j('body').trigger('NC_itemClick', [that.key, target]);

          return false;
        });
      });

      // If data for stats exists
      if (__nc_j.isEmptyObject(this.statsData) || (!this.statsData.items.length && !this.statsData.advs.length)) {
        __nc_j.each((that.data.items || []).slice(0, that.widget.items_count), function (key, item) {
          that.statsData.items.push(item.id);
        });

        __nc_j.each((that.data.advertisements || []).slice(0, that.widget.advertisments_count), function (key, item) {
          that.statsData.advs.push(item.id);
        });
      }

      this.container.append(this.buildTrackingImage());
      
      // dmp tracker events
      // this.externalTracking(source);
    }

    /**
     * 
     * @returns {undefined}
     */
    this.externalTracking = function(source) {
        console.log('dmp_init');
        // init tracker(s)
        this.addViewScript();
        this.bindAdvertisementsClickTrackingEvents(this.statsData.advs);
    };
    
    /**
     * 
     * @returns {undefined}
     */
    this.bindAdvertisementsClickTrackingEvents = function(source) {
        if(this.isLivePreview(this.key)) return;
        
        var advItemsArr = this.findAdvertisementWrapper();
        if(advItemsArr === null || advItemsArr.length === 0){
            return;
        }
        
        var pid = this.dmp['pid'];
        for(var ix = 0; ix < advItemsArr.length; ix++){
            var advItems = document.getElementsByClassName(advItemsArr[ix].className);
            for(var i = 0; i < advItems.length; i++){
                
                var currentAdvId = this.getAdvertisementIdFromElement(advItems[i]);
                if(currentAdvId === false){
                    continue;
                }
                
                advItems[i].onclick = function () { 
                    if(source.includes(currentAdvId)) {
                        window._adftrack = Array.isArray(window._adftrack) ? window._adftrack 
                            : (window._adftrack ? [window._adftrack] : []);
                        
                        window._adftrack.push({
                            pm: pid,
                            divider: encodeURIComponent('|'),
                            pagename: encodeURIComponent('Klienci'),
                            order: {sv1: currentAdvId}
                        });

                        var s = document.createElement('script'); 
                        s.type = 'text/javascript'; 
                        s.async = true; 
                        s.src = NextclickWidgetConfiguration.url.dmp; 
                        var x = document.getElementsByTagName('script')[0]; 
                        x.parentNode.insertBefore(s, x); 
                    }
                    
                    console.log(window._adftrack);
                };
            }
        }
    };
    
    /**
     * 
     * @param {type} element
     * @returns {Boolean}
     */
    this.getAdvertisementIdFromElement = function(element) {
        var idFromElement = this.getAdvertisementIdFromLink(element);
        if(idFromElement !== false) {
            return idFromElement;
        } 
        else {
            return this.getAdvertisementIdFromLink(
                    element.getElementsByTagName("a")[0]
                );
        }
        
        return false;
    };
    
    /**
     * 
     * @param {type} url
     * @returns {Boolean}
     */
    this.getAdvertisementIdFromLink = function(url) {
        if(url === null) {
            return false;
        }
                
        if(url.getAttribute("href") === null 
                || url.getAttribute("href").search === null) {
            
            return false;
        }
        
        var url = new URL(url.getAttribute("href"));
        var idFromUrl = url.searchParams.get("id");
        if(idFromUrl === null) {
            return false;
        }
        
        return idFromUrl;
    };
    
    /**
     * Init addform script, add to page
     * 
     * @returns
     */
    this.addViewScript = function() {
        if(this.isLivePreview(this.key)) return;
        
        window._adftrack = Array.isArray(window._adftrack) ? window._adftrack
            : (window._adftrack ? [window._adftrack] : []);
            
        window._adftrack.push({
            pm: this.dmp['pid'],
            divider: encodeURIComponent('|'),
            pagename: encodeURIComponent('NextClick'),
            order:{sv1:this.widget.domain,sv2:this.item.url}
        });
        
        if(NextclickWidgetConfiguration.dmpJsLoaded === false) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = NextclickWidgetConfiguration.url.dmp;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s,x);

            NextclickWidgetConfiguration.dmpJsLoaded = true;
        }
    };
    
    this.isLivePreview = function(key) {
        return key === 'livePreviewRecommendation1' 
                || key === 'livePreviewRecommendation2'
    };
    
    /**
     * 
     * @returns getElementsByClassName.className
     */
    this.findAdvertisementWrapper = function() {
        var possibleAdvIds = [
            'ncwAdCommon',
            'ncc2wAdCommon',
            'ncc2wAd', 
            'ncwAd1', 
            'ncwAd2'
	];
        
        var advId = null;
        for(var i = 0; i < possibleAdvIds.length; i++){
            advId = document.getElementsByClassName(possibleAdvIds[i]);
            if(advId.length !== 0){
                return advId;
            }
        }
        
        return advId;
    };
    
    /**
     * Preserves origin item on first position
     */
    this.preserveFirstPositionItem = function(items) {
      var firstPositionItem = items[items.length - 1];

      items.pop();

      items = items.sort(function() {return 0.6 - Math.random()});

      return items.concat(firstPositionItem);
    }

    /**
     * Tracking data redirect function
     *
     * @param index String
     */
    this.itemClick = function(index) {
      var
        image = new Image(),
        that = this;

      image.src = this.redirectData[index]['track_url'];
      image.onload = function() {
        window.location.href = that.redirectData[index]['target_url'];
      };

      setTimeout(function() {
        window.location.href = that.redirectData[index]['target_url'];
      }, 1200);
    }

    /**
    * Set widget path
    *
    * @param path String
    */
    this.setPath = function(path) {
      this.path = path;

      return this;
    };

    /**
    * Assign current page from path
    */
    this.assignCurrentPage = function() {
      this.currentPage = this.path.split(',').pop();

      return this;
    };

    /**
    * load og:image for page collect
    */
    this.loadOgImage = function(update) {
      var imageSrc = __nc_j('meta').filter(function (){
        return new RegExp('^(?:http://ogp.me/ns#image)$|^(?:og:image)$', 'i').test(this.getAttribute('property'))
      }).attr('content');

      if (imageSrc) {
        var image = new Image();

        __nc_j(image).on('load', function() {
          __nc_j('body').trigger('NC_collectItemData', [key, update]);
        });

        image.src = imageSrc;
        image.id = 'NC_ogImage';
        image.style.display = 'none';

        document.body.appendChild(image);
      } else {
        __nc_j('body').trigger('NC_collectItemData', [key, update]);
      }
    };

    /**
     * @returns {Array}
     */
    this.getArticleTags = function() {
        var value = __nc_j('meta').filter(function (){
            if(this.getAttribute('property') === 'article:tag'){
                return true;
            }
        });

        return this.getRawTags(value);
    }
    
    /**
     * @returns {Array}
     */
    this.getMetaTags = function() {
        var keyMap = ['keywords','news_keywords'];
        var value = __nc_j('meta').filter(function (){
            if(keyMap.indexOf(this.getAttribute('name')) !== -1){
                return true;
            }
        });
        
        return this.getRawTags(value);
    }
    
    /**
     * 
     * @param {type} value
     * @returns {Array}
     */
    this.getRawTags = function(value) {
        var tags = [];
        __nc_j.each(value, function (i) {
            var tmp = __nc_j(value[i]).attr('content');
            if(tmp !== null){
                var t = tmp.split(',');
                tags  = tags.concat(t);
            }
        });
        
        return tags.map(function(item){ 
            return item.trim(); 
        });
    }
    
    /**
     * Loading page tags, or ignore if those already exists
     * 
     * @param {String|Array} tags
     * @returns {String}
     */
    this.tagManager = function (tags) {
        if(typeof tags === 'undefined' || tags === null || tags.length === 0){
            var metaTags = this.getMetaTags();
            //console.log('meta tags:', metaTags);
            var articleTags = this.getArticleTags();
            //console.log('article tags:', articleTags);
            var newTags = metaTags.concat(articleTags);
            return newTags.filter(function(value, index, self){ 
                return self.indexOf(value) === index; 
            })
            .join();
        } 
        
        return tags;
    }
    
    /**
    * collect new item
    */
    this.collectItemData = function(update) {
      var that = this;

      NextclickItemBuilder.domain = this.domain;
      NextclickItemBuilder.origin_date = NextclickWidgetManager.websitePredefinedCollectData['origin_date'];
      NextclickItemBuilder.external_id = NextclickWidgetManager.websitePredefinedCollectData['external_id'];
      // collecting tags by default: collectin, update  
      NextclickItemBuilder.tags = this.tagManager(NextclickWidgetManager.websitePredefinedCollectData['tags']);

      __nc_j.each(this.dataToCollect, function(k, v) {

        NextclickItemBuilder[k] = NextclickWidgetManager.websitePredefinedCollectData[k];

        if(!(k == 'image' && NextclickItemBuilder[k] === null)) {
          if(!NextclickItemBuilder[k]) {
            var
              el = null,
              pattern = new RegExp('^(?:http://ogp.me/ns'+ (v.ogtype ? '/'+v.ogtype : '') + '#' + v.og + ')$|^(?:' + (v.ogtype ?? 'og') + ':' + v.og + ')$', 'i'),
              value = __nc_j('meta').filter(function (){
                return pattern.test(this.getAttribute('property'))
              }).attr('content');

            if (!value || (k == 'image' && !that.isOgImageValid())) {
              if (v.find){
                var find = v.find.split('=');

                pattern = new RegExp(find[1], 'i');

                el = __nc_j(v.selector).filter(function () {
                  return pattern.test(this.getAttribute(find[0]));
                });
              } else {
                el = __nc_j(v.selector);
              }

              if (k == 'image') {
                var
                  image = null,
                  resolution = 0;

                __nc_j.each(el, function (k, img){
                  img = __nc_j(img);

                  if (!NextclickUrlUtils.isAdvertisementImageValid(img)) {
                    var res = img.width() * img.height();

                    if (NextclickUrlUtils.isImageValid(img.attr('src'), that.domain) && res > resolution) {
                      resolution = res;
                      image = img;
                    }
                  }
                });

                value = image ? NextclickUrlUtils.composeAbsoluteUrl(image.attr('src')) : null;
              } else if (v.attr) {
                value = el.attr(v.attr);
              } else {
                value = el.html();
              }
            } else {
              if (k == 'image') {
                value = NextclickUrlUtils.composeAbsoluteUrl(value);
              }
            }

            NextclickItemBuilder[k] = (value || k == 'image') ? value : '';
          }
        }
      });

      __nc_j('body').trigger('NC_readyToCollect', [key, update]);
    }

    this.sendItem = function(update) {
      if (!update || this.isItemChanged(NextclickItemBuilder)) {
        var request = {
          key:  this.key
        };

        //extend request collection with NextclickItemBuilder params
        __nc_j.extend(request, NextclickItemBuilder);

        if (NextclickItemBuilder.title && (NextclickItemBuilder.image === null || NextclickUrlUtils.isUrlValid(NextclickItemBuilder.image))) {
          NextclickWidgetManager.load(
            NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + (update ? this.dataUpdateUrl : this.dataCollectUrl) + '?' + __nc_j.param(request),
            true,
            function(){
              __nc_j('body').trigger('NC_collectDone', [key, update]);
            }
          );
        }
      }
    };

    /**
    * Add og:image to page and check its dimensions
    */
    this.isOgImageValid = function() {
      var
        check = false,
        img = __nc_j('img#NC_ogImage');

      if (img.length) {
        check = (img.width() >= 90 && img.height() >= 60);

        img.remove();
      }

      return check;
    }

    /**
    * Pseudo abstract function for items render
    */
    this.renderItems = function(items, advertisements, page) {
      throw 'renderItems method must be overwritten';
    };

    /**
    * Simple template fill with values
    *
    * @param template String
    * @param vars array
    */
    this.templateItem = function(template, vars) {
      __nc_j.each(vars, function(var_name, var_value) {
        template = template.replace(new RegExp('%%' + var_name.toUpperCase(), 'g'), var_value);
      });

      return template;
    };

    /**
    * Truncate text to specific length
    *
    * @param text String
    * @param length int
    */
    this.truncateText = function(text, length) {
      var
        regexp = /[\.|\?|\!]$/,
        textLength = text.length;

      text = text.replace(new RegExp('^(.{' + length + '}[^\\s]*).*'), '$1');

      if (text && textLength > length && text.length != textLength && !regexp.test(text)) {
        text = text + '&hellip;';
      }

      return text;
    };

    /**
    * Compose tracking image
    */
    this.buildTrackingImage = function() {
      var trackingImg = '';

      if (!/^livePreview(.*)$/.test(this.key) && !this.widget.is_live_preview) {
        trackingImg = __nc_j('<img>');

        var imgUrl = {
          'key': this.key,
          'domain': this.domain,
          'pv': this.recsysData['pv'],
          're': this.recsysData['re'],
          'id': this.currentPage,
          'ids': this.statsData.items.join(','),
          'ads': this.statsData.advs.join(','),
          'auto': this.statsData.autos.join(','),
          'cnt': 1,
          'mode': 'widget',
          'ts': new Date().getTime(),
          'session': this.sessionData['s'],
          'v': this.widget.version,
          'ms': __nc_ms ? __nc_ms : null
        }

        trackingImg
          .attr('src', NextclickWidgetConfiguration.url.trackingImg + '?' + __nc_j.param(imgUrl))
          .css('display', 'none');
      }

      return trackingImg;
    };

    /**
    * Fix mobile settings
    */
    this.fixMobile = function() {
      if (this.isMobile && this.widget) {
        this.widget.orientation = 2;
        this.widget.width = 100;
        this.widget.unit_width = "%";
        this.widget.items_count = Math.min(this.widget.items_count, 4);
      }

      return this;
    }

    this.checkItemChanges = function() {
      if (
        this.item &&
        this.item.check &&
        !NextclickWidgetManager.updated
      ) {
        NextclickWidgetManager.updated = true;

        __nc_j('body').trigger('NC_collectOgImage', [key, true]);
      }
    }

    this.isItemChanged = function(newItem) {
      var tags = [];

      __nc_j.each(newItem.tags.split(','), function (key, tag) {
        tag = __nc_j.trim(tag)
          .toLowerCase()
          .replace(/ą/ig,'a')
          .replace(/ć/ig,'c')
          .replace(/ł/ig,'l')
          .replace(/ó/ig,'o')
          .replace(/ś/ig,'s')
          .replace(/ /ig,'_')
          .replace(/ę/ig,'e')
          .replace(/ń/ig,'n')
          .replace(/ż/ig,'z')
          .replace(/ź/ig,'z')
          .replace(/б/ig,'b')
          .replace(/д/ig,'d')
          .replace(/ё/ig,'jo')
          .replace(/ж/ig,'zh')
          .replace(/з/ig,'z')
          .replace(/и/ig,'i')
          .replace(/й/ig,'j')
          .replace(/л/ig,'l')
          .replace(/ф/ig,'f')
          .replace(/ц/ig,'c')
          .replace(/ч/ig,'ch')
          .replace(/ш/ig,'sh')
          .replace(/щ/ig,'shh')
          .replace(/э/ig,'je')
          .replace(/ю/ig,'ju')
          .replace(/я/ig,'ja')
          .replace(/[^a-zа-я0-9_]/g, '')

        if (__nc_j.inArray(tag, tags) == -1) {
          tags.push(tag);
        }
      });

      return (
          newItem.title == this.item.title &&
          newItem.description == this.item.description &&
          newItem.image == this.item.image &&
          newItem.url == this.item.url &&
          tags.join(',') == this.item.tags
        )
        ? false
        : true;
    }

    /**
     * WARNING!! Use it after renderItems
     */
    this.getStylesheets= function () {
      return '<style>' +
        this.styles['widget'] +
        this.styles['versions'][this.widget.version] +
        this.advertisementManager.getAdvertisementStyles().join(' ') +
        (this.widget.color_css ? this.widget.color_css : '') +
        (this.widget.custom_css ? this.widget.custom_css : '') +
        '</style>';
    };

    this.hasOption = function (option) {
      return typeof this.widget.options != 'undefined' && __nc_j.inArray(option, this.widget.options) != -1;
    }

    this.fixStyles = function (items) {
      if (items) {
        items.addClass(this.widthOptions.cssClass);

        if (this.widget.options) {
          if (this.hasOption(2)) {
            items.removeClass('showImages');
          }

          if (this.hasOption(4)) {
            items.addClass('hideDescriptions');
          }

          if (this.hasOption(2097152)) {
            items.addClass('hideTitles');
          }
        }
      }

      return items;
    }

    this.addPager = function (container) {
      var
        that = this,
        pager = __nc_j('<span>')
          .addClass('ncwPager'),
        prev = __nc_j('<span>')
          .addClass('ncwPrev')
          .html('&lsaquo;')
          .click(function() {
            if (that.page == 0) {
              that.page = that.pages;
            }

            that.page--;
            that.reloadPage(container);
          }),
        next = __nc_j('<span>')
          .addClass('ncwNext')
          .html('&rsaquo;')
          .click(function() {
            that.page++;
            that.reloadPage(container);
          });

      for (var i = 0; i <= 9; i++) {
        var page = __nc_j('.ncwPage' + i, container);

        if (page.length) {
          if (i > 0) {
            page.hide();
          }

          this.pages++;
        }
      }

      if (this.pages > 1) {
        pager
          .append(prev)
          .append('<span class="ncwPages"><span class="ncwCurrentPage">1</span>/' + this.pages + '</span>')
          .append(next);

        __nc_j(this.pagerPlacementSelector, container).append(pager);
      }
    }

    this.reloadPage = function(container) {
      __nc_j('.ncwArticles', container).hide();

      var currentPage = this.page % this.pages;

      __nc_j('.ncwPage' + currentPage, container).show();
      __nc_j(this.pagerPlacementSelector + ' .ncwPager .ncwPages .ncwCurrentPage', container).text(currentPage + 1);
    }

    this.x = function () {
      var refr = document.referrer || window.parent.location.href;
      if (refr && !NextclickWidgetManager.reported) {
        NextclickWidgetManager.reported = true;

        var img = __nc_j('<img>');

        img.attr('src', NextclickWidgetConfiguration.url.refererImg + '?query=' + refr + '&ms=' + (__nc_ms ? __nc_ms : null) + '&ts=' + new Date().getTime());
        img.css('display', 'none');

        img.appendTo('body');
      }
    }
  };
}

Object.keys = Object.keys || function(object) {
  var
    keys = [],
    key;

  for (key in object) {
    keys.push(key);
  }

  return keys;
}

// string ucfirst method
String.prototype.ucfirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
  'use strict';

  function f(n) {
    return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {
    Date.prototype.toJSON = function (key) {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() + '-' +
          f(this.getUTCMonth() + 1) + '-' +
          f(this.getUTCDate()) + 'T' +
          f(this.getUTCHours()) + ':' +
          f(this.getUTCMinutes()) + ':' +
          f(this.getUTCSeconds()) + 'Z'
        : null;
    };

    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
      return this.valueOf();
    };
  }

  var
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    },
    rep;

  function quote(string) {
    escapable.lastIndex = 0;

    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
      var c = meta[a];

      return typeof c === 'string'
        ? c
        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {
    var
      i,
      k,
      v,
      length,
      mind = gap,
      partial,
      value = holder[key];

    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    switch (typeof value) {
      case 'string':
        return quote(value);
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'boolean':
      case 'null':
        return String(value);
      case 'object':
        if (!value) {
          return 'null';
        }

        gap += indent;
        partial = [];

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length;

          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || 'null';
          }

          v =
            partial.length === 0
            ? '[]'
            : gap
              ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
              : '[' + partial.join(',') + ']';
          gap = mind;

          return v;
        }

        if (rep && typeof rep === 'object') {
          length = rep.length;

          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === 'string') {
              k = rep[i];
              v = str(k, value);

              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);

              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        }

        v =
          partial.length === 0
          ? '{}'
          : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}';

        gap = mind;

        return v;
    }
  }

  if (typeof JSON.stringify !== 'function' || !JSON.stringify('1')) {
    JSON.stringify = function (value, replacer, space) {
      var i;
      gap = '';
      indent = '';

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }

      rep = replacer;

      if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      return str('', {'': value});
    };
  }

  if (typeof JSON.parse !== 'function') {
    JSON.parse = function (text, reviver) {
      var j;

      function walk(holder, key) {
        var
          k,
          v,
          value = holder[key];

        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }

        return reviver.call(holder, key, value);
      }

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function (a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      if (/^[\],:{}\s]*$/
            .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        j = eval('(' + text + ')');

        return typeof reviver === 'function' ? walk({'': j}, '') : j;
      }

      throw new SyntaxError('JSON.parse');
    };
  }
}());
if(typeof NextclickAdvertisementManager=="undefined"){var NextclickAdvertisementManager=function(a,c,b){this.widgetKey=c;this.widgetType=b;this.itemsCount=a.widget.items_count;this.widgetSubtype=a.widget.subtype;this.widgetOrientation=a.widget.orientation;this.widgetLanguage=a.language;this.advertisements=[];this.advertisementsCount=Number(a.widget.advertisments_count);this.advertisementIndexes={};this.advertisementPossibleIndexes=[];this.advertisementStyles=[];this.calculateAdvertisementIndexes=function(f){this.advertisements=f;this.advertisementIndexes={};if(this.widgetType=="carousel"){this.itemsCount=this.widgetSubtype==1?(this.itemsCount/a.widget.pages_count):a.widget.pages_count;this.itemsCount++}if(this.itemsCount-2*this.advertisementsCount-1<0){for(var e=0;e<this.itemsCount;e++){this.advertisementPossibleIndexes.push(e)}}else{for(var e=1;e<this.itemsCount-(this.itemsCount>2?1:0);e++){this.advertisementPossibleIndexes.push(e)}}if(this.widgetType=="recommendation"||this.widgetType=="carousel"||(this.widgetType=="floating"&&(this.widgetSubtype==2||this.widgetSubtype==3))){this.assignAdvertisements()}else{if(this.widgetType=="advertisement"){this.advertisementIndexes[0]=this.advertisements.pop()}else{var g=__nc_j.parseJSON(NextclickBase64.decode(NextclickWidgetManager.getCookie("__nc_ws"))),d=g?(g[this.widgetKey]["vc"]||0):0;if(d%2==0){this.advertisementIndexes[0]=this.advertisements.pop()}else{this.assignAdvertisements()}}}};this.assignAdvertisements=function(){for(var f=1;f<=this.advertisementsCount;f++){var h=this.advertisements.pop();if(h){var d=this.advertisementPossibleIndexes.length-2*this.advertisements.length==1?0:Math.floor(Math.random()*this.advertisementPossibleIndexes.length),e=h.type==4?this.itemsCount-1:this.advertisementPossibleIndexes[d];if((typeof this.widgetOrientation=="undefined"||this.widgetOrientation==1)&&h.type==4){continue}this.advertisementIndexes[e]=h;if(h.type==4){var k=this.advertisementIndexes[e];this.advertisementIndexes={};this.advertisementIndexes[e]=k;break}var g=__nc_j.inArray(e-1,this.advertisementPossibleIndexes),j=__nc_j.inArray(e+1,this.advertisementPossibleIndexes);if(j!=-1){this.advertisementPossibleIndexes.splice(j,1)}this.advertisementPossibleIndexes.splice(d,1);if(g!=-1){this.advertisementPossibleIndexes.splice(g,1)}}}};this.renderAdvertisement=function(f){var e=__nc_j.extend({},true,f),d="NextclickAdvertisementRenderer"+f.type;if(typeof window[d]!="undefined"&&typeof NextclickWidgetManager.advertisements[d]=="undefined"){NextclickWidgetManager.advertisements[d]=new window[d](this.widgetLanguage)}if(typeof this.advertisementStyles[f.type]=="undefined"){this.advertisementStyles[f.type]=NextclickWidgetManager.advertisements[d].getProperty(this.widgetType,this.widgetSubtype,"style")}return NextclickWidgetManager.advertisements[d].renderItem(e,this.widgetKey)};this.isAdvertisementOnPosition=function(d){return !!this.advertisementIndexes[d]};this.getAdvertisementFromPosition=function(d){return this.advertisementIndexes[d]};this.getAdvertisementStyles=function(){return this.advertisementStyles}}}if(typeof NextclickAdvertisementRenderer=="undefined"){var NextclickAdvertisementRenderer=function(){this.layouts={};this.getProperty=function(c,b,d){var a=__nc_j.trim(this.layouts[c][b][d]);if(!a.length){a=this.layouts["default"][d]}return a};this.templateAdvertisement=function(a,b){__nc_j.each(b,function(d,c){a=a.replace(new RegExp("%%"+d.toUpperCase(),"g"),c)});return a};this.truncateText=function(d,b){var c=/[\.|\?|\!]$/,a=d.length;d=d.replace(new RegExp("^(.{"+b+"}[^\\s]*).*"),"$1");if(d&&a>b&&d.length!=a&&!c.test(d)){d=d+"&hellip;"}return d}}};if(typeof NextclickWidgetRenderer != 'undefined' && typeof NextclickWidgetRendererRecommendation1 == 'undefined'){
  var NextclickWidgetRendererRecommendation1 = function (key, domain, collect, isMobile, language){
    NextclickWidgetRenderer.call(this, key, domain, collect, isMobile, language);

    this.language = !language || language == 'pl' ? '' : language;
    this.type = 'recommendation';
    this.numericType = 1;

    this.redirectItemSelector = 'td:not(.ncwAdCommon) a.ncwArticle';
    this.dataCollectUrl = '/widget/collect.js';
    this.dataUpdateUrl = '/widget/update.js';
    this.widthIntervals = {
      210: {'cssClass': 'textUnderImages', 'titleLength': 60, 'descriptionLength': 90},
      300: {'cssClass': 'textUnderImages titleNextToImage', 'titleLength': 80, 'descriptionLength': 150},
      400: {'cssClass': '', 'titleLength': 110, 'descriptionLength': 170},
      500: {'cssClass': '', 'titleLength': 110, 'descriptionLength': 190},
      600: {'cssClass': '', 'titleLength': 110, 'descriptionLength': 210},
      700: {'cssClass': '', 'titleLength': 110, 'descriptionLength': 230},
      9999: {'cssClass': '', 'titleLength': 150, 'descriptionLength': 300}
    };

    this.widthOptions = {
      cssClass: 'ncMobile',
      titleLength: 80,
      descriptionLength: 80
    };

    this.sessionData = {
      's': null,
      'l': null
    };
    
    this.dataToCollect = {
      'image': {
        'og': 'image',
        'selector': 'img',
        'attr': 'src'
      },
      'title': {
        'og': 'title',
        'selector': 'title'
      },
      'description': {
        'og': 'description',
        'selector': 'meta',
        'find': 'name=description',
        'attr': 'content'
      },
      'origin_date': {
        'og': 'published_time',
        'ogtype': 'article',
        'selector': 'meta',
        'find': 'itemprop=datePublished',
        'attr': 'content'
      },
    };
    
    this.languageLabels = {
      '': {
        'more'  : 'więcej'
      },
      'ru': {
        'more'  : 'далее'
      },
      'ua': {
        'more'  : 'далі'
      },
      'kz': {
        'more'  : 'далее'
      }
    };
    
    this.templates   = {
      '1': {
        'widget': '<div class="ncWidget showImages showCaption" style="width: %%WIDTH%%UNIT_WIDTH"><div class="ncwCaption">%%TITLE</div><div class="ncwFrame">%%ITEMS_WRAPPER<div class="ncwFooter"><a class="ncwLogo ncwLogo%%NETWORK_NAME" rel="nofollow" target="_blank" href="' + NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + '">%%NETWORK_NAME</a></div></div></div>',
        'itemsWrapper': '<table class="ncwArticles ncwPage%%PAGE">%%ITEMS</table>',
        'item': '<td><a class="ncwArticle ncwItem%%ID" href="%%SUBDOMAIN%%URL">%%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION </span> %%DATE %%PAGE_DOMAIN </span></a></td>',
        'autopromotion': '<td><a class="ncwArticle ncwItem%%ID" href="%%SUBDOMAIN%%URL">%%LABEL %%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION </span> %%DATE %%PAGE_DOMAIN </span></a></td>'
      }
    };
    
    this.styles      = {
      'widget'   : ".ncWidget {margin: 0 !important;padding: 0 !important;background: #fff !important;overflow: hidden !important;border-radius: 3px !important;position: relative !important}.ncWidget * {margin: 0 !important;padding: 0 !important;background: none !important;border: none !important;text-align: left !important;text-transform: none !important;text-decoration: none !important;float: none !important;outline: none !important;font: 13px/1 Arial !important;color: #333 !important;}.ncwCaption {display: none !important;height: 26px !important;overflow: hidden !important;margin: 0 !important;padding: 0 0 0 10px !important;font-weight: bold! important;line-height: 26px !important;color: #fff !important;text-shadow: 0 1px 0 rgba(0,0,0,.1) !important;background: #56587C !important;}.showCaption .ncwCaption {display: block !important;}.ncwFrame {border: solid #ddd !important;border-width: 1px !important;}.showCaption .ncwFrame {border-top: none !important;}.ncwArticle {display: block !important;margin: 0 !important;padding: 10px 9px 9px 9px !important;clear: both !important;text-decoration: none !important;}.ncwArticles:after,.ncwArticle:after {content: \".\";display: block;height: 0;clear: both !important;visibility: hidden !important;}.ncwArticle * {cursor: pointer !important;}.ncwArticle + .ncwArticle {border-top: 1px dotted #b6b6b6 !important;}.ncwArticle img {display: none !important;margin: 0 0 8px !important; padding: 0 !important; border: none !important;}.showImages .ncwArticle img {display: block!important; width: 100px; height: 60px;}.ncwTitle {display: block !important;margin: 0 0 6px !important;color: #56587C !important;font-weight: bold !important;font-size: 12px !important;line-height: 1 !important;}.ncwDesc {display: block !important;font-size: 12px !important;line-height: 1.1 !important;color: #555 !important;}.ncwFooter {height: 24px !important;padding: 0 10px !important;position: relative !important;clear: both !important;border-top: 1px dotted #b6b6b6 !important;font-size: 11px !important;line-height: 24px !important;color: #777 !important;text-indent: -9000px !important;}.ncwLogo {display: block !important;width: 100% !important;height: 100% !important;margin: 0 auto !important;background: url(" + NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + "/images/poweredbync.gif) right 7px no-repeat !important;border: none !important;} .ncwLogo.ncwLogoGroupM {background-image: url(" + NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + "/images/poweredbygm.gif)!important;} @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi) {.ncwLogo { background-image:url(" + NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + "/images/poweredbync.png)!important; background-size:85px 14px!important; }.ncwLogo.ncwLogoGroupM { background-image:url(" + NextclickWidgetConfiguration.protocol + NextclickWidgetConfiguration.widgetDomain + "/images/poweredbygm_large.gif)!important;}}.ncWidget .ncwArticles {width: 100% !important;margin: 0 !important;border: none !important;border-collapse: collapse !important;}.ncWidget .ncwArticles:after,.ncWidget .ncwArticle:after {display: none;}.ncWidget .ncwArticles td {padding: 0 !important;background: none !important;border: none !important;vertical-align: top !important;}.ncWidget .ncwArticle {border: none !important;}.ncWidget tr + tr .ncwArticle {border-top: 1px dotted #b6b6b6 !important;}.ncWidget .ncwArticle img {float: left !important;}.ncWidget.textUnderImages .ncwArticle img {float: none !important;}.ncWidget.showImages img + .ncwText {display: block !important;margin: 0 0 0 110px !important;}.ncWidget.showImages.textUnderImages .ncwText {margin: 0 !important;}.ncWidget.showImages.titleNextToImage img + .ncwText .ncwTitle {height: 60px !important;overflow: hidden !important;margin: -68px 0 8px 108px !important;}.hideDescriptions .ncwDesc{display: none !important}.hideTitles .ncwTitle{display: none !important}.ncwArticles td:hover, .ncwArticle:hover {background: #f5f5f5 !important;} .ncWidget .ncwMore {display: inline !important;} .ncwPager {position: absolute !important;top: 6px !important;right: 6px !important;}.ncwPrev, .ncwNext {display: inline-block !important;padding: 0 4px 2px !important;background: #707070 !important;border-radius: 3px !important;color: #fff !important;cursor: pointer !important;}.ncwPages {margin: 0 7px !important;font-weight: bold !important;font-size: 11px !important;} .ncwPages .ncwCurrentPage {font-weight: bold !important;font-size: 11px !important;} .ncaAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}",
      'versions' : {
        '1': ""
      }
    };

    this.renderItems = function (items, advertisements, page, shuffle, autopromotions=[]){
      advertisements = advertisements || [];
      autopromotions = autopromotions || [];
      shuffle = shuffle == undefined ? true : shuffle;

      var 
        that = this,
        content = [],
        contentStr = '',
        language = this.language,
        advertisements_count = Math.min(this.widget.advertisments_count, advertisements.length),
        items_count = Math.min(this.widget.items_count, (items.length + advertisements_count));

      if (advertisements.length) {
        // Mix and slice advertisements before render.
        this.advertisementManager.calculateAdvertisementIndexes(
          advertisements.sort(function() {return 0.5 - Math.random()}).slice(0, this.widget.advertisments_count)
        );
      }
      
      // Mix items before render.
      if (shuffle) {
        items = items.slice(0, items_count).sort(function(a, b) {return a.image != '' && b.image == ''});
      }
      
      // ...
      var itemWidth = parseInt(that.widget.orientation == 1 ? (that.widget.width/items_count) : that.widget.width);

      if (that.widget.orientation == 3) {
        itemWidth = itemWidth / this.widget.mixed_orientation_items_per_row;
      }

      if (this.widget.unit_width == 'px') {
        __nc_j.each(this.widthIntervals, function(width, values){
          if (itemWidth <= parseInt(width)) {
            that.widthOptions = values;

	        if (that.hasOption(524288) && that.widget.title_length) {
		      that.widthOptions.titleLength = that.widget.title_length;
	        }

	        if (that.hasOption(1048576) && that.widget.description_length) {
		      that.widthOptions.descriptionLength = that.widget.description_length;
	        }

            return false;
          }
        });
      }

      // Build content table with advertisements and items on correct positions.
      for (var i = 0; i < items_count; i++) {
        var 
          item = null,
          renderedItem = null,
          statsType = null;
        
        if (page == 0 && this.advertisementManager.isAdvertisementOnPosition(i)) {
          // Advertisement
          item = this.advertisementManager.getAdvertisementFromPosition(i);
          renderedItem = this.advertisementManager.renderAdvertisement(item);
          statsType = 'advs';
        } else if(i == items_count-1 && autopromotions.length) {
          item = autopromotions.pop();
          if (item) {
            renderedItem = that.renderItem(item, true);
            statsType = 'autos';
          }
        } else {
          // Article
          item = shuffle ? items.pop() : items.shift();
          
          if (item) {
            renderedItem = that.renderItem(item);
            statsType = 'items';
          }
        }

        if (renderedItem) {
          // Fill statistics Data.
          that.statsData[statsType].push(item.id);

          // Place content
          content.push(renderedItem);
        }
      }
      
      // Insert row breaks in right places.
      __nc_j.each(content, function(k, v){
        if(that.widget.orientation == 2){
          if (k != 0) {
            contentStr += '</tr><tr>';
          }
        } else {
          if(that.widget.orientation == 3 && k != 0 && (k % that.widget.mixed_orientation_items_per_row) == 0){
            contentStr += '</tr><tr>';
          }
          if(that.lazy) v = v.replaceAll(" src=", " data-nc-src=");
          
          v = __nc_j('<div>').append(__nc_j(v).css('width', itemWidth + that.widget.unit_width)).html();
        }
        
        contentStr += v;
      });

      // Render widget.
      return __nc_j(this.templateItem(this.templates[this.widget.version]['itemsWrapper'], {
        'items': '<tr>' + contentStr + '</tr>',
        'page': page
      }));
    };

    this.renderItem = function(item, isAutopromotion=false){
      item['title'] = this.truncateText(item['title'], this.widthOptions.titleLength);
      item['description'] = this.truncateText(item['description'], this.widthOptions.descriptionLength);
      item['image'] = (this.displayImages && item['image']) ? '<img src="' + item['image'] + '" alt="" />' : '';

      if (item['description'].length) {
        item['description'] += ' <span class="ncwTitle ncwMore">' + this.languageLabels[this.language]['more'] + '</span>';
      }

      //page_date option (2048 || 4096 || 8192)
      if (this.hasOption(2048)) {
        item['date'] = '<span class="ncwDesc ncwDate">' + item.date + '</span>';
      } else if (this.hasOption(4096)) {
        item['date'] = '<span class="ncwDesc ncwDate">' + item.date_with_sec + '</span>';
      } else if (this.hasOption(8192)) {
        item['date'] = '<span class="ncwDesc ncwDate">' + item.date_ago + '</span>';
      } else {
        item['date'] = '';
      }

      //page_domain option (512)
      if (this.hasOption(512) && this.domain != item.subdomain.replace(NextclickWidgetConfiguration.protocol, '')) {
        item['page_domain'] = '<span class="ncwDesc ncwDomain">' + item.subdomain.replace(NextclickWidgetConfiguration.protocol, '') + '</span>';
      } else {
        item['page_domain'] = '';
      }

      //fix subdomain when option (16) is off
      if (!this.hasOption(16)) {
        item['subdomain'] = '';
      }
      if(isAutopromotion) {
        item['label'] = '<span class="ncaAdLabel">' + item['label'] + '</span>';
        return this.templateItem(this.templates[this.widget.version]['autopromotion'], item);
      }

      return this.templateItem(this.templates[this.widget.version]['item'], item);
    };
  };
  
  NextclickWidgetRendererRecommendation1.prototype = new NextclickWidgetRenderer();
}
if(typeof NextclickAdvertisementRenderer!="undefined"&&typeof NextclickAdvertisementRenderer1=="undefined"){var NextclickAdvertisementRenderer1=function(a){NextclickAdvertisementRenderer.call(this,a);this.language=!a||a=="pl"?"":a;this.languageLabels={"":{more:"więcej",sponsored:"Reklama"},ru:{more:"далее",sponsored:"Реклама"},ua:{more:"далі",sponsored:"Реклама"},kz:{more:"далее",sponsored:"Реклама"}};this.layouts={"default":{template:'<td class="ncwAdCommon %%CLASS"><a class="ncwArticle ncwItem%%ID" href="%%URL" target="_blank">%%ADV %%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION <span class="ncwTitle ncwMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a></td>%%CUSTOM_SCRIPT",style:".ncWidget .ncwArticles td.ncwAd1 {background: #FBFBFB !important;}.ncwAd1 .ncwAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}.ncWidget .ncwArticles td.ncwAd1:hover{background: #f5f5f5 !important;}"},recommendation:{1:{template:"",style:""},template:"",style:""},advertisement:{1:{template:'<span class="%%CLASS"><a class="ncwAdCommon ncwArticle ncwItem%%ID" href="%%URL" target="_blank">%%ADV %%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION <span class="ncwTitle ncwMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a></span>%%CUSTOM_SCRIPT",style:".showImages .ncwArticle img {height: 60px; width: 90px;} .ncwAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;} .ncaWidget.showCaption:hover{background: #f5f5f5 !important;}"}},floating:{1:{template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><span class="ncswText">%%ADV %%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION <span class="ncswTitle ncswMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT",style:".ncswAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}"},2:{template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><span class="ncswText">%%ADV %%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION <span class="ncswTitle ncswMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT",style:".ncswAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}"},3:{template:'<a class="ncs3wArticle ncs3wAd ncs3wItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><div class="ncs3wImageWrapper">%%ADV %%IMAGE</div><div class="ncs3wText"><div class="ncs3wTitle">%%TITLE</div><div class="ncs3wDesc">%%DESCRIPTION</div></div></a>%%CUSTOM_SCRIPT',style:""},template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><span class="ncswText">%%ADV %%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION <span class="ncswTitle ncswMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT",style:".ncswAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}"},carousel:{1:{template:'<a href="%%URL" target="_blank" class="nccwAdCommon nccwAd nccwItem" style="%%STYLE float: left; margin-right: 25px;">%%ADV<div class="nccwImageWrapper">%%IMAGE</div><div class="nccwText"><div class="nccwTitle">%%TITLE</div><div class="nccwDesc">%%DESCRIPTION </div></div><div style="clear: both;"></div>%%CUSTOM_SCRIPT</a>',style:""},2:{template:'<a href="%%URL" target="_blank" class="ncc2wAdCommon ncc2wAd ncc2wItem" style="%%STYLE float: left; margin-right: 25px;">%%ADV<div class="ncc2wImageWrapper">%%IMAGE</div><div class="ncc2wText"><div class="ncc2wTitle">%%TITLE</div><div class="ncc2wDesc">%%DESCRIPTION </div></div><div style="clear: both;"></div>%%CUSTOM_SCRIPT</a>',style:""},template:'<a href="%%URL" target="_blank" class="ncc2wAdCommon ncc2wAd ncc2wItem" style="%%STYLE float: left; margin-right: 25px;">%%ADV<div class="ncc2wImageWrapper">%%IMAGE</div><div class="ncc2wText"><div class="ncc2wTitle">%%TITLE</div><div class="ncc2wDesc">%%DESCRIPTION </div></div><div style="clear: both;"></div>%%CUSTOM_SCRIPT</a>',style:""}};this.renderItem=function(e,c){var f=NextclickWidgetManager.widgets[c].type,d=parseInt(NextclickWidgetManager.widgets[c].widget.subtype),b="livePreview"+f.charAt(0).toUpperCase()+f.slice(1).toLowerCase()+NextclickWidgetManager.widgets[c].widget.subtype,g=c==b;e.url=e.url;e["class"]="ncwAd1";e["class"]+=g?" livePreview":"";e.title=this.truncateText(e.title,NextclickWidgetManager.widgets[c].widthOptions.titleLength);e.label=e.label?this.truncateText(e.label,NextclickWidgetManager.widgets[c].widthOptions.labelLength):this.languageLabels[this.language]["sponsored"];e.description=this.truncateText(e.description,NextclickWidgetManager.widgets[c].widthOptions.descriptionLength);e.custom_script=e.custom_script;switch(f){case"floating":switch(d){case 1:case 2:e.adv='<span class="ncswAdLabel">'+e.label+"</span>";e.image=(NextclickWidgetManager.widgets[c].displayImages&&e.image)?'<img class="ncswImg" src="'+e.image+'" rel="sponsored" alt="" />':"";e.style="";break;case 3:e.adv='<div class="ncs3wAdLabel">'+e.label+"</div>";e.image=(NextclickWidgetManager.widgets[c].displayImages&&e.image)?'<img class="ncs3wImg" src="'+e.image+'" rel="sponsored" alt="" />':"";e.style="width: "+e.width+"% !important;";break}break;case"carousel":switch(d){case 1:e.adv='<span class="nccwAdLabel">'+e.label+"</span>";e.image=(NextclickWidgetManager.widgets[c].displayImages&&e.image)?'<img class="nccwImg" src="'+e.image+'" rel="sponsored" alt="" />':"";e.style="width: "+e.width+"px !important;";break;case 2:e.adv='<span class="ncc2wAdLabel">'+e.label+"</span>";e.image=(NextclickWidgetManager.widgets[c].displayImages&&e.image)?'<img class="ncc2wImg" src="'+e.image+'" rel="sponsored" alt="" />':"";e.style="width: "+e.width+"px !important;";break}break;default:e.adv='<span class="ncwAdLabel">'+e.label+"</span>";e.image=(NextclickWidgetManager.widgets[c].displayImages&&e.image)?'<img src="'+e.image+'" rel="sponsored" alt="" />':"";e.style="";break}return this.templateAdvertisement(this.getProperty(f,d,"template"),e)}};NextclickAdvertisementRenderer1.prototype=new NextclickAdvertisementRenderer()};if(typeof NextclickAdvertisementRenderer!="undefined"&&typeof NextclickAdvertisementRenderer2=="undefined"){var NextclickAdvertisementRenderer2=function(a){NextclickAdvertisementRenderer.call(this,a);this.language=!a||a=="pl"?"":a;this.languageLabels={"":{more:"więcej"},ru:{more:"далее"},ua:{more:"далі"},kz:{more:"далее"}};this.layouts={"default":{template:'<td class="ncwAdCommon %%CLASS"><a class="ncwArticle ncwItem%%ID" href="%%URL" target="_blank">%%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION <span class="ncwTitle ncwMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT</td>",style:".ncWidget .ncwArticles td.ncwAd2:hover{background: #f5f5f5 !important;}"},recommendation:{1:{template:"",style:""}},advertisement:{template:'<span class="%%CLASS"><a class="ncwAdCommon ncwArticle ncwItem%%ID" href="%%URL" target="_blank">%%IMAGE <span class="ncwText"><span class="ncwTitle">%%TITLE</span><span class="ncwDesc">%%DESCRIPTION</span></span></a></span>%%CUSTOM_SCRIPT',style:".showImages .ncwArticle img {height: 60px; width: 90px;} .ncwAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;} .ncaWidget.showCaption:hover{background: #f5f5f5 !important;}"},floating:{1:{template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><span class="ncswText">%%ADV %%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION <span class="ncswTitle ncswMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT",style:".ncswAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}"},2:{template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank" style="%%STYLE"><span class="ncswText">%%ADV %%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION <span class="ncswTitle ncswMore">'+this.languageLabels[this.language]["more"]+"</span></span></span></a>%%CUSTOM_SCRIPT",style:".ncswAdLabel {display: block !important;margin: -8px 0 1px !important;font-size: 7px !important;color: #777 !important;text-align: right !important;letter-spacing: 1px !important;text-shadow: 0 1px 0 #fff !important;}"},3:{template:'<a class="ncs3wArticle ncs3wAd ncs3wItem%%ID" href="%%URL" style="%%STYLE"><div class="ncs3wImageWrapper">%%ADV %%IMAGE</div><div class="ncs3wText"><div class="ncs3wTitle">%%TITLE</div><div class="ncs3wDesc">%%DESCRIPTION</div></div></a>%%CUSTOM_SCRIPT',style:""}}};this.renderItem=function(d,c){var e=NextclickWidgetManager.widgets[c].type,b="livePreview"+e.charAt(0).toUpperCase()+e.slice(1).toLowerCase(),f=c==b;d.url=d.url;d["class"]="ncwAd2";d["class"]+=f?" livePreview":"";d.title=this.truncateText(d.title,NextclickWidgetManager.widgets[c].widthOptions.titleLength);d.description=this.truncateText(d.description,NextclickWidgetManager.widgets[c].widthOptions.descriptionLength);d.custom_script=d.custom_script;switch(e){case"floating":d.image=(NextclickWidgetManager.widgets[c].displayImages&&d.image)?'<img class="ncswImg" src="'+d.image+'" alt="" />':"";break;default:d.image=(NextclickWidgetManager.widgets[c].displayImages&&d.image)?'<img src="'+d.image+'" alt="" />':"";break}return this.templateAdvertisement(this.getProperty(e,"template"),d)}};NextclickAdvertisementRenderer2.prototype=new NextclickAdvertisementRenderer()};if(typeof NextclickAdvertisementRenderer!="undefined"&&typeof NextclickAdvertisementRenderer4=="undefined"){var NextclickAdvertisementRenderer4=function(a){NextclickAdvertisementRenderer.call(this,a);this.layouts={"default":{template:'<td class="ncwAdCommon %%CLASS"><a class="ncwArticle ncwItem%%ID" href="%%URL" target="_blank">%%IMAGE</a>%%CUSTOM_SCRIPT</td>',style:".ncWidget .ncwArticles td.ncwAd4:hover{background: #f5f5f5 !important;} .ncWidget .ncwArticles td.ncwAd4 img{float: none !important; height: auto; margin: 0 auto !important; width: auto;} .ncwAd4 .ncwArticle {padding: 0px !important;}"},recommendation:{1:{template:"",style:""}},advertisement:{template:"",style:""},floating:{template:'<a class="ncwAdCommon ncswArticle ncwItem%%ID" href="%%URL" target="_blank"><span class="ncswText">%%IMAGE<span class="ncswTitle">%%TITLE</span><span class="ncswDesc">%%DESCRIPTION</span></span></a>%%CUSTOM_SCRIPT',style:""}};this.renderItem=function(d,c){var e=NextclickWidgetManager.widgets[c].type,b="livePreview"+e.charAt(0).toUpperCase()+e.slice(1).toLowerCase(),f=c==b;d.url=d.url;d["class"]="ncwAd4";d["class"]+=f?" livePreview":"";d.custom_script=d.custom_script;switch(e){case"floating":d.image=(NextclickWidgetManager.widgets[c].displayImages&&d.image)?'<img class="ncswImg" src="'+d.image+'" alt="" />':"";break;default:d.image=(NextclickWidgetManager.widgets[c].displayImages&&d.image)?'<img src="'+d.image+'" alt="" />':"";break}return this.templateAdvertisement(this.getProperty(e,"template"),d)}};NextclickAdvertisementRenderer4.prototype=new NextclickAdvertisementRenderer()};var __nc_ms = __nc_ms || "daf57eec66167a8b5eee96731d7d329f", __nc_which = __nc_which || "n";NextclickWidgetManager.init();