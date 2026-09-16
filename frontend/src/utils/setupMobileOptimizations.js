/**
 * Global Mobile Performance & Touch Architecture Initializer
 * - Enforces { passive: true } on touch and scroll listeners so main JS thread never blocks compositor scrolling
 * - Configures hardware acceleration hooks and touch optimizations
 */

export function setupMobileOptimizations() {
  if (typeof window === "undefined") return;

  // 1. Enforce passive event listeners by default for touch and wheel (except for 3D canvas and maps that must call preventDefault)
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (["touchstart", "touchmove", "wheel", "mousewheel"].includes(type)) {
      const isTargetCanvasOrMap = this instanceof Element && (
        this.tagName === "CANVAS" || 
        this.classList.contains("leaflet-container") ||
        Boolean(this.closest?.(".globe-canvas-wrapper, .leaflet-container"))
      );

      if (!isTargetCanvasOrMap) {
        if (typeof options === "boolean") {
          options = { capture: options, passive: true };
        } else if (typeof options === "object" && options !== null) {
          if (options.passive === undefined) {
            options = { ...options, passive: true };
          }
        } else if (options === undefined) {
          options = { passive: true };
        }
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // 2. Add touch capability class to <html> for tailored high-performance styling
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.documentElement.classList.add("is-touch-device");
  }

  // 3. Prevent 300ms double-tap delay programmatically if browser requires
  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  }, { passive: false });
}
