'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: '로그인 실패',
        description:
          error instanceof Error
            ? error.message
            : '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'error',
      });
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
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isLoading ? 'Google로 이동 중...' : 'Google로 시작하기'}
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
