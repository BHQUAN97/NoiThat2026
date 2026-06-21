'use client'

import { createContext, useContext } from 'react'

const PageBannerContext = createContext<Record<string, string>>({})

export function PageBannerProvider({ banners, children }: { banners: Record<string, string>; children: React.ReactNode }) {
  return <PageBannerContext.Provider value={banners}>{children}</PageBannerContext.Provider>
}

export function usePageBanner(slug: string): string | null {
  const banners = useContext(PageBannerContext)
  return banners[slug] || null
}
