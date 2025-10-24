import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/auth-provider';

export const metadata: Metadata = {
  title: '지원한판 - 채용 공고 관리',
  description: '모든 지원 현황을 한 판에서 관리하세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
