# AGENTS.md

이 지침은 저장소 전체에 적용된다. 하위 디렉터리에 별도의 `AGENTS.md`가 있으면 해당 디렉터리에서는 더 가까운 지침을 우선한다.

## Project

DonWorry는 소비 및 참은 소비를 기록하고, 위시리스트의 상품을 일정 시간 뒤 다시 판단하도록 돕는 모바일 웹앱이다.

- React 19 + TypeScript + Vite
- React Router 7
- TanStack React Query 5
- Axios
- CSS Modules + Tailwind CSS 테마 토큰
- Vitest + Testing Library
- 화면 최대 너비: `390px`

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run format:check
npm run build
```

작업 완료 전 변경 범위에 맞는 테스트를 실행한다. 최종 검증은 원칙적으로 다음 순서로 수행한다.

```bash
npm test
npm run lint
npm run build
```

전체 포맷 명령으로 무관한 파일까지 수정하지 않는다. 필요한 파일만 포맷한다.

## Repository Map

```text
src/api/                 공통 Axios 클라이언트와 인증 API
src/components/layout/   공통 앱 레이아웃과 폼 구성 요소
src/constants/           카테고리와 시간 옵션 등 상수
src/features/            도메인별 UI, hook, API, 타입
src/pages/               라우트 진입 페이지
src/router/              전체 라우트 정의
src/shared/              공통 인증, 컴포넌트, 유틸리티
src/test/                전역 테스트 설정
```

- `@/*` 별칭은 `src/*`를 가리킨다.
- 기능 전용 코드는 `src/features/<domain>`에 둔다.
- 두 개 이상의 기능에서 재사용되는 코드만 `src/shared`로 이동한다.
- `dist/`와 같은 생성 결과물은 직접 편집하지 않는다.

## Coding Rules

- TypeScript의 기존 타입을 재사용하고 `any`를 새로 도입하지 않는다.
- 서버 응답 타입과 화면 모델을 분리하고 변환은 API 경계에서 수행한다.
- 화면 모델에서 금액은 `number`, 날짜는 가능한 한 `Date`로 정규화한다.
- HTTP 요청은 반드시 `src/api/client.ts`의 Axios 인스턴스를 사용한다.
- API URL, request body, response 필드를 추측하지 않는다. 관련 타입, 테스트, 기존 호출부를 확인한다.
- 서버 상태는 React Query로 관리한다. 성공 후 정확한 query key를 갱신하거나 무효화한다.
- 즉각적인 화면 반영이 필요하면 `setQueryData` 후 `invalidateQueries`를 사용한다.
- 비동기 기능에는 loading, success, empty, error 상태를 고려한다.
- mutation 진행 중에는 관련 버튼을 비활성화해 중복 요청을 막는다.

## Authentication Invariants

이 프로젝트에는 전역 `ProtectedRoute`가 없다. 인증이 필요한 각 화면에서 API의 401을 직접 처리한다.

- 인증이 필요한 화면을 추가하거나 수정할 때 401 안내와 `/login` 이동을 확인한다.
- 로그인 필요 안내에는 기존 `ConfirmDialog`를 우선 사용한다.
- access token 첨부와 갱신은 공통 Axios 인터셉터가 담당한다.
- 여러 요청이 동시에 401을 받아도 refresh 요청은 하나만 공유한다.
- refresh 요청 자체가 401일 때만 인증 세션을 삭제한다.
- 네트워크 오류, timeout, 5xx로 refresh가 실패한 경우 세션을 삭제하지 않는다.
- 토큰 저장과 삭제는 `src/shared/auth/session.ts`를 사용한다.

환경 변수:

```text
VITE_API_BASE_URL
VITE_KAKAO_CLIENT_ID
VITE_KAKAO_REDIRECT_URI
```

## Route Contracts

라우트 정의는 `src/router/index.tsx`에 있다. 화면 이동을 바꿀 때 목적지 컴포넌트가 기대하는 `location.state`까지 함께 확인한다.

- `/record/intervention`: `{ draft: RecordDraft }`
- `/record/intervention/result`: `{ draft, risk, answers }`
- `/temptation/saved`: `{ name, category, price }`
- 개입 화면에 draft가 없으면 `/record/new`로 이동한다.
- 위험도 결과에 필수 state가 없으면 `/record/new`로 이동한다.
- 정의되지 않은 경로는 `NotFoundPage`로 처리한다.

## Wishlist and Decision Invariants

`WishlistProvider`가 `/temptation` 하위 화면의 목록과 mutation 상태를 공유한다.

- 일반 삭제와 상세 화면의 “포기하기”: `DELETE /wishlist-items/{id}`
- 고민 시간 연장: `POST /temptations/{id}/decisions`, `decisionType: DELAY`
- 안 살래요: 같은 endpoint에 `decisionType: SKIP`
- 살래요: 같은 endpoint에 `decisionType: BUY`
- 재판단을 DELETE 요청으로 대체하지 않는다.
- DELAY 요청에는 선택한 wait type을 포함한다.
- BUY 또는 SKIP 성공 후 목록 캐시에서 해당 상품을 즉시 숨긴다.
- 캐시 제거 후에도 다음 화면에 데이터를 전달할 수 있도록 요청 직전 상품 스냅샷을 보존한다.
- 연장·BUY·SKIP 중 하나가 진행 중이면 나머지 선택지도 모두 비활성화한다.
- 상세 화면은 고민 시간이 끝나면 judge로 이동한다.
- judge는 고민 시간이 남아 있으면 상세 화면으로 되돌린다.
- 삭제의 401, 403, 404와 일반 실패를 구분한다.
- 재시도 가능한 일반 실패에서는 사용자가 원래 확인 흐름으로 돌아갈 수 있어야 한다.

## UI and Styling

- 기존 화면의 CSS Modules 패턴을 유지한다.
- 색상과 글꼴은 `src/index.css`의 테마 토큰을 우선 사용한다.
- 공통 버튼, 입력 필드, 뒤로가기 버튼, 확인창은 `src/shared/components`를 재사용한다.
- 접근 가능한 label, button type, focus, keyboard 동작을 보존한다.
- 다이얼로그는 기존 `ConfirmDialog`의 focus trap과 Escape 처리를 활용한다.

## Tests

- 테스트는 대상 코드 가까이에 `*.test.ts` 또는 `*.test.tsx`로 작성한다.
- API 테스트에서는 공통 `client`를 mock하고 method, URL, params/body, 응답 변환을 검증한다.
- hook과 컴포넌트 테스트에서는 성공뿐 아니라 loading, 실패, 재시도, 인증 및 라우트 분기를 검증한다.
- 버그 수정에는 재현 가능한 경우 회귀 테스트를 추가한다.
- 테스트 환경은 jsdom이며 설정은 `src/test/setup.ts`에 있다.

## Git and Workspace Safety

- 작업 시작 전에 `git status`와 충돌 마커를 확인한다.
- 기존 변경과 미추적 파일은 사용자 소유로 취급한다.
- 관련 없는 변경을 되돌리거나 삭제하거나 스테이징하지 않는다.
- 충돌은 한쪽 버전을 통째로 선택하지 말고 양쪽의 API 계약과 사용자 분기를 비교해 해결한다.
- 요청받지 않은 commit, merge commit, push는 수행하지 않는다.
- 위험하거나 복구하기 어려운 Git 명령은 사용하지 않는다.

## Definition of Done

- 요청한 사용자 흐름이 성공·실패·예외 분기까지 동작한다.
- TypeScript와 ESLint 오류가 없다.
- 관련 테스트와 프로덕션 빌드가 통과한다.
- 충돌 마커와 의도하지 않은 파일 변경이 없다.
- 변경 내용과 검증 결과를 사용자에게 간결하게 보고한다.

커밋이 필요한 경우 README의 Gitmoji 및 Git Flow 규칙을 따른다.
