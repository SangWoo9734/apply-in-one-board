'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-bg-200 p-8 shadow-card">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-100 font-brand">
            지원한판
          </h1>
          <p className="mt-2 text-text-200">
            모든 지원 현황을 한 판에서 관리하세요
          </p>
        </div>

        {/* Login Button */}
        <div className="mt-8">
          <Button
            onClick={handleGoogleLogin}
            variant="default"
            size="lg"
            className="w-full"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Google로 시작하기
          </Button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-text-300">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
