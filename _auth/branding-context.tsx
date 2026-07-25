'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type BrandingContextType = {
  isOpen: boolean
  origin: { x: number; y: number } | null
  isAnimating: boolean
  open: (x: number, y: number) => void
  close: () => void
  toggle: (x?: number, y?: number) => void
  finishAnimation: () => void
}

const BrandingContext = createContext<BrandingContextType>({
  isOpen: false,
  origin: null,
  isAnimating: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  finishAnimation: () => {},
})

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const finishAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const open = useCallback((x: number, y: number) => {
    if (isAnimating) return
    setOrigin({ x, y })
    setIsAnimating(true)
    setIsOpen(true)
  }, [isAnimating])

  const close = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsOpen(false)
  }, [isAnimating])

  const toggle = useCallback((x?: number, y?: number) => {
    if (isAnimating) return
    if (!isOpen && x !== undefined && y !== undefined) {
      setOrigin({ x, y })
      setIsAnimating(true)
      setIsOpen(true)
    } else {
      setIsAnimating(true)
      setIsOpen(false)
    }
  }, [isOpen, isAnimating])

  return (
    <BrandingContext.Provider value={{ isOpen, origin, isAnimating, open, close, toggle, finishAnimation }}>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)
