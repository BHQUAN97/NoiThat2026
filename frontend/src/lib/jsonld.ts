import { CONTACT, SITE_DESCRIPTION, SITE_NAME } from './constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhquan.site'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressLocality: 'Ha Noi',
      addressRegion: 'Ha Noi',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.0285,
      longitude: 105.8542,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [],
  }
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function articleJsonLd(article: {
  title: string
  slug: string
  excerpt?: string | null
  published_at?: string | null
  updated_at?: string
  cover_image?: { preview_url?: string | null } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    url: `${SITE_URL}/articles/${article.slug}`,
    description: article.excerpt || '',
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    image: article.cover_image?.preview_url || undefined,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  }
}

export function projectJsonLd(project: {
  title: string
  slug: string
  description?: string | null
  location?: string | null
  area?: string | null
  cover_image?: { preview_url?: string | null } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: `${SITE_URL}/projects/${project.slug}`,
    description: project.description || '',
    image: project.cover_image?.preview_url || undefined,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }
}

export function productJsonLd(product: {
  name: string
  slug: string
  description?: string | null
  price_range?: string | null
  cover_image?: { preview_url?: string | null } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `${SITE_URL}/catalog/${product.slug}`,
    description: product.description || '',
    image: product.cover_image?.preview_url || undefined,
    brand: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    offers: product.price_range
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  }
}
