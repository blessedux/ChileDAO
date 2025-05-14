import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChileDAO',
  description: 'ChileDAO Landing Page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
