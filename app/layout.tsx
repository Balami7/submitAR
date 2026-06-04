import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'SubmitAR',
  description: 'Submitar — Fast, clean, and powerful submission tool.',
  icons: {
    icon: '/logo.png',           
    shortcut: '/logo.png',
    apple: '/logo.png', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}