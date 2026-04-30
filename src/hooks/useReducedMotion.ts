'use client'

import { useSyncExternalStore } from 'react'

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia) return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  let mediaQuery: MediaQueryList | undefined
  try {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  } catch {
    return () => {}
  }
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', callback)
  } else {
    mediaQuery.addListener(callback)
  }
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', callback)
    } else {
      mediaQuery.removeListener(callback)
    }
  }
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getReducedMotionSnapshot, getServerSnapshot)
}
