import React from 'react';
import '../src/index.css';

/**
 * Next.js App Router Metadata Specification
 * Conforms to Next.js App Router (app/layout.tsx) metadata conventions.
 */
export const metadata = {
  title: 'Code Diff Checker - Free Online Code & Text Comparison Tool',
  description:
    'Free online code diff checker. Compare code, text snippets, and JSON files side-by-side or inline to spot differences, additions, and deletions instantly.',
  keywords: [
    'codediffchecker',
    'code diff checker',
    'compare code online',
    'text diff tool',
    'diff viewer online',
    'json diff checker',
    'git diff online',
    'side by side diff',
  ],
  metadataBase: new URL('https://codediffchecker.ai.studio'),
  alternates: {
    canonical: 'https://codediffchecker.ai.studio/',
  },
  openGraph: {
    title: 'Code Diff Checker - Free Online Code & Text Comparison Tool',
    description:
      'Free online code diff checker. Compare code, text snippets, and JSON files side-by-side or inline to spot differences, additions, and deletions instantly.',
    url: 'https://codediffchecker.ai.studio/',
    siteName: 'Code Diff Checker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Diff Checker - Free Online Code & Text Comparison Tool',
    description:
      'Free online code diff checker. Compare code, text snippets, and JSON files side-by-side or inline to spot differences, additions, and deletions instantly.',
  },
  verification: {
    google: 'g_ttU9qMrAof1XebB384EyoK6vUOV2fONoJ9IYzNyo8',
  },
};

export const viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Code Diff Checker',
    url: 'https://codediffchecker.ai.studio/',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    description:
      'Free online code diff checker. Compare code, text snippets, and JSON files side-by-side or inline to spot differences, additions, and deletions instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Side-by-side split code comparison',
      'Unified git-style inline difference view',
      'Intra-line word and character level diff highlighting',
      'Interactive merge changes feature',
      'Privacy-first browser execution with zero server transmission',
      'VS Code IntelliCode word wrap support (Alt+Z)',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
