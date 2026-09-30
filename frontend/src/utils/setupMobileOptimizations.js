/**
 * Global Mobile & Cross-Platform Performance Initializer
 * - Accurately detects iOS, Android, macOS, and touch devices
 * - Sets CSS custom properties and helper classes on <html>
 * - Avoids monkey-patching EventTarget.prototype which interferes with Three.js/Leaflet on WebKit
 */

export function setupMobileOptimizations() {
  if (typeof window === "undefined") return;

  const ua = navigator.userAgent || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. Cross-Platform OS Detection
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua) && !isIOS;
  const isTouchDevice = "ontouchstart" in window || maxTouchPoints > 0;

  const root = document.documentElement;

  if (isIOS) root.classList.add("is-ios");
  if (isAndroid) root.classList.add("is-android");
  if (isMac) root.classList.add("is-mac");
  if (isTouchDevice) root.classList.add("is-touch-device");

  // 2. Dynamic Viewport Height (dvh) sync for mobile address bars
  const updateViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    root.style.setProperty("--vh", `${vh}px`);
  };

  updateViewportHeight();
  window.addEventListener("resize", updateViewportHeight, { passive: true });
  window.addEventListener("orientationchange", () => {
    setTimeout(updateViewportHeight, 150);
  }, { passive: true });
}

