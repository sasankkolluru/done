import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

const defaultDescription = 'Smart Exam Duty Scheduling System - Fair, Fast & Transparent. Efficiently manage exam duty allocation for faculty members.';
const defaultKeywords = 'exam scheduling, duty allocation, faculty management, academic scheduling, exam duty system';

export const SEO = ({
  title = 'Exam Duty Scheduler',
  description = defaultDescription,
  keywords = defaultKeywords,
  ogImage = '/og-image.jpg'
}: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title === 'Exam Duty Scheduler' ? title : `${title} | Exam Duty Scheduler`;
    document.title = fullTitle;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: `${window.location.origin}${location.pathname}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = property ? 'property' : 'name';
      const value = (property || name) as string;

      let element = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });
  }, [title, description, keywords, ogImage, location.pathname]);

  return null;
};
