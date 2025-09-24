import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
}

const setMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const setOgTag = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export const Seo = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: SeoProps) => {
  useEffect(() => {
    document.title = title

    setMetaTag('description', description)
    if (keywords) {
      setMetaTag('keywords', keywords)
    }

    setOgTag('og:title', ogTitle || title)
    setOgTag('og:description', ogDescription || description)
    setOgTag('og:type', 'website')
    if (ogImage) {
      setOgTag('og:image', ogImage)
    }
    if (ogUrl) {
      setOgTag('og:url', ogUrl)
    }

    const canonicalUrl = ogUrl || window.location.href
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl])

  return null
}
