-- 지원한판 - 초기 데이터베이스 스키마
-- PRD 기반 테이블 구조

-- Users 테이블 (Supabase Auth와 연동)
-- Supabase Auth가 자동으로 auth.users 테이블을 관리하므로
-- 추가 사용자 정보가 필요한 경우에만 public.profiles 테이블 생성

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UserJobTracking 테이블 (공고 관리)
CREATE TABLE IF NOT EXISTS public.user_job_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- 공고 정보
  url TEXT NOT NULL,
  company VARCHAR(100),
  position VARCHAR(200),
  experience VARCHAR(50), -- 신입/1-3년/3-5년/5년 이상/경력무관
  employment_type VARCHAR(50), -- 정규직/계약직/인턴
  keywords TEXT[], -- PostgreSQL array
  category VARCHAR(50), -- Backend/Frontend/Fullstack/DevOps/Data/Mobile
  deadline DATE,

  -- 사용자 관리 정보
  status VARCHAR(50) DEFAULT 'interested', -- interested/preparing/applied/document_passed/interview/accepted/rejected
  notes TEXT, -- 메모 (마크다운)
  applied_at TIMESTAMP WITH TIME ZONE,

  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_user_job_tracking_user_id ON public.user_job_tracking(user_id);
CREATE INDEX idx_user_job_tracking_status ON public.user_job_tracking(user_id, status);
CREATE INDEX idx_user_job_tracking_created_at ON public.user_job_tracking(user_id, created_at DESC);
CREATE INDEX idx_user_job_tracking_deadline ON public.user_job_tracking(deadline) WHERE deadline IS NOT NULL;

-- RLS 활성화
ALTER TABLE public.user_job_tracking ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 공고만 관리 가능
CREATE POLICY "Users can view their own jobs"
  ON public.user_job_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs"
  ON public.user_job_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
  ON public.user_job_tracking FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
  ON public.user_job_tracking FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_job_tracking_updated_at
  BEFORE UPDATE ON public.user_job_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
