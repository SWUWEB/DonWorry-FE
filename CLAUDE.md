# DonWorry Frontend Guide

이 문서는 Claude가 이 저장소에서 작업할 때 따라야 할 프로젝트 지침이다. 실제 코드와 이 문서가 다르면 먼저 관련 코드를 확인하고, 동작을 바꿀 필요가 있을 때는 기존 사용자 흐름과 API 계약을 보존한다.

## 프로젝트 개요

DonWorry는 충동구매를 줄이기 위한 모바일 웹앱이다. 사용자는 소비 및 참은 소비를 기록하고, 사고 싶은 상품을 위시리스트에 넣어 고민 시간을 가진 뒤 구매·포기·연장을 다시 판단한다.

- React 19 + TypeScript + Vite
- React Router 7
- TanStack React Query 5
- Axios
- CSS Modules + Tailwind CSS 테마 토큰
- Vitest + Testing Library
- 모바일 기준 최대 너비: `390px`

## 자주 사용하는 명령어

```bash
npm install
npm run dev
npm run api:check
npm test
npm run test:coverage
npm run lint
npm run format:check
npm run build
```

작업 완료 전에는 변경 범위에 맞는 테스트를 실행하고, 최종적으로 `npm run lint`와 `npm run build`를 확인한다. 전체 소스에 `npm run format`을 실행해 무관한 파일까지 바꾸지 않는다.

## 디렉터리 구조

```text
src/
├── api/                 # 공통 Axios 클라이언트와 인증 API
├── assets/              # 아이콘, 로고 등 정적 자산
├── components/layout/   # 앱 공통 레이아웃과 폼 구성 요소
├── constants/           # 카테고리, 시간 옵션 등 공통 상수
├── features/            # 도메인별 UI, hook, API, 타입
│   ├── auth/
│   ├── home/
│   ├── intervention/
│   ├── mypage/
│   ├── notification/
│   ├── onboarding/
│   ├── record/
│   └── temptation/
├── pages/               # 라우트 진입용 페이지
├── router/              # 전체 라우트 정의
├── shared/              # 공통 인증, 컴포넌트, 유틸리티
└── test/                # 전역 테스트 설정
```

- `@/*`는 `src/*` 별칭이다. 긴 상대 경로보다 이 별칭을 사용한다.
- 도메인 로직은 가능한 한 해당 `features/<domain>` 아래에 둔다.
- 여러 기능에서 재사용되는 코드만 `shared`로 이동한다.
- `dist/`는 생성 결과물이므로 직접 수정하지 않는다.
- `src/api/generated/`는 `openapi/openapi.json`에서 생성되므로 직접 수정하지 않는다.

## 데이터와 API 규칙

- 모든 HTTP 요청은 `src/api/client.ts`의 Axios 인스턴스를 사용한다.
- API 경로는 현재 코드처럼 `/api/v1/...` 형태를 유지한다.
- 서버 응답 타입을 선언하고, 화면에서 사용할 형태로의 변환은 API 경계에서 처리한다.
- 금액은 화면 모델에서 `number`, 날짜는 가능한 한 `Date`로 정규화한다.
- 서버 상태는 React Query로 관리한다. 성공 후 관련 query key를 정확히 갱신하거나 무효화한다.
- QueryClient는 `src/api/queryClient.ts`의 `createQueryClient()`로 만든다. 4xx는 재시도하지 않는 것이 전역 기본값이므로, 훅에서 `retry`를 다시 지정하지 않는다.
- 라우트 오류는 `src/pages/RouteErrorPage.tsx`가 처리한다. 없는 경로, 배포 후 청크 로드 실패, 그 밖의 오류를 구분해 안내한다.
- 캐시를 즉시 수정해야 하는 흐름에서는 `setQueryData` 후 `invalidateQueries`를 사용해 화면 깜빡임과 오래된 데이터 노출을 막는다.
- API 스펙을 추측해 새 필드나 엔드포인트를 만들지 않는다. 기존 타입, 테스트, 호출부를 함께 확인한다.
- API 계약이 바뀌면 `npm run api:sync`와 `npm run api:generate`를 실행하고 생성 타입을 요청 경계에 연결한다.

## 인증 규칙

인증이 필요한 화면은 `src/shared/auth/ProtectedRoute.tsx` 아래에 둔다. 가드는 저장된 access/refresh token이 모두 없을 때 로그인으로 보내고 원래 경로를 보존한다.

- 인증이 필요한 새 화면은 보호 라우트 그룹에 포함한다.
- 토큰 만료나 서버 거부는 각 화면에서 401 처리와 `/login` 이동을 유지한다.
- 사용자에게는 `ConfirmDialog`로 로그인 필요 상태를 안내한다.
- access token은 요청 인터셉터에서 자동 첨부한다.
- 401이면 refresh token으로 한 번 재발급하고 원 요청을 재시도한다.
- 여러 요청이 동시에 401을 받아도 refresh 요청은 하나만 공유한다.
- refresh 요청 자체가 401일 때만 인증 세션을 삭제한다. 네트워크 오류, timeout, 5xx에서는 세션을 지우지 않는다.
- 토큰 저장과 삭제는 `src/shared/auth/session.ts`를 사용한다.
- `session.ts`는 구독 가능한 store다. 저장·삭제와 다른 탭의 변경을 구독자에게 알린다.
- 세션 상태를 화면에서 읽을 때는 `useAuthSession()`을 사용한다. `hasAuthSession()`을 직접 호출하면 이후 변경에 반응하지 않는다.
- refresh 실패로 세션이 정리되면 `expired: true`로 표시되고, 가드가 로그인 화면에 만료 안내를 전달한다.

필요한 환경 변수:

```text
VITE_API_BASE_URL
VITE_KAKAO_CLIENT_ID
VITE_KAKAO_REDIRECT_URI
```

## 핵심 라우트와 상태 계약

전체 라우트는 `src/router/index.tsx`에서 관리한다.

- 인증: `/login`, `/signup`, `/find-id`, `/reset-password/*`, `/auth/kakao/*`
- 온보딩: `/onboarding`, `/onboarding/step2`, `/onboarding/step3`
- 홈: `/`
- 위시리스트: `/temptation`, `/temptation/:id`, `/temptation/:id/edit`, `/temptation/:id/judge`, `/temptation/saved`
- 소비 기록: `/record`, `/record/new`, `/record/:id`, `/record/:id/edit`
- 구매 개입: `/record/intervention`, `/record/intervention/result`
- 마이페이지: `/mypage`, `/profile`, `/goal-amount`, `/budget`, `/consumption-report`
- 알림: `/notification`
- 알 수 없는 경로는 `NotFoundPage`로 보낸다.

라우트 간 전달 객체는 임의로 바꾸지 않는다.

- `/record/intervention`: `{ draft: RecordDraft }`
- `/record/intervention/result`: `{ draft, risk, answers }`
- `/temptation/saved`: `{ name, category, price }`
- 개입 화면에 draft가 없으면 `/record/new`로 이동한다.
- 위험도 결과에 필수 state가 없으면 `/record/new`로 이동한다.

## 위시리스트·재판단 핵심 규칙

`WishlistProvider`가 `/temptation` 하위 라우트의 목록과 mutation 상태를 공유한다.

- 일반 삭제와 상세 화면의 “포기하기”는 `DELETE /wishlist-items/{id}`를 사용한다.
- 고민 시간 종료 후 재판단은 삭제 API로 대체하지 않는다.
- 연장: `POST /temptations/{id}/decisions`, `decisionType: DELAY`
- 안 살래요: 같은 API에 `decisionType: SKIP`
- 살래요: 같은 API에 `decisionType: BUY`
- DELAY에는 선택한 wait type을 함께 전송한다.
- 결정 성공 후 목록 캐시에서 해당 상품을 즉시 숨긴다.
- 결정 성공 시 캐시에서 상품이 사라질 수 있으므로, 다음 화면에 필요한 상품 정보는 요청 직전에 스냅샷으로 보존한다.
- 연장·구매·포기 중 mutation 하나가 진행 중이면 나머지 선택 버튼도 모두 비활성화한다.
- 상세 화면은 고민 시간이 끝나면 judge로 이동하고, judge는 시간이 남아 있으면 상세로 돌려보낸다.
- 삭제의 401, 403, 404와 일반 실패를 구분한다. 재시도 가능한 일반 실패에서는 원래 확인 흐름을 유지한다.

## UI와 스타일 규칙

- 기존 화면은 CSS Modules를 중심으로 작성되어 있다. 같은 기능을 수정할 때 기존 방식을 따른다.
- 전역 색상과 폰트 토큰은 `src/index.css`의 `@theme` 값을 우선 사용한다.
- 공통 버튼, 입력창, 뒤로가기, 확인창은 `src/shared/components`의 기존 컴포넌트를 재사용한다.
- 비동기 화면에는 loading, success, empty, error 상태를 모두 고려한다.
- 요청 중인 버튼은 비활성화해 중복 요청을 막는다.
- 다이얼로그를 추가할 때 키보드 focus와 Escape 동작을 제공하는 기존 `ConfirmDialog`를 우선 사용한다.

## 테스트 규칙

- 테스트 파일은 대상 코드 옆에 `*.test.ts` 또는 `*.test.tsx`로 둔다.
- API 테스트에서는 공통 `client`를 mock하고 URL, method, params/body 및 응답 변환을 검증한다.
- hook과 컴포넌트 테스트에서는 loading, 성공, 실패, 재시도 및 라우트 분기를 우선 검증한다.
- 버그를 수정할 때 재현 가능한 경우 회귀 테스트를 함께 추가한다.
- 테스트 환경은 jsdom이며 전역 설정은 `src/test/setup.ts`에 있다.

## 작업 시 주의사항

- 작업 시작 전에 `git status`와 충돌 마커를 확인한다.
- 사용자가 만든 변경과 미추적 파일을 임의로 삭제하거나 덮어쓰지 않는다.
- 충돌 해결 시 한쪽 변경을 통째로 선택하지 말고 양쪽의 API 계약과 사용자 분기를 비교한다.
- 화면 이동 코드를 수정할 때 목적지 컴포넌트가 기대하는 `location.state` 타입까지 확인한다.
- 공통 인증, API client, query key를 우회하는 중복 구현을 만들지 않는다.
- 요청받지 않은 commit, push, merge 완료는 수행하지 않는다.

## Git 컨벤션

기존 README의 Gitmoji와 Git Flow 규칙을 따른다.

```text
✨ feat: 새로운 기능
🐛 fix: 버그 수정
♻️ refactor: 리팩터링
✅ test: 테스트 추가
📝 docs: 문서 변경
```

PR에는 변경 이유, 주요 사용자 흐름, 테스트 방법을 기록한다.
