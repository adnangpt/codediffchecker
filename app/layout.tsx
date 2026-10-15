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
  const softwareAppJsonLd = {
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

  const faqPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a code diff checker and how does it work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A code diff checker is an online developer tool that compares two versions of text, code, or configuration files side-by-side or inline. It uses advanced algorithms to instantly spot additions, deletions, and modifications with character-level or token-level precision.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my code and data secure when using this online diff tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, 100% secure. Our tool executes entirely inside your local browser sandbox. No proprietary code, API keys, or sensitive text files are ever uploaded to external servers or cloud logs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which programming languages and formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It supports all major programming languages and formats including JavaScript, TypeScript, Python, JSON, HTML, CSS, SQL, YAML, Rust, Go, Java, C++, Bash, and plain text files.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare large files with thousands of lines?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! The editor handles large files smoothly with synchronized row-by-row scrolling, dedicated viewport heights, and optimized performance for files exceeding 10,000+ lines.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I merge or export code differences?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can use interactive merge controls to selectively apply or reject individual difference chunks, copy separate panes, or download clean patch files directly from your browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare JSON, minified code, or formatted text without syntax errors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Code Diff Checker seamlessly handles minified single-line code, multi-line JSON configurations, and deeply nested syntax. You can toggle Word Wrap (Alt+Z) or ignore whitespace changes to easily compare minified production payloads against formatted development files.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Code Diff Checker differ from Git diff in terminal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Unlike terminal git diff, our online tool provides interactive side-by-side split visualization, token-level character highlighting, instant one-click chunk merging, and clipboard patch exports directly in your browser without requiring a git repository or CLI setup.',
        },
      },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
