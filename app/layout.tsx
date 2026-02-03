import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Path of Strongest',
  description: 'view POE public character equipment and details.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
