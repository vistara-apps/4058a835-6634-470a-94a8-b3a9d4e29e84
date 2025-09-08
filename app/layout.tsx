import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Combat Arena',
  description: 'Master your NFT collection in real-time blockchain battles',
  keywords: ['NFT', 'blockchain', 'gaming', 'Base', 'crypto', 'battle'],
  openGraph: {
    title: 'Crypto Combat Arena',
    description: 'Master your NFT collection in real-time blockchain battles',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
