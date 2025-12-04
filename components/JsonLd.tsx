import React from 'react'

/**
 * 🔍 JsonLd
 * Adds structured data (Person, WebSite) to the page head for better SEO.
 */
export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        'name': 'Kishore', // TODO: Make dynamic if needed
        'url': 'https://kishore-portfolio.com', // Replace with actual domain
        'jobTitle': 'Software Engineer',
        'sameAs': [
          'https://github.com/your-github',
          'https://linkedin.com/in/your-linkedin'
        ]
      },
      {
        '@type': 'WebSite',
        'name': 'Kishore Portfolio & Blog',
        'url': 'https://kishore-portfolio.com'
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
