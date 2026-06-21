'use client'

import { createContext, useContext } from 'react'

export interface PageBannerData {
  image?: string
  title?: string
  subtitle?: string
  label?: string
}

const PageBannerContext = createContext<Record<string, PageBannerData>>({})

export function PageBannerProvider({ banners, children }: { banners: Record<string, PageBannerData>; children: React.ReactNode }) {
  return <PageBannerContext.Provider value={banners}>{children}</PageBannerContext.Provider>
}

export function usePageBanner(slug: string): PageBannerData {
  const banners = useContext(PageBannerContext)
  return banners[slug] || {}
}
