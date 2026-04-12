import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', 
      allow: '/',     
    },
    sitemap: 'https://oil-today-kj3e.vercel.app/sitemap.xml', 
  }
}