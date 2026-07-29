import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'VEXO — Luxury Architectural Hardware & Acoustics',
  description = 'Experience precision-crafted acoustic systems, minimalist ambient lighting, and bespoke hardware engineered for elevated architectural living.',
  image = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=1200',
  url = typeof window !== 'undefined' ? window.location.href : '',
  schema,
}) => {
  useEffect(() => {
    document.title = title.includes('VEXO') ? title : `${title} | VEXO Luxury Systems`;

    // Set or update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph Tags
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url,
      'og:type': 'website',
      'og:site_name': 'VEXO',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', content);
    });

    // Twitter Card Tags
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let twMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twMeta) {
        twMeta = document.createElement('meta');
        twMeta.setAttribute('name', name);
        document.head.appendChild(twMeta);
      }
      twMeta.setAttribute('content', content);
    });

    // Structured Data JSON-LD
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'VEXO Systems',
        url: 'https://vexo-luxury.com',
        logo: image,
        description: description,
      });
    }
  }, [title, description, image, url, schema]);

  return null;
};
