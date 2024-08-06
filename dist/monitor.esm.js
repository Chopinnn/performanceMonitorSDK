var config = {
  url: '',
  projectName: 'SDK',
  appId: '123456',
  userId: '123456',
  isImageUpload: false,
  // 是否使用图片上报
  batchSize: 5
};
function setConfig(options) {
  for (var key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function deepCopy(target) {
  if (_typeof(target) === 'object') {
    var result = Array.isArray(target) ? [] : {};
    for (var key in target) {
      if (_typeof(target[key]) == 'object') {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }
  return target;
}
function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

var cache = [];
function getCache() {
  return deepCopy(cache);
}
function addCache(data) {
  cache.push(data);
}
function clearCache() {
  cache.length = 0;
}

var originalOpen$1 = XMLHttpRequest.prototype.open;
var originalSend$1 = XMLHttpRequest.prototype.send;
function report(data) {
  if (!config.url) {
    console.error('请设置上传 url 地址');
  }
  var reportData = JSON.stringify({
    id: generateUniqueId(),
    data: data
  });
  // 上报数据，使用图片的方式
  if (config.isImageUpload) {
    console.log('发送数据img');
    imgRequest(reportData);
  } else {
    // 优先使用 sendBeacon
    if (window.navigator.sendBeacon) {
      console.log('发送数据sendBeacon');
      return beaconRequest(reportData);
    } else {
      console.log('发送数据xhr');
      xhrRequest(reportData);
    }
  }
}

// 批量上报数据
function lazyReportBatch(data) {
  addCache(data);
  var dataCache = getCache();
  console.log('dataCache', dataCache);
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache);
    clearCache();
  }
}

// 图片发送数据
function imgRequest(data) {
  var img = new Image();
  // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
  img.src = "".concat(config.url, "?data=").concat(encodeURIComponent(JSON.stringify(data)));
}

// 普通ajax发送请求数据
function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, 'post', config.url);
      originalSend$1.call(xhr, JSON.stringify(data));
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, 'post', url);
      originalSend$1.call(xhr, JSON.stringify(data));
    });
  }
}
function beaconRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      window.navigator.sendBeacon(config.url, data);
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      window.navigator.sendBeacon(config.url, data);
    });
  }
}

var originalFetch = window.fetch;
function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    var startTime = Date.now();
    var reportData = {
      type: 'performance',
      subType: 'fetch',
      url: url,
      startTime: startTime,
      method: config.method
    };
    return originalFetch(url, config).then(function (res) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      var data = res.clone();
      reportData.status = data.status;
      reportData.success = data.ok;
      lazyReportBatch(reportData);
      return res;
    }).catch(function (err) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      reportData.status = 0;
      reportData.success = false;
      lazyReportBatch(reportData);
    });
  };
}
function fetch() {
  overwriteFetch();
}

function observerEntries() {
  if (document.readyState === 'complete') {
    observerEvent();
  } else {
    var _onLoad = function onLoad() {
      observerEvent();
      window.removeEventListener('load', _onLoad, true);
    };
    window.addEventListener('load', _onLoad, true);
  }
}
function observerEvent() {
  var entryHandler = function entryHandler(list) {
    var entries = list.getEntries();
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (observer) {
          observer.disconnect();
        }
        var reportData = {
          name: entry.name,
          // 资源的名字
          type: 'performance',
          // 类型
          subType: entry.entryType,
          //类型
          sourceType: entry.initiatorType,
          // 资源类型
          duration: entry.duration,
          // 加载时间
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          // dns解析时间
          tcp: entry.connectEnd - entry.connectStart,
          // tcp连接时间
          redirect: entry.redirectEnd - entry.redirectStart,
          // 重定向时间
          ttfb: entry.responseStart,
          // 首字节时间
          protocol: entry.nextHopProtocol,
          // 请求协议
          responseBodySize: entry.encodedBodySize,
          // 响应内容大小
          responseHeaderSize: entry.transferSize - entry.encodedBodySize,
          // 响应头部大小
          transferSize: entry.transferSize,
          // 请求内容大小
          resourceSize: entry.decodedBodySize,
          // 资源解压后的大小
          startTime: performance.now()
        };
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: ['resource'],
    buffered: true
  });
}

function observerLCP() {
  var entryHandler = function entryHandler(list) {
    if (observer) {
      observer.disconnect();
    }
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var json = entry.toJSON();
        console.log(json);
        var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
          type: 'performance',
          subType: entry.name,
          pageUrl: window.location.href
        });
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算lcp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: 'largest-contentful-paint',
    buffered: true
  });
}

function observerFCP() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === 'first-contentful-paint') {
          observer.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: 'performance',
            subType: entry.name,
            pageUrl: window.location.href
          });
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算fcp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: 'paint',
    buffered: true
  });
}

function observerLoad() {
  window.addEventListener('pageShow', function (event) {
    requestAnimationFrame(function () {
      ['load'].forEach(function (type) {
        var reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp
        };
        // 发送数据
        lazyReportBatch(reportData);
      });
    }, true);
  });
}

function observerPaint() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === 'first-paint') {
          observer.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: 'performance',
            subType: entry.name,
            pageUrl: window.location.href
          });
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算fp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: 'paint',
    buffered: true
  });
}

var originalProto = XMLHttpRequest.prototype;
var originalSend = originalProto.send;
var originalOpen = originalProto.open;
function overwriteOpenAndSend() {
  originalProto.open = function newOpen() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.url = args[1];
    this.method = args[0];
    originalOpen.apply(this, args);
  };
  originalProto.send = function newSend() {
    var _this = this;
    this.startTime = Date.now();
    var _onLoaded = function onLoaded() {
      _this.endTime = Date.now();
      _this.duration = _this.endTime - _this.startTime;
      var url = _this.url,
        method = _this.method,
        startTime = _this.startTime,
        endTime = _this.endTime,
        duration = _this.duration,
        status = _this.status;
      var reportData = {
        status: status,
        duration: duration,
        startTime: startTime,
        endTime: endTime,
        url: url,
        method: method.toUpperCase(),
        type: 'performance',
        success: status >= 200 && status < 300,
        subType: 'xhr'
      };
      lazyReportBatch(reportData);
      _this.removeEventListener('loadend', _onLoaded, true);
    };
    // 请求结束时触发
    this.addEventListener('loadend', _onLoaded, true);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    originalSend.apply(this, args);
  };
}
function xhr() {
  overwriteOpenAndSend();
}

function performance$1() {
  fetch();
  observerEntries();
  observerLCP();
  observerFCP();
  observerLoad();
  observerPaint();
  xhr();
}

function error() {
  // 捕获资源加载失败的错误：js css img
  window.addEventListener('error', function (e) {
    var target = e.target;
    if (target.src || target.href) {
      var url = target.src || target.href;
      var reportData = {
        type: 'error',
        subType: 'resource',
        url: url,
        html: target.outerHTML,
        pageUrl: window.location.href,
        path: e.path
      };
      lazyReportBatch(reportData);
    }
  }, true);
  // 捕获js错误
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    var reportData = {
      type: 'error',
      subType: 'javascript',
      msg: msg,
      url: url,
      lineNo: lineNo,
      columnNo: columnNo,
      stack: error.stack,
      pageUrl: window.location.href,
      startTime: performance.now()
    };
    lazyReportBatch(reportData);
  };
  // 捕获promise错误
  window.addEventListener('unhandledrejection', function (e) {
    var _e$reason;
    var reportData = {
      type: 'error',
      subType: 'promise',
      reason: (_e$reason = e.reason) === null || _e$reason === void 0 ? void 0 : _e$reason.stack,
      pageUrl: window.location.href,
      startTime: e.timeStamp
    };
    lazyReportBatch(reportData);
  }, true);
}

function onClick() {
  ['mousedown', 'touchstart'].forEach(function (eventType) {
    window.addEventListener(eventType, function (e) {
      var target = e.target;
      console.warn('click', target);
      if (target.tagName) {
        var reportData = {
          type: 'behavior',
          subType: 'click',
          target: target.tagName,
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          eventType: eventType,
          path: e.path
        };
        lazyReportBatch(reportData);
      }
    });
  });
}

function pageChange() {
  // hash
  var oldUrl1 = '';
  window.addEventListener('hashchange', function (event) {
    console.warn('hashchange', event);
    var newUrl = event.newURL;
    var reportData = {
      form: oldUrl1,
      to: newUrl,
      type: 'behavior',
      subType: 'hashchange',
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    oldUrl1 = newUrl;
  }, true);
  // history
  var oldUrl2 = '';
  window.addEventListener('popstate', function (event) {
    console.warn('popstate', event);
    var to = window.location.href;
    var reportData = {
      form: oldUrl2,
      to: to,
      type: 'behavior',
      subType: 'popstate',
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    oldUrl2 = to;
  }, true);
}

function pageView() {
  var reportData = {
    type: 'behavior',
    subType: 'pageView',
    startTime: performance.now(),
    pageUrl: window.location.href,
    referror: document.referrer,
    uuid: generateUniqueId()
  };
  lazyReportBatch(reportData);
}

function behavior() {
  onClick(), pageChange(), pageView();
}

window.__webSDK__ = {
  version: '0.0.1'
};

// 针对Vue项目的错误捕获
function install(Vue, options) {
  if (__webEyeSDK__.vue) return;
  __webEyeSDK__.vue = true;
  setConfig(options);
  var handler = Vue.config.errorHandler;
  // vue项目中 通过 Vue.config.errorHandler 捕获错误
  Vue.config.errorHandler = function (err, vm, info) {
    var reportData = {
      info: info,
      error: err.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(),
      pageURL: window.location.href
    };
    console.log('vue error', reportData);
    lazyReportBatch(reportData);
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}

// 针对React项目的错误捕获
function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  var reportData = {
    error: err === null || err === void 0 ? void 0 : err.stack,
    info: info,
    subType: 'react',
    type: 'error',
    startTime: window.performance.now(),
    pageURL: window.location.href
  };
  lazyReportBatch(reportData);
}
function init(options) {
  setConfig(options);
  performance$1();
  error();
  behavior();
}
var webSDK = {
  install: install,
  errorBoundary: errorBoundary,
  performance: performance$1,
  error: error,
  behavior: behavior,
  init: init
};

export { webSDK as default, errorBoundary, init, install };
//# sourceMappingURL=monitor.esm.js.map
