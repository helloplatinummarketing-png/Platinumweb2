import type { MetadataRoute } from 'next'
import { routes, site } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).map((path) => ({
    url: `${site.url}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
