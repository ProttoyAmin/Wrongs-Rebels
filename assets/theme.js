var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// js/common/actions/confirm-button.js
var ConfirmButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (!window.confirm(this.getAttribute("data-message") ?? "Once confirmed, this action cannot be undone.")) {
        event.preventDefault();
      }
    });
  }
};
if (!window.customElements.get("confirm-button")) {
  window.customElements.define("confirm-button", ConfirmButton);
}

// js/common/actions/copy-button.js
var _CopyButton_instances, copyToClipboard_fn;
var CopyButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CopyButton_instances);
    this.addEventListener("click", __privateMethod(this, _CopyButton_instances, copyToClipboard_fn));
  }
  get buttonElement() {
    return this.querySelector("button");
  }
};
_CopyButton_instances = new WeakSet();
copyToClipboard_fn = async function() {
  if (!navigator.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(this.getAttribute("data-text") ?? "");
  if (this.hasAttribute("data-success-message")) {
    const originalMessage = this.buttonElement.textContent;
    this.buttonElement.textContent = this.getAttribute("data-success-message");
    setTimeout(() => {
      this.buttonElement.textContent = originalMessage;
    }, 1500);
  }
};
if (!window.customElements.get("copy-button")) {
  window.customElements.define("copy-button", CopyButton);
}

// js/common/actions/share-button.js
var _ShareButton_instances, showSystemShare_fn;
var ShareButton = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ShareButton_instances);
    if (navigator.share) {
      this.querySelector(".share-buttons--native").hidden = false;
      this.addEventListener("click", __privateMethod(this, _ShareButton_instances, showSystemShare_fn));
    }
  }
};
_ShareButton_instances = new WeakSet();
showSystemShare_fn = async function() {
  try {
    await navigator.share({
      title: this.hasAttribute("share-title") ? this.getAttribute("share-title") : document.title,
      url: this.hasAttribute("share-url") ? this.getAttribute("share-url") : window.location.href
    });
  } catch (error) {
  }
};
if (!window.customElements.get("share-button")) {
  window.customElements.define("share-button", ShareButton);
}

// js/common/animation/marquee-text.js
import { inView, animate } from "vendor";
var _currentAnimation, _MarqueeText_instances, direction_get, scroller_get, initialize_fn;
var MarqueeText = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _MarqueeText_instances);
    __privateAdd(this, _currentAnimation);
    inView(this, __privateMethod(this, _MarqueeText_instances, initialize_fn).bind(this), { margin: "400px" });
    if (this.hasAttribute("pause-on-hover")) {
      this.addEventListener("pointerenter", () => __privateGet(this, _currentAnimation)?.pause());
      this.addEventListener("pointerleave", () => __privateGet(this, _currentAnimation)?.play());
    }
  }
};
_currentAnimation = new WeakMap();
_MarqueeText_instances = new WeakSet();
direction_get = function() {
  return this.getAttribute("direction") === "right" ? 1 : -1;
};
scroller_get = function() {
  return this.shadowRoot.querySelector('[part="scroller"]');
};
initialize_fn = function() {
  this.attachShadow({ mode: "open" }).appendChild(document.createRange().createContextualFragment(`
      <slot part="scroller"></slot>
    `));
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= 5; ++i) {
    const node = this.firstElementChild.cloneNode(true);
    node.setAttribute("aria-hidden", "true");
    node.style.cssText = `position: absolute; inset-inline-start: ${100 * i * -__privateGet(this, _MarqueeText_instances, direction_get)}%;`;
    fragment.appendChild(node);
  }
  this.append(fragment);
  __privateSet(this, _currentAnimation, animate(__privateGet(this, _MarqueeText_instances, scroller_get), { transform: ["translateX(0)", `translateX(calc(var(--transform-logical-flip) * ${__privateGet(this, _MarqueeText_instances, direction_get) * 100}%))`] }, {
    duration: 1 / parseFloat(this.getAttribute("speed")) * (__privateGet(this, _MarqueeText_instances, scroller_get).clientWidth / 300),
    easing: "linear",
    repeat: Infinity
  }));
};
if (!window.customElements.get("marquee-text")) {
  window.customElements.define("marquee-text", MarqueeText);
}

// js/common/behavior/gesture-area.js
var _domElement, _thresholdDistance, _thresholdTime, _signal, _firstClientX, _tracking, _start, _GestureArea_instances, touchStart_fn, preventTouch_fn, gestureStart_fn, gestureMove_fn, gestureEnd_fn;
var GestureArea = class {
  constructor(domElement, { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}) {
    __privateAdd(this, _GestureArea_instances);
    __privateAdd(this, _domElement);
    __privateAdd(this, _thresholdDistance);
    __privateAdd(this, _thresholdTime);
    __privateAdd(this, _signal);
    __privateAdd(this, _firstClientX);
    __privateAdd(this, _tracking, false);
    __privateAdd(this, _start, {});
    __privateSet(this, _domElement, domElement);
    __privateSet(this, _thresholdDistance, thresholdDistance);
    __privateSet(this, _thresholdTime, thresholdTime);
    __privateSet(this, _signal, signal ?? new AbortController().signal);
    __privateGet(this, _domElement).addEventListener("touchstart", __privateMethod(this, _GestureArea_instances, touchStart_fn).bind(this), { passive: true, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("touchmove", __privateMethod(this, _GestureArea_instances, preventTouch_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerdown", __privateMethod(this, _GestureArea_instances, gestureStart_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointermove", __privateMethod(this, _GestureArea_instances, gestureMove_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerup", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerleave", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointercancel", __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
  }
};
_domElement = new WeakMap();
_thresholdDistance = new WeakMap();
_thresholdTime = new WeakMap();
_signal = new WeakMap();
_firstClientX = new WeakMap();
_tracking = new WeakMap();
_start = new WeakMap();
_GestureArea_instances = new WeakSet();
touchStart_fn = function(event) {
  __privateSet(this, _firstClientX, event.touches[0].clientX);
};
preventTouch_fn = function(event) {
  if (Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) > 10) {
    event.preventDefault();
  }
};
gestureStart_fn = function(event) {
  __privateSet(this, _tracking, true);
  __privateSet(this, _start, {
    time: (/* @__PURE__ */ new Date()).getTime(),
    x: event.clientX,
    y: event.clientY
  });
};
gestureMove_fn = function(event) {
  if (__privateGet(this, _tracking)) {
    event.preventDefault();
  }
};
gestureEnd_fn = function(event) {
  if (!__privateGet(this, _tracking)) {
    return;
  }
  __privateSet(this, _tracking, false);
  const now = (/* @__PURE__ */ new Date()).getTime(), deltaTime = now - __privateGet(this, _start).time, deltaX = event.clientX - __privateGet(this, _start).x, deltaY = event.clientY - __privateGet(this, _start).y;
  if (deltaTime > __privateGet(this, _thresholdTime)) {
    return;
  }
  let matchedEvent;
  if (deltaX === 0 && deltaY === 0) {
    matchedEvent = "tap";
  } else if (deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swiperight";
  } else if (-deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeleft";
  } else if (deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipedown";
  } else if (-deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeup";
  }
  if (matchedEvent) {
    __privateGet(this, _domElement).dispatchEvent(new CustomEvent(matchedEvent, { bubbles: true, composed: true, detail: { originalEvent: event } }));
  }
};

// js/common/utilities/country-selector.js
var _onCountryChangedListener, _CountrySelector_instances, onCountryChanged_fn;
var CountrySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CountrySelector_instances);
    __privateAdd(this, _onCountryChangedListener, __privateMethod(this, _CountrySelector_instances, onCountryChanged_fn).bind(this));
  }
  connectedCallback() {
    this.countryElement = this.querySelector('[name="address[country]"]');
    this.provinceElement = this.querySelector('[name="address[province]"]');
    this.countryElement.addEventListener("change", __privateGet(this, _onCountryChangedListener));
    if (this.hasAttribute("country") && this.getAttribute("country") !== "") {
      this.countryElement.selectedIndex = Math.max(0, Array.from(this.countryElement.options).findIndex((option) => option.textContent === this.getAttribute("country")));
    }
    this.countryElement.dispatchEvent(new Event("change"));
  }
  disconnectedCallback() {
    this.countryElement.removeEventListener("change", __privateGet(this, _onCountryChangedListener));
  }
};
_onCountryChangedListener = new WeakMap();
_CountrySelector_instances = new WeakSet();
onCountryChanged_fn = function() {
  const option = this.countryElement.options[this.countryElement.selectedIndex], provinces = JSON.parse(option.getAttribute("data-provinces"));
  this.provinceElement.parentElement.hidden = provinces.length === 0;
  if (provinces.length === 0) {
    return;
  }
  this.provinceElement.innerHTML = "";
  provinces.forEach((data) => {
    const selected = data[1] === this.getAttribute("province") || data[0] === this.getAttribute("province");
    this.provinceElement.options.add(new Option(data[1], data[0], selected, selected));
  });
};
if (!window.customElements.get("country-selector")) {
  window.customElements.define("country-selector", CountrySelector);
}

// js/common/utilities/cached-fetch.js
var cachedMap = /* @__PURE__ */ new Map();
function cachedFetch(url, options) {
  const cacheKey = url;
  if (cachedMap.has(cacheKey)) {
    return Promise.resolve(new Response(new Blob([cachedMap.get(cacheKey)])));
  }
  return fetch(url, options).then((response) => {
    if (response.status === 200) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && (contentType.match(/application\/json/i) || contentType.match(/text\//i))) {
        response.clone().text().then((content) => {
          cachedMap.set(cacheKey, content);
        });
      }
    }
    return response;
  });
}

// js/common/utilities/extract-section-id.js
function extractSectionId(element) {
  element = element.classList.contains("shopify-section") ? element : element.closest(".shopify-section");
  return element.id.replace("shopify-section-", "");
}

// js/common/utilities/dom.js
function deepQuerySelector(root, selector) {
  let element = root.querySelector(selector);
  if (element) {
    return element;
  }
  for (const template of root.querySelectorAll("template")) {
    element = deepQuerySelector(template.content, selector);
    if (element) {
      return element;
    }
  }
  return null;
}
function throttle(callback) {
  let requestId = null, lastArgs;
  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };
  return throttled;
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const done = (event) => {
      if (event.target === element) {
        element.removeEventListener(eventName, done);
        resolve(event);
      }
    };
    element.addEventListener(eventName, done);
  });
}

// js/common/utilities/media.js
function videoLoaded(videoOrArray) {
  if (!videoOrArray) {
    return Promise.resolve();
  }
  videoOrArray = videoOrArray instanceof Element ? [videoOrArray] : Array.from(videoOrArray);
  return Promise.all(videoOrArray.map((video) => {
    return new Promise((resolve) => {
      if (video.tagName === "VIDEO" && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA || !video.offsetParent || video.parentNode.hasAttribute("suspended")) {
        resolve();
      } else {
        video.oncanplay = () => resolve();
      }
    });
  }));
}
function imageLoaded(imageOrArray) {
  if (!imageOrArray) {
    return Promise.resolve();
  }
  imageOrArray = imageOrArray instanceof Element ? [imageOrArray] : Array.from(imageOrArray);
  return Promise.all(imageOrArray.map((image) => {
    return new Promise((resolve) => {
      if (image.tagName === "IMG" && image.complete || !image.offsetParent) {
        resolve();
      } else {
        image.onload = () => resolve();
      }
    });
  }));
}
function generateSrcset(imageObjectOrString, widths = []) {
  let imageUrl, maxWidth;
  if (typeof imageObjectOrString === "string") {
    imageUrl = new URL(imageObjectOrString.startsWith("//") ? `https:${imageObjectOrString}` : imageObjectOrString);
    maxWidth = parseInt(imageUrl.searchParams.get("width"));
  } else {
    imageUrl = new URL(imageObjectOrString["src"].startsWith("//") ? `https:${imageObjectOrString["src"]}` : imageObjectOrString["src"]);
    maxWidth = imageObjectOrString["width"];
  }
  return widths.filter((width) => width <= maxWidth).map((width) => {
    imageUrl.searchParams.set("width", width.toString());
    return `${imageUrl.href} ${width}w`;
  }).join(", ");
}
function createMediaImg(media, widths = [], attributes = {}) {
  const image = new Image(media["preview_image"]["width"], media["preview_image"]["height"]), src = media["preview_image"]["src"], featuredMediaUrl = new URL(src.startsWith("//") ? `https:${src}` : src);
  for (const attributeKey in attributes) {
    image.setAttribute(attributeKey, attributes[attributeKey]);
  }
  image.alt = media["alt"] || "";
  image.src = featuredMediaUrl.href;
  image.srcset = generateSrcset(media["preview_image"], widths);
  return image;
}

// js/common/utilities/media-query.js
function matchesMediaQuery(breakpointName) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    throw `Media query ${breakpointName} does not exist`;
  }
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName]).matches;
}
function mediaQueryListener(breakpointName, func) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    throw `Media query ${breakpointName} does not exist`;
  }
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName]).addEventListener("change", func);
}

// js/common/utilities/player.js
var _callback, _duration, _remainingTime, _startTime, _timer, _state, _onVisibilityChangeListener, _mustResumeOnVisibility, _Player_instances, onVisibilityChange_fn;
var Player = class extends EventTarget {
  constructor(durationInSec, stopOnVisibility = true) {
    super();
    __privateAdd(this, _Player_instances);
    __privateAdd(this, _callback);
    __privateAdd(this, _duration);
    __privateAdd(this, _remainingTime);
    __privateAdd(this, _startTime);
    __privateAdd(this, _timer);
    __privateAdd(this, _state, "paused");
    __privateAdd(this, _onVisibilityChangeListener, __privateMethod(this, _Player_instances, onVisibilityChange_fn).bind(this));
    __privateAdd(this, _mustResumeOnVisibility, true);
    __privateSet(this, _callback, () => this.dispatchEvent(new CustomEvent("player:end")));
    __privateSet(this, _duration, __privateSet(this, _remainingTime, durationInSec * 1e3));
    if (stopOnVisibility) {
      document.addEventListener("visibilitychange", __privateGet(this, _onVisibilityChangeListener));
    }
  }
  pause() {
    if (__privateGet(this, _state) !== "started") {
      return;
    }
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "paused");
    __privateSet(this, _remainingTime, __privateGet(this, _remainingTime) - ((/* @__PURE__ */ new Date()).getTime() - __privateGet(this, _startTime)));
    this.dispatchEvent(new CustomEvent("player:pause"));
  }
  resume(restartTimer = false) {
    if (__privateGet(this, _state) !== "stopped") {
      if (restartTimer) {
        this.start();
      } else {
        clearTimeout(__privateGet(this, _timer));
        __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
        __privateSet(this, _state, "started");
        __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
        this.dispatchEvent(new CustomEvent("player:resume"));
      }
    }
  }
  start() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _startTime, (/* @__PURE__ */ new Date()).getTime());
    __privateSet(this, _state, "started");
    __privateSet(this, _remainingTime, __privateGet(this, _duration));
    __privateSet(this, _timer, setTimeout(__privateGet(this, _callback), __privateGet(this, _remainingTime)));
    this.dispatchEvent(new CustomEvent("player:start"));
  }
  stop() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "stopped");
    this.dispatchEvent(new CustomEvent("player:stop"));
  }
};
_callback = new WeakMap();
_duration = new WeakMap();
_remainingTime = new WeakMap();
_startTime = new WeakMap();
_timer = new WeakMap();
_state = new WeakMap();
_onVisibilityChangeListener = new WeakMap();
_mustResumeOnVisibility = new WeakMap();
_Player_instances = new WeakSet();
onVisibilityChange_fn = function() {
  if (document.visibilityState === "hidden") {
    __privateSet(this, _mustResumeOnVisibility, __privateGet(this, _state) === "started");
    this.pause();
    this.dispatchEvent(new CustomEvent("player:visibility-pause"));
  } else if (document.visibilityState === "visible" && __privateGet(this, _mustResumeOnVisibility)) {
    this.resume();
    this.dispatchEvent(new CustomEvent("player:visibility-resume"));
  }
};

// js/common/utilities/qr-code.js
var QrCode = class extends HTMLElement {
  connectedCallback() {
    new window.QRCode(this, {
      text: this.getAttribute("identifier"),
      width: this.hasAttribute("width") ? parseInt(this.getAttribute("width")) : 200,
      height: this.hasAttribute("height") ? parseInt(this.getAttribute("height")) : 200
    });
  }
};
if (!window.customElements.get("qr-code")) {
  window.customElements.define("qr-code", QrCode);
}

// js/common/behavior/height-observer.js
var _resizeObserver, _HeightObserver_instances, updateCustomProperties_fn;
var HeightObserver = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _HeightObserver_instances);
    __privateAdd(this, _resizeObserver, new ResizeObserver(throttle(__privateMethod(this, _HeightObserver_instances, updateCustomProperties_fn).bind(this))));
  }
  connectedCallback() {
    __privateGet(this, _resizeObserver).observe(this);
    if (!window.ResizeObserver) {
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${this.clientHeight.toFixed(2)}px`);
    }
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver).unobserve(this);
  }
};
_resizeObserver = new WeakMap();
_HeightObserver_instances = new WeakSet();
updateCustomProperties_fn = function(entries) {
  entries.forEach((entry) => {
    if (entry.target === this) {
      const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${height.toFixed(2)}px`);
    }
  });
};
if (!window.customElements.get("height-observer")) {
  window.customElements.define("height-observer", HeightObserver);
}

// js/common/behavior/loading-bar.js
import { animate as animate2 } from "vendor";
var _LoadingBar_instances, onLoadingStart_fn, onLoadingEnd_fn;
var LoadingBar = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LoadingBar_instances);
    document.addEventListener("theme:loading:start", __privateMethod(this, _LoadingBar_instances, onLoadingStart_fn).bind(this));
    document.addEventListener("theme:loading:end", __privateMethod(this, _LoadingBar_instances, onLoadingEnd_fn).bind(this));
  }
};
_LoadingBar_instances = new WeakSet();
onLoadingStart_fn = function() {
  animate2(this, { opacity: [0, 1], transform: ["scaleX(0)", "scaleX(0.4)"] }, { duration: 0.25 });
};
onLoadingEnd_fn = async function() {
  await animate2(this, { transform: [null, "scaleX(1)"] }, { duration: 0.25 }).finished;
  animate2(this, { opacity: 0 }, { duration: 0.25 });
};
if (!window.customElements.get("loading-bar")) {
  window.customElements.define("loading-bar", LoadingBar);
}

// js/common/behavior/safe-sticky.js
import { inView as inView2 } from "vendor";
var _resizeObserver2, _checkPositionListener, _initialTop, _lastKnownY, _currentTop, _position, _SafeSticky_instances, recalculateStyles_fn, checkPosition_fn;
var SafeSticky = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SafeSticky_instances);
    __privateAdd(this, _resizeObserver2, new ResizeObserver(__privateMethod(this, _SafeSticky_instances, recalculateStyles_fn).bind(this)));
    __privateAdd(this, _checkPositionListener, throttle(__privateMethod(this, _SafeSticky_instances, checkPosition_fn).bind(this)));
    __privateAdd(this, _initialTop, 0);
    __privateAdd(this, _lastKnownY, 0);
    /* we could initialize it to window.scrollY but this avoids a costly reflow */
    __privateAdd(this, _currentTop, 0);
    __privateAdd(this, _position, "relative");
  }
  connectedCallback() {
    inView2(this, () => {
      window.addEventListener("scroll", __privateGet(this, _checkPositionListener));
      __privateGet(this, _resizeObserver2).observe(this);
      return () => {
        window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
        __privateGet(this, _resizeObserver2).unobserve(this);
      };
    }, { margin: "500px" });
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
    __privateGet(this, _resizeObserver2).unobserve(this);
  }
};
_resizeObserver2 = new WeakMap();
_checkPositionListener = new WeakMap();
_initialTop = new WeakMap();
_lastKnownY = new WeakMap();
_currentTop = new WeakMap();
_position = new WeakMap();
_SafeSticky_instances = new WeakSet();
recalculateStyles_fn = function() {
  this.style.removeProperty("top");
  const computedStyles = getComputedStyle(this);
  __privateSet(this, _initialTop, parseInt(computedStyles.top));
  __privateSet(this, _position, computedStyles.position);
  __privateMethod(this, _SafeSticky_instances, checkPosition_fn).call(this);
};
checkPosition_fn = function() {
  if (__privateGet(this, _position) !== "sticky") {
    return this.style.removeProperty("top");
  }
  let bounds = this.getBoundingClientRect(), maxTop = bounds.top + window.scrollY - this.offsetTop + __privateGet(this, _initialTop), minTop = this.clientHeight - window.innerHeight + 20;
  if (window.scrollY < __privateGet(this, _lastKnownY)) {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) - (window.scrollY - __privateGet(this, _lastKnownY)));
  } else {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) + (__privateGet(this, _lastKnownY) - window.scrollY));
  }
  __privateSet(this, _currentTop, Math.min(Math.max(__privateGet(this, _currentTop), -minTop), maxTop, __privateGet(this, _initialTop)));
  __privateSet(this, _lastKnownY, window.scrollY);
  this.style.top = `${Math.round(__privateGet(this, _currentTop))}px`;
};
if (!window.customElements.get("safe-sticky")) {
  window.customElements.define("safe-sticky", SafeSticky);
}

// js/common/carousel/carousel-navigation.js
var _abortController, _allItems, _CarouselNavigation_instances, onCarouselFilter_fn;
var CarouselNavigation = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CarouselNavigation_instances);
    __privateAdd(this, _abortController);
    __privateAdd(this, _allItems, []);
  }
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel navigation component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    __privateSet(this, _abortController, new AbortController());
    __privateSet(this, _allItems, Array.from(this.querySelectorAll("button")));
    __privateGet(this, _allItems).forEach((button) => button.addEventListener("click", () => this.onButtonClicked(this.items.indexOf(button)), { signal: __privateGet(this, _abortController).signal }));
    this.carousel.addEventListener("carousel:change", (event) => this.onNavigationChange(event.detail.index), { signal: __privateGet(this, _abortController).signal });
    this.carousel.addEventListener("carousel:filter", __privateMethod(this, _CarouselNavigation_instances, onCarouselFilter_fn).bind(this), { signal: __privateGet(this, _abortController).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController).abort();
  }
  get items() {
    return __privateGet(this, _allItems).filter((item) => !item.hasAttribute("hidden"));
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
  get selectedIndex() {
    return this.items.findIndex((button) => button.getAttribute("aria-current") === "true");
  }
  onButtonClicked(newIndex) {
    this.carousel.select(newIndex);
    this.onNavigationChange(newIndex);
  }
  onNavigationChange(newIndex) {
    this.items.forEach((button, index) => button.setAttribute("aria-current", newIndex === index ? "true" : "false"));
    if (this.hasAttribute("align-selected") && (this.scrollWidth !== this.clientWidth || this.scrollHeight !== this.clientHeight)) {
      this.scrollTo({
        left: this.items[newIndex].offsetLeft - this.clientWidth / 2 + this.items[newIndex].clientWidth / 2,
        top: this.items[newIndex].offsetTop - this.clientHeight / 2 + this.items[newIndex].clientHeight / 2,
        behavior: matchesMediaQuery("motion-safe") ? "smooth" : "auto"
      });
    }
  }
};
_abortController = new WeakMap();
_allItems = new WeakMap();
_CarouselNavigation_instances = new WeakSet();
onCarouselFilter_fn = function(event) {
  __privateGet(this, _allItems).forEach((item, index) => {
    item.toggleAttribute("hidden", (event.detail.filteredIndexes || []).includes(index));
  });
};
var CarouselPrevButton = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel prev button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.previous(), { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-nearing", (event) => this.firstElementChild.disabled = event.detail.position === "start", { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-leaving", (event) => this.firstElementChild.disabled = event.detail.position === "start" ? false : this.firstElementChild.disabled, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
var CarouselNextButton = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel next button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.next(), { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-nearing", (event) => this.firstElementChild.disabled = event.detail.position === "end", { signal: this.#abortController.signal });
    this.carousel.addEventListener("scroll:edge-leaving", (event) => this.firstElementChild.disabled = event.detail.position === "end" ? false : this.firstElementChild.disabled, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
if (!window.customElements.get("carousel-prev-button")) {
  window.customElements.define("carousel-prev-button", CarouselPrevButton);
}
if (!window.customElements.get("carousel-next-button")) {
  window.customElements.define("carousel-next-button", CarouselNextButton);
}
if (!window.customElements.get("carousel-navigation")) {
  window.customElements.define("carousel-navigation", CarouselNavigation);
}

// js/common/carousel/effect-carousel.js
import { animate as animate3, timeline, inView as inView3 } from "vendor";
var _listenersAbortController, _gestureArea, _player, _targetIndex, _preventInitialTransition, _EffectCarousel_instances, setupListeners_fn, onKeyboardNavigation_fn, preloadImages_fn;
var EffectCarousel = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _EffectCarousel_instances);
    __privateAdd(this, _listenersAbortController);
    __privateAdd(this, _gestureArea);
    __privateAdd(this, _player);
    __privateAdd(this, _targetIndex, 0);
    __privateAdd(this, _preventInitialTransition, false);
    __privateMethod(this, _EffectCarousel_instances, setupListeners_fn).call(this);
    inView3(this, () => this.onBecameVisible());
    this.addEventListener("carousel:settle", (event) => {
      this.allCells.forEach((cell) => cell.classList.toggle("is-selected", cell === event.detail.cell));
    });
  }
  connectedCallback() {
    __privateSet(this, _targetIndex, Math.max(0, this.cells.findIndex((item) => item.classList.contains("is-selected"))));
    inView3(this, () => __privateMethod(this, _EffectCarousel_instances, preloadImages_fn).call(this));
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get allowSwipe() {
    return this.hasAttribute("allow-swipe");
  }
  get cellSelector() {
    return this.hasAttribute("cell-selector") ? this.getAttribute("cell-selector") : null;
  }
  get allCells() {
    return this.cellSelector ? Array.from(this.querySelectorAll(this.cellSelector)) : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex);
  }
  get player() {
    return __privateGet(this, _player);
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    return this.select((this.selectedIndex - 1 + this.cells.length) % this.cells.length, { instant, direction: "previous" });
  }
  next({ instant = false } = {}) {
    return this.select((this.selectedIndex + 1 + this.cells.length) % this.cells.length, { instant, direction: "next" });
  }
  async select(index, { instant = false, direction = null } = {}) {
    if (!(index in this.cells)) {
      return Promise.resolve();
    }
    this.dispatchEvent(new CustomEvent("carousel:select", { detail: { index, cell: this.cells[index] } }));
    if (index === this.selectedIndex) {
      return Promise.resolve();
    }
    __privateGet(this, _player)?.pause();
    const [fromSlide, toSlide] = [this.selectedCell, this.cells[index]];
    direction ??= index > this.selectedIndex ? "next" : "previous";
    __privateSet(this, _targetIndex, index);
    this.dispatchEvent(new CustomEvent("carousel:change", { detail: { index, cell: this.cells[index] } }));
    const animationControls = this.createOnChangeAnimationControls(fromSlide, toSlide, { direction });
    if ("leaveControls" in animationControls && "enterControls" in animationControls) {
      const leaveAnimationControls = animationControls.leaveControls();
      if (instant) {
        leaveAnimationControls.finish();
      }
      await leaveAnimationControls.finished;
      __privateGet(this, _player)?.resume(true);
      fromSlide.classList.remove("is-selected");
      toSlide.classList.add("is-selected");
      const enterAnimationControls = animationControls.enterControls();
      if (instant) {
        enterAnimationControls.finish();
      }
      await enterAnimationControls.finished;
    } else {
      if (instant) {
        animationControls.finish();
      }
      __privateGet(this, _player)?.resume(true);
      toSlide.classList.add("is-selected");
      await animationControls.finished;
      fromSlide.classList.remove("is-selected");
    }
    this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index, cell: this.cells[index] } }));
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    this.dispatchEvent(new CustomEvent("carousel:filter", { detail: { filteredIndexes: indexes } }));
  }
  async onBecameVisible() {
    const animationControls = await this.createOnBecameVisibleAnimationControls(this.selectedCell);
    [this.selectedCell, ...this.selectedCell.querySelectorAll("[reveal-on-scroll]")].forEach((element) => {
      element.removeAttribute("reveal-on-scroll");
    });
    if (__privateGet(this, _preventInitialTransition) && typeof animationControls.finish === "function") {
      animationControls.finish();
    }
    return animationControls.finished.then(() => {
      __privateGet(this, _player)?.resume(true);
      this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index: this.selectedIndex, cell: this.selectedCell } }));
    });
  }
  /**
   * The animation controls when the carousel enter into the view for the first time (by default, none)
   */
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate3(toSlide, {}, { duration: 0 });
  }
  /**
   * Define the transition when the slide changes
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    return timeline([
      [fromSlide, { opacity: [1, 0] }, { duration: 0.3 }],
      [toSlide, { opacity: [0, 1] }, { duration: 0.3, at: "<" }]
    ]);
  }
  /**
   * When the breakpoint changes (for instance from mobile to desktop), we may have to clean up the existing
   * attributes leave by Motion
   */
  cleanUpAnimations() {
    this.allCells.forEach((cell) => {
      cell.style.removeProperty("opacity");
      cell.style.removeProperty("visibility");
    });
  }
};
_listenersAbortController = new WeakMap();
_gestureArea = new WeakMap();
_player = new WeakMap();
_targetIndex = new WeakMap();
_preventInitialTransition = new WeakMap();
_EffectCarousel_instances = new WeakSet();
/**
 * -------------------------------------------------------------------------------------------------------------------
 * PRIVATE
 * -------------------------------------------------------------------------------------------------------------------
 */
setupListeners_fn = function() {
  if (this.hasAttribute("disabled-on")) {
    mediaQueryListener(this.getAttribute("disabled-on"), (event) => {
      if (event.matches) {
        __privateGet(this, _listenersAbortController)?.abort();
        this.cleanUpAnimations();
      } else {
        __privateMethod(this, _EffectCarousel_instances, setupListeners_fn).call(this);
      }
    });
    if (matchesMediaQuery(this.getAttribute("disabled-on"))) {
      return;
    }
  }
  __privateSet(this, _listenersAbortController, new AbortController());
  const listenerOptions = { signal: __privateGet(this, _listenersAbortController).signal };
  if (Shopify.designMode) {
    this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => __privateSet(this, _preventInitialTransition, event.detail.load), listenerOptions);
  }
  if (this.allCells.length > 1) {
    this.addEventListener("carousel:change", __privateMethod(this, _EffectCarousel_instances, preloadImages_fn));
    if (this.allowSwipe) {
      __privateSet(this, _gestureArea, new GestureArea(this, { signal: __privateGet(this, _listenersAbortController).signal }));
      this.addEventListener("swipeleft", this.next, listenerOptions);
      this.addEventListener("swiperight", this.previous, listenerOptions);
    }
    if (!this.hasAttribute("disable-keyboard-navigation")) {
      this.tabIndex = 0;
      this.addEventListener("keydown", __privateMethod(this, _EffectCarousel_instances, onKeyboardNavigation_fn), listenerOptions);
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.select(this.cells.indexOf(event.target), { instant: event.detail.load }), listenerOptions);
    }
    if (this.hasAttribute("autoplay")) {
      __privateGet(this, _player) ?? __privateSet(this, _player, new Player(this.getAttribute("autoplay") ?? 5));
      __privateGet(this, _player).addEventListener("player:end", this.next.bind(this), listenerOptions);
      if (Shopify.designMode) {
        this.addEventListener("shopify:block:select", () => __privateGet(this, _player).stop(), listenerOptions);
        this.addEventListener("shopify:block:deselect", () => __privateGet(this, _player).start(), listenerOptions);
      }
    }
  }
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * OTHER
 * -------------------------------------------------------------------------------------------------------------------
 */
onKeyboardNavigation_fn = function(event) {
  if (event.target !== this) {
    return;
  }
  if (event.code === "ArrowLeft") {
    this.previous();
  } else if (event.code === "ArrowRight") {
    this.next();
  }
};
preloadImages_fn = function() {
  const previousSlide = this.cells[(this.selectedIndex - 1 + this.cells.length) % this.cells.length], nextSlide = this.cells[(this.selectedIndex + 1 + this.cells.length) % this.cells.length];
  [previousSlide, this.selectedCell, nextSlide].forEach((item) => {
    Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.removeAttribute("loading"));
    Array.from(item.querySelectorAll('video[preload="none"]')).forEach((video) => video.setAttribute("preload", "metadata"));
  });
};
if (!window.customElements.get("effect-carousel")) {
  window.customElements.define("effect-carousel", EffectCarousel);
}

// js/common/carousel/scroll-carousel.js
import { inView as inView4 } from "vendor";
var _hasPendingProgrammaticScroll, _onMouseDownListener, _onMouseMoveListener, _onMouseClickListener, _onMouseUpListener, _targetIndex2, _forceChangeEvent, _dragPosition, _isDragging, _dispatchableScrollEvents, _scrollTimeout, _ScrollCarousel_instances, setupListeners_fn2, updateTargetIndex_fn, onScroll_fn, onScrollEnd_fn, calculateLeftScroll_fn, calculateClosestIndexToAlignment_fn, onMouseDown_fn, onMouseMove_fn, onMouseClick_fn, onMouseUp_fn, onResize_fn, onMutate_fn, adaptHeight_fn, preloadImages_fn2;
var ScrollCarousel = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ScrollCarousel_instances);
    __privateAdd(this, _hasPendingProgrammaticScroll, false);
    __privateAdd(this, _onMouseDownListener, __privateMethod(this, _ScrollCarousel_instances, onMouseDown_fn).bind(this));
    __privateAdd(this, _onMouseMoveListener, __privateMethod(this, _ScrollCarousel_instances, onMouseMove_fn).bind(this));
    __privateAdd(this, _onMouseClickListener, __privateMethod(this, _ScrollCarousel_instances, onMouseClick_fn).bind(this));
    __privateAdd(this, _onMouseUpListener, __privateMethod(this, _ScrollCarousel_instances, onMouseUp_fn).bind(this));
    __privateAdd(this, _targetIndex2, 0);
    // The cell index to which we are currently going to
    __privateAdd(this, _forceChangeEvent, false);
    __privateAdd(this, _dragPosition, {});
    __privateAdd(this, _isDragging, false);
    __privateAdd(this, _dispatchableScrollEvents, { nearingStart: true, nearingEnd: true, leavingStart: true, leavingEnd: true });
    __privateAdd(this, _scrollTimeout);
    __privateMethod(this, _ScrollCarousel_instances, setupListeners_fn2).call(this);
    new ResizeObserver(__privateMethod(this, _ScrollCarousel_instances, onResize_fn).bind(this)).observe(this);
    new MutationObserver(__privateMethod(this, _ScrollCarousel_instances, onMutate_fn).bind(this)).observe(this, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }
  connectedCallback() {
    __privateSet(this, _targetIndex2, Math.max(0, this.cells.findIndex((item) => item.classList.contains("is-initial"))));
    if (__privateGet(this, _targetIndex2) > 0) {
      this.select(__privateGet(this, _targetIndex2), { instant: true });
    }
    if (this.adaptiveHeight) {
      __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(this);
    }
    inView4(this, () => __privateMethod(this, _ScrollCarousel_instances, preloadImages_fn2).call(this));
  }
  disconnectedCallback() {
    this.removeEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
    document.removeEventListener("mouseup", __privateGet(this, _onMouseUpListener));
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get cellSelector() {
    return this.hasAttribute("cell-selector") ? this.getAttribute("cell-selector") : null;
  }
  get allCells() {
    return this.cellSelector ? Array.from(this.querySelectorAll(this.cellSelector)) : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex2);
  }
  get cellAlign() {
    const scrollSnapAlign = getComputedStyle(this.cells[0]).scrollSnapAlign;
    return scrollSnapAlign === "none" ? "center" : scrollSnapAlign;
  }
  get groupCells() {
    if (this.hasAttribute("group-cells")) {
      const number = parseInt(this.getAttribute("group-cells"));
      return isNaN(number) ? Math.floor(this.clientWidth / this.cells[0].clientWidth) : number;
    } else {
      return 1;
    }
  }
  get adaptiveHeight() {
    return this.hasAttribute("adaptive-height");
  }
  get isScrollable() {
    const differenceWidth = this.scrollWidth - this.clientWidth;
    const differenceHeight = this.scrollHeight - this.clientHeight;
    return differenceWidth > 1 || differenceHeight > 1;
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    this.select(Math.max(__privateGet(this, _targetIndex2) - this.groupCells, 0), { instant });
  }
  next({ instant = false } = {}) {
    this.select(Math.min(__privateGet(this, _targetIndex2) + this.groupCells, this.cells.length - 1), { instant });
  }
  select(index, { instant = false } = {}) {
    if (!(index in this.cells)) {
      return;
    }
    this.dispatchEvent(new CustomEvent("carousel:select", { detail: { index, cell: this.cells[index] } }));
    if ("checkVisibility" in this && this.checkVisibility() || this.offsetWidth > 0 && this.offsetHeight > 0) {
      const targetScrollLeft = __privateMethod(this, _ScrollCarousel_instances, calculateLeftScroll_fn).call(this, this.cells[index]);
      if (this.scrollLeft !== targetScrollLeft) {
        __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, index);
        __privateSet(this, _hasPendingProgrammaticScroll, true);
        this.scrollTo({ left: targetScrollLeft, behavior: instant ? "auto" : "smooth" });
      } else {
        __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
      }
    } else {
      __privateSet(this, _targetIndex2, index);
      __privateSet(this, _forceChangeEvent, true);
    }
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    __privateSet(this, _forceChangeEvent, true);
    this.dispatchEvent(new CustomEvent("carousel:filter", { detail: { filteredIndexes: indexes } }));
  }
};
_hasPendingProgrammaticScroll = new WeakMap();
_onMouseDownListener = new WeakMap();
_onMouseMoveListener = new WeakMap();
_onMouseClickListener = new WeakMap();
_onMouseUpListener = new WeakMap();
_targetIndex2 = new WeakMap();
_forceChangeEvent = new WeakMap();
_dragPosition = new WeakMap();
_isDragging = new WeakMap();
_dispatchableScrollEvents = new WeakMap();
_scrollTimeout = new WeakMap();
_ScrollCarousel_instances = new WeakSet();
/**
 * -------------------------------------------------------------------------------------------------------------------
 * PRIVATE METHODS
 * -------------------------------------------------------------------------------------------------------------------
 */
/**
 * Setup all the listeners needed for the carousel to work properly
 */
setupListeners_fn2 = function() {
  if (this.allCells.length > 1) {
    this.addEventListener("carousel:change", __privateMethod(this, _ScrollCarousel_instances, preloadImages_fn2));
    this.addEventListener("scroll", throttle(__privateMethod(this, _ScrollCarousel_instances, onScroll_fn).bind(this)));
    this.addEventListener("scrollend", __privateMethod(this, _ScrollCarousel_instances, onScrollEnd_fn));
    if (this.hasAttribute("allow-drag")) {
      const mediaQuery = window.matchMedia("screen and (pointer: fine)");
      mediaQuery.addEventListener("change", (event) => {
        if (event.matches) {
          this.addEventListener("mousedown", __privateGet(this, _onMouseDownListener));
        } else {
          this.removeEventListener("mousedown", __privateGet(this, _onMouseDownListener));
        }
      });
      if (mediaQuery.matches) {
        this.addEventListener("mousedown", __privateGet(this, _onMouseDownListener));
      }
    }
    if (this.adaptiveHeight) {
      this.addEventListener("carousel:settle", __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.select(this.cells.indexOf(event.target), { instant: event.detail.load }));
    }
  }
};
updateTargetIndex_fn = function(newValue) {
  if (newValue === __privateGet(this, _targetIndex2) && !__privateGet(this, _forceChangeEvent)) {
    return;
  }
  __privateSet(this, _targetIndex2, newValue);
  __privateSet(this, _forceChangeEvent, false);
  this.dispatchEvent(new CustomEvent("carousel:change", { detail: { index: newValue, cell: this.cells[newValue] } }));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * SCROLL MANAGEMENT
 * -------------------------------------------------------------------------------------------------------------------
 */
onScroll_fn = function() {
  const scrollEdgeThreshold = 100, normalizedScrollLeft = Math.round(Math.abs(this.scrollLeft));
  if (normalizedScrollLeft < scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["nearingStart"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-nearing", { detail: { position: "start" } }));
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = true;
  }
  if (normalizedScrollLeft >= scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["leavingStart"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-leaving", { detail: { position: "start" } }));
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = true;
  }
  if (this.scrollWidth - this.clientWidth < normalizedScrollLeft + scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["nearingEnd"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-nearing", { detail: { position: "end" } }));
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = true;
  }
  if (this.scrollWidth - this.clientWidth >= normalizedScrollLeft + scrollEdgeThreshold && __privateGet(this, _dispatchableScrollEvents)["leavingEnd"]) {
    this.dispatchEvent(new CustomEvent("scroll:edge-leaving", { detail: { position: "end" } }));
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = true;
  }
  if (!("onscrollend" in window)) {
    clearTimeout(__privateGet(this, _scrollTimeout));
    __privateSet(this, _scrollTimeout, setTimeout(() => {
      this.dispatchEvent(new CustomEvent("scrollend", { bubbles: true }));
    }, 75));
  }
  if (__privateGet(this, _hasPendingProgrammaticScroll)) {
    return;
  }
  __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
};
onScrollEnd_fn = function() {
  __privateSet(this, _hasPendingProgrammaticScroll, false);
  if (!__privateGet(this, _isDragging)) {
    this.style.removeProperty("scroll-snap-type");
  }
  __privateMethod(this, _ScrollCarousel_instances, updateTargetIndex_fn).call(this, __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this));
  this.dispatchEvent(new CustomEvent("carousel:settle", { detail: { index: this.selectedIndex, cell: this.selectedCell } }));
};
/**
 * Calculate the amount to scroll to align the cell with the "cell-align" rule
 */
calculateLeftScroll_fn = function(cell) {
  let scrollLeft;
  switch (this.cellAlign) {
    case "start":
      scrollLeft = document.dir === "ltr" ? cell.offsetLeft - (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0) : cell.offsetLeft + cell.offsetWidth - this.clientWidth + (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0);
      break;
    case "center":
      scrollLeft = Math.round(cell.offsetLeft - this.clientWidth / 2 + cell.clientWidth / 2);
      break;
    case "end":
      scrollLeft = document.dir === "ltr" ? cell.offsetLeft + cell.offsetWidth - this.clientWidth + (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0) : cell.offsetLeft - (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0);
      break;
  }
  return document.dir === "ltr" ? Math.min(Math.max(scrollLeft, 0), this.scrollWidth - this.clientWidth) : Math.min(Math.max(scrollLeft, this.clientWidth - this.scrollWidth), 0);
};
calculateClosestIndexToAlignment_fn = function() {
  let cellAlign = this.cellAlign, offsetAccumulators, targetPoint;
  if (cellAlign === "center") {
    offsetAccumulators = this.cells.map((cell) => Math.round(cell.offsetLeft + cell.clientWidth / 2));
    targetPoint = Math.round(this.scrollLeft + this.clientWidth / 2);
  } else if (cellAlign === "start" && document.dir === "ltr" || cellAlign === "end" && document.dir === "rtl") {
    offsetAccumulators = this.cells.map((cell) => cell.offsetLeft);
    targetPoint = this.scrollLeft;
  } else {
    offsetAccumulators = this.cells.map((cell) => cell.offsetLeft + cell.clientWidth);
    targetPoint = this.scrollLeft + this.clientWidth;
  }
  return offsetAccumulators.indexOf(offsetAccumulators.reduce((prev, curr) => Math.abs(curr - targetPoint) < Math.abs(prev - targetPoint) ? curr : prev));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * DRAG FEATURE
 * -------------------------------------------------------------------------------------------------------------------
 */
onMouseDown_fn = function(event) {
  __privateSet(this, _dragPosition, {
    // The current scroll
    left: this.scrollLeft,
    top: this.scrollTop,
    // Get the current mouse position
    x: event.clientX,
    y: event.clientY
  });
  __privateSet(this, _isDragging, true);
  this.style.setProperty("scroll-snap-type", "none");
  this.addEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
  this.addEventListener("click", __privateGet(this, _onMouseClickListener), { once: true });
  document.addEventListener("mouseup", __privateGet(this, _onMouseUpListener));
};
onMouseMove_fn = function(event) {
  event.preventDefault();
  const [dx, dy] = [event.clientX - __privateGet(this, _dragPosition).x, event.clientY - __privateGet(this, _dragPosition).y];
  this.scrollTop = __privateGet(this, _dragPosition).top - dy;
  this.scrollLeft = __privateGet(this, _dragPosition).left - dx;
};
onMouseClick_fn = function(event) {
  if (event.clientX - __privateGet(this, _dragPosition).x !== 0) {
    event.preventDefault();
  }
};
onMouseUp_fn = function(event) {
  __privateSet(this, _isDragging, false);
  if (event.clientX - __privateGet(this, _dragPosition).x === 0) {
    this.style.removeProperty("scroll-snap-type");
  } else if (!__privateGet(this, _hasPendingProgrammaticScroll)) {
    this.scrollTo({ left: __privateMethod(this, _ScrollCarousel_instances, calculateLeftScroll_fn).call(this, this.selectedCell), behavior: "smooth" });
  }
  this.removeEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
  document.removeEventListener("mouseup", __privateGet(this, _onMouseUpListener));
};
/**
 * -------------------------------------------------------------------------------------------------------------------
 * OTHER
 * -------------------------------------------------------------------------------------------------------------------
 */
onResize_fn = function() {
  if (this.selectedIndex !== __privateMethod(this, _ScrollCarousel_instances, calculateClosestIndexToAlignment_fn).call(this)) {
    this.select(this.selectedIndex, { instant: true });
  }
  if (this.adaptiveHeight) {
    __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(this);
  }
  this.classList.toggle("is-scrollable", this.scrollWidth > this.clientWidth);
};
onMutate_fn = function() {
  __privateSet(this, _forceChangeEvent, true);
};
adaptHeight_fn = function() {
  if (this.clientHeight === this.selectedCell.clientHeight) {
    return;
  }
  this.style.maxHeight = null;
  if (this.isScrollable) {
    this.style.maxHeight = `${this.selectedCell.clientHeight}px`;
  }
};
preloadImages_fn2 = function() {
  requestAnimationFrame(() => {
    const previousSlide = this.cells[Math.max(this.selectedIndex - 1, 0)], nextSlide = this.cells[Math.min(this.selectedIndex + 1, this.cells.length - 1)];
    [previousSlide, this.selectedCell, nextSlide].filter((item) => item !== null).forEach((item) => {
      Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.removeAttribute("loading"));
      Array.from(item.querySelectorAll('video[preload="none"]')).forEach((video) => video.setAttribute("preload", "metadata"));
    });
  });
};
if (!window.customElements.get("scroll-carousel")) {
  window.customElements.define("scroll-carousel", ScrollCarousel);
}

// js/common/cart/fetch-cart.js
var createCartPromise = () => {
  return new Promise(async (resolve) => {
    resolve(await (await fetch(`${Shopify.routes.root}cart.js`)).json());
  });
};
var fetchCart = createCartPromise();
document.addEventListener("cart:change", (event) => {
  fetchCart = event.detail["cart"];
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    fetchCart = createCartPromise();
  }
});
document.addEventListener("cart:refresh", () => {
  fetchCart = createCartPromise();
});

// js/common/cart/cart-count.js
var _abortController2, _CartCount_instances, updateFromServer_fn;
var CartCount = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartCount_instances);
    __privateAdd(this, _abortController2);
  }
  connectedCallback() {
    __privateSet(this, _abortController2, new AbortController());
    document.addEventListener("cart:change", (event) => this.itemCount = event.detail["cart"]["item_count"], { signal: __privateGet(this, _abortController2).signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(this), { signal: __privateGet(this, _abortController2).signal });
    window.addEventListener("pageshow", __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(this), { signal: __privateGet(this, _abortController2).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController2).abort();
  }
  set itemCount(count) {
    this.innerText = count;
  }
};
_abortController2 = new WeakMap();
_CartCount_instances = new WeakSet();
updateFromServer_fn = async function() {
  this.itemCount = (await fetchCart)["item_count"];
};
if (!window.customElements.get("cart-count")) {
  window.customElements.define("cart-count", CartCount);
}

// js/common/cart/cart-dot.js
var _abortController3, _CartDot_instances, updateFromServer_fn2;
var CartDot = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartDot_instances);
    __privateAdd(this, _abortController3);
  }
  connectedCallback() {
    __privateSet(this, _abortController3, new AbortController());
    document.addEventListener("cart:change", (event) => this.classList.toggle("is-visible", event.detail["cart"]["item_count"] > 0), { signal: __privateGet(this, _abortController3).signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _CartDot_instances, updateFromServer_fn2).bind(this), { signal: __privateGet(this, _abortController3).signal });
    window.addEventListener("pageshow", __privateMethod(this, _CartDot_instances, updateFromServer_fn2).bind(this), { signal: __privateGet(this, _abortController3).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController3).abort();
  }
};
_abortController3 = new WeakMap();
_CartDot_instances = new WeakSet();
updateFromServer_fn2 = async function() {
  this.classList.toggle("is-visible", (await fetchCart)["item_count"] > 0);
};
if (!window.customElements.get("cart-dot")) {
  window.customElements.define("cart-dot", CartDot);
}

// js/common/cart/cart-note.js
var _CartNote_instances, onNoteChanged_fn;
var CartNote = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CartNote_instances);
    this.addEventListener("change", __privateMethod(this, _CartNote_instances, onNoteChanged_fn));
  }
};
_CartNote_instances = new WeakSet();
onNoteChanged_fn = function(event) {
  if (event.target.getAttribute("name") !== "note") {
    return;
  }
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: event.target.value }),
    keepalive: true
    // Allows to make sure the request is fired even when submitting the form
  });
};
if (!window.customElements.get("cart-note")) {
  window.customElements.define("cart-note", CartNote);
}

// js/common/cart/free-shipping-bar.js
var _onCartChangedListener, _currencyFormatter, _threshold, _FreeShippingBar_instances, updateMessage_fn, onCartChanged_fn;
var FreeShippingBar = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _FreeShippingBar_instances);
    __privateAdd(this, _onCartChangedListener, __privateMethod(this, _FreeShippingBar_instances, onCartChanged_fn).bind(this));
    __privateAdd(this, _currencyFormatter, new Intl.NumberFormat(Shopify.locale, { style: "currency", currency: Shopify.currency.active }));
    __privateAdd(this, _threshold);
    __privateSet(this, _threshold, parseFloat(this.getAttribute("threshold").replace(/[^0-9.]/g, "")) * 100);
    this.setAttribute("threshold", __privateGet(this, _threshold));
  }
  static get observedAttributes() {
    return ["threshold", "total-price"];
  }
  connectedCallback() {
    document.addEventListener("cart:change", __privateGet(this, _onCartChangedListener));
  }
  disconnectedCallback() {
    document.removeEventListener("cart:change", __privateGet(this, _onCartChangedListener));
  }
  get totalPrice() {
    return parseFloat(this.getAttribute("total-price"));
  }
  set totalPrice(value) {
    this.setAttribute("total-price", value);
  }
  attributeChangedCallback() {
    __privateMethod(this, _FreeShippingBar_instances, updateMessage_fn).call(this);
  }
};
_onCartChangedListener = new WeakMap();
_currencyFormatter = new WeakMap();
_threshold = new WeakMap();
_FreeShippingBar_instances = new WeakSet();
updateMessage_fn = function() {
  const messageElement = this.querySelector("span");
  if (this.totalPrice >= __privateGet(this, _threshold)) {
    messageElement.innerHTML = this.getAttribute("reached-message");
  } else {
    const replacement = `${__privateGet(this, _currencyFormatter).format((__privateGet(this, _threshold) - this.totalPrice) / 100).replace(/\$/g, "$$$$")}`;
    messageElement.innerHTML = this.getAttribute("unreached-message").replace(new RegExp("({{.*}})", "g"), replacement);
  }
};
onCartChanged_fn = function(event) {
  const priceForItems = event.detail["cart"]["items"].filter((item) => item["requires_shipping"]).reduce((sum, item) => sum + item["final_line_price"], 0), cartDiscount = event.detail["cart"]["cart_level_discount_applications"].reduce((sum, discountAllocation) => sum + discountAllocation["total_allocated_amount"], 0);
  this.totalPrice = priceForItems - cartDiscount;
};
if (!window.customElements.get("free-shipping-bar")) {
  window.customElements.define("free-shipping-bar", FreeShippingBar);
}

// js/common/cart/line-item-quantity.js
import { Delegate } from "vendor";
var _delegate, _LineItemQuantity_instances, onQuantityChanged_fn, onChangeLinkClicked_fn, changeLineItemQuantity_fn;
var LineItemQuantity = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _LineItemQuantity_instances);
    __privateAdd(this, _delegate, new Delegate(this));
    __privateGet(this, _delegate).on("change", "[data-line-key]", __privateMethod(this, _LineItemQuantity_instances, onQuantityChanged_fn).bind(this));
    __privateGet(this, _delegate).on("click", '[href*="/cart/change"]', __privateMethod(this, _LineItemQuantity_instances, onChangeLinkClicked_fn).bind(this));
  }
};
_delegate = new WeakMap();
_LineItemQuantity_instances = new WeakSet();
onQuantityChanged_fn = function(event, target) {
  __privateMethod(this, _LineItemQuantity_instances, changeLineItemQuantity_fn).call(this, target.getAttribute("data-line-key"), parseInt(target.value));
};
onChangeLinkClicked_fn = function(event, target) {
  event.preventDefault();
  const url = new URL(target.href);
  __privateMethod(this, _LineItemQuantity_instances, changeLineItemQuantity_fn).call(this, url.searchParams.get("id"), parseInt(url.searchParams.get("quantity")));
};
changeLineItemQuantity_fn = async function(lineKey, targetQuantity) {
  if (window.themeVariables.settings.pageType === "cart") {
    window.location.href = `${Shopify.routes.root}cart/change?id=${lineKey}&quantity=${targetQuantity}`;
  } else {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
    const lineItem = this.closest("line-item");
    lineItem?.dispatchEvent(new CustomEvent("line-item:will-change", { bubbles: true, detail: { targetQuantity } }));
    let sectionsToBundle = [];
    document.documentElement.dispatchEvent(new CustomEvent("cart:prepare-bundled-sections", { bubbles: true, detail: { sections: sectionsToBundle } }));
    const cartContent = await (await fetch(`${Shopify.routes.root}cart/change.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: lineKey,
        quantity: targetQuantity,
        sections: sectionsToBundle.join(",")
      })
    })).json();
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
    const lineItemAfterChange = cartContent["items"].filter((lineItem2) => lineItem2["key"] === lineKey);
    lineItem?.dispatchEvent(new CustomEvent("line-item:change", {
      bubbles: true,
      detail: {
        quantity: lineItemAfterChange.length === 0 ? 0 : lineItemAfterChange[0]["quantity"],
        cart: cartContent
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        baseEvent: "line-item:change",
        cart: cartContent
      }
    }));
  }
};
if (!window.customElements.get("line-item-quantity")) {
  window.customElements.define("line-item-quantity", LineItemQuantity);
}

// js/common/cart/shipping-estimator.js
var _estimateShippingListener, _ShippingEstimator_instances, estimateShipping_fn, getAsyncShippingRates_fn, formatShippingRates_fn, formatError_fn;
var ShippingEstimator = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ShippingEstimator_instances);
    __privateAdd(this, _estimateShippingListener, __privateMethod(this, _ShippingEstimator_instances, estimateShipping_fn).bind(this));
  }
  connectedCallback() {
    this.submitButton = this.querySelector('[type="button"]');
    this.resultsElement = this.querySelector('[aria-live="polite"]');
    this.submitButton.addEventListener("click", __privateGet(this, _estimateShippingListener));
  }
  disconnectedCallback() {
    this.submitButton.removeEventListener("click", __privateGet(this, _estimateShippingListener));
  }
};
_estimateShippingListener = new WeakMap();
_ShippingEstimator_instances = new WeakSet();
estimateShipping_fn = async function(event) {
  event.preventDefault();
  const zip = this.querySelector('[name="address[zip]"]').value, country = this.querySelector('[name="address[country]"]').value, province = this.querySelector('[name="address[province]"]').value;
  this.submitButton.setAttribute("aria-busy", "true");
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  const prepareResponse = await fetch(`${Shopify.routes.root}cart/prepare_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`, { method: "POST" });
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
  if (prepareResponse.ok) {
    const shippingRates = await __privateMethod(this, _ShippingEstimator_instances, getAsyncShippingRates_fn).call(this, zip, country, province);
    __privateMethod(this, _ShippingEstimator_instances, formatShippingRates_fn).call(this, shippingRates);
  } else {
    const jsonError = await prepareResponse.json();
    __privateMethod(this, _ShippingEstimator_instances, formatError_fn).call(this, jsonError);
  }
  this.resultsElement.hidden = false;
  this.submitButton.removeAttribute("aria-busy");
};
getAsyncShippingRates_fn = async function(zip, country, province) {
  const response = await fetch(`${Shopify.routes.root}cart/async_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`);
  const responseAsText = await response.text();
  if (responseAsText === "null") {
    return __privateMethod(this, _ShippingEstimator_instances, getAsyncShippingRates_fn).call(this, zip, country, province);
  } else {
    return JSON.parse(responseAsText)["shipping_rates"];
  }
};
formatShippingRates_fn = function(shippingRates) {
  let formattedShippingRates = shippingRates.map((shippingRate) => {
    return `<li>${shippingRate["presentment_name"]}: ${shippingRate["currency"]} ${shippingRate["price"]}</li>`;
  });
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${shippingRates.length === 0 ? window.themeVariables.strings.shippingEstimatorNoResults : shippingRates.length === 1 ? window.themeVariables.strings.shippingEstimatorOneResult : window.themeVariables.strings.shippingEstimatorMultipleResults}</p>
        ${formattedShippingRates === "" ? "" : `<ul class="list-disc" role="list">${formattedShippingRates}</ul>`}
      </div>
    `;
};
formatError_fn = function(errors) {
  let formattedShippingRates = Object.keys(errors).map((errorKey) => {
    return `<li>${errors[errorKey]}</li>`;
  }).join("");
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${window.themeVariables.strings.shippingEstimatorError}</p>
        <ul class="list-disc" role="list">${formattedShippingRates}</ul>
      </div>
    `;
};
if (!window.customElements.get("shipping-estimator")) {
  window.customElements.define("shipping-estimator", ShippingEstimator);
}

// js/common/facets/facets-form.js
var _isDirty, _FacetsForm_instances, form_get, buildUrl_fn, onFormChanged_fn, onFormSubmitted_fn;
var FacetsForm = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _FacetsForm_instances);
    __privateAdd(this, _isDirty, false);
    this.addEventListener("change", __privateMethod(this, _FacetsForm_instances, onFormChanged_fn));
    this.addEventListener("submit", __privateMethod(this, _FacetsForm_instances, onFormSubmitted_fn));
  }
};
_isDirty = new WeakMap();
_FacetsForm_instances = new WeakSet();
form_get = function() {
  return this.querySelector("form");
};
buildUrl_fn = function() {
  const searchParams = new URLSearchParams(new FormData(__privateGet(this, _FacetsForm_instances, form_get))), url = new URL(__privateGet(this, _FacetsForm_instances, form_get).action);
  url.search = "";
  searchParams.forEach((value, key) => url.searchParams.append(key, value));
  ["page", "filter.v.price.gte", "filter.v.price.lte"].forEach((optionToClear) => {
    if (url.searchParams.get(optionToClear) === "") {
      url.searchParams.delete(optionToClear);
    }
  });
  url.searchParams.set("section_id", this.getAttribute("section-id"));
  return url;
};
onFormChanged_fn = function() {
  __privateSet(this, _isDirty, true);
  if (this.hasAttribute("update-on-change")) {
    if (HTMLFormElement.prototype.requestSubmit) {
      __privateGet(this, _FacetsForm_instances, form_get).requestSubmit();
    } else {
      __privateGet(this, _FacetsForm_instances, form_get).dispatchEvent(new Event("submit", { cancelable: true }));
    }
  } else {
    cachedFetch(__privateMethod(this, _FacetsForm_instances, buildUrl_fn).call(this).toString());
  }
};
onFormSubmitted_fn = function(event) {
  event.preventDefault();
  if (!__privateGet(this, _isDirty)) {
    return;
  }
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url: __privateMethod(this, _FacetsForm_instances, buildUrl_fn).call(this)
    }
  }));
  __privateSet(this, _isDirty, false);
};
if (!window.customElements.get("facets-form")) {
  window.customElements.define("facets-form", FacetsForm);
}

// js/common/overlay/dialog-element.js
import { animate as animate4, FocusTrap, Delegate as Delegate2 } from "vendor";
var lockLayerCount = 0;
var _isLocked, _delegate2, _abortController4, _focusTrap, _originalParentBeforeAppend, _DialogElement_instances, allowOutsideClick_fn, allowOutsideClickTouch_fn, allowOutsideClickMouse_fn, onToggleClicked_fn, updateSlotVisibility_fn;
var DialogElement = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _DialogElement_instances);
    __privateAdd(this, _isLocked, false);
    __privateAdd(this, _delegate2, new Delegate2(document.body));
    __privateAdd(this, _abortController4);
    __privateAdd(this, _focusTrap);
    __privateAdd(this, _originalParentBeforeAppend);
    if (this.shadowDomTemplate) {
      this.attachShadow({ mode: "open" }).appendChild(document.getElementById(this.shadowDomTemplate).content.cloneNode(true));
      this.shadowRoot.addEventListener("slotchange", (event) => __privateMethod(this, _DialogElement_instances, updateSlotVisibility_fn).call(this, event.target));
    }
    this.addEventListener("dialog:force-close", (event) => {
      this.hide();
      event.stopPropagation();
    });
  }
  static get observedAttributes() {
    return ["id", "open"];
  }
  connectedCallback() {
    if (this.id) {
      __privateGet(this, _delegate2).off().on("click", `[aria-controls="${this.id}"]`, __privateMethod(this, _DialogElement_instances, onToggleClicked_fn).bind(this));
    }
    __privateSet(this, _abortController4, new AbortController());
    this.setAttribute("role", "dialog");
    if (this.shadowDomTemplate) {
      this.getShadowPartByName("overlay")?.addEventListener("click", this.hide.bind(this), { signal: this.abortController.signal });
      Array.from(this.shadowRoot.querySelectorAll("slot")).forEach((slot) => __privateMethod(this, _DialogElement_instances, updateSlotVisibility_fn).call(this, slot));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.show(!event.detail.load), { signal: this.abortController.signal });
      this.addEventListener("shopify:block:deselect", this.hide, { signal: this.abortController.signal });
      this._shopifySection = this._shopifySection || this.closest(".shopify-section");
      if (this._shopifySection) {
        if (this.hasAttribute("handle-editor-events")) {
          this._shopifySection.addEventListener("shopify:section:select", (event) => this.show(!event.detail.load), { signal: this.abortController.signal });
          this._shopifySection.addEventListener("shopify:section:deselect", this.hide.bind(this), { signal: this.abortController.signal });
        }
        this._shopifySection.addEventListener("shopify:section:unload", () => this.remove(), { signal: this.abortController.signal });
      }
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate2).off();
    this.abortController.abort();
    this.focusTrap?.deactivate({ onDeactivate: () => {
    } });
    if (__privateGet(this, _isLocked)) {
      __privateSet(this, _isLocked, false);
      document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
    }
  }
  /**
   * Open the dialog element (the animation can be disabled by passing false as an argument). This function should
   * normally not be directly overriden on children classes
   */
  show(animate26 = true) {
    if (this.open) {
      return Promise.resolve();
    }
    this.setAttribute("open", animate26 ? "" : "immediate");
    return waitForEvent(this, "dialog:after-show");
  }
  /**
   * Hide the dialog element. This function should normally not be directly overriden on children classes
   */
  hide() {
    if (!this.open) {
      return Promise.resolve();
    }
    this.removeAttribute("open");
    return waitForEvent(this, "dialog:after-hide");
  }
  /**
   * Get the abort controller used to clean listeners. You can retrieve it in children classes to add your own listeners
   * that will be cleaned when the element is removed or re-rendered
   */
  get abortController() {
    return __privateGet(this, _abortController4);
  }
  /**
   * Get all the elements controlling this dialog (typically, button). An element controls this dialog if it has an
   * aria-controls attribute matching the ID of this dialog element
   */
  get controls() {
    return Array.from(this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`));
  }
  /**
   * Returns if the dialog is open or closed
   */
  get open() {
    return this.hasAttribute("open");
  }
  /**
   * If true is returned, then FocusTrap will activate and manage all the focus management. This is required for good
   * accessibility (such as keyboard management) and should normally not be set to false in children classes unless
   * there is a very good reason to do so
   */
  get shouldTrapFocus() {
    return true;
  }
  /**
   * When the dialog focus is trapped, define if the page is lock (not scrollable). This is usually desirable on
   * full screen modals
   */
  get shouldLock() {
    return false;
  }
  /**
   * By default, when the focus is trapped on an element, a click outside the trapped element close it. Sometimes, it
   * may be desirable to turn off all interactions so that all clicks outside don't do anything
   */
  get clickOutsideDeactivates() {
    return true;
  }
  /**
   * Sometimes (especially for drawer) we need to ensure that an element is on top of everything else. To do that,
   * we need to move the element to the body. We are doing that on open, and then restore the initial position on
   * close
   */
  get shouldAppendToBody() {
    return false;
  }
  /**
   * Decide which element to focus first when the dialog focus is trapped. By default, the first focusable element
   * will be focused, but this can be overridden by passing a selector in the "initial-focus" attribute
   */
  get initialFocus() {
    return this.hasAttribute("initial-focus") ? this.getAttribute("initial-focus") === "false" ? false : this.querySelector(this.getAttribute("initial-focus")) : this.hasAttribute("tabindex") ? this : this.querySelector('input:not([type="hidden"])') || false;
  }
  /**
   * If set to true, then focus trap will not automatically scroll to the first focused element, which can cause
   * annoying experience.
   */
  get preventScrollWhenTrapped() {
    return true;
  }
  /**
   * Get the focus trap element configured with all the other attributes
   */
  get focusTrap() {
    return __privateSet(this, _focusTrap, __privateGet(this, _focusTrap) || new FocusTrap.createFocusTrap(this, {
      onDeactivate: this.hide.bind(this),
      allowOutsideClick: this.clickOutsideDeactivates ? __privateMethod(this, _DialogElement_instances, allowOutsideClick_fn).bind(this) : false,
      initialFocus: matchesMediaQuery("supports-hover") ? this.initialFocus : false,
      fallbackFocus: this,
      tabbableOptions: {
        getShadowRoot: true
      },
      preventScroll: this.preventScrollWhenTrapped
    }));
  }
  /**
   * Get the ShadowDOM template (if any). If there is one defined, the dialog automatically constructs it with the
   * shadow DOM
   */
  get shadowDomTemplate() {
    return this.getAttribute("template");
  }
  /**
   * For dialog that use Shadow DOM, this allows a quick retrieval of parts by name
   */
  getShadowPartByName(name) {
    return this.shadowRoot?.querySelector(`[part="${name}"]`);
  }
  /**
   * Callback called when attributes changes. This is the part that glues everything
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        this.controls.forEach((toggle) => toggle.setAttribute("aria-expanded", newValue === null ? "false" : "true"));
        if (oldValue === null && (newValue === "" || newValue === "immediate")) {
          __privateSet(this, _originalParentBeforeAppend, null);
          this.style.setProperty("display", "block");
          this.dispatchEvent(new CustomEvent("dialog:before-show"));
          if (this.shouldAppendToBody && this.parentElement !== document.body) {
            __privateSet(this, _originalParentBeforeAppend, this.parentElement);
            document.body.append(this);
          }
          const animationControls = this.createEnterAnimationControls();
          if (newValue === "immediate") {
            animationControls.finish();
          }
          animationControls.finished.then(() => {
            this.dispatchEvent(new CustomEvent("dialog:after-show"));
          });
          if (this.shouldTrapFocus) {
            this.focusTrap.activate({
              checkCanFocusTrap: () => animationControls.finished
            });
          }
          if (this.shouldLock) {
            lockLayerCount += 1;
            __privateSet(this, _isLocked, true);
            document.documentElement.classList.add("lock");
          }
        } else if (oldValue !== null && newValue === null) {
          this.dispatchEvent(new CustomEvent("dialog:before-hide"));
          const hideTransitionPromise = this.createLeaveAnimationControls().finished;
          hideTransitionPromise.then(() => {
            this.style.setProperty("display", "none");
            if (this.parentElement === document.body && __privateGet(this, _originalParentBeforeAppend)) {
              __privateGet(this, _originalParentBeforeAppend).appendChild(this);
              __privateSet(this, _originalParentBeforeAppend, null);
            }
            this.dispatchEvent(new CustomEvent("dialog:after-hide"));
          });
          this.focusTrap?.deactivate({
            checkCanReturnFocus: () => hideTransitionPromise
          });
          if (this.shouldLock) {
            __privateSet(this, _isLocked, false);
            document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
          }
        }
        this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
        break;
    }
  }
  /**
   * Create the animation controls for the enter animation
   */
  createEnterAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * Create the animation controls for the leave animation
   */
  createLeaveAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * When "clickOutsideDeactivates" is true, this method is called on the final click destination. If this method
   * returns true, then the dialog closes (if false, the dialog remains in its current state). By default, this
   * will close the dialog if a click is done outside the dialog. However, this may be overridden in children classes
   * to provide custom behavior (for instance, to only allow some elements to close the dialog)
   */
  hideForOutsideClickTarget(target) {
    return !this.contains(target);
  }
  /**
   * When "clickOutsideDeactivates" is set to true, this method allows to control which element, when clicked, allows
   * to pass-through and have its behavior being executed
   */
  allowOutsideClickForTarget(target) {
    return false;
  }
};
_isLocked = new WeakMap();
_delegate2 = new WeakMap();
_abortController4 = new WeakMap();
_focusTrap = new WeakMap();
_originalParentBeforeAppend = new WeakMap();
_DialogElement_instances = new WeakSet();
/**
 * If "clickOutsideDeactivates" is true, then this listener will be called on every click outside the element. This
 * allows function separates touch and non-touch events
 */
allowOutsideClick_fn = function(event) {
  if ("TouchEvent" in window && event instanceof TouchEvent) {
    return __privateMethod(this, _DialogElement_instances, allowOutsideClickTouch_fn).call(this, event);
  } else {
    return __privateMethod(this, _DialogElement_instances, allowOutsideClickMouse_fn).call(this, event);
  }
};
/**
 * If "clickOutsideDeactivates" is true, this listener will be called on every touch click outside the trapped
 * element. By default, this will allow any click outside to cause the dialog to close
 */
allowOutsideClickTouch_fn = function(event) {
  event.target.addEventListener("touchend", (subEvent) => {
    const endTarget = document.elementFromPoint(subEvent.changedTouches.item(0).clientX, subEvent.changedTouches.item(0).clientY);
    if (this.hideForOutsideClickTarget(endTarget)) {
      this.hide();
    }
  }, { once: true, signal: this.abortController.signal });
  return this.allowOutsideClickForTarget(event.target);
};
/**
 * If "clickOutsideDeactivates" is true, this listener will be called on every mouse click outside the trapped
 * element. By default, this will allow any click outside to cause the dialog to close.
 */
allowOutsideClickMouse_fn = function(event) {
  if (event.type !== "click") {
    return false;
  }
  if (this.hideForOutsideClickTarget(event.target)) {
    this.hide();
  }
  if (this.allowOutsideClickForTarget(event.target)) {
    return true;
  }
  let target = event.target, closestControl = event.target.closest("[aria-controls]");
  if (closestControl && closestControl.getAttribute("aria-controls") === this.id) {
    target = closestControl;
  }
  return this.id !== target.getAttribute("aria-controls");
};
/**
 * This function is called whenever a toggle (an element controlling this dialog) is called. This simply open
 * the dialog if closed, or close it if open
 */
onToggleClicked_fn = function(event) {
  event?.preventDefault();
  this.open ? this.hide() : this.show();
};
/**
 * Hide the slots that do not have any children
 */
updateSlotVisibility_fn = function(slot) {
  if (!["header", "footer"].includes(slot.name)) {
    return;
  }
  slot.parentElement.hidden = slot.assignedElements({ flatten: true }).length === 0;
};
var DialogCloseButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("dialog:force-close", { bubbles: true, cancelable: true, composed: true })));
  }
};
if (!window.customElements.get("dialog-element")) {
  window.customElements.define("dialog-element", DialogElement);
}
if (!window.customElements.get("dialog-close-button")) {
  window.customElements.define("dialog-close-button", DialogCloseButton);
}

// js/common/overlay/drawer.js
import { timeline as timeline3 } from "vendor";

// js/common/overlay/modal.js
import { animate as animate5, timeline as timeline2 } from "vendor";
var Modal = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-modal", "true");
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "modal-default-template";
  }
  get shouldLock() {
    return true;
  }
  get shouldAppendToBody() {
    return true;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [0, 1] }, { duration: 0.2 });
    } else {
      return timeline2([
        [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [1, 0] }, { duration: 0.2 });
    } else {
      return timeline2([
        [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
};
if (!window.customElements.get("x-modal")) {
  window.customElements.define("x-modal", Modal);
}

// js/common/overlay/drawer.js
var Drawer = class extends Modal {
  get shadowDomTemplate() {
    return this.getAttribute("template") || "drawer-default-template";
  }
  get openFrom() {
    return this.getAttribute("open-from") || "right";
  }
  createEnterAnimationControls() {
    this.getShadowPartByName("content").style.marginInlineStart = this.openFrom === "right" ? "auto" : 0;
    return timeline3([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { transform: [`translateX(calc(var(--transform-logical-flip) * ${this.openFrom === "right" ? "100%" : "-100%"}))`, "translateX(0)"] }, { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    return timeline3([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { transform: ["translateX(0)", `translateX(calc(var(--transform-logical-flip) * ${this.openFrom === "right" ? "100%" : "-100%"}))`] }, { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
};
if (!window.customElements.get("x-drawer")) {
  window.customElements.define("x-drawer", Drawer);
}

// js/common/overlay/popin.js
import { animate as animate6 } from "vendor";
var PopIn = class extends DialogElement {
  get shouldTrapFocus() {
    return false;
  }
  createEnterAnimationControls() {
    return animate6(this, { opacity: [0, 1], transform: ["translateY(25px)", "translateY(0)"] }, { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] });
  }
  createLeaveAnimationControls() {
    return animate6(this, { opacity: [1, 0], transform: ["translateY(0)", "translateY(25px)"] }, { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] });
  }
};
if (!window.customElements.get("pop-in")) {
  window.customElements.define("pop-in", PopIn);
}

// js/common/overlay/popover.js
import { animate as animate7, timeline as timeline4 } from "vendor";
var Popover = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.controls.forEach((control) => control.setAttribute("aria-haspopup", "dialog"));
    if (this.hasAttribute("close-on-listbox-select")) {
      this.addEventListener("listbox:select", this.hide, { signal: this.abortController.signal });
    }
    if (this.hasAttribute("close-on-listbox-change")) {
      this.addEventListener("change", this.hide, { signal: this.abortController.signal });
    }
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "popover-default-template";
  }
  get shouldLock() {
    return matchesMediaQuery("md-max");
  }
  get shouldAppendToBody() {
    return matchesMediaQuery("md-max");
  }
  get preventScrollWhenTrapped() {
    return true;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("md")) {
      return animate7(this, { opacity: [0, 1] }, { duration: 0.2 });
    } else {
      return timeline4([
        [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md")) {
      return animate7(this, { opacity: [1, 0] }, { duration: 0.2 });
    } else {
      return timeline4([
        [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] }],
        [this.getShadowPartByName("content"), { transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" }]
      ]);
    }
  }
};
if (!window.customElements.get("x-popover")) {
  window.customElements.define("x-popover", Popover);
}

// js/common/facets/facets-drawer.js
var _FacetsDrawer_instances, updateFacets_fn;
var FacetsDrawer = class extends Drawer {
  constructor() {
    super();
    __privateAdd(this, _FacetsDrawer_instances);
    this.addEventListener("dialog:after-hide", __privateMethod(this, _FacetsDrawer_instances, updateFacets_fn));
  }
};
_FacetsDrawer_instances = new WeakSet();
updateFacets_fn = function() {
  const form = this.querySelector("facets-form form");
  if (HTMLFormElement.prototype.requestSubmit) {
    form?.requestSubmit();
  } else {
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  }
};
if (!window.customElements.get("facets-drawer")) {
  window.customElements.define("facets-drawer", FacetsDrawer);
}

// js/common/facets/facet-link.js
var _FacetLink_instances, onFacetUpdate_fn;
var FacetLink = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _FacetLink_instances);
    this.addEventListener("click", __privateMethod(this, _FacetLink_instances, onFacetUpdate_fn).bind(this));
  }
};
_FacetLink_instances = new WeakSet();
onFacetUpdate_fn = function(event) {
  event.preventDefault();
  const sectionId = extractSectionId(event.target), url = new URL(this.firstElementChild.href);
  url.searchParams.set("section_id", sectionId);
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url
    }
  }));
};
if (!window.customElements.get("facet-link")) {
  window.customElements.define("facet-link", FacetLink);
}

// js/common/facets/facets-sort-popover.js
var _FacetsSortPopover_instances, onSortChange_fn;
var FacetsSortPopover = class extends Popover {
  constructor() {
    super();
    __privateAdd(this, _FacetsSortPopover_instances);
    this.addEventListener("listbox:change", __privateMethod(this, _FacetsSortPopover_instances, onSortChange_fn));
  }
};
_FacetsSortPopover_instances = new WeakSet();
onSortChange_fn = function(event) {
  const url = new URL(window.location.href);
  url.searchParams.set("sort_by", event.detail.value);
  url.searchParams.delete("page");
  url.searchParams.set("section_id", this.getAttribute("section-id"));
  this.dispatchEvent(new CustomEvent("facet:update", {
    bubbles: true,
    detail: {
      url
    }
  }));
};
if (!window.customElements.get("facets-sort-popover")) {
  window.customElements.define("facets-sort-popover", FacetsSortPopover);
}

// js/common/facets/facets-listeners.js
import { Delegate as Delegate3 } from "vendor";
var abortController = null;
var delegate = new Delegate3(document.body);
var openDetailsValues = new Set(Array.from(document.querySelectorAll('facets-form details[open] input[name*="filter."]'), (item) => item.name));
delegate.on("toggle", "facets-form details", (event, detailsElement) => {
  const inputNames = [...new Set(Array.from(detailsElement.querySelectorAll('input[name*="filter."]'), (item) => item.name))];
  inputNames.forEach((inputName) => {
    detailsElement.open ? openDetailsValues.add(inputName) : openDetailsValues.delete(inputName);
  });
}, true);
document.addEventListener("facet:update", async (event) => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const url = event.detail.url, shopifySection = document.getElementById(`shopify-section-${url.searchParams.get("section_id")}`);
  const clonedUrl = new URL(url);
  clonedUrl.searchParams.delete("section_id");
  history.replaceState({}, "", clonedUrl.toString());
  try {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
    const tempContent = new DOMParser().parseFromString(await (await cachedFetch(url.toString(), { signal: abortController.signal })).text(), "text/html");
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
    const newShopifySection = tempContent.querySelector(".shopify-section");
    newShopifySection.querySelectorAll("facets-form details").forEach((detailsElement) => {
      const inputNames = [...new Set(Array.from(detailsElement.querySelectorAll('input[name*="filter."]'), (item) => item.name))];
      inputNames.forEach((inputName) => {
        detailsElement.open = openDetailsValues.has(inputName);
      });
    });
    const focusedElement = document.activeElement;
    shopifySection.replaceChildren(...document.importNode(tempContent.querySelector(".shopify-section"), true).childNodes);
    if (focusedElement?.id && document.getElementById(focusedElement.id)) {
      document.getElementById(focusedElement.id).focus();
    }
    const scrollToProductList = () => shopifySection.querySelector(".collection").scrollIntoView({ block: "start", behavior: "smooth" });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(scrollToProductList, { timeout: 500 });
    } else {
      requestAnimationFrame(scrollToProductList);
    }
  } catch (e) {
  }
});

// js/common/feedback/progress-bar.js
import { inView as inView5 } from "vendor";
var _allowUpdatingProgress, _ProgressBar_instances, calculateProgressBar_fn;
var ProgressBar = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProgressBar_instances);
    __privateAdd(this, _allowUpdatingProgress, !this.hasAttribute("animate-on-scroll"));
  }
  static get observedAttributes() {
    return ["aria-valuenow", "aria-valuemax"];
  }
  connectedCallback() {
    if (this.hasAttribute("animate-on-scroll")) {
      inView5(this, () => {
        __privateSet(this, _allowUpdatingProgress, true);
        __privateMethod(this, _ProgressBar_instances, calculateProgressBar_fn).call(this);
      });
    }
  }
  get progress() {
    return Math.min(1, this.getAttribute("aria-valuenow") / this.getAttribute("aria-valuemax"));
  }
  set valueMax(value) {
    this.setAttribute("aria-valuemax", value);
  }
  set valueNow(value) {
    this.setAttribute("aria-valuenow", value);
  }
  attributeChangedCallback() {
    if (__privateGet(this, _allowUpdatingProgress)) {
      __privateMethod(this, _ProgressBar_instances, calculateProgressBar_fn).call(this);
    }
  }
};
_allowUpdatingProgress = new WeakMap();
_ProgressBar_instances = new WeakSet();
calculateProgressBar_fn = function() {
  this.style.setProperty("--progress", `${this.progress}`);
};
if (!window.customElements.get("progress-bar")) {
  window.customElements.define("progress-bar", ProgressBar);
}

// js/common/form/price-range.js
var PriceRange = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    this.#abortController = new AbortController();
    const rangeLowerBound = this.querySelector('input[type="range"]:first-child'), rangeHigherBound = this.querySelector('input[type="range"]:last-child'), textInputLowerBound = this.querySelector('input[name="filter.v.price.gte"]'), textInputHigherBound = this.querySelector('input[name="filter.v.price.lte"]');
    textInputLowerBound.addEventListener("focus", () => textInputLowerBound.select(), { signal: this.#abortController.signal });
    textInputHigherBound.addEventListener("focus", () => textInputHigherBound.select(), { signal: this.#abortController.signal });
    textInputLowerBound.addEventListener("change", (event) => {
      event.preventDefault();
      event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(textInputHigherBound.value || event.target.max) - 1), event.target.min);
      rangeLowerBound.value = event.target.value;
      rangeLowerBound.parentElement.style.setProperty("--range-min", `${parseInt(rangeLowerBound.value) / parseInt(rangeLowerBound.max) * 100}%`);
    }, { signal: this.#abortController.signal });
    textInputHigherBound.addEventListener("change", (event) => {
      event.preventDefault();
      event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(textInputLowerBound.value || event.target.min) + 1), event.target.max);
      rangeHigherBound.value = event.target.value;
      rangeHigherBound.parentElement.style.setProperty("--range-max", `${parseInt(rangeHigherBound.value) / parseInt(rangeHigherBound.max) * 100}%`);
    }, { signal: this.#abortController.signal });
    rangeLowerBound.addEventListener("change", (event) => {
      event.stopPropagation();
      textInputLowerBound.value = event.target.value;
      textInputLowerBound.dispatchEvent(new Event("change", { bubbles: true }));
    }, { signal: this.#abortController.signal });
    rangeHigherBound.addEventListener("change", (event) => {
      event.stopPropagation();
      textInputHigherBound.value = event.target.value;
      textInputHigherBound.dispatchEvent(new Event("change", { bubbles: true }));
    }, { signal: this.#abortController.signal });
    rangeLowerBound.addEventListener("input", (event) => {
      event.target.value = Math.min(parseInt(event.target.value), parseInt(textInputHigherBound.value || event.target.max) - 1);
      event.target.parentElement.style.setProperty("--range-min", `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      textInputLowerBound.value = event.target.value;
    }, { signal: this.#abortController.signal });
    rangeHigherBound.addEventListener("input", (event) => {
      event.target.value = Math.max(parseInt(event.target.value), parseInt(textInputLowerBound.value || event.target.min) + 1);
      event.target.parentElement.style.setProperty("--range-max", `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
      textInputHigherBound.value = event.target.value;
    }, { signal: this.#abortController.signal });
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
};
if (!window.customElements.get("price-range")) {
  window.customElements.define("price-range", PriceRange);
}

// js/common/form/quantity-selector.js
var _abortController5, _decreaseButton, _increaseButton, _inputElement, _QuantitySelector_instances, onDecreaseQuantity_fn, onIncreaseQuantity_fn, updateUI_fn;
var QuantitySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _QuantitySelector_instances);
    __privateAdd(this, _abortController5);
    __privateAdd(this, _decreaseButton);
    __privateAdd(this, _increaseButton);
    __privateAdd(this, _inputElement);
  }
  connectedCallback() {
    __privateSet(this, _abortController5, new AbortController());
    __privateSet(this, _decreaseButton, this.querySelector("button:first-of-type"));
    __privateSet(this, _increaseButton, this.querySelector("button:last-of-type"));
    __privateSet(this, _inputElement, this.querySelector("input"));
    __privateGet(this, _decreaseButton)?.addEventListener("click", __privateMethod(this, _QuantitySelector_instances, onDecreaseQuantity_fn).bind(this), { signal: __privateGet(this, _abortController5).signal });
    __privateGet(this, _increaseButton)?.addEventListener("click", __privateMethod(this, _QuantitySelector_instances, onIncreaseQuantity_fn).bind(this), { signal: __privateGet(this, _abortController5).signal });
    __privateGet(this, _inputElement)?.addEventListener("input", () => __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this), { signal: __privateGet(this, _abortController5).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController5).abort();
  }
  get quantity() {
    return __privateGet(this, _inputElement).value;
  }
  set quantity(quantity) {
    __privateGet(this, _inputElement).value = quantity;
    __privateGet(this, _inputElement).dispatchEvent(new Event("change"));
    __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
  }
};
_abortController5 = new WeakMap();
_decreaseButton = new WeakMap();
_increaseButton = new WeakMap();
_inputElement = new WeakMap();
_QuantitySelector_instances = new WeakSet();
onDecreaseQuantity_fn = function() {
  __privateGet(this, _inputElement).stepDown();
  __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
};
onIncreaseQuantity_fn = function() {
  __privateGet(this, _inputElement).stepUp();
  __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(this);
};
updateUI_fn = function() {
  __privateGet(this, _decreaseButton).disabled = parseInt(__privateGet(this, _inputElement).value) <= parseInt(__privateGet(this, _inputElement).min);
  __privateGet(this, _increaseButton).disabled = __privateGet(this, _inputElement).hasAttribute("max") ? parseInt(__privateGet(this, _inputElement).value) >= parseInt(__privateGet(this, _inputElement).max) : false;
};
var _QuantityInput_instances, inputElement_get, onValueInput_fn, onValueChange_fn;
var QuantityInput = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _QuantityInput_instances);
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("input", __privateMethod(this, _QuantityInput_instances, onValueInput_fn).bind(this));
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("change", __privateMethod(this, _QuantityInput_instances, onValueChange_fn).bind(this));
    __privateGet(this, _QuantityInput_instances, inputElement_get).addEventListener("focus", () => __privateGet(this, _QuantityInput_instances, inputElement_get).select());
  }
  connectedCallback() {
    this.style.setProperty("--quantity-selector-character-count", `${__privateGet(this, _QuantityInput_instances, inputElement_get).value.length}ch`);
  }
  get quantity() {
    return parseInt(__privateGet(this, _QuantityInput_instances, inputElement_get).value);
  }
};
_QuantityInput_instances = new WeakSet();
inputElement_get = function() {
  return this.firstElementChild;
};
onValueInput_fn = function() {
  if (__privateGet(this, _QuantityInput_instances, inputElement_get).value === "") {
    __privateGet(this, _QuantityInput_instances, inputElement_get).value = __privateGet(this, _QuantityInput_instances, inputElement_get).min || 1;
  }
  this.style.setProperty("--quantity-selector-character-count", `${__privateGet(this, _QuantityInput_instances, inputElement_get).value.length}ch`);
};
onValueChange_fn = function() {
  if (!__privateGet(this, _QuantityInput_instances, inputElement_get).checkValidity()) {
    __privateGet(this, _QuantityInput_instances, inputElement_get).stepDown();
  }
};
if (!window.customElements.get("quantity-selector")) {
  window.customElements.define("quantity-selector", QuantitySelector);
}
if (!window.customElements.get("quantity-input")) {
  window.customElements.define("quantity-input", QuantityInput);
}

// js/common/list/listbox.js
var _accessibilityInitialized, _hiddenInput, _Listbox_instances, setupAccessibility_fn, onOptionClicked_fn, onInputChanged_fn, onKeyDown_fn;
var Listbox = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _Listbox_instances);
    __privateAdd(this, _accessibilityInitialized, false);
    __privateAdd(this, _hiddenInput);
    this.addEventListener("keydown", __privateMethod(this, _Listbox_instances, onKeyDown_fn));
  }
  static get observedAttributes() {
    return ["aria-activedescendant"];
  }
  connectedCallback() {
    __privateSet(this, _hiddenInput, this.querySelector('input[type="hidden"]'));
    __privateGet(this, _hiddenInput)?.addEventListener("change", __privateMethod(this, _Listbox_instances, onInputChanged_fn).bind(this));
    if (!__privateGet(this, _accessibilityInitialized)) {
      requestAnimationFrame(__privateMethod(this, _Listbox_instances, setupAccessibility_fn).bind(this));
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "aria-activedescendant" && oldValue !== null && newValue !== oldValue) {
      Array.from(this.querySelectorAll('[role="option"]')).forEach((option) => {
        if (option.id === newValue) {
          option.setAttribute("aria-selected", "true");
          if (__privateGet(this, _hiddenInput) && __privateGet(this, _hiddenInput).value !== option.value) {
            __privateGet(this, _hiddenInput).value = option.value;
            __privateGet(this, _hiddenInput).dispatchEvent(new Event("change", { bubbles: true }));
          }
          if (this.hasAttribute("aria-owns")) {
            this.getAttribute("aria-owns").split(" ").forEach((boundId) => {
              document.getElementById(boundId).textContent = option.getAttribute("title") || option.innerText || option.value;
            });
          }
          option.dispatchEvent(new CustomEvent("listbox:change", {
            bubbles: true,
            detail: {
              value: option.value
            }
          }));
        } else {
          option.setAttribute("aria-selected", "false");
        }
      });
    }
  }
};
_accessibilityInitialized = new WeakMap();
_hiddenInput = new WeakMap();
_Listbox_instances = new WeakSet();
setupAccessibility_fn = function() {
  this.setAttribute("role", "listbox");
  Array.from(this.querySelectorAll('[role="option"]')).forEach((option) => {
    option.addEventListener("click", __privateMethod(this, _Listbox_instances, onOptionClicked_fn).bind(this));
    option.id = "option-" + (crypto.randomUUID ? crypto.randomUUID() : Math.floor(Math.random() * 1e4));
    if (option.getAttribute("aria-selected") === "true") {
      this.setAttribute("aria-activedescendant", option.id);
    }
  });
  __privateSet(this, _accessibilityInitialized, true);
};
onOptionClicked_fn = function(event) {
  if (event.currentTarget.getAttribute("type") === "submit") {
    return;
  }
  this.setAttribute("aria-activedescendant", event.currentTarget.id);
  event.currentTarget.dispatchEvent(new CustomEvent("listbox:select", {
    bubbles: true,
    detail: {
      value: event.currentTarget.value
    }
  }));
};
onInputChanged_fn = function(event) {
  this.setAttribute("aria-activedescendant", this.querySelector(`[role="option"][value="${CSS.escape(event.target.value)}"]`).id);
};
onKeyDown_fn = function(event) {
  if (event.key === "ArrowUp") {
    event.target.previousElementSibling?.focus();
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    event.target.nextElementSibling?.focus();
    event.preventDefault();
  }
};
if (!window.customElements.get("x-listbox")) {
  window.customElements.define("x-listbox", Listbox);
}

// js/common/media/image-parallax.js
import { scroll, animate as animate8 } from "vendor";
var _ImageParallax_instances, setupParallax_fn;
var ImageParallax = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ImageParallax_instances);
  }
  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      __privateMethod(this, _ImageParallax_instances, setupParallax_fn).call(this);
    }
  }
};
_ImageParallax_instances = new WeakSet();
setupParallax_fn = function() {
  const [scale, translate] = [1.3, 0.15 * 100 / 1.3], isFirstSection = this.closest(".shopify-section").matches(":first-child");
  scroll(
    animate8(this.querySelector("img"), { transform: [`scale(${scale}) translateY(-${translate}%)`, `scale(${scale}) translateY(${translate}%)`] }, { easing: "linear" }),
    {
      target: this.querySelector("img"),
      offset: [isFirstSection ? "start start" : "start end", "end start"]
    }
  );
};
if (!window.customElements.get("image-parallax")) {
  window.customElements.define("image-parallax", ImageParallax);
}

// js/common/product/gift-card-recipient.js
var _recipientCheckbox, _recipientOtherProperties, _recipientSendOnProperty, _offsetProperty, _recipientFieldsContainer, _GiftCardRecipient_instances, synchronizeProperties_fn, formatDate_fn;
var GiftCardRecipient = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GiftCardRecipient_instances);
    __privateAdd(this, _recipientCheckbox);
    __privateAdd(this, _recipientOtherProperties, []);
    __privateAdd(this, _recipientSendOnProperty);
    __privateAdd(this, _offsetProperty);
    __privateAdd(this, _recipientFieldsContainer);
  }
  connectedCallback() {
    const properties = Array.from(this.querySelectorAll('[name*="properties"]')), checkboxPropertyName = "properties[__shopify_send_gift_card_to_recipient]";
    __privateSet(this, _recipientCheckbox, properties.find((input) => input.name === checkboxPropertyName));
    __privateSet(this, _recipientOtherProperties, properties.filter((input) => input.name !== checkboxPropertyName));
    __privateSet(this, _recipientFieldsContainer, this.querySelector(".gift-card-recipient__fields"));
    __privateSet(this, _offsetProperty, this.querySelector('[name="properties[__shopify_offset]"]'));
    if (__privateGet(this, _offsetProperty)) {
      __privateGet(this, _offsetProperty).value = (/* @__PURE__ */ new Date()).getTimezoneOffset().toString();
    }
    __privateSet(this, _recipientSendOnProperty, this.querySelector('[name="properties[Send on]"]'));
    const minDate = /* @__PURE__ */ new Date();
    const maxDate = /* @__PURE__ */ new Date();
    maxDate.setDate(minDate.getDate() + 90);
    __privateGet(this, _recipientSendOnProperty)?.setAttribute("min", __privateMethod(this, _GiftCardRecipient_instances, formatDate_fn).call(this, minDate));
    __privateGet(this, _recipientSendOnProperty)?.setAttribute("max", __privateMethod(this, _GiftCardRecipient_instances, formatDate_fn).call(this, maxDate));
    __privateGet(this, _recipientCheckbox)?.addEventListener("change", __privateMethod(this, _GiftCardRecipient_instances, synchronizeProperties_fn).bind(this));
    __privateMethod(this, _GiftCardRecipient_instances, synchronizeProperties_fn).call(this);
  }
};
_recipientCheckbox = new WeakMap();
_recipientOtherProperties = new WeakMap();
_recipientSendOnProperty = new WeakMap();
_offsetProperty = new WeakMap();
_recipientFieldsContainer = new WeakMap();
_GiftCardRecipient_instances = new WeakSet();
synchronizeProperties_fn = function() {
  __privateGet(this, _recipientOtherProperties).forEach((property) => property.disabled = !__privateGet(this, _recipientCheckbox).checked);
  __privateGet(this, _recipientFieldsContainer).toggleAttribute("hidden", !__privateGet(this, _recipientCheckbox).checked);
};
formatDate_fn = function(date) {
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - offset * 60 * 1e3);
  return offsetDate.toISOString().split("T")[0];
};
if (!window.customElements.get("gift-card-recipient")) {
  window.customElements.define("gift-card-recipient", GiftCardRecipient);
}

// js/common/product/product-card.js
import { Delegate as Delegate4 } from "vendor";
var _delegate3, _ProductCard_instances, onSwatchHovered_fn, onSwatchChanged_fn, createMediaImg_fn;
var ProductCard = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductCard_instances);
    __privateAdd(this, _delegate3, new Delegate4(this));
  }
  connectedCallback() {
    __privateGet(this, _delegate3).on("change", '.product-card__info [type="radio"]', __privateMethod(this, _ProductCard_instances, onSwatchChanged_fn).bind(this));
    __privateGet(this, _delegate3).on("pointerover", '.product-card__info [type="radio"] + label', __privateMethod(this, _ProductCard_instances, onSwatchHovered_fn).bind(this), true);
  }
  disconnectedCallback() {
    __privateGet(this, _delegate3).off();
  }
};
_delegate3 = new WeakMap();
_ProductCard_instances = new WeakSet();
onSwatchHovered_fn = async function(event, target) {
  const control = target.control;
  const primaryMediaElement = this.querySelector(".product-card__image--primary");
  if (control.hasAttribute("data-variant-media")) {
    __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, JSON.parse(control.getAttribute("data-variant-media")), primaryMediaElement.className, primaryMediaElement.sizes);
  }
};
onSwatchChanged_fn = async function(event, target) {
  if (target.hasAttribute("data-product-url")) {
    this.querySelectorAll(`a[href^="${Shopify.routes.root}products/"`).forEach((link) => {
      link.href = target.getAttribute("data-product-url");
    });
  } else if (target.hasAttribute("data-variant-id")) {
    this.querySelectorAll(`a[href^="${Shopify.routes.root}products/"`).forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set("variant", target.getAttribute("data-variant-id"));
      link.href = `${url.pathname}${url.search}${url.hash}`;
    });
  }
  if (!target.hasAttribute("data-variant-media")) {
    return;
  }
  let newMedia = JSON.parse(target.getAttribute("data-variant-media")), primaryMediaElement = this.querySelector(".product-card__image--primary"), secondaryMediaElement = this.querySelector(".product-card__image--secondary"), newPrimaryMediaElement = __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, newMedia, primaryMediaElement.className, primaryMediaElement.sizes), newSecondaryMediaElement = null;
  if (secondaryMediaElement && target.hasAttribute("data-variant-secondary-media")) {
    let newSecondaryMedia = JSON.parse(target.getAttribute("data-variant-secondary-media"));
    newSecondaryMediaElement = __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(this, newSecondaryMedia, secondaryMediaElement.className, secondaryMediaElement.sizes);
  }
  if (primaryMediaElement.src !== newPrimaryMediaElement.src) {
    if (secondaryMediaElement && newSecondaryMediaElement) {
      secondaryMediaElement.replaceWith(newSecondaryMediaElement);
    }
    await primaryMediaElement.animate({ opacity: [1, 0] }, { duration: 150, easing: "ease-in", fill: "forwards" }).finished;
    await new Promise((resolve) => newPrimaryMediaElement.complete ? resolve() : newPrimaryMediaElement.onload = () => resolve());
    primaryMediaElement.replaceWith(newPrimaryMediaElement);
    newPrimaryMediaElement.animate({ opacity: [0, 1] }, { duration: 150, easing: "ease-in" });
  }
};
createMediaImg_fn = function(media, className, sizes) {
  return createMediaImg(media, [200, 300, 400, 500, 600, 700, 800, 1e3, 1200, 1400, 1600, 1800], { class: className, sizes });
};
if (!window.customElements.get("product-card")) {
  window.customElements.define("product-card", ProductCard);
}

// js/common/product/product-form.js
var _ProductForm_instances, form_get2, onSubmit_fn;
var ProductForm = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ProductForm_instances);
    this.addEventListener("submit", __privateMethod(this, _ProductForm_instances, onSubmit_fn));
  }
  connectedCallback() {
    __privateGet(this, _ProductForm_instances, form_get2).id.disabled = false;
  }
};
_ProductForm_instances = new WeakSet();
form_get2 = function() {
  return this.querySelector("form");
};
onSubmit_fn = async function(event) {
  event.preventDefault();
  if (event.submitter?.getAttribute("aria-busy") === "true") {
    return;
  }
  if (!__privateGet(this, _ProductForm_instances, form_get2).checkValidity()) {
    __privateGet(this, _ProductForm_instances, form_get2).reportValidity();
    return;
  }
  const submitButtons = Array.from(__privateGet(this, _ProductForm_instances, form_get2).elements).filter((button) => button.type === "submit");
  submitButtons.forEach((submitButton) => {
    submitButton.setAttribute("aria-busy", "true");
  });
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  let sectionsToBundle = [];
  document.documentElement.dispatchEvent(new CustomEvent("cart:prepare-bundled-sections", { bubbles: true, detail: { sections: sectionsToBundle } }));
  const formData = new FormData(__privateGet(this, _ProductForm_instances, form_get2));
  formData.set("sections", sectionsToBundle.join(","));
  formData.set("sections_url", `${Shopify.routes.root}variants/${__privateGet(this, _ProductForm_instances, form_get2).id.value}`);
  const response = await fetch(`${Shopify.routes.root}cart/add.js`, {
    body: formData,
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
      // Needed for Shopify to check inventory
    }
  });
  submitButtons.forEach((submitButton) => {
    submitButton.removeAttribute("aria-busy");
  });
  const responseJson = await response.json();
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
  if (response.ok) {
    if (window.themeVariables.settings.cartType === "page" || window.themeVariables.settings.pageType === "cart") {
      return window.location.href = `${Shopify.routes.root}cart`;
    }
    const cartContent = await (await fetch(`${Shopify.routes.root}cart.js`)).json();
    cartContent["sections"] = responseJson["sections"];
    __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(new CustomEvent("variant:add", {
      bubbles: true,
      detail: {
        items: responseJson.hasOwnProperty("items") ? responseJson["items"] : [responseJson],
        cart: cartContent,
        onSuccessDo: formData.get("on_success")
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        baseEvent: "variant:add",
        onSuccessDo: formData.get("on_success"),
        cart: cartContent
      }
    }));
  } else {
    __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(new CustomEvent("cart:error", {
      bubbles: true,
      detail: {
        error: responseJson["description"]
      }
    }));
    document.dispatchEvent(new CustomEvent("cart:refresh"));
  }
};
if (!window.customElements.get("product-form")) {
  window.customElements.define("product-form", ProductForm);
}

// js/common/product/product-form-listeners.js
var _abortController6, _BuyButtons_instances, onVariantAdded_fn, onCartError_fn;
var BuyButtons = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _BuyButtons_instances);
    __privateAdd(this, _abortController6);
  }
  connectedCallback() {
    __privateSet(this, _abortController6, new AbortController());
    document.forms[this.getAttribute("form")]?.addEventListener("cart:error", __privateMethod(this, _BuyButtons_instances, onCartError_fn).bind(this), { signal: __privateGet(this, _abortController6).signal });
    if (window.themeVariables.settings.cartType === "message") {
      document.forms[this.getAttribute("form")]?.addEventListener("variant:add", __privateMethod(this, _BuyButtons_instances, onVariantAdded_fn).bind(this), { signal: __privateGet(this, _abortController6).signal });
    }
  }
  disconnectedCallback() {
    __privateGet(this, _abortController6).abort();
  }
};
_abortController6 = new WeakMap();
_BuyButtons_instances = new WeakSet();
onVariantAdded_fn = function(event) {
  const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--success" role="alert">
        ${window.themeVariables.strings.addedToCart}
      </div>
    `).firstElementChild;
  this.prepend(bannerElement);
  setTimeout(() => {
    bannerElement.remove();
  }, 2500);
};
onCartError_fn = function(event) {
  const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--error" role="alert">
        ${event.detail.error}
      </div>
    `).firstElementChild;
  this.prepend(bannerElement);
  setTimeout(() => {
    bannerElement.remove();
  }, 2500);
};
if (!window.customElements.get("buy-buttons")) {
  window.customElements.define("buy-buttons", BuyButtons);
}

// js/common/product/product-gallery.js
import { PhotoSwipeLightbox } from "vendor";
var _abortController7, _photoSwipeInstance, _onGestureChangedListener, _settledMedia, _ProductGallery_instances, registerLightboxUi_fn, onSectionRerender_fn, onVariantChange_fn, onMediaChange_fn, onMediaSettle_fn, onCarouselClick_fn, onGestureStart_fn, onGestureChanged_fn;
var ProductGallery = class extends HTMLElement {
  /* Keep track of the currently settled media */
  constructor() {
    super();
    __privateAdd(this, _ProductGallery_instances);
    __privateAdd(this, _abortController7);
    __privateAdd(this, _photoSwipeInstance);
    __privateAdd(this, _onGestureChangedListener, __privateMethod(this, _ProductGallery_instances, onGestureChanged_fn).bind(this));
    __privateAdd(this, _settledMedia);
    this.addEventListener("lightbox:open", (event) => this.openLightBox(event?.detail?.index));
  }
  connectedCallback() {
    __privateSet(this, _abortController7, new AbortController());
    if (!this.carousel) {
      return;
    }
    const form = document.forms[this.getAttribute("form")];
    form.addEventListener("product:rerender", __privateMethod(this, _ProductGallery_instances, onSectionRerender_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    form.addEventListener("variant:change", __privateMethod(this, _ProductGallery_instances, onVariantChange_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    this.carousel.addEventListener("carousel:change", __privateMethod(this, _ProductGallery_instances, onMediaChange_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    this.carousel.addEventListener("carousel:settle", __privateMethod(this, _ProductGallery_instances, onMediaSettle_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    this.carousel.addEventListener("click", __privateMethod(this, _ProductGallery_instances, onCarouselClick_fn).bind(this), { signal: __privateGet(this, _abortController7).signal });
    if (this.hasAttribute("allow-zoom")) {
      this.carousel.addEventListener("gesturestart", __privateMethod(this, _ProductGallery_instances, onGestureStart_fn).bind(this), { capture: false, signal: __privateGet(this, _abortController7).signal });
    }
    __privateMethod(this, _ProductGallery_instances, onMediaChange_fn).call(this);
  }
  disconnectedCallback() {
    __privateGet(this, _abortController7).abort();
  }
  get viewInSpaceButton() {
    return this.querySelector("[data-shopify-xr]");
  }
  get carousel() {
    return this.querySelector(".product-gallery__carousel");
  }
  /**
   * Create the PhotoSwipe instance if it does not already exist. This is done on demand, so until the lightbox is
   * open, nothing is created to not impact performance
   */
  get lightBox() {
    if (__privateGet(this, _photoSwipeInstance)) {
      return __privateGet(this, _photoSwipeInstance);
    }
    __privateSet(this, _photoSwipeInstance, new PhotoSwipeLightbox({
      pswpModule: () => import("photoswipe"),
      bgOpacity: 1,
      maxZoomLevel: parseInt(this.getAttribute("allow-zoom")) || 3,
      closeTitle: window.themeVariables.strings.closeGallery,
      zoomTitle: window.themeVariables.strings.zoomGallery,
      errorMsg: window.themeVariables.strings.errorGallery,
      // UX
      arrowPrev: false,
      arrowNext: false,
      counter: false,
      close: false,
      zoom: false
    }));
    __privateGet(this, _photoSwipeInstance).on("uiRegister", __privateMethod(this, _ProductGallery_instances, registerLightboxUi_fn).bind(this));
    __privateGet(this, _photoSwipeInstance).addFilter("thumbEl", (thumbEl, data) => data.thumbnailElement);
    __privateGet(this, _photoSwipeInstance).init();
    return __privateGet(this, _photoSwipeInstance);
  }
  get filteredIndexes() {
    return JSON.parse(this.getAttribute("filtered-indexes")).map((index) => parseInt(index) - 1);
  }
  /**
   * Open the lightbox at the given index (by default, it opens the selected image)
   */
  openLightBox(index) {
    const images = this.carousel.cells.flatMap((cell) => Array.from(cell.querySelectorAll(":scope > img")));
    const dataSource = images.map((image) => {
      return {
        thumbnailElement: image,
        src: image.src,
        srcset: image.srcset,
        msrc: image.currentSrc || image.src,
        width: parseInt(image.getAttribute("width")),
        height: parseInt(image.getAttribute("height")),
        alt: image.alt,
        thumbCropped: true
      };
    });
    const imageCells = this.carousel.cells.filter((cell) => cell.getAttribute("data-media-type") === "image");
    this.lightBox.loadAndOpen(index ?? imageCells.indexOf(this.carousel.selectedCell), dataSource);
  }
};
_abortController7 = new WeakMap();
_photoSwipeInstance = new WeakMap();
_onGestureChangedListener = new WeakMap();
_settledMedia = new WeakMap();
_ProductGallery_instances = new WeakSet();
/**
 * Add custom elements to PhotoSwipe gallery
 */
registerLightboxUi_fn = function() {
  __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
    name: "close-button",
    className: "circle-button circle-button--xl hover:animate-icon-block",
    ariaLabel: window.themeVariables.strings.closeGallery,
    order: 2,
    isButton: true,
    html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon" viewBox="0 0 16 16">
          <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="1"/>
        </svg>
      `,
    onClick: () => {
      __privateGet(this, _photoSwipeInstance).pswp.close();
    }
  });
  if (__privateGet(this, _photoSwipeInstance).pswp.options.dataSource.length > 1) {
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "previous-button",
      className: "circle-button hover:animate-icon-inline",
      ariaLabel: window.themeVariables.strings.previous,
      order: 1,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="M11 1 3 9l8 8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.prev();
      }
    });
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "next-button",
      className: "circle-button hover:animate-icon-inline",
      ariaLabel: window.themeVariables.strings.next,
      order: 3,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="m5 17 8-8-8-8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.next();
      }
    });
  }
};
/**
 * When the section is re-rendered upon variant changes, the media might have been filtered
 */
onSectionRerender_fn = function(event) {
  const galleryMarkup = deepQuerySelector(event.detail.htmlFragment, `${this.tagName}[form="${this.getAttribute("form")}"]`);
  if (!galleryMarkup) {
    return;
  }
  if (galleryMarkup.filteredIndex !== this.filteredIndexes) {
    this.carousel.filter(galleryMarkup.filteredIndexes);
    this.setAttribute("filtered-indexes", galleryMarkup.getAttribute("filtered-indexes"));
  }
};
/**
 * When the variant changes, we check the alt tags for each media and filter them
 */
onVariantChange_fn = function(event) {
  if (!event.detail.variant) {
    return;
  }
  if (event.detail.variant["featured_media"] && event.detail.previousVariant?.["featured_media"]?.["id"] !== event.detail.variant["featured_media"]["id"]) {
    const position = event.detail.variant["featured_media"]["position"] - 1, filteredIndexBelowPosition = this.filteredIndexes.filter((filteredIndex) => filteredIndex < position);
    if (this.carousel.isScrollable) {
      this.carousel.select(position - filteredIndexBelowPosition.length, { instant: true });
    } else {
      this.querySelector(`[data-media-id="${event.detail.variant["featured_media"]["id"]}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
};
/**
 * When the media is about to change, we perform some logic
 */
onMediaChange_fn = function() {
  if (!__privateGet(this, _settledMedia)) {
    return;
  }
  switch (__privateGet(this, _settledMedia).getAttribute("data-media-type")) {
    case "external_video":
    case "video":
    case "model":
      __privateGet(this, _settledMedia).firstElementChild.pause();
  }
};
/**
 * When the media settles, we have to update various elements such as the AR button, the autoplay strategy...
 */
onMediaSettle_fn = function(event) {
  const media = event ? event.detail.cell : this.carousel.selectedCell, zoomButton = this.querySelector(".product-gallery__zoom-button");
  switch (media.getAttribute("data-media-type")) {
    case "image":
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id"));
      zoomButton?.classList.remove("product-gallery__zoom-button--hidden");
      break;
    case "external_video":
    case "video":
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id"));
      zoomButton?.classList.add("product-gallery__zoom-button--hidden");
      if (this.hasAttribute("autoplay-media")) {
        media.firstElementChild.play();
      }
      break;
    case "model":
      if (matchesMediaQuery("md")) {
        media.firstElementChild.play();
      }
      this.viewInSpaceButton?.setAttribute("data-shopify-model3d-id", event.detail.cell.getAttribute("data-media-id"));
      zoomButton?.classList.add("product-gallery__zoom-button--hidden");
      break;
  }
  __privateSet(this, _settledMedia, media);
};
/**
 * Detect a click on an image on desktop, and open the lightbox for the corresponding image
 */
onCarouselClick_fn = function(event) {
  if (!this.hasAttribute("allow-zoom") || !matchesMediaQuery("md") || event.target.tagName !== "IMG") {
    return;
  }
  const media = event.target.closest(".product-gallery__media");
  if (media.getAttribute("data-media-type") !== "image") {
    return;
  }
  const imageCells = this.carousel.cells.filter((cell) => cell.getAttribute("data-media-type") === "image");
  this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true, detail: { index: imageCells.indexOf(media) } }));
};
/**
 * For iOS devices only, we use the gesturechange event to easily detect a "pinch to zoom"
 */
onGestureStart_fn = function(event) {
  event.preventDefault();
  this.carousel.addEventListener("gesturechange", __privateGet(this, _onGestureChangedListener), { capture: false, signal: __privateGet(this, _abortController7).signal });
};
onGestureChanged_fn = function(event) {
  event.preventDefault();
  if (event.scale > 1.5) {
    this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true, detail: { index: this.carousel.selectedIndex } }));
    this.removeEventListener("gesturechange", __privateGet(this, _onGestureChangedListener));
  }
};
var _intersectionObserver, _hasProgrammaticScroll, _scrollDirection, _lastScrollPosition, _ProductGalleryNavigation_instances, onMediaObserve_fn;
var ProductGalleryNavigation = class extends CarouselNavigation {
  constructor() {
    super();
    __privateAdd(this, _ProductGalleryNavigation_instances);
    __privateAdd(this, _intersectionObserver, new IntersectionObserver(__privateMethod(this, _ProductGalleryNavigation_instances, onMediaObserve_fn).bind(this), { threshold: [0, 0.5, 1] }));
    __privateAdd(this, _hasProgrammaticScroll, false);
    __privateAdd(this, _scrollDirection, "bottom");
    __privateAdd(this, _lastScrollPosition);
    window.addEventListener("scroll", () => {
      if (window.scrollY > __privateGet(this, _lastScrollPosition)) {
        __privateSet(this, _scrollDirection, "bottom");
      } else {
        __privateSet(this, _scrollDirection, "top");
      }
      __privateSet(this, _lastScrollPosition, window.scrollY);
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.carousel.allCells.forEach((cell) => __privateGet(this, _intersectionObserver).observe(cell));
  }
  onButtonClicked(newIndex) {
    if (this.carousel.isScrollable) {
      super.onButtonClicked(newIndex);
    } else {
      this.carousel.cells[newIndex]?.scrollIntoView({ block: "start", behavior: "smooth" });
      this.onNavigationChange(newIndex);
      __privateSet(this, _hasProgrammaticScroll, true);
      if (!("onscrollend" in window)) {
        setTimeout(() => {
          __privateSet(this, _hasProgrammaticScroll, false);
        }, 1e3);
      } else {
        window.addEventListener("scrollend", () => {
          __privateSet(this, _hasProgrammaticScroll, false);
        }, { once: true });
      }
    }
  }
};
_intersectionObserver = new WeakMap();
_hasProgrammaticScroll = new WeakMap();
_scrollDirection = new WeakMap();
_lastScrollPosition = new WeakMap();
_ProductGalleryNavigation_instances = new WeakSet();
/**
 * Use the intersection observer to change the selected icon
 */
onMediaObserve_fn = function(entries) {
  if (this.carousel.isScrollable) {
    return;
  }
  const firstEntry = entries.find((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5);
  if (!firstEntry || __privateGet(this, _hasProgrammaticScroll)) {
    return;
  }
  const selectedItem = this.items.find((item) => item.getAttribute("aria-current") === "true"), candidateItem = this.items.find((item) => item.getAttribute("data-media-id") === firstEntry.target.getAttribute("data-media-id"));
  if (__privateGet(this, _scrollDirection) === "bottom" && parseInt(candidateItem.getAttribute("data-media-position")) > parseInt(selectedItem.getAttribute("data-media-position"))) {
    selectedItem.setAttribute("aria-current", "false");
    candidateItem.setAttribute("aria-current", "true");
  } else if (__privateGet(this, _scrollDirection) === "top" && parseInt(candidateItem.getAttribute("data-media-position")) < parseInt(selectedItem.getAttribute("data-media-position"))) {
    selectedItem.setAttribute("aria-current", "false");
    candidateItem.setAttribute("aria-current", "true");
  }
};
var OpenLightBoxButton = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true })));
  }
};
if (!window.customElements.get("product-gallery")) {
  window.customElements.define("product-gallery", ProductGallery);
}
if (!window.customElements.get("product-gallery-navigation")) {
  window.customElements.define("product-gallery-navigation", ProductGalleryNavigation);
}
if (!window.customElements.get("open-lightbox-button")) {
  window.customElements.define("open-lightbox-button", OpenLightBoxButton);
}

// js/common/product/product-list.js
import { inView as inView6, animate as animate9, stagger } from "vendor";
var ProductList = class extends HTMLElement {
  connectedCallback() {
    if (matchesMediaQuery("motion-safe") && this.querySelectorAll('product-card[reveal-on-scroll="true"]').length > 0) {
      inView6(this, this.reveal.bind(this));
    }
  }
  reveal() {
    animate9(this.querySelectorAll('product-card[reveal-on-scroll="true"]'), {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0)"]
    }, {
      duration: 0.2,
      easing: "ease-in-out",
      delay: stagger(0.05, { start: 0.4, easing: "ease-out" })
    });
  }
};
if (!window.customElements.get("product-list")) {
  window.customElements.define("product-list", ProductList);
}

// js/common/product/product-loader.js
var loadedProducts = {};
var ProductLoader = class {
  static load(productHandle) {
    if (!productHandle) {
      return;
    }
    if (loadedProducts[productHandle]) {
      return loadedProducts[productHandle];
    }
    loadedProducts[productHandle] = new Promise(async (resolve, reject) => {
      const response = await fetch(`${Shopify.routes.root}products/${productHandle}.js`);
      if (response.ok) {
        const responseAsJson = await response.json();
        resolve(responseAsJson);
      } else {
        reject(`
          Attempted to load information for product with handle ${productHandle}, but this product is in "draft" mode. You won't be able to
          switch between variants or access to per-variant information. To fully preview this product, change temporarily its status
          to "active".
        `);
      }
    });
    return loadedProducts[productHandle];
  }
};

// js/common/product/product-rerender.js
var _abortController8, _ProductRerender_instances, onRerender_fn;
var ProductRerender = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductRerender_instances);
    __privateAdd(this, _abortController8);
  }
  connectedCallback() {
    __privateSet(this, _abortController8, new AbortController());
    if (!this.id || !this.hasAttribute("observe-form")) {
      console.warn('The <product-rerender> requires an ID to identify the element to re-render, and an "observe-form" attribute referencing to the form to monitor.');
    }
    document.forms[this.getAttribute("observe-form")].addEventListener("product:rerender", __privateMethod(this, _ProductRerender_instances, onRerender_fn).bind(this), { signal: __privateGet(this, _abortController8).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController8).abort();
  }
};
_abortController8 = new WeakMap();
_ProductRerender_instances = new WeakSet();
onRerender_fn = function(event) {
  const matchingElement = deepQuerySelector(event.detail.htmlFragment, `#${this.id}`);
  if (!matchingElement) {
    return;
  }
  const focusedElement = document.activeElement;
  if (!this.hasAttribute("allow-partial-rerender") || event.detail.productChange) {
    this.replaceWith(matchingElement);
  } else {
    const blockTypes = ["sku", "badges", "quantity-selector", "volume-pricing", "price", "payment-terms", "variant-picker", "inventory", "buy-buttons", "pickup-availability", "liquid"];
    blockTypes.forEach((blockType) => {
      this.querySelectorAll(`[data-block-type="${blockType}"]`).forEach((element) => {
        const matchingBlock = matchingElement.querySelector(`[data-block-type="${blockType}"][data-block-id="${element.getAttribute("data-block-id")}"]`);
        if (matchingBlock) {
          if (blockType === "buy-buttons") {
            element.querySelector("buy-buttons").replaceWith(matchingBlock.querySelector("buy-buttons"));
          } else if (blockType === "quantity-selector") {
            const quantitySelectorElement = element.querySelector("quantity-selector");
            if (quantitySelectorElement) {
              const existingQuantity = quantitySelectorElement.quantity;
              element.replaceWith(matchingBlock);
              matchingBlock.querySelector("quantity-selector").quantity = existingQuantity;
            }
          } else {
            element.replaceWith(matchingBlock);
          }
        }
      });
    });
  }
  if (focusedElement.id) {
    const element = document.getElementById(focusedElement.id);
    if (this.contains(element)) {
      element.focus();
    }
  }
};
if (!window.customElements.get("product-rerender")) {
  window.customElements.define("product-rerender", ProductRerender);
}

// js/common/product/quick-buy-modal.js
var _QuickBuyModal_instances, onAfterHide_fn;
var QuickBuyModal = class extends Modal {
  constructor() {
    super();
    __privateAdd(this, _QuickBuyModal_instances);
    if (window.themeVariables.settings.cartType === "drawer") {
      document.addEventListener("variant:add", this.hide.bind(this));
    }
    this.addEventListener("dialog:after-hide", __privateMethod(this, _QuickBuyModal_instances, onAfterHide_fn).bind(this));
  }
  async show() {
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
    const responseContent = await (await cachedFetch(`${window.Shopify.routes.root}products/${this.getAttribute("handle")}`)).text();
    document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
    const tempDoc = new DOMParser().parseFromString(responseContent, "text/html");
    const quickBuyContent = tempDoc.getElementById("quick-buy-content").content;
    Array.from(quickBuyContent.querySelectorAll("noscript")).forEach((noScript) => noScript.remove());
    this.replaceChildren(quickBuyContent);
    Shopify?.PaymentButton?.init();
    return super.show();
  }
};
_QuickBuyModal_instances = new WeakSet();
onAfterHide_fn = function() {
  this.innerHTML = "";
};
if (!window.customElements.get("quick-buy-modal")) {
  window.customElements.define("quick-buy-modal", QuickBuyModal);
}

// js/common/product/variant-picker.js
import { Delegate as Delegate5 } from "vendor";
var CACHE_EVICTION_TIME = 1e3 * 60 * 5;
var _preloadedHtml, _delegate4, _intersectionObserver2, _form, _selectedVariant, _VariantPicker_instances, getActiveOptionValues_fn, getOptionValuesFromOption_fn, onOptionChanged_fn, onOptionPreload_fn, onIntersection_fn, renderForCombination_fn, createHashKeyForHtml_fn;
var _VariantPicker = class _VariantPicker extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _VariantPicker_instances);
    __privateAdd(this, _delegate4, new Delegate5(document.body));
    __privateAdd(this, _intersectionObserver2, new IntersectionObserver(__privateMethod(this, _VariantPicker_instances, onIntersection_fn).bind(this)));
    __privateAdd(this, _form);
    __privateAdd(this, _selectedVariant);
  }
  async connectedCallback() {
    __privateSet(this, _selectedVariant, JSON.parse(this.querySelector("script[data-variant]")?.textContent || "{}"));
    __privateSet(this, _form, document.forms[this.getAttribute("form-id")]);
    __privateGet(this, _delegate4).on("change", `input[data-option-position][form="${this.getAttribute("form-id")}"]`, __privateMethod(this, _VariantPicker_instances, onOptionChanged_fn).bind(this));
    __privateGet(this, _delegate4).on("pointerenter", `input[data-option-position][form="${this.getAttribute("form-id")}"]:not(:checked) + label`, __privateMethod(this, _VariantPicker_instances, onOptionPreload_fn).bind(this), true);
    __privateGet(this, _delegate4).on("touchstart", `input[data-option-position][form="${this.getAttribute("form-id")}"]:not(:checked) + label`, __privateMethod(this, _VariantPicker_instances, onOptionPreload_fn).bind(this), true);
    __privateGet(this, _intersectionObserver2).observe(this);
  }
  disconnectedCallback() {
    __privateGet(this, _delegate4).off();
    __privateGet(this, _intersectionObserver2).unobserve(this);
  }
  get selectedVariant() {
    return __privateGet(this, _selectedVariant);
  }
  get productHandle() {
    return this.getAttribute("handle");
  }
  get updateUrl() {
    return this.hasAttribute("update-url");
  }
  /**
   * Select a variant using a list of option values. The list of option values might lead to no variant (for instance)
   * in the case of a combination that does not exist
   */
  async selectCombination({ optionValues, productChange }) {
    const previousVariant = this.selectedVariant;
    const newContent = document.createRange().createContextualFragment(await __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, optionValues));
    if (!productChange) {
      const newVariantPicker = deepQuerySelector(newContent, `${this.tagName}[form-id="${this.getAttribute("form-id")}"]`);
      const newVariant = JSON.parse(newVariantPicker.querySelector("script[data-variant]")?.textContent || "{}");
      __privateSet(this, _selectedVariant, newVariant);
      __privateGet(this, _form).id.value = __privateGet(this, _selectedVariant)?.id;
      __privateGet(this, _form).id.dispatchEvent(new Event("change", { bubbles: true }));
      if (this.updateUrl && __privateGet(this, _selectedVariant)?.id) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("variant", __privateGet(this, _selectedVariant).id);
        window.history.replaceState({ path: newUrl.toString() }, "", newUrl.toString());
      }
    }
    __privateGet(this, _form).dispatchEvent(new CustomEvent("product:rerender", {
      detail: {
        htmlFragment: newContent,
        productChange
      }
    }));
    if (!productChange) {
      __privateGet(this, _form).dispatchEvent(new CustomEvent("variant:change", {
        bubbles: true,
        detail: {
          formId: __privateGet(this, _form).id,
          variant: __privateGet(this, _selectedVariant),
          previousVariant
        }
      }));
    }
    Shopify?.PaymentButton?.init();
  }
};
_preloadedHtml = new WeakMap();
_delegate4 = new WeakMap();
_intersectionObserver2 = new WeakMap();
_form = new WeakMap();
_selectedVariant = new WeakMap();
_VariantPicker_instances = new WeakSet();
/**
 * Get the option values for the active combination
 */
getActiveOptionValues_fn = function() {
  return Array.from(__privateGet(this, _form).elements).filter((item) => item.matches("input[data-option-position]:checked")).sort((a, b) => parseInt(a.getAttribute("data-option-position")) - parseInt(b.getAttribute("data-option-position"))).map((input) => input.value);
};
/**
 * Get the option values for a given input
 */
getOptionValuesFromOption_fn = function(input) {
  const optionValues = [input, ...Array.from(__privateGet(this, _form).elements).filter((item) => item.matches(`input[data-option-position]:not([name="${input.name}"]):checked`))].sort((a, b) => parseInt(a.getAttribute("data-option-position")) - parseInt(b.getAttribute("data-option-position"))).map((input2) => input2.value);
  return optionValues;
};
onOptionChanged_fn = async function(event) {
  if (!event.target.name.includes("option")) {
    return;
  }
  this.selectCombination({
    optionValues: __privateMethod(this, _VariantPicker_instances, getActiveOptionValues_fn).call(this),
    productChange: event.target.hasAttribute("data-product-url")
  });
};
/**
 * To improve the user experience, we preload a variant whenever the user hovers over a specific option
 */
onOptionPreload_fn = function(event, target) {
  __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, __privateMethod(this, _VariantPicker_instances, getOptionValuesFromOption_fn).call(this, target.control));
};
/**
 * When the variant picker is intersecting the viewport, we preload the options to improve the user experience
 * so that switching variants is nearly instant
 */
onIntersection_fn = function(entries) {
  const prerenderOptions = () => {
    Array.from(__privateGet(this, _form).elements).filter((item) => item.matches("input[data-option-position]:not(:checked)")).forEach((input) => {
      __privateMethod(this, _VariantPicker_instances, renderForCombination_fn).call(this, __privateMethod(this, _VariantPicker_instances, getOptionValuesFromOption_fn).call(this, input));
    });
  };
  if (entries[0].isIntersecting) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(prerenderOptions, { timeout: 2e3 });
    } else {
      prerenderOptions();
    }
  }
};
renderForCombination_fn = async function(optionValues) {
  const optionValuesAsString = optionValues.join(",");
  const hashKey = __privateMethod(this, _VariantPicker_instances, createHashKeyForHtml_fn).call(this, optionValuesAsString);
  let productUrl = `${Shopify.routes.root}products/${this.productHandle}`;
  for (const optionValue of optionValues) {
    const inputForOptionValue = Array.from(__privateGet(this, _form).elements).find((item) => item.matches(`input[value="${optionValue}"]`));
    if (inputForOptionValue?.dataset.productUrl) {
      productUrl = inputForOptionValue.dataset.productUrl;
      break;
    }
  }
  if (!__privateGet(_VariantPicker, _preloadedHtml).has(hashKey)) {
    const sectionQueryParam = this.getAttribute("context") === "quick_buy" ? "" : `&section_id=${this.getAttribute("section-id")}`;
    const promise = new Promise(async (resolve) => {
      resolve(await (await fetch(`${productUrl}?option_values=${optionValuesAsString}${sectionQueryParam}`)).text());
    });
    __privateGet(_VariantPicker, _preloadedHtml).set(hashKey, { htmlPromise: promise, timestamp: Date.now() });
    if (__privateGet(_VariantPicker, _preloadedHtml).size > 100) {
      __privateGet(_VariantPicker, _preloadedHtml).delete(Array.from(__privateGet(_VariantPicker, _preloadedHtml).keys())[0]);
    }
  }
  return __privateGet(_VariantPicker, _preloadedHtml).get(hashKey).htmlPromise;
};
createHashKeyForHtml_fn = function(optionValuesAsString) {
  return `${optionValuesAsString}-${this.getAttribute("section-id")}`;
};
__privateAdd(_VariantPicker, _preloadedHtml, /* @__PURE__ */ new Map());
var VariantPicker = _VariantPicker;
if (!window.customElements.get("variant-picker")) {
  window.customElements.define("variant-picker", VariantPicker);
}

// js/common/media/base-media.js
import { inView as inView7 } from "vendor";
var BaseMedia = class extends HTMLElement {
  static get observedAttributes() {
    return ["playing"];
  }
  connectedCallback() {
    this._abortController = new AbortController();
    if (this.hasAttribute("autoplay")) {
      inView7(this, this.play.bind(this), { margin: "0px 0px 0px 0px" });
    }
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
  get playing() {
    return this.hasAttribute("playing");
  }
  get player() {
    return this._playerProxy = this._playerProxy || new Proxy(this._playerTarget(), {
      get: (target, prop) => {
        return async () => {
          target = await target;
          this._playerHandler(target, prop);
        };
      }
    });
  }
  play() {
    if (!this.playing) {
      this.player.play();
    }
  }
  pause() {
    if (this.playing) {
      this.player.pause();
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "playing") {
      if (oldValue === null && newValue === "") {
        this.dispatchEvent(new CustomEvent("media:play", { bubbles: true }));
        if (this.hasAttribute("group")) {
          Array.from(document.querySelectorAll(`[group="${this.getAttribute("group")}"]`)).filter((item) => item !== this).forEach((itemToPause) => {
            itemToPause.pause();
          });
        }
      } else if (newValue === null) {
        this.dispatchEvent(new CustomEvent("media:pause", { bubbles: true }));
      }
    }
  }
};

// js/common/media/model.js
var ModelMedia = class extends BaseMedia {
  connectedCallback() {
    super.connectedCallback();
    this.player;
  }
  _playerTarget() {
    return new Promise((resolve) => {
      this.setAttribute("loaded", "");
      window.Shopify.loadFeatures([
        {
          name: "shopify-xr",
          version: "1.0",
          onLoad: this._setupShopifyXr.bind(this)
        },
        {
          name: "model-viewer-ui",
          version: "1.0",
          onLoad: () => {
            const modelViewer = this.querySelector("model-viewer");
            modelViewer.addEventListener("shopify_model_viewer_ui_toggle_play", () => this.setAttribute("playing", ""));
            modelViewer.addEventListener("shopify_model_viewer_ui_toggle_pause", () => this.removeAttribute("playing"));
            resolve(new window.Shopify.ModelViewerUI(modelViewer, { focusOnPlay: true }));
          }
        }
      ]);
    });
  }
  _playerHandler(target, prop) {
    target[prop]();
  }
  async _setupShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener("shopify_xr_initialized", this._setupShopifyXr.bind(this));
    } else {
      const models = (await ProductLoader.load(this.getAttribute("handle")))["media"].filter((media) => media["media_type"] === "model");
      window.ShopifyXR.addModels(models);
      window.ShopifyXR.setupXRElements();
    }
  }
};
if (!window.customElements.get("model-media")) {
  window.customElements.define("model-media", ModelMedia);
}

// js/common/media/video.js
import { inView as inView8 } from "vendor";
var onYouTubePromise = new Promise((resolve) => {
  window.onYouTubeIframeAPIReady = () => resolve();
});
var VideoMedia = class extends BaseMedia {
  #mustRemoveControlsAfterSuspend = false;
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("autoplay")) {
      this.addEventListener("click", this.play, { once: true, signal: this._abortController.signal });
    }
    if (this.hasAttribute("show-play-button") && !this.shadowRoot) {
      this.attachShadow({ mode: "open" }).appendChild(document.getElementById("video-media-default-template").content.cloneNode(true));
    }
    if (this.getAttribute("type") === "video") {
      inView8(this, () => {
        this.querySelector("video")?.setAttribute("preload", "metadata");
      }, { margin: "800px" });
    }
  }
  _playerTarget() {
    if (this.hasAttribute("host")) {
      this.setAttribute("loaded", "");
      return new Promise(async (resolve) => {
        const templateElement = this.querySelector("template");
        if (templateElement) {
          templateElement.replaceWith(templateElement.content.firstElementChild.cloneNode(true));
        }
        const muteVideo = this.hasAttribute("autoplay") || matchesMediaQuery("md-max");
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (this.getAttribute("host") === "youtube") {
          if (!window.YT || !window.YT.Player) {
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          await onYouTubePromise;
          const player = new YT.Player(this.querySelector("iframe"), {
            events: {
              "onReady": () => {
                if (muteVideo) {
                  player.mute();
                }
                resolve(player);
              },
              "onStateChange": (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                  this.setAttribute("playing", "");
                } else if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
                  this.removeAttribute("playing");
                }
              }
            }
          });
        }
        if (this.getAttribute("host") === "vimeo") {
          if (!window.Vimeo || !window.Vimeo.Player) {
            script.src = "https://player.vimeo.com/api/player.js";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          const player = new Vimeo.Player(this.querySelector("iframe"));
          if (muteVideo) {
            player.setMuted(true);
          }
          player.on("play", () => {
            this.setAttribute("playing", "");
          });
          player.on("pause", () => this.removeAttribute("playing"));
          player.on("ended", () => this.removeAttribute("playing"));
          resolve(player);
        }
      });
    } else {
      const videoElement = this.querySelector("video");
      this.setAttribute("loaded", "");
      videoElement.addEventListener("play", () => {
        this.setAttribute("playing", "");
        this.removeAttribute("suspended");
        if (this.#mustRemoveControlsAfterSuspend) {
          videoElement.controls = false;
        }
      });
      videoElement.addEventListener("pause", () => {
        if (!videoElement.seeking && videoElement.paused) {
          this.removeAttribute("playing");
        }
      });
      return videoElement;
    }
  }
  _playerHandler(target, prop) {
    if (this.getAttribute("host") === "youtube") {
      prop === "play" ? target.playVideo() : target.pauseVideo();
    } else {
      if (prop === "play" && !this.hasAttribute("host")) {
        target.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            this.setAttribute("suspended", "");
            if (!this.hasAttribute("controls")) {
              this.#mustRemoveControlsAfterSuspend = true;
              target.controls = true;
            }
          }
        });
      } else {
        target[prop]();
      }
    }
  }
};
if (!window.customElements.get("video-media")) {
  window.customElements.define("video-media", VideoMedia);
}

// js/common/navigation/accordion-disclosure.js
import { timeline as timeline5 } from "vendor";

// js/common/navigation/custom-details.js
var _onSummaryClickedListener, _CustomDetails_instances, onSummaryClicked_fn;
var CustomDetails = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _CustomDetails_instances);
    __privateAdd(this, _onSummaryClickedListener, __privateMethod(this, _CustomDetails_instances, onSummaryClicked_fn).bind(this));
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.toggle(true, !event.detail.load));
      this.addEventListener("shopify:block:deselect", (event) => this.toggle(false, !event.detail.load));
    }
  }
  static get observedAttributes() {
    return ["open", "aria-expanded"];
  }
  connectedCallback() {
    this.disclosureElement.setAttribute("aria-expanded", this.disclosureElement.open ? "true" : "false");
    this.summaryElement.addEventListener("click", __privateGet(this, _onSummaryClickedListener));
  }
  disconnectedCallback() {
    this.summaryElement.removeEventListener("click", __privateGet(this, _onSummaryClickedListener));
  }
  get disclosureElement() {
    return this.querySelector("details");
  }
  get summaryElement() {
    return this.disclosureElement.firstElementChild;
  }
  get contentElement() {
    return this.disclosureElement.lastElementChild;
  }
  toggle(force = void 0, animate26 = true) {
    const newValue = typeof force === "boolean" ? force : !(this.disclosureElement.getAttribute("aria-expanded") === "true");
    if (newValue) {
      this.open({ instant: !animate26 });
    } else {
      this.close();
    }
  }
  async open({ instant = false } = {}) {
    if (this.disclosureElement.getAttribute("aria-expanded") === "true") {
      return;
    }
    this.disclosureElement.open = true;
    this.disclosureElement.setAttribute("aria-expanded", "true");
    const controls = this.createShowAnimationControls();
    if (instant) {
      controls.finish();
    }
  }
  async close() {
    this.disclosureElement.setAttribute("aria-expanded", "false");
    if (!this.disclosureElement.open) {
      return;
    }
    this.createHideAnimationControls()?.finished.then((event) => {
      if (event !== void 0) {
        this.disclosureElement.removeAttribute("open");
      }
    });
  }
  createShowAnimationControls() {
  }
  createHideAnimationControls() {
  }
};
_onSummaryClickedListener = new WeakMap();
_CustomDetails_instances = new WeakSet();
/**
 * By default, when clicking on the summary, the browser directly toggle the "open" attribute, which prevent to
 * perform animation. We therefore block that to allow doing an animation
 */
onSummaryClicked_fn = function(event) {
  event.preventDefault();
  if (this.disclosureElement.open && this.summaryElement.hasAttribute("data-follow-link")) {
    return window.location.href = this.summaryElement.getAttribute("data-follow-link");
  }
  this.toggle();
};

// js/common/navigation/accordion-disclosure.js
var AccordionDisclosure = class extends CustomDetails {
  createShowAnimationControls() {
    this.disclosureElement.style.overflow = "hidden";
    const animationControls = timeline5([
      [this.disclosureElement, { height: [`${this.summaryElement.clientHeight}px`, `${this.disclosureElement.scrollHeight}px`] }, { duration: 0.25, easing: "ease" }],
      [this.contentElement, { opacity: [0, 1], transform: ["translateY(4px)", `translateY(0)`] }, { duration: 0.15, at: "-0.1" }]
    ]);
    animationControls.finished.then(() => {
      this.disclosureElement.style.height = null;
      this.disclosureElement.style.overflow = null;
    });
    return animationControls;
  }
  createHideAnimationControls() {
    const animationControls = timeline5([
      [this.contentElement, { opacity: 0 }, { duration: 0.15 }],
      [this.disclosureElement, { height: [`${this.disclosureElement.clientHeight}px`, `${this.summaryElement.clientHeight}px`] }, { duration: 0.25, at: "<", easing: "ease" }]
    ]);
    animationControls.finished.then(() => {
      this.disclosureElement.style.height = null;
    });
    return animationControls;
  }
};
if (!window.customElements.get("accordion-disclosure")) {
  window.customElements.define("accordion-disclosure", AccordionDisclosure);
}

// js/common/navigation/menu-disclosure.js
var _hoverTimer, _detectClickOutsideListener, _detectEscKeyboardListener, _detectFocusOutListener, _detectHoverOutsideListener, _detectHoverListener, _MenuDisclosure_instances, detectClickOutside_fn, detectHover_fn, detectHoverOutside_fn, detectEscKeyboard_fn, detectFocusOut_fn;
var _MenuDisclosure = class _MenuDisclosure extends CustomDetails {
  constructor() {
    super();
    __privateAdd(this, _MenuDisclosure_instances);
    __privateAdd(this, _hoverTimer);
    __privateAdd(this, _detectClickOutsideListener, __privateMethod(this, _MenuDisclosure_instances, detectClickOutside_fn).bind(this));
    __privateAdd(this, _detectEscKeyboardListener, __privateMethod(this, _MenuDisclosure_instances, detectEscKeyboard_fn).bind(this));
    __privateAdd(this, _detectFocusOutListener, __privateMethod(this, _MenuDisclosure_instances, detectFocusOut_fn).bind(this));
    __privateAdd(this, _detectHoverOutsideListener, __privateMethod(this, _MenuDisclosure_instances, detectHoverOutside_fn).bind(this));
    __privateAdd(this, _detectHoverListener, __privateMethod(this, _MenuDisclosure_instances, detectHover_fn).bind(this));
    this.disclosureElement.addEventListener("mouseover", __privateGet(this, _detectHoverListener).bind(this));
    this.disclosureElement.addEventListener("mouseout", __privateGet(this, _detectHoverListener).bind(this));
  }
  /**
   * Get the trigger mode (can be "click" or "hover"). However, for touch devices, it is always forced to click
   * to provide a better user experience
   */
  get trigger() {
    return !window.matchMedia("screen and (pointer: fine)").matches ? "click" : this.getAttribute("trigger");
  }
  /**
   * In ms, describe the delay before which we close the menu
   */
  get mouseOverDelayTolerance() {
    return 250;
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PRIVATE API
   * -------------------------------------------------------------------------------------------------------------------
   */
  async open({ instant = false } = {}) {
    super.open({ instant });
    document.addEventListener("click", __privateGet(this, _detectClickOutsideListener));
    document.addEventListener("keydown", __privateGet(this, _detectEscKeyboardListener));
    document.addEventListener("focusout", __privateGet(this, _detectFocusOutListener));
    document.addEventListener("mouseover", __privateGet(this, _detectHoverOutsideListener));
  }
  async close() {
    super.close();
    document.removeEventListener("click", __privateGet(this, _detectClickOutsideListener));
    document.removeEventListener("keydown", __privateGet(this, _detectEscKeyboardListener));
    document.removeEventListener("focusout", __privateGet(this, _detectFocusOutListener));
    document.removeEventListener("mouseover", __privateGet(this, _detectHoverOutsideListener));
  }
};
_hoverTimer = new WeakMap();
_detectClickOutsideListener = new WeakMap();
_detectEscKeyboardListener = new WeakMap();
_detectFocusOutListener = new WeakMap();
_detectHoverOutsideListener = new WeakMap();
_detectHoverListener = new WeakMap();
_MenuDisclosure_instances = new WeakSet();
/**
 * When dropdown menu is configured to open on click, we add a listener to detect click outside and automatically
 * close the navigation.
 */
detectClickOutside_fn = function(event) {
  if (this.trigger !== "click") {
    return;
  }
  if (!this.contains(event.target) && !(event.target.closest("details") instanceof _MenuDisclosure)) {
    this.toggle(false);
  }
};
/**
 * On desktop device, if the mode is set to hover, we open/close the dropdown on hover
 */
detectHover_fn = function(event) {
  if (this.trigger !== "hover") {
    return;
  }
  if (event.type === "mouseover") {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(true);
  } else if (event.type === "mouseout") {
    __privateSet(this, _hoverTimer, setTimeout(() => this.toggle(false), this.mouseOverDelayTolerance));
  }
};
/**
 * Try to detect when the user hover a different link, to immediately close the item without extra delay
 */
detectHoverOutside_fn = function(event) {
  if (this.trigger !== "hover") {
    return;
  }
  const closestDetails = event.target.closest("details");
  if (closestDetails instanceof _MenuDisclosure && closestDetails !== this && !closestDetails.contains(this) && !this.contains(closestDetails)) {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(false);
  }
};
/**
 * Detect if we hit the "Escape" key to automatically close the dropdown
 */
detectEscKeyboard_fn = function(event) {
  if (event.code === "Escape") {
    const targetMenu = event.target.closest("details[open]");
    if (targetMenu && targetMenu instanceof _MenuDisclosure) {
      targetMenu.toggle(false);
      event.stopPropagation();
    }
  }
};
/**
 * Close the dropdown automatically when the dropdown is focused out
 */
detectFocusOut_fn = function(event) {
  if (event.relatedTarget && !this.contains(event.relatedTarget)) {
    this.toggle(false);
  }
};
var MenuDisclosure = _MenuDisclosure;

// js/common/navigation/tabs.js
import { Delegate as Delegate6, animate as animate10, timeline as timeline6 } from "vendor";
var _componentID, _buttons, _panels, _delegate5, _Tabs_instances, setupComponent_fn, onButtonClicked_fn, onSlotChange_fn, handleKeyboard_fn;
var Tabs = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _Tabs_instances);
    __privateAdd(this, _componentID, crypto.randomUUID ? crypto.randomUUID() : Math.floor(Math.random() * 1e4));
    __privateAdd(this, _buttons, []);
    __privateAdd(this, _panels, []);
    __privateAdd(this, _delegate5, new Delegate6(this));
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" }).appendChild(this.querySelector("template").content.cloneNode(true));
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => this.selectedIndex = __privateGet(this, _buttons).indexOf(event.target));
    }
    __privateGet(this, _delegate5).on("click", 'button[role="tab"]', __privateMethod(this, _Tabs_instances, onButtonClicked_fn).bind(this));
    this.shadowRoot.addEventListener("slotchange", __privateMethod(this, _Tabs_instances, onSlotChange_fn).bind(this));
    this.addEventListener("keydown", __privateMethod(this, _Tabs_instances, handleKeyboard_fn));
  }
  static get observedAttributes() {
    return ["selected-index"];
  }
  connectedCallback() {
    __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this);
    this.selectedIndex = this.selectedIndex;
  }
  disconnectedCallback() {
    __privateGet(this, _delegate5).destroy();
  }
  /**
   * --------------------------------------------------------------------------
   * GETTERS AND SETTERS
   * --------------------------------------------------------------------------
   */
  get animationDuration() {
    return this.hasAttribute("animation-duration") ? parseFloat(this.getAttribute("animation-duration")) : 0.3;
  }
  get selectedIndex() {
    return parseInt(this.getAttribute("selected-index")) || 0;
  }
  set selectedIndex(index) {
    this.setAttribute("selected-index", Math.min(Math.max(index, 0), __privateGet(this, _buttons).length - 1).toString());
    this.style.setProperty("--selected-index", this.selectedIndex.toString());
  }
  /**
   * --------------------------------------------------------------------------
   * METHODS
   * --------------------------------------------------------------------------
   */
  attributeChangedCallback(name, oldValue, newValue) {
    __privateGet(this, _buttons).forEach((button, index) => button.setAttribute("aria-selected", index === parseInt(newValue) ? "true" : "false"));
    if (name === "selected-index" && oldValue !== null && oldValue !== newValue) {
      this.transition(__privateGet(this, _panels)[parseInt(oldValue)], __privateGet(this, _panels)[parseInt(newValue)]);
    }
  }
  /**
   * Perform a custom transition (can be overridden in subclasses). To "from" and "to" are hash representing the panel
   */
  async transition(fromPanel, toPanel) {
    const beforeHeight = this.clientHeight;
    await animate10(fromPanel, { transform: ["translateY(0px)", "translateY(10px)"], opacity: [1, 0] }, { duration: this.animationDuration }).finished;
    fromPanel.hidden = true;
    toPanel.hidden = false;
    await timeline6([
      [this, { height: [`${beforeHeight}px`, `${this.clientHeight}px`], overflow: ["hidden", "visible"] }, { duration: 0.15, easing: [0.85, 0, 0.15, 1] }],
      [toPanel, { transform: ["translateY(10px)", "translateY(0px)"], opacity: [0, 1] }, { duration: this.animationDuration, at: "+0.1" }]
    ]).finished;
    this.style.removeProperty("height");
  }
};
_componentID = new WeakMap();
_buttons = new WeakMap();
_panels = new WeakMap();
_delegate5 = new WeakMap();
_Tabs_instances = new WeakSet();
setupComponent_fn = function() {
  __privateSet(this, _buttons, Array.from(this.shadowRoot.querySelector('slot[name="title"]').assignedNodes(), (item) => item.matches("button") && item || item.querySelector("button")));
  __privateSet(this, _panels, Array.from(this.shadowRoot.querySelector('slot[name="content"]').assignedNodes()));
  __privateGet(this, _buttons).forEach((button, index) => {
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", `tab-panel-${__privateGet(this, _componentID)}-${index}`);
    button.id = `tab-${__privateGet(this, _componentID)}-${index}`;
  });
  __privateGet(this, _panels).forEach((panel, index) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${__privateGet(this, _componentID)}-${index}`);
    panel.id = `tab-panel-${__privateGet(this, _componentID)}-${index}`;
    panel.hidden = index !== this.selectedIndex;
  });
  this.style.setProperty("--item-count", __privateGet(this, _buttons).length.toString());
};
onButtonClicked_fn = function(event, button) {
  this.selectedIndex = __privateGet(this, _buttons).indexOf(button);
};
onSlotChange_fn = function() {
  __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this);
};
/**
 * As per https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-automatic.html, when a tab is currently focused,
 * left and right arrow should switch the tab
 */
handleKeyboard_fn = function(event) {
  const index = __privateGet(this, _buttons).indexOf(document.activeElement);
  if (index === -1 || !["ArrowLeft", "ArrowRight"].includes(event.key)) {
    return;
  }
  if (event.key === "ArrowLeft") {
    this.selectedIndex = (this.selectedIndex - 1 + __privateGet(this, _buttons).length) % __privateGet(this, _buttons).length;
  } else {
    this.selectedIndex = (this.selectedIndex + 1 + __privateGet(this, _buttons).length) % __privateGet(this, _buttons).length;
  }
  __privateGet(this, _buttons)[this.selectedIndex].focus();
};
if (!window.customElements.get("x-tabs")) {
  window.customElements.define("x-tabs", Tabs);
}

// js/common/search/predictive-search.js
var _listenersAbortController2, _fetchAbortController, _searchForm, _queryInput, _PredictiveSearch_instances, onInputChanged_fn2, onFormSubmitted_fn2, doPredictiveSearch_fn, onSearchCleared_fn;
var PredictiveSearch = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _PredictiveSearch_instances);
    __privateAdd(this, _listenersAbortController2);
    __privateAdd(this, _fetchAbortController);
    __privateAdd(this, _searchForm);
    __privateAdd(this, _queryInput);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(document.createRange().createContextualFragment(`<slot name="results"></slot>`));
  }
  connectedCallback() {
    __privateSet(this, _listenersAbortController2, new AbortController());
    __privateSet(this, _searchForm, document.querySelector(`[aria-owns="${this.id}"]`));
    __privateSet(this, _queryInput, __privateGet(this, _searchForm).elements["q"]);
    __privateGet(this, _searchForm).addEventListener("submit", __privateMethod(this, _PredictiveSearch_instances, onFormSubmitted_fn2).bind(this), { signal: __privateGet(this, _listenersAbortController2).signal });
    __privateGet(this, _searchForm).addEventListener("reset", __privateMethod(this, _PredictiveSearch_instances, onSearchCleared_fn).bind(this), { signal: __privateGet(this, _listenersAbortController2).signal });
    __privateGet(this, _queryInput).addEventListener("input", debounce(__privateMethod(this, _PredictiveSearch_instances, onInputChanged_fn2).bind(this), this.autoCompleteDelay, { signal: __privateGet(this, _listenersAbortController2).signal }));
  }
  disconnectedCallback() {
    __privateGet(this, _listenersAbortController2).abort();
  }
  /**
   * Return the delay in ms before we send the autocomplete request. Using a value too low can cause the results to
   * refresh too often, so we recommend to keep the default one
   */
  get autoCompleteDelay() {
    return 280;
  }
  /**
   * Check if the store supports the predictive API (some languages do not). When not supported, the predictive
   * search is simply disabled and only the standard search is used
   */
  supportsPredictiveApi() {
    return JSON.parse(document.getElementById("shopify-features").innerHTML)["predictiveSearch"];
  }
};
_listenersAbortController2 = new WeakMap();
_fetchAbortController = new WeakMap();
_searchForm = new WeakMap();
_queryInput = new WeakMap();
_PredictiveSearch_instances = new WeakSet();
/**
 * Check if the input is not empty, and if so, trigger the predictive search
 */
onInputChanged_fn2 = function() {
  if (__privateGet(this, _queryInput).value === "") {
    return __privateMethod(this, _PredictiveSearch_instances, onSearchCleared_fn).call(this);
  }
  __privateGet(this, _fetchAbortController)?.abort();
  __privateSet(this, _fetchAbortController, new AbortController());
  try {
    return __privateMethod(this, _PredictiveSearch_instances, doPredictiveSearch_fn).call(this);
  } catch (e) {
    if (e.name !== "AbortError") {
      throw e;
    }
  }
};
/**
 * Prevent the form submission if the query is empty
 */
onFormSubmitted_fn2 = function(event) {
  if (__privateGet(this, _queryInput).value === "") {
    return event.preventDefault();
  }
};
doPredictiveSearch_fn = async function() {
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:start", { bubbles: true }));
  const url = `${window.Shopify.routes.root}search${this.supportsPredictiveApi() ? "/suggest" : ""}`, queryParams = `q=${encodeURIComponent(__privateGet(this, _queryInput).value)}&section_id=predictive-search&resources[limit]=10&resources[limit_scope]=each`, tempDoc = new DOMParser().parseFromString(await (await cachedFetch(`${url}?${queryParams}`, { signal: __privateGet(this, _fetchAbortController).signal })).text(), "text/html");
  this.querySelector('[slot="results"]').replaceChildren(...document.importNode(tempDoc.querySelector(".shopify-section"), true).children);
  document.documentElement.dispatchEvent(new CustomEvent("theme:loading:end", { bubbles: true }));
};
/**
 * If any search is pending, we abort them, and transition to the idle slot
 */
onSearchCleared_fn = function() {
  __privateGet(this, _fetchAbortController)?.abort();
  __privateGet(this, _queryInput).focus();
  this.querySelector('[slot="results"]').innerHTML = "";
};
if (!window.customElements.get("predictive-search")) {
  window.customElements.define("predictive-search", PredictiveSearch);
}

// js/sections/announcement-bar.js
import { animate as animate11 } from "vendor";
var AnnouncementBarCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () => animate11(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-10px)"] }, { duration: 0.25, easing: [0.55, 0.055, 0.675, 0.19] }),
      enterControls: () => animate11(toSlide, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, { duration: 0.4, easing: [0.215, 0.61, 0.355, 1] })
    };
  }
};
if (!window.customElements.get("announcement-bar-carousel")) {
  window.customElements.define("announcement-bar-carousel", AnnouncementBarCarousel);
}

// js/sections/before-after-image.js
import { animate as animate12, inView as inView9 } from "vendor";
var _onPointerMoveListener, _touchStartTimestamp, _BeforeAfter_instances, onPointerDown_fn, onPointerMove_fn, onTouchStart_fn, onPointerUp_fn, onKeyboardNavigation_fn2, calculatePosition_fn, animateInitialPosition_fn;
var BeforeAfter = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _BeforeAfter_instances);
    __privateAdd(this, _onPointerMoveListener, __privateMethod(this, _BeforeAfter_instances, onPointerMove_fn).bind(this));
    __privateAdd(this, _touchStartTimestamp, 0);
    this.addEventListener("pointerdown", __privateMethod(this, _BeforeAfter_instances, onPointerDown_fn));
    this.addEventListener("keydown", __privateMethod(this, _BeforeAfter_instances, onKeyboardNavigation_fn2));
    this.addEventListener("touchstart", __privateMethod(this, _BeforeAfter_instances, onTouchStart_fn), { passive: false });
  }
  connectedCallback() {
    inView9(this, __privateMethod(this, _BeforeAfter_instances, animateInitialPosition_fn).bind(this));
  }
};
_onPointerMoveListener = new WeakMap();
_touchStartTimestamp = new WeakMap();
_BeforeAfter_instances = new WeakSet();
onPointerDown_fn = function(event) {
  if (event.target.tagName === "A") {
    return;
  }
  document.addEventListener("pointerup", __privateMethod(this, _BeforeAfter_instances, onPointerUp_fn).bind(this), { once: true });
  if (matchesMediaQuery("supports-hover")) {
    document.addEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
    __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
  }
};
onPointerMove_fn = function(event) {
  __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
};
onTouchStart_fn = function(event) {
  const cursor = this.querySelector(".before-after__cursor");
  if (event.target === cursor || cursor.contains(event.target)) {
    event.preventDefault();
    document.addEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
  } else {
    __privateSet(this, _touchStartTimestamp, event.timeStamp);
  }
};
onPointerUp_fn = function(event) {
  document.removeEventListener("pointermove", __privateGet(this, _onPointerMoveListener));
  if (!matchesMediaQuery("supports-hover")) {
    if (event.timeStamp - __privateGet(this, _touchStartTimestamp) <= 250) {
      __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(this, event);
    }
  }
};
onKeyboardNavigation_fn2 = function(event) {
  if (!event.target.classList.contains("before-after__cursor") || !this.hasAttribute("vertical") && event.code !== "ArrowLeft" && event.code !== "ArrowRight" || this.hasAttribute("vertical") && event.code !== "ArrowUp" && event.code !== "ArrowDown") {
    return;
  }
  event.preventDefault();
  let currentPosition = parseInt(this.style.getPropertyValue("--before-after-cursor-position"));
  if (Number.isNaN(currentPosition)) {
    currentPosition = parseInt(getComputedStyle(this).getPropertyValue("--before-after-initial-cursor-position"));
  }
  let newPosition;
  if (this.hasAttribute("vertical")) {
    newPosition = event.code === "ArrowUp" ? currentPosition - 1 : currentPosition + 1;
  } else {
    newPosition = event.code === "ArrowLeft" ? currentPosition - 1 : currentPosition + 1;
  }
  this.style.setProperty("--before-after-cursor-position", `${Math.min(Math.max(newPosition, 0), 100)}%`);
};
calculatePosition_fn = function(event) {
  let rectangle = this.getBoundingClientRect(), percentage;
  if (this.hasAttribute("vertical")) {
    percentage = (event.clientY - rectangle.top) / this.clientHeight * 100;
  } else {
    percentage = (event.clientX - rectangle.left) / this.clientWidth * 100;
    percentage = document.dir === "rtl" ? 100 - percentage : percentage;
  }
  this.style.setProperty("--before-after-cursor-position", `${Math.min(Math.max(percentage, 0), 100)}%`);
};
animateInitialPosition_fn = function() {
  animate12((progress) => {
    this.style.setProperty("--before-after-cursor-position", `calc(var(--before-after-initial-cursor-position) * ${progress})`);
  }, { duration: 0.6, easing: [0.85, 0, 0.15, 1] });
};
if (!window.customElements.get("before-after")) {
  window.customElements.define("before-after", BeforeAfter);
}

// js/sections/blog-posts.js
import { animate as animate13, stagger as stagger2, inView as inView10 } from "vendor";
var _BlogPosts_instances, reveal_fn;
var BlogPosts = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _BlogPosts_instances);
    if (this.hasAttribute("reveal-on-scroll") && matchesMediaQuery("motion-safe")) {
      inView10(this, __privateMethod(this, _BlogPosts_instances, reveal_fn).bind(this), { margin: "-50px 0px" });
    }
  }
};
_BlogPosts_instances = new WeakSet();
reveal_fn = function() {
  this.style.opacity = "1";
  animate13(
    this.children,
    { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
    { duration: 0.25, delay: stagger2(0.1, { easing: "ease-out" }), easing: "ease" }
  );
};
if (!window.customElements.get("blog-posts")) {
  window.customElements.define("blog-posts", BlogPosts);
}

// js/sections/cart-drawer.js
import { animate as animate14, timeline as timeline7 } from "vendor";
var _sectionId, _CartDrawer_instances, onBundleSection_fn, onCartChange_fn, onBeforeShow_fn, onPageShow_fn, refreshCart_fn, replaceContent_fn;
var CartDrawer = class extends Drawer {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CartDrawer_instances);
    __privateAdd(this, _sectionId);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _sectionId) ?? __privateSet(this, _sectionId, extractSectionId(this));
    document.addEventListener("cart:prepare-bundled-sections", __privateMethod(this, _CartDrawer_instances, onBundleSection_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:change", __privateMethod(this, _CartDrawer_instances, onCartChange_fn).bind(this), { signal: this.abortController.signal });
    document.addEventListener("cart:refresh", __privateMethod(this, _CartDrawer_instances, refreshCart_fn).bind(this), { signal: this.abortController.signal });
    window.addEventListener("pageshow", __privateMethod(this, _CartDrawer_instances, onPageShow_fn).bind(this), { signal: this.abortController.signal });
    this.addEventListener("dialog:before-show", __privateMethod(this, _CartDrawer_instances, onBeforeShow_fn));
  }
};
_sectionId = new WeakMap();
_CartDrawer_instances = new WeakSet();
/**
 * This method is called when the cart is changing, and allow custom sections to order a "re-render"
 */
onBundleSection_fn = function(event) {
  event.detail.sections.push(__privateGet(this, _sectionId));
};
onCartChange_fn = async function(event) {
  __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(this, event.detail.cart["sections"][__privateGet(this, _sectionId)]);
  if ((window.themeVariables.settings.cartType === "drawer" || event.detail["onSuccessDo"] === "force_open_drawer") && event.detail.baseEvent === "variant:add") {
    this.show();
  }
};
onBeforeShow_fn = async function() {
  const drawerFooter = this.shadowRoot.querySelector('[part="footer"]');
  if (!drawerFooter) {
    return;
  }
  drawerFooter.style.opacity = "0";
  await waitForEvent(this, "dialog:after-show");
  animate14(drawerFooter, { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] });
};
onPageShow_fn = async function(event) {
  if (!event.persisted) {
    return;
  }
  __privateMethod(this, _CartDrawer_instances, refreshCart_fn).call(this);
};
refreshCart_fn = async function() {
  __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(this, await (await fetch(`${Shopify.routes.root}?section_id=${__privateGet(this, _sectionId)}`)).text());
};
replaceContent_fn = async function(html) {
  const domElement = new DOMParser().parseFromString(html, "text/html"), newCartDrawer = document.createRange().createContextualFragment(domElement.getElementById(`shopify-section-${__privateGet(this, _sectionId)}`).querySelector("cart-drawer").innerHTML), itemCount = (await fetchCart)["item_count"];
  if (itemCount === 0) {
    const controls = timeline7([
      [this.getShadowPartByName("body"), { opacity: [1, 0] }, { duration: 0.15, easing: "ease-in" }],
      [this.getShadowPartByName("footer"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(30px)"] }, { duration: 0.15, at: "<", easing: "ease-in" }]
    ]);
    await controls.finished;
    this.replaceChildren(...newCartDrawer.children);
    animate14(this.getShadowPartByName("body"), { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] });
  } else {
    this.replaceChildren(...newCartDrawer.children);
  }
  this.classList.toggle("drawer--center-body", itemCount === 0);
  this.dispatchEvent(new CustomEvent("cart-drawer:refreshed", { bubbles: true }));
};
var CartNoteDialog = class extends DialogElement {
  createEnterAnimationControls() {
    return animate14(this, { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.2, easing: "ease-in" });
  }
  createLeaveAnimationControls() {
    return animate14(this, { transform: ["translateY(0)", "translateY(100%)"] }, { duration: 0.2, easing: "ease-in" });
  }
};
if (!window.customElements.get("cart-drawer")) {
  window.customElements.define("cart-drawer", CartDrawer);
}
if (!window.customElements.get("cart-note-dialog")) {
  window.customElements.define("cart-note-dialog", CartNoteDialog);
}

// js/sections/collection.js
import { timeline as timeline8, inView as inView11, Delegate as Delegate7 } from "vendor";
var _CollectionBanner_instances, reveal_fn2;
var CollectionBanner = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CollectionBanner_instances);
  }
  connectedCallback() {
    if (this.hasAttribute("reveal-on-scroll") && matchesMediaQuery("motion-safe")) {
      inView11(this, __privateMethod(this, _CollectionBanner_instances, reveal_fn2).bind(this));
    }
  }
};
_CollectionBanner_instances = new WeakSet();
reveal_fn2 = async function() {
  const image = this.querySelector(".content-over-media > picture img, .content-over-media > image-parallax img"), hasParallax = this.querySelector(".content-over-media image-parallax") !== null, content = this.querySelector(".content-over-media > .prose");
  await imageLoaded(image);
  const transformEffect = 0.15 * 100 / 1.3;
  const imageTransform = hasParallax ? [`scale(1.5) translateY(-${transformEffect}%)`, `scale(1.3) translateY(-${transformEffect}%)`] : ["scale(1.2)", "scale(1)"];
  return timeline8([
    [this, { opacity: 1 }, { duration: 0, easing: [0.25, 0.46, 0.45, 0.94] }],
    [image, { opacity: [0, 1], transform: imageTransform }, { duration: 0.8, delay: 0.25, at: "<", easing: [0.25, 0.46, 0.45, 0.94] }],
    [content, { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] }]
  ]);
};
var _delegate6, _CollectionLayoutSwitch_instances, onLayoutSwitch_fn, setCartAttribute_fn;
var CollectionLayoutSwitch = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CollectionLayoutSwitch_instances);
    __privateAdd(this, _delegate6, new Delegate7(this));
  }
  connectedCallback() {
    __privateGet(this, _delegate6).on("click", 'button[type="button"]', __privateMethod(this, _CollectionLayoutSwitch_instances, onLayoutSwitch_fn).bind(this));
  }
  get controlledList() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
_delegate6 = new WeakMap();
_CollectionLayoutSwitch_instances = new WeakSet();
onLayoutSwitch_fn = function(event, target) {
  if (target.classList.contains("is-active")) {
    return;
  }
  this.controlledList.setAttribute(`collection-${this.getAttribute("device")}-layout`, target.value);
  Array.from(this.querySelectorAll("button")).forEach((item) => item.classList.toggle("is-active", item === target));
  this.controlledList.reveal();
  __privateMethod(this, _CollectionLayoutSwitch_instances, setCartAttribute_fn).call(this, target.value);
};
setCartAttribute_fn = function(newLayout) {
  const attributeProperty = `products_${this.getAttribute("device")}_grid_mode`;
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attributes: {
        [attributeProperty]: newLayout
      }
    }),
    keepalive: true
    // Allows to make sure the request is fired even when submitting the form
  });
};
if (!window.customElements.get("collection-banner")) {
  window.customElements.define("collection-banner", CollectionBanner);
}
if (!window.customElements.get("collection-layout-switch")) {
  window.customElements.define("collection-layout-switch", CollectionLayoutSwitch);
}

// js/sections/countdown-timer.js
import { animate as animate15, inView as inView12 } from "vendor";
var _flips, _expirationDate, _interval, _isVisible, _CountdownTimer_instances, recalculateFlips_fn;
var CountdownTimer = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CountdownTimer_instances);
    __privateAdd(this, _flips);
    __privateAdd(this, _expirationDate);
    __privateAdd(this, _interval);
    __privateAdd(this, _isVisible);
  }
  connectedCallback() {
    __privateSet(this, _flips, Array.from(this.querySelectorAll("countdown-timer-flip")));
    const expiresAt = this.getAttribute("expires-at");
    if (expiresAt !== "") {
      __privateSet(this, _expirationDate, new Date(expiresAt));
      __privateSet(this, _interval, setInterval(__privateMethod(this, _CountdownTimer_instances, recalculateFlips_fn).bind(this), 1e3));
      __privateMethod(this, _CountdownTimer_instances, recalculateFlips_fn).call(this);
    }
    inView12(this, () => {
      __privateSet(this, _isVisible, true);
      return () => __privateSet(this, _isVisible, false);
    }, { margin: "500px" });
  }
  disconnectedCallback() {
    clearInterval(__privateGet(this, _interval));
  }
  get daysFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "days");
  }
  get hoursFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "hours");
  }
  get minutesFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "minutes");
  }
  get secondsFlip() {
    return __privateGet(this, _flips).find((flip) => flip.getAttribute("type") === "seconds");
  }
};
_flips = new WeakMap();
_expirationDate = new WeakMap();
_interval = new WeakMap();
_isVisible = new WeakMap();
_CountdownTimer_instances = new WeakSet();
recalculateFlips_fn = function() {
  const dateNow = /* @__PURE__ */ new Date();
  if (__privateGet(this, _expirationDate) < dateNow) {
    if (this.getAttribute("expiration-behavior") === "hide") {
      this.closest(".shopify-section").remove();
    } else {
      return clearInterval(__privateGet(this, _interval));
    }
  }
  if (!__privateGet(this, _isVisible)) {
    return;
  }
  let delta = Math.abs(__privateGet(this, _expirationDate) - dateNow) / 1e3;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.floor(delta % 60);
  this.daysFlip?.updateValue(days);
  this.hoursFlip?.updateValue(hours);
  this.minutesFlip?.updateValue(minutes);
  this.secondsFlip?.updateValue(seconds);
};
var CountdownTimerFlip = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    let flipHtml = [...this.textContent].map(() => `<countdown-timer-flip-digit part="digit" ${this.hasAttribute("animate") ? "animate" : ""} style="display: inline-block">0</countdown-timer-flip-digit>`);
    this.shadowRoot.appendChild(document.createRange().createContextualFragment(flipHtml.join("")));
  }
  updateValue(value) {
    const newValue = Math.min(99, value).toString().padStart(2, "0");
    [...newValue].forEach((digit, index) => {
      this.shadowRoot.children[index].setAttribute("number", digit);
    });
  }
};
var CountdownTimerFlipDigit = class extends HTMLElement {
  static observedAttributes = ["number"];
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(document.createRange().createContextualFragment("<div><slot></slot></div>"));
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === null || oldValue === newValue || !this.hasAttribute("animate")) {
      return this.textContent = newValue;
    }
    await animate15(this.shadowRoot.firstElementChild, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-8px)"] }, { duration: 0.3, easing: [0.64, 0, 0.78, 0] }).finished;
    this.textContent = newValue;
    animate15(this.shadowRoot.firstElementChild, { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0px)"] }, { duration: 0.3, easing: [0.22, 1, 0.36, 1] });
  }
};
if (!window.customElements.get("countdown-timer")) {
  window.customElements.define("countdown-timer", CountdownTimer);
}
if (!window.customElements.get("countdown-timer-flip")) {
  window.customElements.define("countdown-timer-flip", CountdownTimerFlip);
}
if (!window.customElements.get("countdown-timer-flip-digit")) {
  window.customElements.define("countdown-timer-flip-digit", CountdownTimerFlipDigit);
}

// js/sections/customer.js
import { animate as animate16 } from "vendor";
var _AccountLogin_instances, loginForm_get, recoverForm_get, switchForm_fn;
var AccountLogin = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _AccountLogin_instances);
    window.addEventListener("hashchange", __privateMethod(this, _AccountLogin_instances, switchForm_fn).bind(this));
    if (window.location.hash === "#recover") {
      __privateGet(this, _AccountLogin_instances, loginForm_get).hidden = true;
      __privateGet(this, _AccountLogin_instances, recoverForm_get).hidden = false;
    }
  }
};
_AccountLogin_instances = new WeakSet();
loginForm_get = function() {
  return this.querySelector("#login");
};
recoverForm_get = function() {
  return this.querySelector("#recover");
};
switchForm_fn = async function() {
  const fromForm = window.location.hash === "#recover" ? __privateGet(this, _AccountLogin_instances, loginForm_get) : __privateGet(this, _AccountLogin_instances, recoverForm_get), toForm = window.location.hash === "#recover" ? __privateGet(this, _AccountLogin_instances, recoverForm_get) : __privateGet(this, _AccountLogin_instances, loginForm_get);
  await animate16(fromForm, { transform: ["translateY(0)", "translateY(30px)"], opacity: [1, 0] }, { duration: 0.6, easing: "ease" }).finished;
  fromForm.hidden = true;
  toForm.hidden = false;
  await animate16(toForm, { transform: ["translateY(30px)", "translateY(0)"], opacity: [0, 1] }, { duration: 0.6, easing: "ease" });
};
if (!window.customElements.get("account-login")) {
  window.customElements.define("account-login", AccountLogin);
}

// js/sections/faq.js
var _observer, _FaqToc_instances, onObserve_fn;
var FaqToc = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _FaqToc_instances);
    __privateAdd(this, _observer, new IntersectionObserver(__privateMethod(this, _FaqToc_instances, onObserve_fn).bind(this), { rootMargin: "0px 0px -70% 0px" }));
  }
  connectedCallback() {
    this.anchoredElements.forEach((anchoredElement) => __privateGet(this, _observer).observe(anchoredElement));
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
  }
  get anchorLinks() {
    return Array.from(this.querySelectorAll('a[href^="#"]'));
  }
  get anchoredElements() {
    return this.anchorLinks.map((anchor) => document.querySelector(anchor.getAttribute("href")));
  }
};
_observer = new WeakMap();
_FaqToc_instances = new WeakSet();
onObserve_fn = function(entries) {
  for (const entry of entries) {
    const anchorLink = this.anchorLinks.find((anchor) => anchor.getAttribute("href") === `#${entry.target.id}`);
    if (!entry.isIntersecting && anchorLink.classList.contains("is-active")) {
      continue;
    }
    if (entry.isIntersecting) {
      this.anchorLinks.forEach((link) => link.classList.toggle("is-active", link === anchorLink));
    }
  }
};
if (!window.customElements.get("faq-toc")) {
  window.customElements.define("faq-toc", FaqToc);
}

// js/sections/featured-collections.js
import { animate as animate17 } from "vendor";
var FeaturedCollectionsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () => animate17(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(15px)"] }, { duration: 0.3, easing: "ease-in" }),
      enterControls: () => animate17(toSlide, { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] }, { duration: 0.2, delay: 0.2, easing: "ease-out" })
    };
  }
};
if (!window.customElements.get("featured-collections-carousel")) {
  window.customElements.define("featured-collections-carousel", FeaturedCollectionsCarousel);
}

// js/sections/header.js
import { animate as animate18, timeline as timeline9, stagger as stagger3, Delegate as Delegate8 } from "vendor";
var _headerTrackerIntersectionObserver, _abortController9, _scrollYTrackingPosition, _isVisible2, _Header_instances, onHeaderTrackerIntersection_fn, detectMousePosition_fn, detectScrollDirection_fn, setVisibility_fn;
var Header = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Header_instances);
    __privateAdd(this, _headerTrackerIntersectionObserver, new IntersectionObserver(__privateMethod(this, _Header_instances, onHeaderTrackerIntersection_fn).bind(this)));
    __privateAdd(this, _abortController9);
    __privateAdd(this, _scrollYTrackingPosition, 0);
    __privateAdd(this, _isVisible2, true);
  }
  connectedCallback() {
    __privateSet(this, _abortController9, new AbortController());
    __privateGet(this, _headerTrackerIntersectionObserver).observe(document.getElementById("header-scroll-tracker"));
    if (this.hasAttribute("hide-on-scroll")) {
      window.addEventListener("scroll", __privateMethod(this, _Header_instances, detectScrollDirection_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
      window.addEventListener("pointermove", __privateMethod(this, _Header_instances, detectMousePosition_fn).bind(this), { signal: __privateGet(this, _abortController9).signal });
    }
  }
  disconnectedCallback() {
    __privateGet(this, _abortController9).abort();
  }
};
_headerTrackerIntersectionObserver = new WeakMap();
_abortController9 = new WeakMap();
_scrollYTrackingPosition = new WeakMap();
_isVisible2 = new WeakMap();
_Header_instances = new WeakSet();
onHeaderTrackerIntersection_fn = function(entries) {
  this.classList.toggle("is-solid", !entries[0].isIntersecting);
};
detectMousePosition_fn = function(event) {
  if (event.clientY < 100 && window.matchMedia("screen and (pointer: fine)").matches) {
    __privateMethod(this, _Header_instances, setVisibility_fn).call(this, true);
    __privateSet(this, _scrollYTrackingPosition, 0);
  }
};
detectScrollDirection_fn = function() {
  let isVisible;
  if (window.scrollY > __privateGet(this, _scrollYTrackingPosition) && window.scrollY - __privateGet(this, _scrollYTrackingPosition) > 100) {
    isVisible = false;
    __privateSet(this, _scrollYTrackingPosition, window.scrollY);
  } else if (window.scrollY < __privateGet(this, _scrollYTrackingPosition)) {
    __privateSet(this, _scrollYTrackingPosition, window.scrollY);
    isVisible = true;
  }
  if (isVisible !== void 0) {
    __privateMethod(this, _Header_instances, setVisibility_fn).call(this, isVisible);
  }
};
setVisibility_fn = function(isVisible) {
  if (isVisible !== __privateGet(this, _isVisible2)) {
    if (!isVisible && this.querySelectorAll("[open]").length > 0) {
      return;
    }
    __privateSet(this, _isVisible2, isVisible);
    document.documentElement.style.setProperty("--header-is-visible", isVisible ? "1" : "0");
    this.classList.toggle("is-hidden", !isVisible);
  }
};
var DropdownMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    let menuItemsSequence = [];
    if (window.themeVariables.settings.staggerMenuApparition) {
      menuItemsSequence = [this.contentElement.querySelectorAll(":scope > li"), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: stagger3(0.1) }];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      menuItemsSequence
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }]
    ]);
  }
};
var MegaMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    const linklists = Array.from(this.contentElement.querySelectorAll(".mega-menu__linklist > li"));
    let menuItemsSequence = [];
    if (window.themeVariables.settings.staggerMenuApparition) {
      menuItemsSequence = [
        { name: "content", at: "-0.5" },
        [linklists, { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.3, at: "content", delay: stagger3(0.1) }],
        [this.contentElement.querySelector(".mega-menu__promo"), { opacity: [0, 1] }, { duration: 0.3, at: "-0.15" }]
      ];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      ...menuItemsSequence
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }]
    ]);
  }
};
var _HeaderSearch_instances, calculateMaxHeight_fn;
var HeaderSearch = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _HeaderSearch_instances);
    this.addEventListener("dialog:before-show", __privateMethod(this, _HeaderSearch_instances, calculateMaxHeight_fn).bind(this));
  }
  get shadowDomTemplate() {
    return "header-search-default-template";
  }
  get shouldLock() {
    return true;
  }
  createEnterAnimationControls() {
    return timeline9([
      [this.getShadowPartByName("overlay"), { opacity: [0, 1] }, { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { opacity: [0, 1], transform: ["translateY(calc(-1 * var(--header-height)))", "translateY(0)"] }, { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
  createLeaveAnimationControls() {
    return timeline9([
      [this.getShadowPartByName("overlay"), { opacity: [1, 0] }, { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] }],
      [this.getShadowPartByName("content"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(calc(-1 * var(--header-height)))"] }, { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] }]
    ]);
  }
};
_HeaderSearch_instances = new WeakSet();
calculateMaxHeight_fn = function() {
  const boundingRect = this.getBoundingClientRect(), maxHeight = window.innerHeight - boundingRect.top;
  this.style.setProperty("--header-search-max-height", `${maxHeight}px`);
};
var _collapsiblePanel, _buttonElements, _HeaderSidebar_instances, openCollapsiblePanel_fn, onSidebarBeforeShow_fn, onSidebarAfterShow_fn, onSidebarBeforeHide_fn, onSidebarAfterHide_fn;
var HeaderSidebar = class extends Drawer {
  constructor() {
    super();
    __privateAdd(this, _HeaderSidebar_instances);
    __privateAdd(this, _collapsiblePanel);
    __privateAdd(this, _buttonElements);
    this.addEventListener("dialog:before-show", __privateMethod(this, _HeaderSidebar_instances, onSidebarBeforeShow_fn));
    this.addEventListener("dialog:after-show", __privateMethod(this, _HeaderSidebar_instances, onSidebarAfterShow_fn));
    this.addEventListener("dialog:before-hide", __privateMethod(this, _HeaderSidebar_instances, onSidebarBeforeHide_fn));
    this.addEventListener("dialog:after-hide", __privateMethod(this, _HeaderSidebar_instances, onSidebarAfterHide_fn));
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _collapsiblePanel, this.querySelector('[slot="collapsible-panel"]'));
    __privateSet(this, _buttonElements, Array.from(this.querySelectorAll(".header-sidebar__main-panel .header-sidebar__linklist [aria-controls]")));
    __privateGet(this, _buttonElements).forEach((button) => button.addEventListener("click", __privateMethod(this, _HeaderSidebar_instances, openCollapsiblePanel_fn).bind(this), { signal: this.abortController.signal }));
  }
  revealItems(withDelay = false) {
    return timeline9([
      [this.querySelector(".header-sidebar__main-panel"), { opacity: 1, transform: "translateX(0)" }, { duration: 0, delay: withDelay ? 0.5 : 0 }],
      [this.querySelectorAll(".header-sidebar__main-panel .header-sidebar__linklist li"), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: window.themeVariables.settings.staggerMenuApparition ? stagger3(0.1) : 0 }],
      [this.querySelector(".header-sidebar__footer"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.3 }]
    ]);
  }
};
_collapsiblePanel = new WeakMap();
_buttonElements = new WeakMap();
_HeaderSidebar_instances = new WeakSet();
openCollapsiblePanel_fn = function(event) {
  __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", button === event.currentTarget ? "true" : "false"));
  __privateGet(this, _collapsiblePanel)?.setAttribute("aria-activedescendant", event.currentTarget.getAttribute("aria-controls"));
  if (matchesMediaQuery("md-max")) {
    animate18(this.querySelector(".header-sidebar__main-panel"), { opacity: [1, 0], transform: ["translateX(0)", "translateX(-10px)"] }, { duration: 0.25 });
  }
};
onSidebarBeforeShow_fn = function() {
  animate18(this.querySelector(".header-sidebar__main-panel"), { opacity: 0, transform: "translateX(0)" }, { duration: 0 });
};
onSidebarAfterShow_fn = function() {
  this.revealItems();
};
onSidebarBeforeHide_fn = function() {
  if (matchesMediaQuery("md")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute("aria-activedescendant");
    __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", "false"));
  }
};
onSidebarAfterHide_fn = function() {
  if (matchesMediaQuery("md-max")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute("aria-activedescendant");
    __privateGet(this, _buttonElements).forEach((button) => button.setAttribute("aria-expanded", "false"));
  }
  Array.from(this.querySelectorAll("details")).forEach((detail) => detail.open = false);
};
var _sidebarDelegate, _HeaderSidebarCollapsiblePanel_instances, closePanel_fn, switchPanel_fn;
var HeaderSidebarCollapsiblePanel = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _HeaderSidebarCollapsiblePanel_instances);
    __privateAdd(this, _sidebarDelegate, new Delegate8(this));
    __privateGet(this, _sidebarDelegate).on("click", '[data-action="close-panel"]', __privateMethod(this, _HeaderSidebarCollapsiblePanel_instances, closePanel_fn).bind(this));
  }
  static get observedAttributes() {
    return [...super.observedAttributes, "aria-activedescendant"];
  }
  hideForOutsideClickTarget(target) {
    return false;
  }
  allowOutsideClickForTarget(target) {
    return target.closest(".header-sidebar") !== void 0;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [this, { opacity: [0, 1], transform: "translateX(0)" }, { duration: 0.3 }]
      ]);
    } else {
      return timeline9([
        [this, { opacity: [0, 1], transform: ["translateX(0)", "translateX(calc(var(--transform-logical-flip) * 100%)"] }, { duration: 0.3 }]
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [this, { opacity: [1, 0], transform: ["translateX(0)", "translateX(10px)"] }, { duration: 0.3 }]
      ]);
    } else {
      return timeline9([
        [this, { opacity: [1, 0], transform: ["translateX(calc(var(--transform-logical-flip) * 100%))", "translateX(0)"] }, { duration: 0.3 }]
      ]);
    }
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "aria-activedescendant") {
      if (oldValue === newValue) {
        return;
      }
      if (newValue !== null) {
        __privateMethod(this, _HeaderSidebarCollapsiblePanel_instances, switchPanel_fn).call(this, this.querySelector(`#${oldValue}`), this.querySelector(`#${newValue}`));
      } else {
        await this.hide();
        Array.from(this.querySelectorAll(".header-sidebar__sub-panel")).forEach((subPanel) => subPanel.hidden = true);
      }
    }
  }
};
_sidebarDelegate = new WeakMap();
_HeaderSidebarCollapsiblePanel_instances = new WeakSet();
closePanel_fn = function() {
  this.removeAttribute("aria-activedescendant");
  this.closest("header-sidebar").revealItems(true);
};
switchPanel_fn = async function(fromPanel, toPanel) {
  if (!this.open) {
    await this.show();
  }
  if (fromPanel) {
    await animate18(fromPanel, { opacity: [1, 0] }, { duration: 0.15 }).finished;
    fromPanel.hidden = true;
    Array.from(fromPanel.querySelectorAll("details")).forEach((detail) => detail.open = false);
  }
  toPanel.hidden = false;
  const listSelector = matchesMediaQuery("md-max") ? ".header-sidebar__back-button, .header-sidebar__linklist li" : ".header-sidebar__linklist li";
  timeline9([
    [toPanel, { opacity: 1 }, { duration: 0 }],
    [toPanel.querySelectorAll(listSelector), { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.15, at: "-0.15", delay: window.themeVariables.settings.staggerMenuApparition ? stagger3(0.1) : 0 }],
    [toPanel.querySelector(".header-sidebar__promo"), { opacity: [0, 1] }, { duration: 0.45 }]
  ]);
};
if (!window.customElements.get("x-header")) {
  window.customElements.define("x-header", Header);
}
if (!window.customElements.get("dropdown-menu-disclosure")) {
  window.customElements.define("dropdown-menu-disclosure", DropdownMenuDisclosure);
}
if (!window.customElements.get("mega-menu-disclosure")) {
  window.customElements.define("mega-menu-disclosure", MegaMenuDisclosure);
}
if (!window.customElements.get("header-search")) {
  window.customElements.define("header-search", HeaderSearch);
}
if (!window.customElements.get("header-sidebar")) {
  window.customElements.define("header-sidebar", HeaderSidebar);
}
if (!window.customElements.get("header-sidebar-collapsible-panel")) {
  window.customElements.define("header-sidebar-collapsible-panel", HeaderSidebarCollapsiblePanel);
}

// js/sections/image-with-text.js
import { animate as animate19, inView as inView13 } from "vendor";
var _ImageWithText_instances, onBecameVisible_fn;
var ImageWithText = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ImageWithText_instances);
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe")) {
      inView13(this.querySelector('[reveal-on-scroll="true"]'), ({ target }) => __privateMethod(this, _ImageWithText_instances, onBecameVisible_fn).call(this, target), { margin: "-200px 0px 0px 0px" });
    }
  }
};
_ImageWithText_instances = new WeakSet();
onBecameVisible_fn = async function(target) {
  await imageLoaded(target);
  const fromValue = (window.direction === "rtl" ? -1 : 1) * (matchesMediaQuery("md-max") ? 0.6 : 1) * (this.classList.contains("image-with-text--reverse") ? 25 : -25);
  animate19(
    target,
    { opacity: 1, transform: [`translateX(${fromValue}px)`, "translateX(0)"] },
    { easing: [0.215, 0.61, 0.355, 1] },
    { duration: 0.8 }
  );
};
if (!window.customElements.get("image-with-text")) {
  window.customElements.define("image-with-text", ImageWithText);
}

// js/sections/image-with-text-overlay.js
import { timeline as timeline10, inView as inView14 } from "vendor";
var _preventInitialTransition2, _ImageWithTextOverlay_instances, onBecameVisible_fn2;
var ImageWithTextOverlay = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ImageWithTextOverlay_instances);
    __privateAdd(this, _preventInitialTransition2, false);
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => __privateSet(this, _preventInitialTransition2, event.detail.load));
    }
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe") && this.getAttribute("reveal-on-scroll") === "true") {
      inView14(this, ({ target }) => __privateMethod(this, _ImageWithTextOverlay_instances, onBecameVisible_fn2).call(this, target), { amount: 0.05 });
    }
  }
};
_preventInitialTransition2 = new WeakMap();
_ImageWithTextOverlay_instances = new WeakSet();
onBecameVisible_fn2 = async function(target) {
  const media = target.querySelector(".content-over-media > picture img, .content-over-media > svg"), content = target.querySelector(".content-over-media > :not(picture, svg)");
  await imageLoaded(media);
  const animationControls = timeline10([
    [target, { opacity: 1 }],
    [media, { opacity: [0, 1], scale: [1.1, 1], easing: [0.215, 0.61, 0.355, 1], duration: 0.8 }],
    [content, { opacity: [0, 1], duration: 0.8 }]
  ]);
  if (__privateGet(this, _preventInitialTransition2)) {
    animationControls.finish();
  }
};
if (!window.customElements.get("image-with-text-overlay")) {
  window.customElements.define("image-with-text-overlay", ImageWithTextOverlay);
}

// js/sections/images-with-text-scroll.js
import { timeline as timeline11, animate as animate20, inView as inView15, scroll as scroll2, ScrollOffset } from "vendor";
var _itemElements, _imageElements, _textElements, _visibleImageElement, _ImagesWithTextScroll_instances, setupScrollObservers_fn, onBreakpointChanged_fn;
var ImagesWithTextScroll = class extends EffectCarousel {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ImagesWithTextScroll_instances);
    __privateAdd(this, _itemElements);
    __privateAdd(this, _imageElements);
    __privateAdd(this, _textElements);
    __privateAdd(this, _visibleImageElement);
  }
  // Reference to the currently visible image elements
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _itemElements, Array.from(this.querySelectorAll(".images-with-text-scroll__item")));
    __privateSet(this, _imageElements, Array.from(this.querySelectorAll(".images-with-text-scroll__image")));
    __privateSet(this, _textElements, Array.from(this.querySelectorAll(".images-with-text-scroll__text")));
    __privateSet(this, _visibleImageElement, __privateGet(this, _imageElements)[0]);
    inView15(this, () => {
      __privateGet(this, _imageElements).forEach((imageElement) => imageElement.removeAttribute("loading"));
    });
    if (matchesMediaQuery("md")) {
      __privateMethod(this, _ImagesWithTextScroll_instances, setupScrollObservers_fn).call(this);
    }
    mediaQueryListener("md", __privateMethod(this, _ImagesWithTextScroll_instances, onBreakpointChanged_fn).bind(this));
  }
  /**
   * Override the "cellSelector". In this component, what makes a "slide" (on mobile) is the piece of text
   */
  get cellSelector() {
    return ".images-with-text-scroll__item";
  }
  /**
   * Swipe should only be available on mobile and tablet, otherwise it is a scroll-based experience
   */
  get allowSwipe() {
    return matchesMediaQuery("md-max");
  }
  /**
   * Perform the mobile animation
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    let imageAnimationSequence = [], toSlideImage = toSlide.querySelector(".images-with-text-scroll__image");
    if (toSlideImage && toSlideImage !== __privateGet(this, _visibleImageElement)) {
      imageAnimationSequence.push(
        [__privateGet(this, _visibleImageElement), { opacity: [1, 0] }, { duration: 0.8, delay: 0.4 }],
        [toSlideImage, { opacity: [0, 1] }, { duration: 0.8, at: "<", delay: 0.4 }]
      );
      __privateSet(this, _visibleImageElement, toSlideImage);
    }
    return timeline11([
      ...imageAnimationSequence,
      [fromSlide.querySelector(".images-with-text-scroll__text"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(-15px)"] }, { duration: 0.4, at: "<", easing: [0.55, 0.055, 0.675, 0.19] }],
      [toSlide.querySelector(".images-with-text-scroll__text"), { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] }, { duration: 0.4, at: "+0.4", easing: [0.25, 0.46, 0.45, 0.94] }]
    ]);
  }
};
_itemElements = new WeakMap();
_imageElements = new WeakMap();
_textElements = new WeakMap();
_visibleImageElement = new WeakMap();
_ImagesWithTextScroll_instances = new WeakSet();
/**
 * Setup the different observers for the desktop experience
 */
setupScrollObservers_fn = function() {
  __privateGet(this, _textElements).forEach((textElement) => {
    scroll2(animate20(textElement, { opacity: [0, 0.25, 1, 0.25, 0] }), { target: textElement, offset: ScrollOffset.Any });
  });
  scroll2((info) => {
    const index = Math.min(Math.floor(info.y.progress / (1 / __privateGet(this, _itemElements).length)), __privateGet(this, _itemElements).length - 1), toImage = __privateGet(this, _itemElements)[index].querySelector(".images-with-text-scroll__image");
    if (toImage && toImage !== __privateGet(this, _visibleImageElement)) {
      timeline11([
        [__privateGet(this, _visibleImageElement), { opacity: [1, 0] }, { duration: 0.25 }],
        [toImage, { opacity: [0, 1] }, { duration: 0.25, at: "<" }]
      ]);
      __privateSet(this, _visibleImageElement, toImage);
    }
  }, { target: this, offset: ["start center", "end center"] });
};
/**
 * Due to how different the experience is on mobile and desktop, we use an observer to toggle between one mode and other
 */
onBreakpointChanged_fn = function(event) {
  if (event.matches) {
    __privateGet(this, _imageElements).forEach((image) => image.style = null);
    __privateGet(this, _textElements).forEach((text) => text.style = null);
    __privateMethod(this, _ImagesWithTextScroll_instances, setupScrollObservers_fn).call(this);
  } else {
    this.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  }
};
if (!window.customElements.get("images-with-text-scroll")) {
  window.customElements.define("images-with-text-scroll", ImagesWithTextScroll);
}

// js/sections/main-article.js
import { scroll as scroll3 } from "vendor";
var ArticleToolbar = class extends HTMLElement {
  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      scroll3((info) => {
        this.classList.toggle("is-visible", info.y.progress > 0 && info.y.progress < 1);
      }, {
        target: this.closest(".shopify-section"),
        offset: ["100px start", "end start"]
      });
    }
  }
};
if (!window.customElements.get("article-toolbar")) {
  window.customElements.define("article-toolbar", ArticleToolbar);
}

// js/sections/media-grid.js
import { animate as animate21, inView as inView16 } from "vendor";
var _MediaGrid_instances, onReveal_fn;
var MediaGrid = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _MediaGrid_instances);
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe")) {
      inView16(this.querySelectorAll('[reveal-on-scroll="true"]'), __privateMethod(this, _MediaGrid_instances, onReveal_fn).bind(this), { margin: "-200px 0px 0px 0px" });
    }
  }
};
_MediaGrid_instances = new WeakSet();
onReveal_fn = async function(entry) {
  await imageLoaded(entry.target.querySelector(":scope > img"));
  animate21(entry.target, { opacity: [0, 1] }, { duration: 0.35, easing: "ease" });
};
if (!window.customElements.get("media-grid")) {
  window.customElements.define("media-grid", MediaGrid);
}

// js/sections/multi-column.js
var MultiColumn = class extends HTMLElement {
  constructor() {
    super();
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => {
        event.target.scrollIntoView({ inline: "center", block: "nearest", behavior: event.detail["load"] ? "auto" : "smooth" });
      });
    }
  }
};
if (!window.customElements.get("multi-column")) {
  window.customElements.define("multi-column", MultiColumn);
}

// js/sections/multiple-media-with-text.js
import { timeline as timeline12, inView as inView17 } from "vendor";
var _preventInitialTransition3, _MultipleMediaWithText_instances, onBecameVisible_fn3;
var MultipleMediaWithText = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _MultipleMediaWithText_instances);
    __privateAdd(this, _preventInitialTransition3, false);
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => __privateSet(this, _preventInitialTransition3, event.detail.load));
    }
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe") && this.hasAttribute("reveal-on-scroll")) {
      inView17(this, __privateMethod(this, _MultipleMediaWithText_instances, onBecameVisible_fn3).bind(this), { margin: "-10% 0px" });
    }
  }
};
_preventInitialTransition3 = new WeakMap();
_MultipleMediaWithText_instances = new WeakSet();
onBecameVisible_fn3 = function() {
  const timelineSequence = timeline12([
    [this, { opacity: 1 }, { duration: 0 }],
    "media",
    ...Array.from(this.querySelectorAll(".multiple-media-with-text__media-wrapper > *"), (media) => {
      return [media, { opacity: [0, 1], transform: ["rotate(0deg)", `rotate(${media.style.getPropertyValue("--media-rotate")})`] }, { duration: 0.5, at: "media" }];
    }),
    [this.querySelector(".multiple-media-with-text__content-wrapper"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.5 }]
  ]);
  if (__privateGet(this, _preventInitialTransition3)) {
    timelineSequence.finish();
  }
};
if (!window.customElements.get("multiple-media-with-text")) {
  window.customElements.define("multiple-media-with-text", MultipleMediaWithText);
}

// js/sections/newsletter-popup.js
var NewsletterPopup = class extends PopIn {
  connectedCallback() {
    super.connectedCallback();
    if (this.shouldAppearAutomatically) {
      setTimeout(() => this.show(), this.apparitionDelay);
    }
  }
  get apparitionDelay() {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3;
  }
  get shouldAppearAutomatically() {
    return !(localStorage.getItem("theme:popup-filled") === "true" || this.hasAttribute("only-once") && localStorage.getItem("theme:popup-appeared") === "true");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "open" && this.open) {
      localStorage.setItem("theme:popup-appeared", "true");
    }
  }
};
if (!window.customElements.get("newsletter-popup")) {
  window.customElements.define("newsletter-popup", NewsletterPopup);
}

// js/sections/privacy-banner.js
import { Delegate as Delegate9 } from "vendor";
var _delegate7, _PrivacyBanner_instances, onConsentLibraryLoaded_fn, acceptPolicy_fn, declinePolicy_fn;
var PrivacyBanner = class extends PopIn {
  constructor() {
    super();
    __privateAdd(this, _PrivacyBanner_instances);
    __privateAdd(this, _delegate7, new Delegate9(this));
    window.Shopify.loadFeatures([{
      name: "consent-tracking-api",
      version: "0.1",
      onLoad: __privateMethod(this, _PrivacyBanner_instances, onConsentLibraryLoaded_fn).bind(this)
    }]);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _delegate7).on("click", '[data-action="accept"]', __privateMethod(this, _PrivacyBanner_instances, acceptPolicy_fn).bind(this));
    __privateGet(this, _delegate7).on("click", '[data-action="decline"]', __privateMethod(this, _PrivacyBanner_instances, declinePolicy_fn).bind(this));
  }
  disconnectedCallback() {
    __privateGet(this, _delegate7).off();
  }
};
_delegate7 = new WeakMap();
_PrivacyBanner_instances = new WeakSet();
onConsentLibraryLoaded_fn = function() {
  if (window.Shopify.customerPrivacy?.shouldShowBanner()) {
    this.show();
  }
};
acceptPolicy_fn = function() {
  window.Shopify.customerPrivacy?.setTrackingConsent(true, this.hide.bind(this));
};
declinePolicy_fn = function() {
  window.Shopify.customerPrivacy?.setTrackingConsent(false, this.hide.bind(this));
};
if (!window.customElements.get("privacy-banner")) {
  window.customElements.define("privacy-banner", PrivacyBanner);
}

// js/sections/product.js
var _intersectionObserver3, _formElement, _footerElement, _latestFooterCondition, _latestFormCondition, _ProductStickyBar_instances, onFormVisibilityChange_fn;
var ProductStickyBar = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductStickyBar_instances);
    __privateAdd(this, _intersectionObserver3, new IntersectionObserver(__privateMethod(this, _ProductStickyBar_instances, onFormVisibilityChange_fn).bind(this)));
    __privateAdd(this, _formElement);
    __privateAdd(this, _footerElement);
    __privateAdd(this, _latestFooterCondition, false);
    __privateAdd(this, _latestFormCondition, false);
  }
  connectedCallback() {
    __privateSet(this, _formElement, document.forms[this.getAttribute("form")]);
    __privateSet(this, _footerElement, document.querySelector(".shopify-section--footer"));
    if (__privateGet(this, _formElement)) {
      __privateGet(this, _intersectionObserver3).observe(__privateGet(this, _formElement));
      __privateGet(this, _intersectionObserver3).observe(__privateGet(this, _footerElement));
    }
  }
  disconnectedCallback() {
    __privateGet(this, _intersectionObserver3).disconnect();
  }
};
_intersectionObserver3 = new WeakMap();
_formElement = new WeakMap();
_footerElement = new WeakMap();
_latestFooterCondition = new WeakMap();
_latestFormCondition = new WeakMap();
_ProductStickyBar_instances = new WeakSet();
onFormVisibilityChange_fn = function(entries) {
  const [formEntry, footerEntry] = [entries.find((entry) => entry.target === __privateGet(this, _formElement)), entries.find((entry) => entry.target === __privateGet(this, _footerElement))];
  if (formEntry) {
    __privateSet(this, _latestFormCondition, !formEntry.isIntersecting && formEntry.boundingClientRect.bottom < 0);
  }
  if (footerEntry) {
    __privateSet(this, _latestFooterCondition, !footerEntry.isIntersecting);
  }
  this.classList.toggle("is-visible", __privateGet(this, _latestFooterCondition) && __privateGet(this, _latestFormCondition));
};
if (!window.customElements.get("product-sticky-bar")) {
  window.customElements.define("product-sticky-bar", ProductStickyBar);
}

// js/sections/product-recommendations.js
var _isLoaded, _ProductRecommendations_instances, loadRecommendations_fn;
var ProductRecommendations = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProductRecommendations_instances);
    __privateAdd(this, _isLoaded, false);
  }
  connectedCallback() {
    __privateMethod(this, _ProductRecommendations_instances, loadRecommendations_fn).call(this);
  }
};
_isLoaded = new WeakMap();
_ProductRecommendations_instances = new WeakSet();
loadRecommendations_fn = async function() {
  if (__privateGet(this, _isLoaded)) {
    return;
  }
  __privateSet(this, _isLoaded, true);
  const section = this.closest(".shopify-section"), intent = this.getAttribute("intent") || "related", url = `${Shopify.routes.root}recommendations/products?product_id=${this.getAttribute("product")}&limit=${this.getAttribute("limit") || 4}&section_id=${extractSectionId(section)}&intent=${intent}`, response = await fetch(url, { priority: intent === "related" ? "low" : "auto" });
  const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), productRecommendationsElement = tempDiv.querySelector("product-recommendations");
  if (productRecommendationsElement.childElementCount > 0) {
    this.replaceChildren(...document.importNode(productRecommendationsElement, true).childNodes);
    this.hidden = false;
  } else {
    this.remove();
  }
};
if (!window.customElements.get("product-recommendations")) {
  window.customElements.define("product-recommendations", ProductRecommendations);
}

// js/sections/recently-viewed-products.js
var _isLoaded2, _RecentlyViewedProducts_instances, searchQueryString_get, loadProducts_fn;
var RecentlyViewedProducts = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _RecentlyViewedProducts_instances);
    __privateAdd(this, _isLoaded2, false);
  }
  connectedCallback() {
    __privateMethod(this, _RecentlyViewedProducts_instances, loadProducts_fn).call(this);
  }
};
_isLoaded2 = new WeakMap();
_RecentlyViewedProducts_instances = new WeakSet();
searchQueryString_get = function() {
  const items = new Set(JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]"));
  if (this.hasAttribute("exclude-id")) {
    items.delete(parseInt(this.getAttribute("exclude-id")));
  }
  return Array.from(items.values(), (item) => `id:${item}`).slice(0, parseInt(this.getAttribute("products-count"))).join(" OR ");
};
loadProducts_fn = async function() {
  if (__privateGet(this, _isLoaded2)) {
    return;
  }
  __privateSet(this, _isLoaded2, true);
  const section = this.closest(".shopify-section"), url = `${Shopify.routes.root}search?type=product&q=${__privateGet(this, _RecentlyViewedProducts_instances, searchQueryString_get)}&section_id=${extractSectionId(section)}`, response = await fetch(url, { priority: "low" });
  const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), recentlyViewedProductsElement = tempDiv.querySelector("recently-viewed-products");
  if (recentlyViewedProductsElement.childElementCount > 0) {
    this.replaceChildren(...document.importNode(recentlyViewedProductsElement, true).childNodes);
  } else {
    section.remove();
  }
};
if (!window.customElements.get("recently-viewed-products")) {
  window.customElements.define("recently-viewed-products", RecentlyViewedProducts);
}

// js/sections/shop-the-look.js
import { animate as animate22, timeline as timeline13 } from "vendor";
var _controlledPopover, _selectedHotSpot, _ShopTheLookMobileCarousel_instances, setInitialPosition_fn, onSpotSelected_fn, onUpdateHotSpotPosition_fn, onLookChanged_fn, changeLookFocalPoint_fn, restorePosition_fn;
var ShopTheLookMobileCarousel = class extends ScrollCarousel {
  constructor() {
    super();
    __privateAdd(this, _ShopTheLookMobileCarousel_instances);
    __privateAdd(this, _controlledPopover);
    __privateAdd(this, _selectedHotSpot);
    this.addEventListener("carousel:change", __privateMethod(this, _ShopTheLookMobileCarousel_instances, onLookChanged_fn));
    Array.from(this.querySelectorAll(".shop-the-look__hot-spot-list")).forEach((list) => {
      list.carousel.addEventListener("carousel:select", __privateMethod(this, _ShopTheLookMobileCarousel_instances, onSpotSelected_fn).bind(this));
      list.carousel.addEventListener("carousel:change", () => __privateMethod(this, _ShopTheLookMobileCarousel_instances, onUpdateHotSpotPosition_fn).call(this, list));
    });
    Array.from(this.querySelectorAll(".shop-the-look__popover")).forEach((popover) => {
      popover.addEventListener("dialog:before-show", __privateMethod(this, _ShopTheLookMobileCarousel_instances, changeLookFocalPoint_fn).bind(this));
      popover.addEventListener("dialog:before-hide", __privateMethod(this, _ShopTheLookMobileCarousel_instances, restorePosition_fn).bind(this));
    });
  }
  connectedCallback() {
    super.connectedCallback();
    __privateMethod(this, _ShopTheLookMobileCarousel_instances, setInitialPosition_fn).call(this);
  }
  get isExpanded() {
    return this.classList.contains("is-expanded");
  }
};
_controlledPopover = new WeakMap();
_selectedHotSpot = new WeakMap();
_ShopTheLookMobileCarousel_instances = new WeakSet();
setInitialPosition_fn = function() {
  __privateSet(this, _selectedHotSpot, this.selectedCell.querySelector('.shop-the-look__hot-spot[aria-current="true"]'));
  __privateMethod(this, _ShopTheLookMobileCarousel_instances, onLookChanged_fn).call(this);
};
onSpotSelected_fn = function() {
  if (!this.isExpanded) {
    document.getElementById(this.selectedCell.getAttribute("data-popover-id")).show();
  }
};
onUpdateHotSpotPosition_fn = function(list) {
  __privateSet(this, _selectedHotSpot, list.querySelector('.shop-the-look__hot-spot[aria-current="true"]'));
  if (this.isExpanded) {
    __privateMethod(this, _ShopTheLookMobileCarousel_instances, changeLookFocalPoint_fn).call(this);
  }
};
onLookChanged_fn = function() {
  const popoverId = this.selectedCell.getAttribute("data-popover-id");
  __privateSet(this, _controlledPopover, document.getElementById(popoverId));
  this.nextElementSibling.setAttribute("aria-controls", popoverId);
};
changeLookFocalPoint_fn = function() {
  const scale = window.innerWidth / this.selectedCell.clientWidth, remainingSpace = window.innerHeight - __privateGet(this, _controlledPopover).shadowRoot.querySelector('[part="base"]').clientHeight, imageHeightAfterScale = Math.round(this.selectedCell.querySelector(".shop-the-look__image-wrapper").clientHeight * scale), outsideViewportImageHeight = Math.max(imageHeightAfterScale - remainingSpace, 0), insideViewportImageHeight = imageHeightAfterScale - outsideViewportImageHeight, hotSpotFocalPoint = Math.round((__privateGet(this, _selectedHotSpot).offsetTop + __privateGet(this, _selectedHotSpot).clientHeight / 2) * scale), offsetToMove = Math.round(hotSpotFocalPoint - insideViewportImageHeight / 2), minTranslateY = Math.round(-(this.parentElement.getBoundingClientRect().top - (imageHeightAfterScale - this.selectedCell.offsetHeight) / 2)), maxTranslateY = Math.round(minTranslateY - outsideViewportImageHeight), translateY = Math.min(Math.max(minTranslateY - offsetToMove, maxTranslateY), minTranslateY);
  if (!this.isExpanded) {
    animate22(this, { transform: ["translateY(0) scale(1)", `translateY(${translateY}px) scale(${scale})`] }, { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] });
    document.documentElement.style.setProperty("--hide-header-group", "1");
  } else {
    animate22(this, { transform: `translateY(${translateY}px) scale(${scale})` }, { duration: 0.4, easing: "ease-in-out" });
  }
  this.classList.add("is-expanded");
};
restorePosition_fn = function() {
  animate22(this, { transform: "translateY(0) scale(1)" }, { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }).finished.then(() => {
    this.style.transform = null;
  });
  this.classList.remove("is-expanded");
  document.documentElement.style.removeProperty("--hide-header-group");
};
var _ShopTheLookProductListCarousel_instances, updateButtonLink_fn;
var ShopTheLookProductListCarousel = class extends EffectCarousel {
  constructor() {
    super();
    __privateAdd(this, _ShopTheLookProductListCarousel_instances);
    this.addEventListener("carousel:change", __privateMethod(this, _ShopTheLookProductListCarousel_instances, updateButtonLink_fn).bind(this));
  }
};
_ShopTheLookProductListCarousel_instances = new WeakSet();
updateButtonLink_fn = function(event) {
  const productCard = event.detail.cell.querySelector(".product-card");
  if (productCard.hasAttribute("handle")) {
    this.nextElementSibling.href = `${Shopify.routes.root}products/${productCard.getAttribute("handle")}`;
  }
};
var ShopTheLookDesktopCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate22(toSlide.querySelectorAll(".shop-the-look__item-content"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.5 });
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return timeline13([
      [fromSlide.querySelectorAll(".shop-the-look__item-content"), { opacity: [1, 0] }, { duration: 0.3 }],
      [fromSlide.querySelectorAll(".shop-the-look__image-wrapper > *"), { opacity: [1, 0], transform: ["translateX(0)", "translateX(-15px)"] }, { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] }],
      [toSlide.querySelectorAll(".shop-the-look__image-wrapper > *"), { opacity: [0, 1], transform: ["translateX(-15px)", "translateX(0)"] }, { duration: 0.5, at: "<" }],
      [toSlide.querySelectorAll(".shop-the-look__item-content"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.5, at: "-0.1" }]
    ]);
  }
};
var ShopTheLookPopover = class extends Popover {
  hideForOutsideClickTarget(target) {
    return false;
  }
  allowOutsideClickForTarget(target) {
    return target.classList.contains("shop-the-look__hot-spot");
  }
};
if (!window.customElements.get("shop-the-look-mobile-carousel")) {
  window.customElements.define("shop-the-look-mobile-carousel", ShopTheLookMobileCarousel);
}
if (!window.customElements.get("shop-the-look-product-list-carousel")) {
  window.customElements.define("shop-the-look-product-list-carousel", ShopTheLookProductListCarousel);
}
if (!window.customElements.get("shop-the-look-desktop-carousel")) {
  window.customElements.define("shop-the-look-desktop-carousel", ShopTheLookDesktopCarousel);
}
if (!window.customElements.get("shop-the-look-popover")) {
  window.customElements.define("shop-the-look-popover", ShopTheLookPopover);
}

// js/sections/slideshow.js
import { timeline as timeline14, Delegate as Delegate10 } from "vendor";
var _delegate8, _onVideoEndedListener, _SlideshowCarousel_instances, autoplayPauseOnVideo_get, getSlideEnteringSequence_fn, getSlideLeavingSequence_fn, muteVideo_fn, unmuteVideo_fn, onVolumeChange_fn, onSlideSettle_fn, onVideoEnded_fn, onNextButtonClicked_fn, handleAutoplayProgress_fn;
var SlideshowCarousel = class extends EffectCarousel {
  constructor() {
    super();
    __privateAdd(this, _SlideshowCarousel_instances);
    __privateAdd(this, _delegate8, new Delegate10(this));
    __privateAdd(this, _onVideoEndedListener, __privateMethod(this, _SlideshowCarousel_instances, onVideoEnded_fn).bind(this));
    __privateGet(this, _delegate8).on("click", '[data-action="navigate-next"]', __privateMethod(this, _SlideshowCarousel_instances, onNextButtonClicked_fn).bind(this));
    __privateGet(this, _delegate8).on("click", '[data-action="unmute"]', __privateMethod(this, _SlideshowCarousel_instances, unmuteVideo_fn).bind(this));
    __privateGet(this, _delegate8).on("click", '[data-action="mute"]', __privateMethod(this, _SlideshowCarousel_instances, muteVideo_fn).bind(this));
    this.addEventListener("volumechange", __privateMethod(this, _SlideshowCarousel_instances, onVolumeChange_fn), { capture: true });
    this.addEventListener("carousel:settle", __privateMethod(this, _SlideshowCarousel_instances, onSlideSettle_fn));
    if (this.hasAttribute("autoplay") && this.player) {
      this.player.addEventListener("player:start", __privateMethod(this, _SlideshowCarousel_instances, handleAutoplayProgress_fn).bind(this));
      this.player.addEventListener("player:stop", __privateMethod(this, _SlideshowCarousel_instances, handleAutoplayProgress_fn).bind(this));
      this.player.addEventListener("player:visibility-pause", __privateMethod(this, _SlideshowCarousel_instances, handleAutoplayProgress_fn).bind(this));
      this.player.addEventListener("player:visibility-resume", __privateMethod(this, _SlideshowCarousel_instances, handleAutoplayProgress_fn).bind(this));
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate8).destroy();
  }
  /**
   * Check when the media is fully loaded so that we can initiate the switch
   */
  async createOnBecameVisibleAnimationControls(toSlide) {
    if (toSlide.getAttribute("media-type") === "image") {
      await imageLoaded(toSlide.querySelectorAll("img"));
    } else {
      await videoLoaded(toSlide.querySelectorAll("video"));
    }
    if (toSlide.hasAttribute("reveal-on-scroll")) {
      return timeline14([
        ...__privateMethod(this, _SlideshowCarousel_instances, getSlideEnteringSequence_fn).call(this, toSlide)
      ]);
    }
    return { finished: Promise.resolve() };
  }
  /**
   * Create the animation when it changes from one slide to another, by making sure to properly handling the videos
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    const fromVideo = Array.from(fromSlide.querySelectorAll("video")), toVideo = Array.from(toSlide.querySelectorAll("video")).filter((video) => video.offsetParent);
    fromSlide.removeEventListener("ended", __privateGet(this, _onVideoEndedListener), { capture: true });
    fromVideo.forEach((video) => {
      video.muted = true;
      video.pause();
    });
    toVideo.forEach((video) => {
      video.muted = true;
      video.currentTime = 0;
      video.play();
    });
    return {
      leaveControls: () => timeline14(__privateMethod(this, _SlideshowCarousel_instances, getSlideLeavingSequence_fn).call(this, fromSlide)),
      enterControls: () => timeline14(__privateMethod(this, _SlideshowCarousel_instances, getSlideEnteringSequence_fn).call(this, toSlide))
    };
  }
};
_delegate8 = new WeakMap();
_onVideoEndedListener = new WeakMap();
_SlideshowCarousel_instances = new WeakSet();
autoplayPauseOnVideo_get = function() {
  return this.hasAttribute("autoplay-pause-on-video");
};
/**
 * Generate the part of the sequence when the given slide is entering
 */
getSlideEnteringSequence_fn = function(slide) {
  const slideContent = slide.querySelector(".slideshow__slide-content");
  if (slideContent.classList.contains("slideshow__slide-content--boxed")) {
    return [
      [slide, { opacity: [0, 1] }, { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }],
      [slide.querySelectorAll(".content-over-media > :is(video-media, svg), .content-over-media > picture img"), { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] }, { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] }],
      [slideContent, { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] }]
    ];
  } else {
    return [
      [slide, { opacity: [0, 1] }, { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }],
      [slide.querySelectorAll(".content-over-media > :is(video-media, svg), .content-over-media > picture img"), { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] }, { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] }],
      [slideContent.querySelector(".prose"), { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] }],
      [slideContent.querySelector(".button-group"), { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] }, { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] }]
    ];
  }
};
/**
 * Generate the part of the sequence when the given slide is leaving
 */
getSlideLeavingSequence_fn = function(slide) {
  const slideContent = slide.querySelector(".slideshow__slide-content");
  if (slideContent.classList.contains("slideshow__slide-content--boxed")) {
    return [
      [slideContent, { opacity: [1, 0], transform: ["translateY(0)", "translateY(20px)"] }, { duration: 0.25, at: "leaving", easing: [0.55, 0.055, 0.675, 0.19] }],
      [slide.querySelectorAll(".content-over-media > :is(video-media, svg), .content-over-media > picture img"), { opacity: [1, 0] }, { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] }]
    ];
  } else {
    return [
      [slideContent.querySelector(".prose"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(10px)"] }, { duration: 0.25, at: "leaving", easing: [0.55, 0.055, 0.675, 0.19] }],
      [slideContent.querySelector(".button-group"), { opacity: [1, 0], transform: ["translateY(0)", "translateY(20px)"] }, { duration: 0.25, at: "<", easing: [0.55, 0.055, 0.675, 0.19] }],
      [slide.querySelectorAll(".content-over-media > :is(video-media, svg), .content-over-media > picture img"), { opacity: [1, 0] }, { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] }]
    ];
  }
};
/**
 * Mute the video for the active slide, by ignoring the video that may not be visible
 */
muteVideo_fn = function(event) {
  event.preventDefault();
  Array.from(this.selectedCell.querySelectorAll("video")).filter((video) => video.offsetParent).forEach((video) => video.muted = true);
};
/**
 * Unmute the video for the active slide, by ignoring the video that may not be visible
 */
unmuteVideo_fn = function(event) {
  event.preventDefault();
  Array.from(this.selectedCell.querySelectorAll("video")).filter((video) => video.offsetParent).forEach((video) => video.muted = false);
};
/**
 * Update the volume controls button (if any) based on whether the video is mute or not
 */
onVolumeChange_fn = function(event) {
  const volumeControl = event.target.closest(".slideshow__slide").querySelector(".slideshow__volume-control");
  if (volumeControl) {
    volumeControl.querySelector('[data-action="unmute"]').hidden = !event.target.muted;
    volumeControl.querySelector('[data-action="mute"]').hidden = event.target.muted;
  }
};
/**
 * Do action when the slide settles
 */
onSlideSettle_fn = function(event) {
  const videoList = Array.from(event.detail.cell.querySelectorAll("video"));
  if (__privateGet(this, _SlideshowCarousel_instances, autoplayPauseOnVideo_get) && this.cells.length > 1 && videoList.length > 0) {
    this.player?.pause();
    event.detail.cell.addEventListener("ended", __privateGet(this, _onVideoEndedListener), { capture: true, once: true });
  }
};
/**
 * If the merchant decide to autorotate but to stop autoplay when video is playing, we register a listener that
 * will move to the next slide (if any)
 */
onVideoEnded_fn = function() {
  this.next();
};
/**
 * Scroll to the next section when the button is clicked, by leveraging JS native scroll
 */
onNextButtonClicked_fn = function() {
  this.closest(".shopify-section").nextElementSibling?.scrollIntoView({ block: "start", behavior: "smooth" });
};
handleAutoplayProgress_fn = async function(event) {
  switch (event.type) {
    case "player:start":
      let autoplayDuration = this.getAttribute("autoplay");
      if (__privateGet(this, _SlideshowCarousel_instances, autoplayPauseOnVideo_get) && this.selectedCell.getAttribute("media-type") === "video") {
        const video = Array.from(this.selectedCell.querySelectorAll("video")).filter((video2) => video2.offsetParent).pop();
        if (isNaN(video.duration)) {
          await new Promise((resolve) => {
            video.onloadedmetadata = () => resolve();
          });
        }
        autoplayDuration = video.duration;
      }
      this.style.setProperty("--slideshow-progress-duration", `${autoplayDuration}s`);
      this.style.setProperty("--slideshow-progress-play-state", "running");
      break;
    case "player:stop":
      this.style.setProperty("--slideshow-progress-duration", `0s`);
      this.style.setProperty("--slideshow-progress-play-state", "paused");
      break;
    case "player:visibility-pause":
      this.style.setProperty("--slideshow-progress-play-state", "paused");
      break;
    case "player:visibility-resume":
      this.style.setProperty("--slideshow-progress-play-state", "running");
      break;
  }
};
if (!window.customElements.get("slideshow-carousel")) {
  window.customElements.define("slideshow-carousel", SlideshowCarousel);
}

// js/sections/testimonials.js
import { animate as animate23 } from "vendor";
var TestimonialCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide, { direction }) {
    return {
      leaveControls: () => animate23(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-15px)"] }, { duration: 0.4, easing: [0.55, 0.055, 0.675, 0.19] }),
      enterControls: () => animate23(toSlide, { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] }, { duration: 0.4, delay: 0, easing: [0.25, 0.46, 0.45, 0.94] })
    };
  }
};
if (!window.customElements.get("testimonial-carousel")) {
  window.customElements.define("testimonial-carousel", TestimonialCarousel);
}

// js/sections/text-with-icons.js
import { animate as animate24 } from "vendor";
var TextWithIconsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () => animate24(fromSlide, { opacity: [1, 0], transform: ["translateY(0)", "translateY(-10px)"] }, { duration: 0.3, easing: "ease-in" }),
      enterControls: () => animate24(toSlide, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, { duration: 0.3, delay: 0.2, easing: "ease-out" })
    };
  }
};
if (!window.customElements.get("text-with-icons-carousel")) {
  window.customElements.define("text-with-icons-carousel", TextWithIconsCarousel);
}

// js/sections/timeline.js
import { animate as animate25, timeline as timeline15 } from "vendor";
var TimelineCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate25(toSlide.querySelectorAll(".timeline__item-content"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.5 });
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return timeline15([
      [fromSlide.querySelectorAll(".timeline__item-content"), { opacity: [1, 0] }, { duration: 0.3 }],
      [fromSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"), { opacity: [1, 0], transform: ["translateX(0)", "translateX(-15px)"] }, { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] }],
      [toSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"), { opacity: [0, 1], transform: ["translateX(-15px)", "translateX(0)"] }, { duration: 0.5, at: "<" }],
      [toSlide.querySelectorAll(".timeline__item-content"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.5, at: "-0.1" }]
    ]);
  }
};
if (!window.customElements.get("timeline-carousel")) {
  window.customElements.define("timeline-carousel", TimelineCarousel);
}

// js/theme.js
import { Delegate as Delegate11 } from "vendor";
(() => {
  const delegateDocument = new Delegate11(document.documentElement);
  delegateDocument.on("click", 'a[href*="#"]', (event, target) => {
    if (event.defaultPrevented || target.matches("[allow-hash-change]") || target.pathname !== window.location.pathname || target.search !== window.location.search) {
      return;
    }
    const url = new URL(target.href);
    if (url.hash === "") {
      return;
    }
    const anchorElement = document.querySelector(url.hash);
    if (anchorElement) {
      event.preventDefault();
      anchorElement.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto" });
      document.documentElement.dispatchEvent(new CustomEvent("hashchange:simulate", { bubbles: true, detail: { hash: url.hash } }));
    }
  });
  if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, maximum-scale=1.0";
  }
  Array.from(document.querySelectorAll(".prose table")).forEach((table) => {
    table.outerHTML = '<div class="table-scroller">' + table.outerHTML + "</div>";
  });
})();
export {
  AccordionDisclosure,
  AccountLogin,
  AnnouncementBarCarousel,
  ArticleToolbar,
  BeforeAfter,
  BlogPosts,
  BuyButtons,
  CarouselNavigation,
  CarouselNextButton,
  CarouselPrevButton,
  CartCount,
  CartDot,
  CartDrawer,
  CartNote,
  CollectionBanner,
  CollectionLayoutSwitch,
  ConfirmButton,
  CopyButton,
  CountdownTimer,
  CountdownTimerFlip,
  CountdownTimerFlipDigit,
  CountrySelector,
  CustomDetails,
  DialogCloseButton,
  DialogElement,
  Drawer,
  EffectCarousel,
  FacetLink,
  FacetsDrawer,
  FacetsForm,
  FacetsSortPopover,
  FaqToc,
  FeaturedCollectionsCarousel,
  FreeShippingBar,
  GestureArea,
  GiftCardRecipient,
  Header,
  HeightObserver,
  ImageParallax,
  ImageWithText,
  ImageWithTextOverlay,
  ImagesWithTextScroll,
  LineItemQuantity,
  Listbox,
  LoadingBar,
  MarqueeText,
  MediaGrid,
  MenuDisclosure,
  Modal,
  ModelMedia,
  MultiColumn,
  MultipleMediaWithText,
  NewsletterPopup,
  OpenLightBoxButton,
  Player,
  PopIn,
  Popover,
  PredictiveSearch,
  PriceRange,
  PrivacyBanner,
  ProductCard,
  ProductForm,
  ProductGallery,
  ProductGalleryNavigation,
  ProductList,
  ProductLoader,
  ProductRecommendations,
  ProductRerender,
  ProductStickyBar,
  ProgressBar,
  QrCode,
  QuantityInput,
  QuantitySelector,
  QuickBuyModal,
  RecentlyViewedProducts,
  SafeSticky,
  ScrollCarousel,
  ShareButton,
  ShippingEstimator,
  ShopTheLookDesktopCarousel,
  ShopTheLookMobileCarousel,
  ShopTheLookPopover,
  ShopTheLookProductListCarousel,
  SlideshowCarousel,
  Tabs,
  TestimonialCarousel,
  TextWithIconsCarousel,
  TimelineCarousel,
  VariantPicker,
  VideoMedia,
  cachedFetch,
  createMediaImg,
  debounce,
  deepQuerySelector,
  extractSectionId,
  fetchCart,
  generateSrcset,
  imageLoaded,
  matchesMediaQuery,
  mediaQueryListener,
  throttle,
  videoLoaded,
  waitForEvent
};
