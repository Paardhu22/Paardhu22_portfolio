// One stable production origin, shared by the build and client-side navigation.
export const siteUrl = 'https://paardhu22-portfolio.vercel.app';
export const fullName = 'Paardhiv Reddy Tumma';
export const pages = {
  work: { path: '/', title: `${fullName} | Creative Developer Portfolio`, description: 'The portfolio of Paardhiv Reddy Tumma. Explore web and mobile apps, AI tools, application security, and lunar image registration projects.' },
  about: { path: '/about', title: `About ${fullName} | Creative Developer`, description: 'Meet Paardhiv Reddy Tumma, a creative developer building web and mobile applications. Explore his work, Motion House hackathon win, and life beyond code.' },
  contact: { path: '/contact', title: `Contact ${fullName} | Portfolio`, description: 'Get in touch with Paardhiv Reddy Tumma by email, GitHub, or LinkedIn, and explore his AI-assisted art sketchbook.' },
  missing: { path: null, title: `Page not found | ${fullName}`, description: 'This page could not be found. Explore Paardhiv Reddy Tumma’s work, about page, or contact details.' },
};

export function structuredData(page) {
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const meta = pages[page];
  const graph = [
    { '@type': 'Person', '@id': personId, name: fullName, alternateName: ['Paardhiv Reddy', 'Paardhu22'], url: `${siteUrl}/about`, description: 'Creative developer building web and mobile applications, AI tools, application security tools, and lunar image registration software.',
      image: `${siteUrl}/assets/about/everyday.jpg`, sameAs: ['https://github.com/Paardhu22', 'https://www.linkedin.com/in/paardhiv-reddy-tumma/'] },
    { '@type': 'WebSite', '@id': websiteId, url: `${siteUrl}/`, name: `${fullName} — Portfolio`, publisher: { '@id': personId }, inLanguage: 'en' },
  ];
  if (meta.path) graph.push({ '@type': page === 'about' ? 'ProfilePage' : page === 'contact' ? 'ContactPage' : 'WebPage', '@id': `${siteUrl}${meta.path}#page`, url: `${siteUrl}${meta.path}`, name: meta.title, description: meta.description, isPartOf: { '@id': websiteId }, about: { '@id': personId }, ...(page === 'about' ? { mainEntity: { '@id': personId } } : {}) });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function applyPageMetadata(page) {
  const meta = pages[page];
  document.title = meta.title;
  function setMeta(attribute, name, content) {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element); }
    element.content = content;
  }
  setMeta('name', 'description', meta.description);
  setMeta('name', 'robots', page === 'missing' ? 'noindex, follow' : 'index, follow');
  for (const [key, value] of Object.entries({ title: meta.title, description: meta.description })) {
    setMeta('property', `og:${key}`, value);
    setMeta('name', `twitter:${key}`, value);
  }
  const canonical = document.head.querySelector('link[rel="canonical"]');
  const ogUrl = document.head.querySelector('meta[property="og:url"]');
  if (meta.path) {
    const link = canonical || document.createElement('link');
    link.rel = 'canonical'; link.href = `${siteUrl}${meta.path}`;
    if (!canonical) document.head.append(link);
    setMeta('property', 'og:url', link.href);
  } else { canonical?.remove(); ogUrl?.remove(); }
  let schema = document.getElementById('portfolio-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'portfolio-schema'; schema.type = 'application/ld+json'; document.head.append(schema); }
  schema.textContent = JSON.stringify(structuredData(page)).replace(/</g, '\\u003c');
}
