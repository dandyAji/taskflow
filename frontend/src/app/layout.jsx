import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  title: 'TaskFlow — Task Management',
  description: 'Kelola tugas-tugas pribadi Anda dengan mudah',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${syne.variable} ${dmSans.variable} font-body bg-slate-50 text-slate-800 min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
