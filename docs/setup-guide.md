# 지원한판 - 환경 설정 가이드

## 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일이 있습니다. 다음 값들을 채워주세요:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase 값 확인 방법

1. [Supabase](https://supabase.com) 접속 및 로그인
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Settings → API 메뉴로 이동
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 입력
5. **Project API keys** → `anon` `public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력

## 2. Supabase 데이터베이스 설정

### 2-1. 테이블 생성

Supabase 대시보드 → SQL Editor에서 다음 스크립트 실행:

```sql
-- profiles 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_job_tracking 테이블
CREATE TABLE user_job_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  company TEXT,
  position TEXT,
  experience TEXT,
  keywords TEXT[],
  status TEXT NOT NULL DEFAULT 'interested',
  deadline DATE,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_job_tracking ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_job_tracking 정책
CREATE POLICY "Users can view own jobs"
  ON user_job_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON user_job_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON user_job_tracking FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON user_job_tracking FOR DELETE
  USING (auth.uid() = user_id);
```

### 2-2. 인덱스 생성 (성능 최적화)

```sql
-- user_job_tracking 인덱스
CREATE INDEX idx_user_job_tracking_user_id ON user_job_tracking(user_id);
CREATE INDEX idx_user_job_tracking_status ON user_job_tracking(status);
CREATE INDEX idx_user_job_tracking_deadline ON user_job_tracking(deadline);
```

## 3. Google OAuth 설정

### 3-1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** → **Credentials** 메뉴
4. **+ CREATE CREDENTIALS** → **OAuth client ID** 선택
5. Application type: **Web application**
6. Name: `지원한판` (원하는 이름)
7. **Authorized redirect URIs** 추가:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   예시: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
8. **CREATE** 클릭
9. Client ID와 Client Secret 복사

### 3-2. Supabase에서 Google Provider 활성화

1. Supabase 대시보드 → **Authentication** → **Providers** 메뉴
2. **Google** 찾아서 클릭
3. **Enable Sign in with Google** 토글 ON
4. **Client ID (for OAuth)**: Google Console에서 복사한 Client ID 입력
5. **Client Secret (for OAuth)**: Google Console에서 복사한 Client Secret 입력
6. **Save** 클릭

## 4. 에러 해결

### "Unsupported provider: provider is not enabled" 에러
- **원인**: Supabase에서 Google OAuth가 활성화되지 않음
- **해결**: 위의 3-2 단계를 완료했는지 확인

### "Invalid redirect URI" 에러
- **원인**: Google Cloud Console의 Authorized redirect URIs가 잘못됨
- **해결**: Supabase 프로젝트의 정확한 URL 확인 (Settings → API → URL)

## 5. 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 6. 필수 체크리스트

- [ ] `.env.local` 파일에 Supabase URL과 ANON KEY 입력
- [ ] Supabase에서 테이블 생성 (profiles, user_job_tracking)
- [ ] RLS 정책 적용
- [ ] Google Cloud Console에서 OAuth Client 생성
- [ ] Supabase에서 Google Provider 활성화
- [ ] 개발 서버 실행 및 로그인 테스트

## 문제가 있나요?

Supabase 대시보드의 **Logs** 메뉴에서 에러 로그를 확인할 수 있습니다.
