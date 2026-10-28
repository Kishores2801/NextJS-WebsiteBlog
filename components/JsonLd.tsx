import React from 'react';

/**
 * 🔍 JsonLd
 * Adds structured data (Person, WebSite) to the page head for rich search indexing and SEO.
 */
export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        'name': 'Kishore Shanmugam',
        'url': 'https://kishore-portfolio.com',
        'jobTitle': 'Lead Data Analyst',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Grant Thornton Stax',
        },
        'sameAs': [
          'https://github.com/Kishores2801',
          'https://www.linkedin.com/in/kishore-shan',
          'https://www.fiverr.com/users/kishore_data',
          'https://www.upwork.com/freelancers/~01ed5351b55a5e345c',
        ],
        'knowsAbout': [
          'Business Analytics',
          'Machine Learning',
          'Data Visualization',
          'Python',
          'Power BI',
          'AI Engineering',
        ],
      },
      {
        '@type': 'WebSite',
        'name': 'Kishore Shanmugam | Portfolio & Blog',
        'url': 'https://kishore-portfolio.com',
        'description': 'Turning complex data into intelligent, actionable solutions.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
