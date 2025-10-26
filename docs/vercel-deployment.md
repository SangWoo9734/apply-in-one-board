# Vercel 배포 가이드

## 프로젝트 구조 분석

이 프로젝트는 Next.js 14 기반 풀스택 애플리케이션으로, **Vercel 배포에 적합**하지만 Puppeteer 크롤링 때문에 추가 설정이 필요합니다.

---

## 배포 가능 여부

### ✅ Vercel과 완벽 호환
- Next.js 14 App Router
- API Routes (Serverless Functions)
- Supabase (외부 DB)
- React 컴포넌트, TailwindCSS

### ⚠️ 호환 문제: Puppeteer
- Vercel Serverless는 Puppeteer의 Chrome 바이너리를 지원하지 않음
- 크롤링 API (`/api/scrape`) 작동 불가

---

## 해결 방안

### 방안 1: puppeteer-core + @sparticuz/chromium (권장)

Vercel Serverless 환경에서 작동하는 경량 Chrome 사용

#### 1-1. 패키지 변경

```bash
npm uninstall puppeteer
npm install puppeteer-core @sparticuz/chromium
```

#### 1-2. scraper.ts 수정

```typescript
// lib/scraper.ts
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function scrapeJobPosting(url: string): Promise<ScrapedData> {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    // 나머지 코드는 동일
    // ...
  } catch (error) {
    // ...
  }
}
```

#### 1-3. next.config.mjs 수정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium'],
  },
};

export default nextConfig;
```

**장점**:
- ✅ Vercel에서 크롤링 작동
- ✅ 추가 인프라 불필요
- ✅ 코드 수정 최소화

**단점**:
- ⚠️ Hobby 플랜: 10초 제한 (크롤링 타임아웃 가능)
- ⚠️ Pro 플랜 권장 (60초 제한)
- ⚠️ 복잡한 사이트는 여전히 실패 가능

---

### 방안 2: 크롤링을 선택적 기능으로 변경 (가장 간단)

크롤링 실패 시 수동 입력 유도 (이미 구현된 UX 활용)

#### 2-1. 크롤링을 Optional로 처리

```typescript
// lib/scraper.ts
export async function scrapeJobPosting(url: string): Promise<ScrapedData> {
  // 개발 환경에서만 Puppeteer 사용
  if (process.env.NODE_ENV === 'development') {
    // 기존 Puppeteer 로직
  }

  // 프로덕션에서는 빈 데이터 반환
  return {
    company: null,
    position: null,
    experience: null,
    keywords: [],
    deadline: null,
  };
}
```

**장점**:
- ✅ 즉시 배포 가능
- ✅ 인프라 비용 0원
- ✅ 타임아웃 문제 없음

**단점**:
- ❌ 프로덕션에서 자동 파싱 불가
- ❌ 핵심 기능 축소

---

### 방안 3: 크롤링을 AWS Lambda로 분리 (확장성 최고)

크롤링만 별도 Lambda로 분리하여 Vercel에서 호출

#### 3-1. 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         사용자 (브라우저)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js 14)                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  프론트엔드   │  │  API Routes  │  │  Middleware  │     │
│  │   (React)    │  │ (Serverless) │  │    (Auth)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                 ↓                                 │
│  ┌──────────────────────────────────────────┐              │
│  │  API: /api/jobs (CRUD)                   │              │
│  │  API: /api/scrape (크롤링 프록시)        │ ← 여기만 수정 │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
         ┌──────────────────┐  ┌──────────────────┐
         │   Supabase       │  │  AWS Lambda      │
         │  (PostgreSQL)    │  │  (크롤링 전용)    │
         │                  │  │                  │
         │ • 사용자 정보     │  │ • Puppeteer      │
         │ • 공고 데이터     │  │ • Chrome Layer   │
         │ • 인증 세션       │  │ • 30초 타임아웃   │
         └──────────────────┘  └──────────────────┘
```

#### 3-2. 데이터 흐름 (Sequence Diagram)

```
사용자              Vercel               Lambda              Supabase
 │                   │                     │                    │
 │  공고 URL 입력    │                     │                    │
 ├──────────────────>│                     │                    │
 │                   │  인증 확인          │                    │
 │                   ├────────────────────────────────────────>│
 │                   │<───────────────────────────────────────┤
 │                   │  (사용자 확인됨)     │                    │
 │                   │                     │                    │
 │                   │  크롤링 요청        │                    │
 │                   ├────────────────────>│                    │
 │                   │  { url: "..." }    │                    │
 │                   │                     │ Puppeteer 실행     │
 │                   │                     │ (URL 접속 & 파싱)  │
 │                   │                     │                    │
 │                   │  크롤링 결과        │                    │
 │                   │<───────────────────┤                    │
 │                   │  { company, ... }  │                    │
 │                   │                     │                    │
 │                   │  DB 저장            │                    │
 │                   ├────────────────────────────────────────>│
 │                   │                     │                    │
 │  결과 반환        │                     │                    │
 │<──────────────────┤                     │                    │
```

#### 3-3. Vercel API 수정 (/api/scrape/route.ts)

**기존 코드** (Puppeteer 직접 실행):
```typescript
import { scrapeJobPosting } from '@/lib/scraper'; // 로컬 실행

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  const scrapedData = await scrapeJobPosting(url); // ❌ Vercel에서 실패
  return NextResponse.json({ data: scrapedData });
}
```

**수정 후** (Lambda 호출):
```typescript
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // AWS Lambda 호출
    const response = await fetch(process.env.LAMBDA_SCRAPER_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LAMBDA_API_KEY!, // API Key 인증
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Lambda scraping failed');
    }

    const scrapedData = await response.json();
    return NextResponse.json({ data: scrapedData });
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape URL' },
      { status: 500 }
    );
  }
}
```

#### 3-4. AWS Lambda 구성

##### Lambda 함수 코드 (scraper-lambda/index.js)

```javascript
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async (event) => {
  let browser;

  try {
    // API Key 검증
    const apiKey = event.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const { url } = JSON.parse(event.body);

    // Puppeteer 실행
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });

    // 크롤링 로직 (기존과 동일)
    const scrapedData = await page.evaluate(() => {
      const getText = (selector) => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || null;
      };

      return {
        company: getText('[class*="company"]') || null,
        position: getText('h1') || null,
        experience: null,
        keywords: [],
        deadline: null,
      };
    });

    await browser.close();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS
      },
      body: JSON.stringify(scrapedData),
    };
  } catch (error) {
    console.error('Lambda scraping error:', error);

    if (browser) await browser.close();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Scraping failed' }),
    };
  }
};
```

##### Lambda 설정 (AWS Console 또는 Serverless Framework)

```yaml
# serverless.yml (Serverless Framework 사용 시)
service: job-scraper

provider:
  name: aws
  runtime: nodejs18.x
  region: ap-northeast-2  # 서울 리전
  memorySize: 2048        # 2GB RAM (Puppeteer용)
  timeout: 30             # 30초 타임아웃
  environment:
    API_KEY: ${env:LAMBDA_API_KEY}

functions:
  scraper:
    handler: index.handler
    events:
      - http:
          path: /scrape
          method: post
          cors: true
    layers:
      - arn:aws:lambda:ap-northeast-2:764866452798:layer:chrome-aws-lambda:43

plugins:
  - serverless-offline
```

#### 3-5. Lambda Layer (Chromium)

Puppeteer는 Chrome이 필요하므로 Lambda Layer 추가:

**옵션 A: 공개 Layer 사용**
```
ARN: arn:aws:lambda:ap-northeast-2:764866452798:layer:chrome-aws-lambda:43
```

**옵션 B: @sparticuz/chromium 사용**
```bash
npm install @sparticuz/chromium puppeteer-core
```

#### 3-6. 환경변수 설정

**Vercel 환경변수** (Dashboard에서 설정):
```
LAMBDA_SCRAPER_URL=https://abc123.execute-api.ap-northeast-2.amazonaws.com/prod/scrape
LAMBDA_API_KEY=your-secure-random-key-here
```

**Lambda 환경변수** (AWS Console):
```
API_KEY=your-secure-random-key-here
```

#### 3-7. 배포 절차

##### Lambda 배포 (Serverless Framework)

```bash
# 1. Lambda 프로젝트 생성
mkdir scraper-lambda
cd scraper-lambda
npm init -y

# 2. 패키지 설치
npm install @sparticuz/chromium puppeteer-core
npm install -D serverless

# 3. serverless.yml 작성 (위 예시 참고)

# 4. 배포
npx serverless deploy

# 출력 예시:
# endpoint: POST - https://abc123.execute-api.ap-northeast-2.amazonaws.com/prod/scrape
```

##### Vercel 재배포

```bash
# Vercel 환경변수 설정 후
vercel --prod
```

#### 3-8. 장단점

**장점**:
- ✅ **완전한 분리**: Vercel 제약 없음
- ✅ **확장 가능**: Lambda Auto Scaling
- ✅ **타임아웃 관리**: 최대 15분 (Lambda)
- ✅ **메모리 확장**: 최대 10GB
- ✅ **독립적 배포**: 크롤링 로직만 업데이트 가능
- ✅ **멀티 리전**: 글로벌 배포 가능

**단점**:
- ❌ **추가 인프라**: AWS 계정 필요
- ❌ **운영 복잡도**: 2개 서비스 관리
- ❌ **비용**: Lambda 호출당 과금
- ❌ **네트워크 레이턴시**: Vercel → Lambda 왕복 시간
- ❌ **Cold Start**: Lambda 첫 실행 시 5-10초 지연

#### 3-9. 비용 분석

**AWS Lambda**:
- 메모리: 2048MB
- 평균 실행 시간: 5초
- 월 요청: 10,000건

```
컴퓨팅 비용:
= (10,000 × 5초) × (2048/1024) / 1,000,000 × $0.0000166667
= $1.67/월

요청 비용:
= (10,000 - 1,000,000 무료) × $0.20 / 1,000,000
= $0/월 (무료 티어 내)

총 비용: ~$2/월
```

**프리 티어 (12개월)**:
- 월 1,000,000 요청 무료
- 월 400,000 GB-초 무료
- → 실질적으로 무료

#### 3-10. 모니터링 및 디버깅

**CloudWatch Logs**:
```javascript
// Lambda에서 로깅
console.log('Scraping started:', url);
console.error('Scraping failed:', error.message);
```

**Vercel Analytics**:
- API Route 응답 시간 모니터링
- Lambda 호출 실패 추적

**알림 설정** (CloudWatch Alarms):
- Lambda 에러율 > 5% → 이메일 알림
- Lambda 실행 시간 > 25초 → 슬랙 알림

---

## 권장 배포 전략

### 단계별 접근

#### Phase 1: 빠른 배포 (방안 2)
1. 크롤링을 Optional로 설정
2. Vercel에 즉시 배포
3. 수동 입력으로 MVP 검증

#### Phase 2: 크롤링 개선 (방안 1)
1. puppeteer-core + @sparticuz/chromium 도입
2. Vercel Pro 플랜 고려 (필요 시)
3. 주요 사이트만 지원

#### Phase 3: 확장 (방안 3)
1. 사용자 증가 시
2. 별도 크롤링 서비스 구축
3. Queue 시스템 도입 (Bull/BullMQ)

---

## Vercel 배포 절차

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel login
vercel link
```

### 2. 환경변수 설정

Vercel Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 배포

```bash
# 프로덕션 배포
vercel --prod

# 또는 Git Push (자동 배포)
git push origin main
```

---

## 배포 후 확인사항

### ✅ 체크리스트
- [ ] 인증 시스템 작동 (Google OAuth)
- [ ] Supabase 연결 확인
- [ ] API Routes 작동 (/api/jobs)
- [ ] 크롤링 API 테스트 (/api/scrape)
- [ ] 환경변수 설정 확인
- [ ] Redirect URI 설정 (Google OAuth)

### Supabase Redirect URI 업데이트

Google Cloud Console에서 Authorized redirect URIs 추가:
```
https://your-vercel-domain.vercel.app/auth/callback
```

Supabase Dashboard → Authentication → URL Configuration:
```
Site URL: https://your-vercel-domain.vercel.app
Redirect URLs: https://your-vercel-domain.vercel.app/auth/callback
```

---

## 예상 비용

### Vercel
- **Hobby (무료)**:
  - 100GB 대역폭
  - Serverless 10초 제한 (크롤링 불가)

- **Pro ($20/월)**:
  - 1TB 대역폭
  - Serverless 60초 제한 (크롤링 가능)
  - 팀 협업

### Supabase
- **Free**:
  - 500MB 데이터베이스
  - 1GB 파일 스토리지
  - 월 50,000 MAU

---

## 결론

**즉시 배포 가능**: ✅ 예
**크롤링 작동**: ⚠️ 추가 설정 필요 (방안 1 또는 2)
**권장 방안**: 방안 2 (Optional 크롤링) → 방안 1 (puppeteer-core)로 점진적 개선

MVP 단계에서는 **크롤링 없이 배포**하고, 사용자 피드백을 받은 후 크롤링 기능을 개선하는 것을 권장합니다.
