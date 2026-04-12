import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://oil-today-kj3e.vercel.app', // URL เว็บของบอส
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 1,
    },
  ]
}