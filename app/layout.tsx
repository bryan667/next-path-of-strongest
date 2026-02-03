import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Path of Strongest',
  description: 'View Path of Exile character equipment and details.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
