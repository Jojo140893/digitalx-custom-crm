import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'DigitalX Solutions | Custom Agency CRM',
  description: 'Production-grade enterprise CRM platform for DigitalX Solutions agency operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen font-sans">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

