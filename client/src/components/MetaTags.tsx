import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function MetaTags({
  title = 'Zoonigia - Frontier Sciences Discovery Platform',
  description = 'Join Zoonigia\'s immersive frontier sciences experience where science meets literature and philosophy. Discover workshops, collaborate with NASA on real research, and unlock your potential.',
  image = '/og-image.jpg',
  url = 'https://zoonigia.com'
}: MetaTagsProps) {
  useEffect(() => {
    // Update page title
    document.title = title;

    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;
      
      let meta = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value!);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  }, [title, description, image, url]);

  return null;
}