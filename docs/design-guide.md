# 지원한판 - 디자인 가이드

## 1. 컬러 시스템

### 1.1 브랜드 컬러

```css
/* Primary - 메인 액션, 중요 버튼 */
--primary-100: #2e8b57; /* SeaGreen - 메인 */
--primary-200: #61bc84; /* 밝은 그린 - Hover */
--primary-300: #c6ffe6; /* 매우 밝은 그린 - 배경/강조 */

/* Accent - 보조 강조 */
--accent-100: #8fbc8f; /* DarkSeaGreen - 보조 */
--accent-200: #345e37; /* 어두운 그린 - 진한 강조 */

/* Text */
--text-100: #ffffff; /* 주요 텍스트 */
--text-200: #e0e0e0; /* 보조 텍스트 */
--text-300: #a0a0a0; /* 비활성 텍스트 */

/* Background */
--bg-100: #1e1e1e; /* 메인 배경 */
--bg-200: #2d2d2d; /* 카드 배경 */
--bg-300: #454545; /* 호버/선택 배경 */
--bg-400: #1a1a1a; /* 더 어두운 배경 (구분용) */
```

### 1.2 상태별 컬러

```css
/* 지원 단계별 색상 */
--status-interested: #8fbc8f; /* 관심 있음 - Accent */
--status-preparing: #4a9eff; /* 지원 준비 - 블루 */
--status-applied: #2e8b57; /* 지원 완료 - Primary */
--status-document-passed: #7b68ee; /* 서류 통과 - 퍼플 */
--status-interview: #ff8c42; /* 면접 대기 - 오렌지 */
--status-accepted: #4caf50; /* 최종 합격 - 밝은 그린 */
--status-rejected: #757575; /* 불합격 - 회색 */
```

### 1.3 시맨틱 컬러

```css
--success: #4caf50; /* 성공 */
--error: #ef5350; /* 에러 */
--warning: #ffa726; /* 경고 */
--info: #42a5f5; /* 정보 */
```

### 1.4 다크모드

- **다크모드 기본 적용** (라이트 모드는 Phase 2 이후 고려)
- 위 컬러 시스템이 다크모드 기준

---

## 2. 타이포그래피

### 2.1 폰트 패밀리

```css
--font-primary: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace; /* 코드, 키워드 태그용 */
--font-brand: "RixInuaridurine"; /* 서비스명 "지원한판" 전용 */
```

**Monospace Font 설명**:

- 키워드 태그 (Java, Spring 등) 표시용
- 코드 블록이나 기술 용어를 돋보이게 함
- 가독성과 구분감 향상

**서비스명 표시 방식**:

- 폰트 사용 추천 (확장성, 반응형 대응 용이)
- 웹폰트로 로드: `@font-face` or Google Fonts/눈누
- 이미지는 해상도, 색상 변경 시 불편

### 2.2 폰트 크기

```css
--text-xs: 12px; /* Caption, 작은 라벨 */
--text-sm: 14px; /* 보조 정보, 메타 데이터 */
--text-base: 16px; /* Body 기본 */
--text-lg: 18px; /* 강조 텍스트 */
--text-xl: 20px; /* H3 */
--text-2xl: 24px; /* H2 */
--text-3xl: 30px; /* H1 */
--text-4xl: 36px; /* 히어로, 서비스명 */
```

### 2.3 폰트 굵기

```css
--font-normal: 400; /* Regular - 본문 */
--font-medium: 500; /* Medium - 강조 */
--font-semibold: 600; /* Semi Bold - 제목 */
--font-bold: 700; /* Bold - 강한 강조 */
```

---

## 3. 반응형 디자인

### 3.1 브레이크포인트

```css
--breakpoint-mobile: 768px; /* 0-767px: 모바일 */
--breakpoint-tablet: 1024px; /* 768-1023px: 태블릿 */
--breakpoint-desktop: 1024px; /* 1024px+: 데스크톱 */
```

**우선순위**: 데스크톱(1024px+) > 태블릿(768-1023px) >> 모바일

### 3.2 칸반 보드 반응형 처리

- **Desktop (1024px+)**: 모든 컬럼 나란히 표시 (가로 스크롤 필요시)
- **Tablet (768-1023px)**: 3-4개 컬럼 표시, 가로 스크롤
- **Mobile (767px 이하)**: 리스트 뷰로 자동 전환 또는 세로 스크롤 칸반

### 3.3 리스트 뷰 반응형 처리

- **Desktop**: 전체 테이블 (회사명, 포지션, 상태, 경력, 키워드, 마감일)
- **Tablet**: 중요 컬럼만 표시 (회사명, 포지션, 상태, 마감일)
- **Mobile**: 카드 형태로 전환 (컴팩트 정보 표시)

---

## 4. 컴포넌트 디자인

### 4.1 버튼

```css
/* Primary Button */
background: var(--primary-100);
color: var(--text-100);
border-radius: 8px;
padding: 10px 20px; /* Medium */

/* Hover */
background: var(--primary-200);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;

/* Sizes */
--btn-sm: padding 6px 12px; font-size 14px;
--btn-md: padding 10px 20px; font-size 16px;
--btn-lg: padding 14px 28px; font-size 18px;
```

**shadcn/ui 활용**: Button 컴포넌트 커스터마이징

### 4.2 카드 (칸반 뷰)

```css
background: var(--bg-200);
border-radius: 12px;
padding: 16px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

/* Hover */
box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
transform: translateY(-2px);
transition: all 0.2s ease;
```

### 4.3 입력 폼

```css
/* Input Field */
background: var(--bg-300);
border: 1px solid var(--bg-300);
border-radius: 8px;
padding: 10px 14px;
color: var(--text-100);

/* Focus */
border-color: var(--primary-100);
outline: none;

/* Error */
border-color: var(--error);
```

**shadcn/ui 활용**: Input, Select, Textarea 컴포넌트

### 4.4 뱃지 & 태그

```css
/* 키워드 태그 */
font-family: var(--font-mono);
font-size: 12px;
background: var(--bg-300);
color: var(--primary-200);
border-radius: 4px;
padding: 4px 8px;

/* 경력 뱃지 */
font-size: 12px;
background: var(--accent-200);
color: var(--text-100);
border-radius: 12px;
padding: 2px 8px;

/* D-day 뱃지 */
font-size: 12px;
font-weight: 600;
/* D-7 이상: 초록 */
/* D-3~6: 주황 */
/* D-0~2: 빨강 */
```

---

## 5. 인터랙션 & 애니메이션

### 5.1 드래그 앤 드롭

```css
/* 드래그 시작 */
opacity: 0.7;
transform: scale(1.05) rotate(2deg);
box-shadow: 0 8px 16px rgba(46, 139, 87, 0.3);
cursor: grabbing;

/* 드래그 중 */
z-index: 1000;
transition: none; /* 부드러운 추적을 위해 */

/* 드롭 가능 영역 */
background: rgba(46, 139, 87, 0.1);
border: 2px dashed var(--primary-100);

/* 드롭 완료 */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**라이브러리**: @dnd-kit

### 5.2 트랜지션

```css
/* 페이지 전환 */
transition: opacity 0.2s ease, transform 0.2s ease;

/* 모달 등장 */
animation: slideUp 0.3s ease-out;

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 5.3 마이크로 인터랙션

```css
/* 버튼 클릭 */
transform: scale(0.98);
transition: transform 0.1s ease;

/* 체크박스 */
transition: all 0.2s ease;

/* 로딩 스피너 */
animation: spin 1s linear infinite;
color: var(--primary-100);
```

---

## 6. 레이아웃

### 6.1 그리드 시스템

```css
--container-max-width: 1440px;
--gutter: 24px;
--columns: 12; /* Desktop */
```

### 6.2 간격 (Spacing)

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### 6.3 섹션 구조

```css
--header-height: 64px;
--sidebar-width: 280px; /* 필터/네비게이션 있을 경우 */
--main-padding: 24px;
```

---

## 7. 특수 상태 UI

### 7.1 빈 상태 (Empty State)

**첫 방문 시**:

- 메시지: "첫 공고를 추가하고 지원 현황을 관리해보세요!"
- CTA 버튼: "공고 추가하기" (Primary Button)
- 아이콘: Heroicons의 `PlusCircleIcon` (큰 사이즈)

**필터링 결과 없음**:

- 메시지: "검색 결과가 없습니다"
- 액션: "필터 초기화" 버튼

**빈 칸반 컬럼**:

- 반투명 점선 박스
- 메시지: "이 단계에 공고가 없습니다"

### 7.2 로딩 상태

**크롤링 중**:

```
[로딩 스피너] 공고 정보를 가져오는 중...
예상 시간: 약 3-5초
```

- Spinner: Heroicons `ArrowPathIcon` 회전
- Progress Bar (선택적)

**무한 스크롤 로딩**:

- 하단에 작은 스피너

### 7.3 에러 상태

**크롤링 실패**:

```
⚠️ 일부 정보를 자동으로 가져올 수 없었습니다.
직접 입력해주세요.
```

- 색상: var(--warning)
- 아이콘: `ExclamationTriangleIcon`

---

## 8. 피드백 & 알림

### 8.1 Toast 알림

```css
/* 위치 */
position: fixed;
bottom: 0;
left: 50%;
transform: translateX(-50%);

/* 애니메이션 */
animation: slideUpToast 0.3s ease-out;

@keyframes slideUpToast {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -24px);
    opacity: 1;
  }
}

/* 스타일 */
background: var(--bg-200);
border: 1px solid var(--bg-300);
border-radius: 12px;
padding: 16px 24px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
min-width: 300px;
max-width: 500px;

/* 지속 시간 */
duration: 3000ms; /* 3초 */
```

**shadcn/ui 활용**: Toast/Sonner 컴포넌트 커스터마이징

### 8.2 모달/다이얼로그

```css
/* 배경 오버레이 */
background: rgba(0, 0, 0, 0.7);
backdrop-filter: blur(4px);

/* 모달 */
background: var(--bg-200);
border-radius: 16px;
max-width: 600px;
padding: 24px;

/* 닫기 버튼 */
position: absolute;
top: 16px;
right: 16px;
```

**shadcn/ui 활용**: Dialog 컴포넌트

### 8.3 툴팁

```css
/* 표시 타이밍 */
delay: 500ms; /* hover 후 0.5초 */

/* 스타일 */
background: var(--bg-300);
color: var(--text-100);
font-size: 12px;
padding: 6px 10px;
border-radius: 6px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
```

---

## 9. 접근성 (Accessibility)

### 9.1 키보드 네비게이션

- **Tab 순서**: 논리적 순서 (헤더 → 필터 → 메인 콘텐츠)
- **포커스 인디케이터**:
  ```css
  outline: 2px solid var(--primary-100);
  outline-offset: 2px;
  ```
- **키보드 단축키** (Phase 2):
  - `Ctrl/Cmd + K`: 검색
  - `N`: 새 공고 추가
  - `Esc`: 모달 닫기

### 9.2 스크린 리더

- 모든 버튼/링크에 명확한 `aria-label`
- 이미지에 `alt` 텍스트
- 랜드마크 역할 (`role="main"`, `role="navigation"`)

### 9.3 색상 대비

- **WCAG AA 기준 준수**
- 텍스트-배경 대비율: 최소 4.5:1
- 큰 텍스트(18px+): 최소 3:1

---

## 10. 아이콘 & 이미지

### 10.1 아이콘 세트

- **라이브러리**: Heroicons (v2)
- **기본 크기**:
  ```css
  --icon-sm: 16px; /* 작은 아이콘 */
  --icon-md: 20px; /* 기본 (텍스트와 함께) */
  --icon-lg: 24px; /* 버튼, 헤더 */
  --icon-xl: 32px; /* 빈 상태, 강조 */
  ```

**주요 사용 아이콘**:

- `PlusCircleIcon`: 추가
- `MagnifyingGlassIcon`: 검색
- `FunnelIcon`: 필터
- `LinkIcon`: 외부 링크
- `DocumentTextIcon`: 공고
- `ClockIcon`: 마감일
- `CheckCircleIcon`: 완료/성공
- `XCircleIcon`: 에러/삭제
- `ArrowPathIcon`: 로딩

### 10.2 회사 로고

- **기본 처리**: 첫 글자 원형 아바타
  ```css
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-100);
  color: var(--text-100);
  font-weight: 600;
  font-size: 18px;
  ```
- **로고 크기**: 40x40px (칸반 카드), 24x24px (리스트)

### 10.3 일러스트

- 필요 시 요청

---

## 11. 디자인 시스템 참고

## 11. 디자인 시스템 참고

### 11.1 레퍼런스 기반 세부 스펙

**기준 레퍼런스**: Kanban Dashboard (Slothui)

#### 전체 레이아웃

```
┌─────────────┬──────────────────────────────────────────┐
│  Sidebar    │  Main Content Area                       │
│  (280px)    │                                          │
│             │  Header (64px)                           │
│             │  ├─ Title + Tabs                         │
│             │  └─ Sort Options                         │
│             │                                          │
│             │  Kanban Board                            │
│             │  ├─ Column 1                             │
│             │  ├─ Column 2                             │
│             │  └─ Column 3                             │
└─────────────┴──────────────────────────────────────────┘
```

#### 사이드바 (Sidebar)

```css
/* 사이드바 */
width: 280px;
background: var(--bg-100);
border-right: 1px solid var(--bg-300);
padding: 24px 16px;

/* 로고 영역 */
margin-bottom: 24px;
font-family: var(--font-brand); /* RixInuaridurine */
font-size: 24px;
color: var(--primary-100);

/* 검색창 */
background: var(--bg-200);
border: 1px solid var(--bg-300);
border-radius: 8px;
padding: 10px 16px;
margin-bottom: 24px;

/* 네비게이션 아이템 */
padding: 12px 16px;
border-radius: 8px;
margin-bottom: 4px;

/* Active 상태 */
background: var(--bg-200);
color: var(--text-100);

/* Hover 상태 */
background: var(--bg-200);
opacity: 0.8;

/* 카운트 뱃지 */
background: var(--bg-300);
color: var(--text-200);
border-radius: 12px;
padding: 2px 8px;
font-size: 12px;
```

#### 헤더 (Header)

```css
/* 헤더 컨테이너 */
height: 64px;
padding: 0 32px;
display: flex;
justify-content: space-between;
align-items: center;
border-bottom: 1px solid var(--bg-300);

/* 제목 */
font-size: 32px;
font-weight: 700;
color: var(--text-100);

/* 탭 메뉴 */
display: flex;
gap: 32px;
margin-left: 48px;

/* 탭 아이템 */
padding: 8px 16px;
font-size: 16px;
color: var(--text-200);
border-bottom: 2px solid transparent;
cursor: pointer;

/* Active 탭 */
color: var(--text-100);
border-bottom-color: var(--primary-100);

/* 뱃지 (탭 내) */
background: var(--primary-100);
color: white;
border-radius: 12px;
padding: 2px 8px;
font-size: 12px;
margin-left: 6px;

/* 정렬 옵션 */
display: flex;
gap: 12px;
align-items: center;
```

#### 칸반 컬럼 헤더

```css
/* 컬럼 헤더 */
background: var(--status-color); /* 상태별 색상 */
border-radius: 24px; /* 둥근 모서리 */
padding: 12px 24px;
display: flex;
align-items: center;
gap: 12px;
margin-bottom: 20px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

/* 카운트 뱃지 (컬럼 헤더 내) */
background: rgba(255, 255, 255, 0.3);
color: white;
border-radius: 50%;
width: 28px;
height: 28px;
display: flex;
align-items: center;
justify-content: center;
font-size: 14px;
font-weight: 600;

/* 컬럼 제목 */
color: white;
font-size: 16px;
font-weight: 600;
flex: 1;

/* 추가 버튼 (컬럼 헤더 내) */
width: 32px;
height: 32px;
border-radius: 50%;
background: rgba(255, 255, 255, 0.2);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;

/* Hover */
background: rgba(255, 255, 255, 0.3);
```

**지원한판 컬럼 색상 매핑**:

```css
--column-interested: #8fbc8f; /* 관심 있음 */
--column-preparing: #4a9eff; /* 지원 준비 */
--column-applied: #2e8b57; /* 지원 완료 */
--column-document: #7b68ee; /* 서류 통과 */
--column-interview: #ff8c42; /* 면접 대기 */
--column-accepted: #4caf50; /* 최종 합격 */
--column-rejected: #757575; /* 불합격 */
```

#### 카드 디자인

```css
/* 카드 컨테이너 */
background: var(--bg-200);
border-radius: 12px;
padding: 16px;
margin-bottom: 12px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
cursor: pointer;
transition: all 0.2s ease;

/* Hover */
box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
transform: translateY(-2px);

/* 상단 라벨 */
display: inline-block;
padding: 4px 12px;
border-radius: 6px;
font-size: 11px;
font-weight: 500;
margin-bottom: 12px;

/* 라벨 색상 변형 */
.label-important {
  background: rgba(74, 158, 255, 0.15);
  color: #4a9eff;
}
.label-high-priority {
  background: rgba(239, 83, 80, 0.15);
  color: #ef5350;
}
.label-low-priority {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}
.label-meh {
  background: rgba(142, 142, 147, 0.15);
  color: #8e8e93;
}

/* 카드 제목 */
font-size: 16px;
font-weight: 600;
color: var(--text-100);
margin-bottom: 8px;
line-height: 1.4;

/* 카드 설명 */
font-size: 14px;
color: var(--text-200);
line-height: 1.5;
margin-bottom: 16px;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;

/* 하단 메타 정보 영역 */
display: flex;
align-items: center;
justify-content: space-between;

/* 아바타 그룹 */
display: flex;
margin-right: auto;

/* 아바타 */
width: 28px;
height: 28px;
border-radius: 50%;
border: 2px solid var(--bg-200);
margin-left: -8px; /* 겹침 효과 */

/* 첫 번째 아바타 */
margin-left: 0;

/* +N 표시 */
background: var(--bg-300);
color: var(--text-200);
font-size: 11px;
font-weight: 600;
display: flex;
align-items: center;
justify-content: center;

/* 통계 아이콘 + 숫자 */
display: flex;
align-items: center;
gap: 12px;

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-200);
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: var(--text-300);
}
```

**지원한판 카드 적용**:

```
┌────────────────────────────────┐
│ [신입/경력무관]  ← 경력 라벨   │
│                                │
│ 토스뱅크 - Server Developer    │ ← 회사명 + 포지션
│ Lorem ipsum dolor...           │ ← 짧은 설명 (선택)
│                                │
│ 👤👤 +2    💬 11   ⏰ D-5     │ ← 키워드, 댓글, 마감일
└────────────────────────────────┘
```

실제 구현 시 조정:

- 아바타 → 키워드 태그로 변경
- 댓글 숫자 → 메모 여부 표시
- 체크 숫자 → D-day 표시

#### 칸반 컬럼 레이아웃

```css
/* 컬럼 컨테이너 */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 20px;
padding: 24px 32px;

/* 개별 컬럼 */
min-width: 320px;
max-width: 400px;

/* 스크롤 (컬럼 내부) */
max-height: calc(100vh - 200px);
overflow-y: auto;
padding-right: 8px;

/* 스크롤바 커스텀 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-200);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: var(--bg-300);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary-100);
}
```

#### 반응형 조정

```css
/* 태블릿 (768px - 1023px) */
@media (max-width: 1023px) {
  /* 사이드바 숨김 or 햄버거 메뉴 */
  .sidebar {
    position: fixed;
    left: -280px;
    transition: left 0.3s ease;
  }
  .sidebar.open {
    left: 0;
  }

  /* 컬럼 2개씩 */
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
    overflow-x: auto;
  }
}

/* 모바일 (767px 이하) */
@media (max-width: 767px) {
  /* 리스트 뷰로 전환 or 세로 스크롤 */
  .kanban-board {
    grid-template-columns: 1fr;
  }

  /* 카드 컴팩트 모드 */
  .card {
    padding: 12px;
  }

  .card-title {
    font-size: 14px;
  }
}
```

#### 특수 상태 UI (레퍼런스 기반)

**빈 컬럼**:

```css
/* 컬럼이 비었을 때 */
.empty-column {
  border: 2px dashed var(--bg-300);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  color: var(--text-300);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  opacity: 0.3;
}

.empty-text {
  font-size: 14px;
}
```

**드래그 중 플레이스홀더**:

```css
.card-placeholder {
  background: var(--bg-300);
  border: 2px dashed var(--primary-100);
  border-radius: 12px;
  height: 120px;
  margin-bottom: 12px;
  opacity: 0.5;
}
```

#### 애니메이션 세부사항

```css
/* 카드 등장 애니메이션 */
@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: cardSlideIn 0.3s ease-out;
}

/* 카드 드래그 시작 */
.card.dragging {
  opacity: 0.5;
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 8px 20px rgba(46, 139, 87, 0.4);
  cursor: grabbing;
  z-index: 1000;
}

/* 컬럼 호버 (드래그 중) */
.column.drag-over {
  background: rgba(46, 139, 87, 0.05);
  border: 2px dashed var(--primary-100);
}
```

### 11.2 영감을 받을 서비스

- **Linear**: 깔끔한 인터페이스, 미니멀한 칸반 보드
- **Notion**: 유연한 데이터베이스 뷰, 필터링 UX
- **Trello**: 직관적인 드래그 앤 드롭

### 11.2 사용할 라이브러리

- ✅ **shadcn/ui**: 모든 기본 컴포넌트
- ✅ **TailwindCSS**: 유틸리티 스타일링
- ✅ **@dnd-kit**: 드래그 앤 드롭
- ✅ **Heroicons**: 아이콘
- ✅ **Framer Motion**: 애니메이션 (선택적)

---

## 변경 이력

**v1.0** (2025-10-24)

- 초기 디자인 가이드 문서 생성

**v1.2** (2025-10-24)

- 레퍼런스 디자인 기반 세부 스펙 추가 (Slothui Kanban)
- 사이드바, 헤더, 칸반 컬럼, 카드 디자인 상세 정의
- 반응형 조정 가이드 추가
- 애니메이션 및 특수 상태 UI 명세화
- 지원한판에 맞는 컬러 및 컴포넌트 매핑 완료v1.0\*\* (2025-10-24)
- 초기 디자인 가이드 문서 생성
- 주요 항목 구조화
- 세부 내용은 추후 채워갈 예정
