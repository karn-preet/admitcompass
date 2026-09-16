import { useState, useRef, useCallback } from "react";

/**
 * Ultra-responsive touch gesture hook with GPU translate3d feedback
 * - Detects horizontal vs vertical intent to prevent interfering with vertical page scrolling
 * - Uses passive touch event listeners
 * - Supports swiping tabs and swipe-to-action on cards
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDismiss,
  threshold = 60,
  swipeResistance = 0.4,
  ignoreSelectors = "canvas, .leaflet-container, input, textarea, select, button, .no-swipe-tabs, [data-no-swipe]"
} = {}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isHorizontalGestureRef = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    if (ignoreSelectors && e.target && e.target.closest && e.target.closest(ignoreSelectors)) {
      return;
    }
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    isHorizontalGestureRef.current = false;
    setDragOffset(0);
  }, [ignoreSelectors]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;

    // Check angle: only activate horizontal drag if horizontal intent clearly exceeds vertical
    if (!isHorizontalGestureRef.current) {
      if (Math.abs(diffX) > 12 || Math.abs(diffY) > 12) {
        if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 15) {
          isHorizontalGestureRef.current = true;
          setIsDragging(true);
        } else {
          // Vertical scroll detected, abort horizontal swipe completely to preserve native vertical scroll
          return;
        }
      } else {
        return;
      }
    }

    if (isHorizontalGestureRef.current) {
      // Apply elastic resistance curve
      const resistance = Math.sign(diffX) * Math.pow(Math.abs(diffX), 0.85) * (1 - swipeResistance);
      setDragOffset(resistance);
    }
  }, [swipeResistance]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = dragOffset;
    const duration = Date.now() - touchStartRef.current.time;
    const isQuickFlick = duration < 250 && Math.abs(diffX) > 30;

    if (diffX < -threshold || (isQuickFlick && diffX < 0)) {
      if (onSwipeLeft) onSwipeLeft();
      if (onSwipeDismiss && diffX < -threshold * 1.5) onSwipeDismiss("left");
    } else if (diffX > threshold || (isQuickFlick && diffX > 0)) {
      if (onSwipeRight) onSwipeRight();
      if (onSwipeDismiss && diffX > threshold * 1.5) onSwipeDismiss("right");
    }

    setDragOffset(0);
  }, [dragOffset, isDragging, onSwipeLeft, onSwipeRight, onSwipeDismiss, threshold]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    },
    dragOffset,
    isDragging,
    style: {
      transform: `translate3d(${dragOffset}px, 0, 0)`,
      willChange: isDragging ? "transform" : "auto",
      transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  };
}
