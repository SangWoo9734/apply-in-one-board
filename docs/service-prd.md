**v1.3** (2025-10-24)

- 서비스명 확정: "지원한판"
- 제출 파일 관리 기능 추가 (Phase 2)
- job_files 테이블 스키마 추가
- 로드맵 업데이트 (파일 관리 Phase 2에 포함)# 지원한판 - 채용 공고 관리 서비스 기획서 (PRD)

## 1. 프로덕트 개요

### 1.1 프로덕트 비전

구직자가 흩어진 채용 공고를 한 곳에서 체계적으로 관리하고, 지원 현황을 트래킹하며, 공고별 맞춤형 이력서를 효율적으로 작성할 수 있는 올인원 커리어 관리 플랫폼

### 1.2 서비스명

**지원한판** - 모든 지원 현황을 한 판에서 관리

### 1.2 서비스명

**지원한판** - 모든 지원 현황을 한 판에서 관리

### 1.3 핵심 가치 제안 (Value Proposition)

- **시간 절약**: URL만 입력하면 자동으로 핵심 정보 추출
- **체계적 관리**: 여러 플랫폼의 공고를 한 곳에서 통합 관리
- **맞춤형 준비**: 공고별 요구사항 분석 및 맞춤 이력서 작성 지원
- **진행 상황 가시화**: 지원 프로세스 전체를 시각적으로 추적

### 1.4 타겟 유저

**Primary**:

- 여러 회사에 동시 지원하는 주니어~시니어 개발자
- 이직 준비 중인 현직자 (3-7년차)

**Secondary**:

- 신입 취준생 (개발자)
- 커리어 전환자

---

## 2. 핵심 기능 명세

### 2.1 공고 수집 & 파싱 (Phase 1 - MVP)

#### 2.1.1 URL 입력

**유저 플로우**:

1. 사용자가 채용 공고 URL 입력
2. "추가하기" 버튼 클릭
3. 로딩 상태 표시 (2-5초)
4. 파싱 완료 → 카드 형태로 표시

**기술 요구사항**:

- Headless Browser (Puppeteer) 기반 크롤링
- URL 유효성 검증
- 중복 URL 체크 (이미 저장된 공고)
- 파싱 실패 시 fallback (수동 입력 옵션)

**추출 데이터**:

```json
{
  "company": "회사명",
  "position": "포지션명",
  "url": "원본 링크",
  "experience": "신입/1-3년/3-5년/5년 이상/경력무관",
  "employmentType": "정규직/계약직/인턴",
  "keywords": ["Java", "Spring", "AWS", "MySQL", "Docker"],
  "category": "Backend/Frontend/Fullstack/DevOps/Data/Mobile",
  "deadline": "2025-11-30",
  "scrapedAt": "2025-10-24T10:30:00Z"
}
```

**크롤링 방식**:

- 매번 실시간 크롤링 (캐싱 없음)
- 항상 최신 정보 제공
- 사용자별 요청이므로 부하 분산됨

#### 2.1.2 지원 플랫폼

- 원티드 (Wanted)
- 사람인
- 잡코리아
- 로켓펀치
- 링크드인
- 기업 채용 페이지 (토스, 카카오, 네이버 등)

**크롤링 전략**:

- 사이트별로 파싱 가능한 필드만 자동 추출
- 나머지는 사용자 직접 입력 (수동 입력이 기본)
- 크롤링은 편의 기능으로 위치

---

### 2.2 지원 현황 관리 (Phase 1 - MVP)

#### 2.2.1 상태 관리

**지원 단계**:

1. 관심 있음 (Interested)
2. 지원 준비 중 (Preparing)
3. 지원 완료 (Applied)
4. 서류 통과 (Document Passed)
5. 면접 대기 (Interview Scheduled)
6. 최종 합격 (Accepted)
7. 불합격 (Rejected)

**인터랙션**:

- **칸반 뷰**: 드래그 앤 드롭으로 상태 변경
- **리스트 뷰**: 드롭다운 메뉴로 상태 변경
- 상태 변경 시 타임스탬프 자동 기록
- 상태별 자동 정렬 (최신순)

#### 2.2.2 UI 뷰 모드

**칸반 보드 뷰** (기본)

```
┌────────────┬────────────┬────────────┬────────────┐
│ 관심 있음   │ 지원 준비  │ 지원 완료  │ 면접 대기  │
├────────────┼────────────┼────────────┼────────────┤
│ [카드1]    │ [카드3]    │ [카드5]    │ [카드7]    │
│ [카드2]    │ [카드4]    │ [카드6]    │            │
└────────────┴────────────┴────────────┴────────────┘
```

**리스트 뷰**

```
┌──────────────────────────────────────────────────────┐
│ [필터] [검색]                       [칸반] [리스트] │
├──────────────────────────────────────────────────────┤
│ ☐ 토스뱅크 | Server Developer | 지원 완료 | D-5   │
│ ☐ 카카오   | Backend Engineer | 면접 대기 | D-12  │
│ ☐ 네이버   | 풀스택 개발자     | 관심 있음 | D-20  │
└──────────────────────────────────────────────────────┘
```

**뷰 전환**:

- 우측 상단에 토글 버튼 (칸반 ↔ 리스트)
- 사용자 선호도 저장 (localStorage or DB)

**리스트 뷰 특징**:

- 한 화면에 더 많은 공고 표시
- 테이블 형태로 정렬/필터링 용이
- 드래그 앤 드롭으로 상태 변경 가능 (칸반과 동일한 UX)
- 대량 선택 및 일괄 작업 가능
- 컴팩트한 정보 표시

_상세 디자인은 추후 논의_

**카드 기본 정보**:

- 회사 로고 (자동 추출 or 기본 아이콘)
- 회사명
- 포지션명
- 경력 요건 배지
- 키워드 태그 (최대 5개)
- 마감일 (D-day 표시)
- 원본 링크 바로가기 버튼

#### 2.2.3 카드 기본 정보 (칸반 뷰)

- 회사 로고 (자동 추출 or 기본 아이콘)
- 회사명
- 포지션명
- 경력 요건 배지
- 키워드 태그 (최대 5개)
- 마감일 (D-day 표시)
- 원본 링크 바로가기 버튼

#### 2.2.4 필터링 & 검색

**필터 옵션**:

- 경력 요건 (신입/주니어/시니어)
- 직무 카테고리 (Backend/Frontend 등)
- 상태 (관심있음/지원완료 등)
- 마감일 (이번 주/이번 달/전체)
- 키워드 (복수 선택 가능)

**검색**:

- 회사명, 포지션명 실시간 검색
- 키워드 하이라이팅

---

### 2.3 공고 상세 페이지 (Phase 1 - MVP)

#### 2.3.1 상세 정보

**표시 항목**:

- 회사명 + 로고
- 포지션명
- 경력 요건 / 고용 형태
- 추출된 키워드 (클릭 시 필터링)
- 마감일 + D-day
- 원본 링크 (새 탭에서 열기)
- 저장 일시 / 마지막 업데이트

**CTA**:

- "원본 공고 보기" (Primary 버튼)
- "메모 추가"
- "파일 업로드" (Phase 2)

#### 2.3.2 메모 기능

- 자유 형식 텍스트 입력
- 마크다운 지원
- 용도 예시:
  - 지원 동기
  - 예상 질문 정리
  - 회사 리서치 내용
  - 연봉 협상 메모

#### 2.3.3 타임라인

상태 변경 히스토리 자동 기록:

```
2025.10.24 - 공고 추가
2025.10.25 - 지원 완료로 변경
2025.10.30 - 서류 통과로 변경
2025.11.05 - 면접 대기로 변경 + 메모: "1차 면접 - 기술 면접"
```

---

### 2.4 제출 파일 관리 (Phase 2)

#### 2.4.1 개요

각 공고별로 제출한 이력서, 자소서, 포트폴리오 파일을 함께 관리

**목적**:

- 어떤 버전의 이력서를 제출했는지 추적
- 재지원 시 이전 제출 파일 참고
- 합격/불합격 패턴 분석

#### 2.4.2 파일 업로드

**지원 파일 형식**:

- PDF (이력서, 자소서, 포트폴리오)
- DOCX (이력서, 자소서)
- 이미지 (PNG, JPG - 증명사진 등)

**업로드 제한**:

- 파일당 최대 10MB
- 공고당 최대 5개 파일

**저장 방식**:

- Supabase Storage 활용
- DB에는 메타데이터만 저장 (파일명, URL, 크기, 타입)

#### 2.4.3 파일 관리 UI

```
┌────────────────────────────────────────┐
│ 📎 제출 파일                            │
├────────────────────────────────────────┤
│ 📄 토스뱅크_이력서_v1.2.pdf (245 KB)   │
│    업로드: 2025.10.20                  │
│    [다운로드] [삭제]                   │
│                                        │
│ 📄 자기소개서.docx (180 KB)           │
│    업로드: 2025.10.20                  │
│    [다운로드] [삭제]                   │
│                                        │
│ [+ 파일 추가]                          │
└────────────────────────────────────────┘
```

#### 2.4.4 DB 스키마 추가

```sql
CREATE TABLE job_files (
  id UUID PRIMARY KEY,
  job_tracking_id UUID REFERENCES user_job_tracking(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size INT NOT NULL, -- bytes
  file_type VARCHAR(50) NOT NULL, -- MIME type
  uploaded_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_job_tracking (job_tracking_id)
);
```

---

### 2.5 대시보드 & 통계 (Phase 2)

#### 2.5.1 요약 카드

```
┌─────────────┬─────────────┬─────────────┐
│ 총 저장     │ 지원 완료   │ 면접 대기   │
│    24개     │    12개     │     3개     │
└─────────────┴─────────────┴─────────────┘
```

#### 2.5.2 인사이트

- **지원 성공률**: (최종 합격 / 지원 완료) × 100
- **평균 전형 기간**: 지원 완료 → 최종 합격까지 일수
- **인기 키워드**: 내가 관심있는 공고에서 가장 많이 등장한 기술 스택 Top 10
- **트렌드 분석**:
  - "최근 Frontend 공고에서 Next.js 언급 30% 증가"
  - "3년 이상 경력 공고가 전체의 60%"

#### 2.5.3 시각화

- 월별 지원 건수 그래프 (Line Chart)
- 상태별 분포 (Pie Chart)
- 키워드 워드클라우드

---

### 2.6 이력서 관리 (Phase 4 - 핵심 차별화)

#### 2.6.1 공고별 맞춤 이력서

**컨셉**:

- 공고마다 강조할 경험/기술이 다름
- 하나의 마스터 이력서를 기반으로 공고별 버전 생성

**플로우**:

1. 사용자가 마스터 이력서 작성 (최초 1회)
2. 특정 공고 선택 → "맞춤 이력서 생성" 버튼
3. AI가 공고 키워드 분석 → 강조할 항목 제안
4. 사용자가 수정/편집
5. PDF/워드 내보내기

**AI 제안 예시**:

```
이 공고는 "Spring Boot, AWS, MSA"를 강조합니다.
다음 경험을 상단에 배치하는 것을 추천합니다:
- [프로젝트 A] Spring Boot 기반 MSA 구축 경험
- [프로젝트 B] AWS ECS로 배포 파이프라인 구축
```

#### 2.6.2 버전 관리

- 공고별로 이력서 버전 자동 저장
- "토스뱅크 v1.2", "카카오뱅크 v1.0" 형태
- 버전 간 diff 비교 기능

#### 2.6.3 자소서 도우미 (Phase 5)

- 공고 기반 예상 질문 생성
- 자소서 초안 작성 도움
- 키워드 밀도 분석

---

## 3. 기술 스택

### 3.1 Frontend

- **프레임워크**: React 18 + TypeScript
- **스타일링**: TailwindCSS + shadcn/ui
- **상태 관리**: Zustand (가벼움) or Redux Toolkit
- **데이터 페칭**: TanStack Query (React Query)
- **라우팅**: React Router v6
- **드래그앤드롭**: @dnd-kit
- **폼**: React Hook Form + Zod (validation)
- **애니메이션**: Framer Motion

### 3.2 Backend

**Next.js 풀스택 + Supabase**

- Next.js App Router + Server Actions
- Supabase (PostgreSQL + Auth + Storage)
- API Routes로 크롤링 로직 처리
- Vercel 배포

### 3.3 크롤링

- **Puppeteer** or **Playwright**
- 별도 크롤링 서버 (CPU/메모리 많이 씀)
- Queue 시스템 (Bull/BullMQ) - 동시 요청 제어

### 3.4 데이터베이스

- **Supabase (PostgreSQL)**
  - 빠른 셋업, 무료 티어 제공
  - Auth, Storage 통합
  - Row Level Security (RLS)로 보안
  - 실시간 기능 (선택적 사용)

### 3.5 인프라

- **호스팅**: Vercel (Next.js)
- **DB**: Supabase (무료 티어로 시작)
- **스토리지**: Supabase Storage (이력서 PDF)
- **모니터링**: Sentry (에러 추적)

**크롤링 처리**:

- Next.js API Routes에서 직접 처리
- Puppeteer 사용 (서버리스 환경 고려)
- 초기에는 별도 서버 불필요

---

## 4. 데이터베이스 스키마

### 4.1 Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 UserJobTracking (사용자별 공고 관리)

```sql
CREATE TABLE user_job_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 공고 정보 (크롤링 결과 직접 저장)
  url TEXT NOT NULL,
  company VARCHAR(100),
  position VARCHAR(200),
  experience VARCHAR(50),
  employment_type VARCHAR(50),
  keywords TEXT[], -- PostgreSQL array
  category VARCHAR(50),
  deadline DATE,

  -- 사용자 관리 정보
  status VARCHAR(50) DEFAULT 'interested',
  notes TEXT,
  applied_at TIMESTAMP,

  -- 타임라인
  status_history JSONB, -- [{status: 'applied', timestamp: '...'}]

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_user_status (user_id, status),
  INDEX idx_user_created (user_id, created_at DESC)
);
```

**설계 변경 사유**:

- JobCache 테이블 제거 (캐싱 불필요)
- 크롤링 결과를 UserJobTracking에 직접 저장
- 사용자마다 같은 URL이라도 별도로 저장
- 단순한 구조로 유지

### 4.3 Resumes (Phase 2)

```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_tracking_id UUID REFERENCES user_job_tracking(id), -- NULL이면 마스터
  title VARCHAR(200), -- "토스뱅크 v1.2"
  content JSONB, -- 이력서 구조화된 데이터
  pdf_url TEXT, -- Supabase Storage 링크
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. API 명세 (주요 엔드포인트)

### 5.1 공고 추가

```
POST /api/jobs/add
Request:
{
  "url": "https://toss.im/career/..."
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "토스뱅크",
    "position": "Server Developer",
    "keywords": ["Java", "Spring"],
    "url": "https://toss.im/career/...",
    ...
  }
}

Process:
1. URL 받기
2. 실시간 크롤링 시도 (5초 타임아웃)
3. 파싱된 데이터 + 빈 필드 함께 리턴
4. 프론트엔드에서 편집 폼 표시
5. 사용자가 수정 후 최종 저장
```

### 5.2 공고 목록 조회

```
GET /api/jobs?status=applied&category=Backend&limit=20

Response:
{
  "data": [
    {
      "id": "uuid",
      "company": "카카오",
      "position": "Backend Developer",
      "status": "applied",
      ...
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

### 5.3 상태 변경

```
PATCH /api/jobs/:id/status
Request:
{
  "status": "interview_scheduled",
  "note": "1차 면접 - 기술 면접"
}
```

### 5.4 내부 크롤링 로직 (API 아님)

```javascript
// Next.js Server Action or API Route
async function crawlJobPosting(url) {
  // 1. Puppeteer로 페이지 접근
  // 2. 파싱 가능한 필드 추출
  // 3. 결과 리턴 (캐싱 없음)
  // 4. 매번 새로 크롤링
}
```

---

## 6. 프로덕트 고려사항

### 6.1 확장성 (Scalability)

**현재 설계**:

- 캐싱으로 크롤링 부하 분산
- 크롤링 서버 분리 (수평 확장 가능)

**향후 대비**:

- 크롤링 Queue 시스템 (Bull)
- CDN 활용 (로고 이미지 등)
- DB 인덱스 최적화

### 6.2 보안 (Security)

**필수 사항**:

- HTTPS 강제
- 비밀번호 해싱 (bcrypt)
- JWT 기반 인증
- CSRF 토큰
- Rate Limiting (크롤링 악용 방지)
- SQL Injection 방어 (Prepared Statement)

**개인정보 보호**:

- 이력서 데이터 암호화 (at-rest)
- GDPR 대응 (유럽 유저 있을 경우)
- 탈퇴 시 데이터 완전 삭제

### 6.3 성능 (Performance)

**최적화 전략**:

- 이미지 lazy loading
- 무한 스크롤 (pagination)
- 크롤링 결과 캐싱 (Redis)
- DB 쿼리 최적화 (N+1 문제 방지)
- CDN 활용 (정적 리소스)

### 6.4 법적 리스크 대응

**이용약관 명시**:

```
본 서비스는 사용자가 입력한 채용 공고 URL에서
메타데이터(회사명, 포지션, 키워드)를 추출하여 제공합니다.
모든 상세 정보는 원본 채용 사이트를 통해 확인하시기 바랍니다.
```

**기술적 대응**:

- User-Agent에 서비스명 + 연락처 명시
- robots.txt 존중
- Rate Limiting (1 URL당 24시간 1회)
- 원본 링크 항상 우선 표시

### 6.5 에러 핸들링

**크롤링 실패 시**:

1. 3회 재시도 (exponential backoff)
2. 실패 시 사용자에게 수동 입력 옵션 제공
3. Sentry에 에러 로깅

**파싱 실패 시**:

- 기본값으로 저장 (회사명: "미확인")
- 사용자가 수정 가능하도록

### 6.6 접근성 (Accessibility)

- 키보드 네비게이션 지원
- ARIA 라벨
- 색상 대비 (WCAG 2.1 AA)
- 스크린 리더 대응

### 6.7 모니터링 & 분석

**핵심 메트릭**:

- DAU/MAU (일간/월간 활성 사용자)
- 공고 추가 성공률
- 평균 저장 공고 수
- 상태 변경 빈도 (funnel 분석)
- 크롤링 성공/실패율

**분석 도구**:

- Google Analytics or Mixpanel (유저 행동)
- Sentry (에러 추적)
- Datadog or New Relic (인프라)

---

## 7. 개발 로드맵

### Phase 1: 이력서 관리 대시보드 (MVP - 2-3개월)

**목표**: 공고 추가 및 상태 관리의 핵심 기능

**주요 기능**:

- URL 입력 → 자동 파싱 (가능한 필드만) + 수동 입력
- 칸반 보드 UI (드래그앤드롭 상태 관리)
- 공고 상세 페이지 + 메모
- 필터링 & 검색
- 기본 인증 (Supabase Auth)

**개발 일정**:

- [Week 1-2] 프로젝트 셋업 (Next.js + Supabase)
- [Week 3-5] 크롤링 로직 + 수동 입력 폼
- [Week 6-8] 칸반 보드 UI
- [Week 9-10] 공고 상세 + 메모 기능
- [Week 11-12] 배포 + 버그 수정

### Phase 2: 통계 & 인사이트 + 파일 관리 (1-2개월)

**추가 기능**:

- 대시보드 요약 (저장/지원/면접 개수)
- 지원 성공률, 평균 전형 기간
- 인기 키워드 Top 10
- 월별 지원 건수 그래프
- 상태별 분포 차트
- **제출 파일 관리** (이력서, 자소서 업로드/다운로드)

### Phase 3: AI 공고 분석 (1-2개월)

**추가 기능**:

- GPT API 연동
- 공고 키워드 자동 분석
- "이 공고는 React 경험 중시" 같은 인사이트
- 내 경험과 공고 매칭도 점수

### Phase 4: 이력서 버전 관리 (지속적)

- 공고별 맞춤 이력서 작성
- 버전 관리 & diff 비교
- PDF 내보내기

---

## 8. 비즈니스 모델

_(장기적 고려사항 - 초기 버전에서는 제외)_

---

## 9. 경쟁사 분석

### 9.1 Huntr (해외)

**강점**: 성숙한 UI/UX, Chrome Extension
**약점**: 한국 사이트 지원 부족, 영어 중심

### 9.2 Notion Template

**강점**: 무료, 커스터마이징 자유
**약점**: 자동화 없음, 수동 입력 필요

### 9.3 엑셀/구글 시트

**강점**: 익숙함, 무료
**약점**: UI/UX 부족, 모바일 불편

**우리의 차별점**:

1. **자동 파싱**: URL만 입력하면 끝
2. **한국 특화**: 국내 주요 플랫폼 완벽 지원
3. **이력서 통합**: 공고 관리 + 이력서 작성 일체화

---

## 10. 핵심 질문 & 고민 사항

### 10.1 프로덕트 방향성

1. **타겟 유저**

   - 초기 버전: 개발자 중심으로 시작 (기술 스택 키워드 명확)
   - 이후 확장: 다른 직군도 사용 가능하도록 설계
   - 키워드 사전은 직군별로 확장 가능

2. **AI 활용 범위**
   - Phase 3에서 공고 분석에만 집중
   - GPT API로 키워드 추출 & 인사이트 제공
   - 이력서 작성은 Phase 4 이후 고려

### 10.2 기술적 의사결정

1. **크롤링 처리 방식**

   - 실시간 크롤링 (사용자가 URL 입력할 때마다)
   - 사용자가 올린 링크에 대해서만 크롤링
   - 서비스가 임의로 데이터 수집하지 않음
   - 한 번에 하나씩만 처리되므로 별도 서버 불필요

2. **데이터 수집 원칙**
   - 사용자 요청 기반 크롤링만
   - 자동 스케줄링이나 백그라운드 수집 없음
   - 캐싱도 사용자 요청 시에만 생성

### 10.3 비즈니스

1. **마케팅 전략**

   - 개발자 커뮤니티 (r/DevKor, 코딩 디스코드)
   - 블로그 SEO (이력서 작성법 등)
   - 입소문 (추천 이벤트)

2. **법적 자문 필요 시점**
   - 사용자 수 증가 시
   - 수익화 고려 시점

---

## 11. 성공 지표 (KPI)

### Phase 1 (MVP 검증)

- 크롤링 성공률: 85% 이상
- 사용자당 평균 저장 공고: 10개 이상
- 주간 재방문율: 30% 이상

### Phase 2 (성장)

- 크롤링 지원 사이트: 10개
- 유료 전환율: 3-5%
- NPS (순추천지수): 40+

---

## 12. 다음 단계

1. **기획 검토 및 피드백**

   - 이 문서 기반으로 추가 논의
   - 우선순위 재조정

2. **기술 검증 (POC)**

   - 주요 3개 사이트 크롤링 테스트
   - 파싱 정확도 측정

3. **디자인 시안**

   - Figma로 와이어프레임
   - 핵심 화면 2-3개

4. **개발 착수**
   - Git repo 셋업
   - 첫 스프린트 계획

---

---

## 부록 A: 프로덕트 추가 고려사항

### A.1 크롤링 전략 (편의 기능)

**기본 원칙**:

- 크롤링은 편의성 제공을 위한 부가 기능
- 수동 입력이 기본 (Default)
- 파싱 가능한 필드만 자동으로 채움

**동작 방식**:

1. 사용자가 URL 입력
2. 크롤링 시도 (5초 타임아웃)
3. 파싱 가능한 필드 자동 입력
   - 회사명: 파싱 성공 → 자동 입력 / 실패 → 빈 칸
   - 포지션명: 파싱 성공 → 자동 입력 / 실패 → 빈 칸
   - 키워드: 추출 가능한 것만 표시
4. 나머지 필드는 사용자가 직접 입력

**UI 플로우**:

```
[URL 입력] → [분석 중...] → [편집 폼]
                               ↓
                    회사명: [토스뱅크] ✓ (자동)
                    포지션: [        ] (수동)
                    경력: [신입] (수동 선택)
                    키워드: [Java] [Spring] (자동)

                    [저장]
```

### A.2 온보딩 경험 설계

**목표**: 신규 유저가 5분 안에 가치를 느끼게 함

**Good 온보딩**:

1. 간단한 회원가입 (이메일 + 비밀번호)
2. 환영 메시지: "첫 공고를 추가해보세요!"
3. URL 입력 칸 바로 표시
4. 샘플 공고 추가 가능 (튜토리얼용)
5. 칸반 보드에 바로 표시

**Bad 온보딩**:

- 긴 설문조사
- 복잡한 프로필 설정
- 기능 설명만 나열

### A.3 에러 처리 UX

**크롤링 실패 시**:

```
[알림] 일부 정보를 자동으로 가져올 수 없었습니다.
직접 입력해주세요.

[편집 폼 표시]
```

**잘못된 URL**:

```
[알림] 유효하지 않은 URL입니다.
채용 공고 링크를 확인해주세요.

예시: https://www.wanted.co.kr/wd/123456
```

---

## 부록 B: 참고 자료

### 디자인 영감

- Linear (프로젝트 관리 - 깔끔한 칸반)
- Notion (데이터베이스 - 필터링)
- Trello (드래그앤드롭)
- Superhuman (온보딩 경험)

### 기술 문서

- Next.js App Router: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Puppeteer: https://pptr.dev
- @dnd-kit: https://dndkit.com
- TanStack Query: https://tanstack.com/query

### 법률

- 한국 저작권법 (제28조 - 공정 이용)
- 개인정보보호법
- Robots.txt 프로토콜

---

## 변경 이력

**v1.0** (2025-10-24)

- 초기 기획서 작성
- MVP 범위 정의: 이력서 관리 대시보드
- Phase별 로드맵 수립

**v1.1** (2025-10-24)

- 기술 스택 확정: Next.js + Supabase
- 크롤링 전략 명확화: 편의 기능으로 위치, 수동 입력 기본
- 타겟 유저: 초기에는 개발자 중심
- 불필요한 기능 제거: 소셜, 멀티테넌시
- 비즈니스 모델 섹션 축소
