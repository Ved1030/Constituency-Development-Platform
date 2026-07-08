"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ──────────────────────────────────────────────────────────────
// useAnimatedCounter — smoothly animates a number from current
// value to the target, ticking upward using requestAnimationFrame
// ──────────────────────────────────────────────────────────────
export function useAnimatedCounter(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = prevRef.current
    const diff = target - start
    if (diff === 0) return

    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        prevRef.current = target
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return display
}

// ──────────────────────────────────────────────────────────────
// useAutoScroll — slowly scrolls a container downward.
// Respects prefers-reduced-motion. Pauses on hover, resumes
// after a short inactivity delay when the user manually scrolls.
// ──────────────────────────────────────────────────────────────
export function useAutoScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  {
    speed = 0.35,            // px per frame (~21 px/s at 60 fps)
    pauseOnHover = true,
    resumeDelay = 3000,      // ms after manual scroll before resuming
    enabled = true,
  } = {},
) {
  const rafRef = useRef<number | null>(null)
  const isHovering = useRef(false)
  const isManuallyScrolling = useRef(false)
  const manualScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isReduced = useRef(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    isReduced.current = mq.matches
    const handler = (e: MediaQueryListEvent) => { isReduced.current = e.matches }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) isHovering.current = true
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
  }, [])

  // Pause on manual scroll, resume after delay
  const handleWheel = useCallback(() => {
    isManuallyScrolling.current = true
    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
    manualScrollTimer.current = setTimeout(() => {
      isManuallyScrolling.current = false
    }, resumeDelay)
  }, [resumeDelay])

  // The animation loop
  useEffect(() => {
    if (!enabled || isReduced.current) return

    const el = ref.current
    if (!el) return

    const scroll = () => {
      if (!isHovering.current && !isManuallyScrolling.current && el) {
        el.scrollTop += speed
        // If we've reached the bottom, jump back to top (infinite loop)
        if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
          el.scrollTop = 0
        }
      }
      rafRef.current = requestAnimationFrame(scroll)
    }

    rafRef.current = requestAnimationFrame(scroll)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [ref, speed, enabled])

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleWheel,
  }
}
