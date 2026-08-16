/* Küçük DOM yardımcıları */

export function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html != null) e.innerHTML = html;
  return e;
}

/** Olay dinleyici ekler ve kaldırma fonksiyonunu döner */
export function on(target, type, handler, opts) {
  target.addEventListener(type, handler, opts);
  return () => target.removeEventListener(type, handler, opts);
}

/** Fonksiyonu wait ms boyunca erteler; art arda çağrılarda sıfırlanır */
export function debounce(fn, wait) {
  let t = null;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
}

/** Boşta kalınca çalıştır — desteklenmiyorsa setTimeout'a düşer */
export function idle(fn, timeout = 1000) {
  if (typeof requestIdleCallback === "function") return requestIdleCallback(fn, { timeout });
  return setTimeout(fn, 1);
}

/** Göreli URL'yi mutlak hale getirir; geçersizse null */
export function absoluteUrl(url) {
  if (!url) return null;
  try {
    return new URL(url, location.href).href;
  } catch {
    return null;
  }
}
