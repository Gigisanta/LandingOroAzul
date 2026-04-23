'use client'

import { useSyncExternalStore } from 'react'

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getReducedMotionSnapshot, getServerSnapshot)
}
