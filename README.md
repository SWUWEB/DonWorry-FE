# DonWorry — 소비 통제 웹앱

> 소비하려는 순간에 개입하고, "참은 소비"를 중심으로 패턴을 분석해 충동 소비를 줄이고 합리적인 소비 습관을 형성하도록 돕는 웹앱 서비스.

---

## 핵심 기능

| # | 기능 | 설명 |
|---|------|------|
| 1 | 소비 / 참은 소비 기록 | 소비하거나 참은 행동을 모두 기록. "참은 소비" 데이터를 중심으로 수집 |
| 2 | 소비 판단 및 개입 피드백 | 입력 시 최근 동일 소비 빈도·충동 소비 가능성을 분석해 구매/보류 판단 유도 |
| 3 | 소비 통제 + 절약 금액 리포트 | 충동 소비 비율, 참은 소비 횟수, 절약 금액 표시 |
| 4 | 소비 유혹 관리 | 사고 싶은 것을 저장하고 일정 시간 후 재판단 유도 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Lint / Format | ESLint (Airbnb), Prettier |

---

## 시작하기

```bash
npm install
npm run dev
```

Node.js 22.13 이상을 사용합니다.

## API 계약 동기화

배포된 Swagger 명세를 갱신하고 TypeScript 타입을 생성합니다.

```bash
npm run api:sync
npm run api:generate
```

- `openapi/openapi.json`: 배포 API 명세 스냅샷
- `src/api/generated`: 자동 생성된 타입이며 직접 수정하지 않음
- `npm run api:check`: 스냅샷과 생성 타입의 일치 여부 확인
- `npm run api:drift`: 배포 API와 저장된 스냅샷의 차이 확인

PR CI는 생성 타입을 검사하고, 예약 워크플로는 매주 배포 API의 변경 여부를 검사합니다.

---

## Git 컨벤션

### Gitmoji

| Gitmoji | Type | 설명 |
|---------|------|------|
| ✨ | `feat` | 새로운 기능 추가 |
| 🐛 | `fix` | 버그 수정 |
| 📦 | `chore` | 패키지 추가 / 기타 작업 |
| ♻️ | `refactor` | 코드 리팩토링 |
| 🎨 | `style` | UI / 스타일 수정 |
| 📝 | `docs` | 문서 수정 |
| 🚑 | `hotfix` | 긴급 버그 수정 |
| 🚀 | `perf` | 성능 개선 |
| 💄 | `design` | 디자인 개선 |
| 🔥 | `remove` | 코드 삭제 |
| 🚚 | `move` | 파일 이동 / 구조 변경 |
| 💡 | `comment` | 코드 주석 추가 |
| ✅ | `test` | 테스트 추가 |
| 🧪 | `test` | 테스트 코드 수정 |
| 🔧 | `config` | 설정 변경 |
| 🔨 | `build` | 빌드 설정 수정 |
| 🚧 | `wip` | 작업 진행 중 |
| 🎉 | `init` | 프로젝트 초기화 |

### 커밋 메시지

```
깃모지 [타입]: [요약]

예) ✨ feat: 로그인 기능 추가
```

### 브랜치 전략

Git Flow — `main` / `develop` / `feature` / `release` / `hotfix`

```
feat/login-ui-#10
```

### PR 규칙

- 제목 형식: `깃모지 [타입(첫대문자)] [요약] (#이슈번호)`
  - 예) `✨ [Feat] 로그인 기능 추가 #10`
- 상호 코드 리뷰 필수
- PR 상세 설명 및 테스트 방법 필수 작성
- 병합 방식: **Squash & Merge**

### 태스크 관리

GitHub Projects — 각 태스크를 이슈로 관리, PR에서 `Closes #이슈번호` 로 연결
