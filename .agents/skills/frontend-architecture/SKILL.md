---
name: frontend-architecture
description: "Use this skill for React frontend architecture decisions in this repository, especially when adding, moving, reviewing, or refactoring code under src/app, src/pages, src/modules, src/features, src/entities, src/components, or src/base. Trigger for 구조 변경, 레이어 배치, FSD, public API, index.ts exports, import boundary review, deep imports, same-layer cross-imports, base/components boundaries, and architecture exceptions. Do not use for pure formatting, testing style, commit messages, CSS-only styling, or generic React advice unless the work changes structural boundaries."
---

# 프론트엔드 아키텍처 스킬

이 스킬은 이 저장소의 프론트엔드 구조를 변경하거나 검토할 때 적용하는 단독 기준이다. 목적은 코드 위치를 예측 가능하게 만들고, 변경 영향을 국소화하며, public API와 의존 방향을 통해 리팩터링 비용을 낮추는 것이다.

이 문서는 현행 코드 스냅샷을 그대로 묘사하는 보고서가 아니라, 팀이 수렴해야 하는 규범적 목표 아키텍처이자 프론트엔드 구조의 단일 기준이다. 구현이 이 문서보다 뒤처질 수는 있지만, 임시 타협이나 레거시 상태를 기본 규칙으로 자동 승격하지 않는다.

## 1. 사용 조건

### 1.1 이 스킬을 사용해야 하는 경우

프론트엔드 작업이 아래 중 하나에 해당하면 이 스킬을 적용한다.

- 새 화면, 화면 블록, feature, entity, 공통 component, base 모듈을 추가하거나 이동한다.
- 파일을 `src/app`, `src/pages`, `src/modules`, `src/features`, `src/entities`, `src/components`, `src/base` 중 어디에 둘지 판단한다.
- import 경계, public API, 같은 레이어 cross-import, `@x` 사용 여부를 리뷰한다.
- 단일 사용 코드가 너무 일찍 `features`, `entities`, `components`, `base`로 올라갔는지 검토한다.
- `base` 또는 `components`가 도메인 로직 저장소로 확장되고 있는지 확인한다.
- 구조적 예외를 승인하거나 제거 조건을 문서화한다.

### 1.2 이 스킬을 사용하지 않는 경우

아래 작업에는 이 스킬을 적용하지 않는다. 다만 해당 작업이 구조 경계를 바꾸는 경우에는 다시 적용한다.

- Prettier, ESLint 세부 규칙, import-sort 같은 포맷팅 규칙
- 테스트 도구 선택, 테스트 파일명, 테스트 작성 방식
- CSS-in-JS, Tailwind, CSS Modules 같은 스타일링 방식
- 커밋 메시지, 브랜치명, PR 템플릿
- 일반 React 구현 팁, 성능 미세 최적화
- 개별 컴포넌트 내부의 순수 구현 방식

## 2. 작업 절차

프론트엔드 구조를 변경하거나 리뷰할 때는 아래 순서로 판단한다.

1. **사용 범위 확인**: 코드가 앱 실행 구성, 한 page, 한 module, 여러 화면의 사용자 액션, 여러 기능이 공유하는 도메인 개념, 도메인 중립 공통 component, 비즈니스 중립 기반 코드 중 무엇인지 분류한다.
2. **가까운 위치 우선**: 재사용되지 않는 UI, 폼, validation, 로컬 상태, 데이터 조회/변경은 우선 `src/pages/{slice}` 또는 `src/modules/{slice}` 안에 둔다.
3. **검증된 재사용 후 승격**: 실제 재사용이나 반복 변경 확산이 확인된 뒤에만 `features`, `entities`, `components`, `base`로 올린다.
4. **레이어 방향 확인**: import는 항상 상위 레이어에서 하위 레이어로만 흐르게 한다.
5. **public API 확인**: 외부 모듈은 slice/segment 내부 파일이 아니라 `index.ts` 또는 명시된 public API만 import한다.
6. **같은 레이어 격리 확인**: 같은 레이어의 slice끼리 직접 import하지 않는다. entity 간 필수 관계만 `@x` public API로 제한한다.
7. **app 경계 확인**: `src/app`은 앱 실행 구성과 전역 조립만 담는다. 화면별 비즈니스 로직과 세부 UI 조립은 `src/pages/{slice}` 또는 하위 레이어에 둔다.
8. **components/base 경계 확인**: `src/components`는 도메인 중립 공통 조합 컴포넌트만 담고, `src/base`는 기반 코드와 primitive만 담는다.
9. **예외 문서화**: 규칙 위반이 불가피하면 owner, 이유, 제거 조건, 제거 예상 시점을 코드 주석이나 단일 기준 문서 본문에 남긴다.

리뷰 결과를 작성할 때는 가능한 한 “어디로 옮길지”, “어떤 import를 public API로 바꿀지”, “왜 승격 또는 비승격이 맞는지”를 함께 제시한다.

## 3. 핵심 원칙

### 3.1 가까운 위치 우선

재사용되지 않는 코드는 사용하는 곳 가까이에 둔다.

- 페이지 전용 폼, validation, fetch/mutation, loading/error UI는 `src/pages/{slice}`에 둔다.
- 특정 module 전용 상태와 API 호출은 `src/modules/{slice}`에 둔다.
- “언젠가 재사용될 것 같다”는 이유만으로 `features`, `entities`, `components`, `base`로 올리지 않는다.
- 한 사용자 흐름을 수정할 때 여러 레이어를 오가야 한다면 응집도가 낮아진 신호로 본다.

### 3.2 검증된 재사용 후 승격

코드는 실제 재사용이나 명확한 책임 분리가 발생할 때만 승격한다.

- 여러 page/module에서 같은 사용자 액션이 반복된다면 `features/{slice}`를 검토한다.
- 여러 기능이 같은 도메인 개념, 모델, 표현을 공유한다면 `entities/{slice}`를 검토한다.
- 도메인과 관련 없고 `base/ui` primitive보다 큰 공통 UI 조합이라면 `components/{slice}`를 검토한다.
- 비즈니스 지식 없이 재사용되는 기반 코드라면 `base/{segment}`를 검토한다.
- 특정 경계 안에 두기에는 변경 영향이 반복적으로 번진다면 상위 추상화로 승격한다.
- 중복 제거 자체보다 응집도, 변경 영향, 삭제 용이성을 우선한다.

### 3.3 단방향 의존성

의존성은 상위 레이어에서 하위 레이어로만 흐른다.

```text
app
↓
pages
↓
modules
↓
features
↓
entities
↓
components
↓
base
```

허용 방향은 다음과 같다.

- `app` → `pages`, `modules`, `features`, `entities`, `components`, `base`
- `pages` → `modules`, `features`, `entities`, `components`, `base`
- `modules` → `features`, `entities`, `components`, `base`
- `features` → `entities`, `components`, `base`
- `entities` → `components`, `base`
- `components` → `base`
- `base` → 외부 라이브러리와 자기 segment 내부

금지 방향은 다음과 같다.

- 하위 레이어가 상위 레이어를 import하는 것
- 같은 레이어의 slice끼리 직접 import하는 것
- `base`가 `components`, `entities`, `features`, `modules`, `pages`, `app`을 import하는 것
- `components`가 domain layer 또는 app/page/module/feature layer를 import하는 것
- `entities`가 `features`, `modules`, `pages`, `app`을 import하는 것
- `features`가 `modules`, `pages`, `app`을 import하는 것
- `modules`가 `pages`, `app`을 import하는 것

### 3.4 공개 API가 경계다

외부 모듈은 `layer/{slice}/{segment}` 구조에서 slice의 내부 파일 구조가 아니라 public API만 사용한다.

- `pages`, `modules`, `features`, `entities`, `components`의 외부 진입점은 기본적으로 slice 루트 `index.ts`다.
- `app`, `base`는 slice가 없으므로 segment 단위 public API를 둘 수 있다. 예: `base/ui/index.ts`, `base/api/index.ts`
- 같은 slice 내부에서는 상대 경로 import를 허용한다.
- slice 아래에는 필요한 segment만 둔다.
- 외부에서 `@/entities/printer/ui/printer-card`처럼 내부 파일을 직접 import하지 않는다.
- 내부 helper, 내부 hook, 내부 type은 기본적으로 public API에 포함하지 않는다.
- `export *`는 내부 구현을 과도하게 노출하기 쉬우므로 피하고, 공개할 symbol을 명시적으로 re-export한다.

### 3.5 기반 레이어는 임시 저장소가 아니다

`base`는 비즈니스 중립 기반 코드만 둔다.

허용한다.

- UI primitive와 가장 작은 단위의 공통 UI
- API client, transport, generated API type
- 환경 설정과 feature flag 기반 구조
- 날짜/숫자/문자열 포맷터
- debounce, throttle, assertion 같은 범용 utility
- project-aware but business-neutral code

허용하지 않는다.

- 도메인 정책
- 특정 feature의 validation 또는 business rule
- 특정 entity 전용 mapper
- 화면 흐름에 종속된 상태와 로직
- `base/ui` primitive보다 큰 조합 컴포넌트
- “어디 둘지 모르겠다”는 이유로 이동한 임시 코드

### 3.6 공통 컴포넌트는 도메인 중립 조합이다

`components`는 도메인과 관련 없고 여러 곳에서 공통으로 쓰이는 조합 컴포넌트를 둔다. `base/ui`보다 크고, page/module/feature/entity보다 중립적인 UI 단위다.

허용한다.

- data-table
- pagination
- search-box
- filter-panel
- file-dropzone
- date-range-picker
- command-menu
- empty-state 조합

허용하지 않는다.

- 특정 도메인 모델을 직접 import하는 컴포넌트
- 특정 feature의 실행 규칙이나 validation
- 특정 page의 layout과 사용자 흐름
- API 요청과 mutation orchestration
- `base/ui`에 둘 수 있는 primitive component

규칙은 다음과 같다.

- `components`는 `base`만 import한다.
- presentation state는 가질 수 있지만 domain state는 갖지 않는다.
- 데이터 조회는 수행하지 않고 props, callback, adapter를 통해 값을 받는다.
- 도메인별 컬럼 정의, 도메인별 label, 도메인별 action 조합은 사용하는 layer에서 주입한다.

### 3.7 세그먼트는 목적을 설명한다

기본 segment는 아래 다섯 가지를 사용한다.

- `ui`: 화면 표시, 컴포넌트, 표시용 formatter, 스타일
- `api`: backend interaction, request 함수, DTO, mapper
- `model`: schema, state, store, domain/business logic
- `lib`: 해당 slice/segment 내부에서 쓰는 supporting library code
- `config`: 설정, feature flag, 상수성 configuration

규칙은 다음과 같다.

- 필요한 segment만 만든다. 비어 있는 segment는 만들지 않는다.
- `components`, `hooks`, `types`, `utils`는 기본 segment 이름으로 사용하지 않는다.
- 타입은 별도 창고보다 책임이 있는 segment 가까이에 둔다.
- DTO와 mapper 타입은 보통 `api`, schema/state/domain type은 보통 `model`, 범용 utility type은 필요 시 `base/lib/utility-types`, generated API type은 `base/api/openapi` 같은 전용 위치에 둔다.
- `components/{slice}`는 보통 `ui`, `model`, `lib`, `config`만 사용한다. 서버 통신을 위한 `api` segment는 만들지 않는다.

## 4. 레이어 책임

| 레이어 | 실제 경로 | 책임 | 담으면 안 되는 것 |
| --- | --- | --- | --- |
| `app` | `src/app` | 앱 실행에 필요한 전역 구성. 엔트리포인트, 라우팅 구성, provider, 전역 스타일, 앱 수준 설정 | 특정 화면의 비즈니스 로직, 개별 feature 구현, 무거운 화면 조립 |
| `pages` | `src/pages` | route 수준 화면과 해당 화면 전용 조립 로직 | 여러 화면에서 재사용되는 사용자 액션, 범용 infra |
| `modules` | `src/modules` | 의미 있는 화면 블록, 재사용 가능한 큰 UI 조합, module-local state/api | 공용 창고 역할의 임시 폴더, 핵심 domain model |
| `features` | `src/features` | 사용자에게 가치가 있는 재사용 가능한 행동 단위 | 한 화면에서만 쓰는 로직, 기계적인 기술 분류 |
| `entities` | `src/entities` | domain concept, model, 최소 UI, entity 단위 API/mapper | 여러 entity를 아우르는 scenario, 화면 흐름 |
| `components` | `src/components` | `base/ui`보다 큰 도메인 중립 공통 UI 조합. 예: `data-table` | domain policy, feature rule, entity 전용 표현, page/module 흐름 |
| `base` | `src/base` | 프로젝트 공통 기반 코드와 business-neutral infra | domain policy, feature rule, page flow logic, 큰 조합 컴포넌트 |

위 표에 없는 새 레이어를 임의로 추가하지 않는다. 모든 레이어를 반드시 사용할 필요는 없지만, 사용하는 레이어의 의미는 위 표를 따른다.

## 5. app 레이어 규칙

`src/app`은 애플리케이션 실행과 전역 조립을 담당한다. 화면별 구현을 담는 레이어가 아니라, 하위 레이어를 연결해 앱을 시작시키는 실행 골격이다.

### 5.1 앱 실행 골격 규칙

`src/app`에 둘 수 있다.

- 앱 엔트리포인트
- 최상위 App component
- provider composition
- router configuration
- 전역 스타일 import
- 앱 수준 configuration
- error boundary, suspense boundary 같은 전역 경계

`src/app`에 두지 않는다.

- 페이지 전용 폼, validation, data fetching
- 특정 feature의 business rule
- 특정 entity 전용 mapper
- 재사용 가능한 공통 component 구현
- page 내부의 세부 layout 조립

규칙은 다음과 같다.

- `src/app`은 가능한 한 얇게 유지한다.
- 화면 전용 UI, 상태, data fetching, mutation, validation은 `src/pages/{slice}`에 둔다.
- 전역 provider와 router 구성은 `src/app`에 둔다.
- 앱 시작에 필요한 연결 코드가 커지면 역할별 segment로 나눈다.

### 5.2 페이지 이름

- route 또는 사용자 흐름이 `/workspace`라면 기본 page slice는 `src/pages/workspace`다.
- URL과 slice 이름이 1:1로 맞지 않을 수 있다. 이때 slice 이름은 사용자 흐름 또는 화면 책임을 기준으로 정한다.
- 여러 route가 하나의 사용자 흐름을 공유한다면 하나의 page slice 안에 하위 entry를 둘 수 있다. 단, page slice가 공용 창고가 되면 분리한다.

## 6. 공통 컴포넌트와 기반 레이어 경계

`src/components`와 `src/base`는 모두 도메인 중립 코드를 담지만, 크기와 책임이 다르다.

### 6.1 `base/ui`

`base/ui`는 가장 작은 단위의 공통 UI primitive를 둔다.

예시는 다음과 같다.

- button
- input
- checkbox
- radio
- select primitive
- dialog primitive
- tooltip primitive
- spinner
- icon

`base/ui`의 규칙은 다음과 같다.

- 도메인 단어와 도메인 상태를 포함하지 않는다.
- feature action이나 page flow를 알지 않는다.
- 복잡한 데이터 구조의 표시 정책을 갖지 않는다.
- 다른 레이어를 import하지 않는다.

### 6.2 `components/{slice}`

`components/{slice}`는 여러 곳에서 재사용되는 도메인 중립 조합 컴포넌트를 둔다.

예시는 다음과 같다.

- `components/data-table`
- `components/filter-panel`
- `components/search-box`
- `components/file-dropzone`
- `components/date-range-picker`

`components/{slice}`의 규칙은 다음과 같다.

- `base`만 import한다.
- 도메인별 데이터 구조와 문구는 props로 받는다.
- 도메인별 action button, column definition, empty message는 사용하는 layer에서 주입한다.
- 서버 통신, mutation, domain-specific validation은 포함하지 않는다.

### 6.3 판단 기준

| 질문 | 위치 |
| --- | --- |
| 가장 작은 UI primitive인가? | `src/base/ui` |
| 여러 곳에서 쓰는 도메인 중립 조합 컴포넌트인가? | `src/components/{slice}` |
| 특정 도메인을 표현하는 UI인가? | `src/entities/{slice}` |
| 특정 사용자 액션을 수행하는 UI인가? | `src/features/{slice}` |
| 특정 page 또는 module 흐름에 묶여 있는가? | `src/pages/{slice}` 또는 `src/modules/{slice}` |

## 7. 상세 참고 자료

- 기준 구조, 코드 배치 결정표, import 예시는 `references/architecture-details.md`를 필요할 때만 읽는다.
- 근거 자료와 외부 링크는 `references/sources.md`를 필요할 때만 읽는다.

## 8. 예외 처리 원칙

예외는 숨기지 않는다. 임시 예외와 장기 예외를 구분한다.

### 8.1 임시 예외

임시 예외는 다음 정보를 남긴다.

```md
아키텍처 예외
- 담당자: @owner
- 위반한 규칙: Public API / 레이어 방향 / slice 격리 / components-base 경계 / 기타
- 이유: 왜 지금 필요한가
- 제거 조건: 어떤 조건에서 제거할 것인가
- 제거 예상: YYYY-MM-DD 또는 마일스톤
```

### 8.2 장기 예외

장기 예외는 해당 단일 기준 문서 본문에 직접 반영한다. 별도 문서, PR 설명, 이슈 댓글에만 남기지 않는다.

장기 예외가 될 수 있는 조건은 다음과 같다.

- 제품 또는 library 제약 때문에 반복적으로 필요한 구조다.
- 우회 비용보다 명시적 예외 관리 비용이 낮다.
- 경계와 책임이 문서화되어 있고, 무분별한 확장을 막을 수 있다.

## 9. 리뷰 체크리스트

구조 변경 PR을 리뷰할 때 아래를 확인한다.

- 의존 방향이 위에서 아래로만 흐르는가?
- 같은 레이어 cross-import가 숨어 있지 않은가?
- 외부 import가 public API를 통하는가?
- 내부 파일 deep import가 생기지 않았는가?
- 단일 사용 코드를 너무 일찍 `features`, `entities`, `components`, `base`로 올리지 않았는가?
- `base`가 domain logic 저장소가 되고 있지 않은가?
- `components`가 domain-specific UI나 feature logic을 흡수하고 있지 않은가?
- `app`이 화면별 business logic이나 세부 UI 조립을 흡수하고 있지 않은가?
- segment 이름이 코드 종류가 아니라 목적을 설명하는가?
- 타입이 책임 있는 위치에 colocate되어 있는가?
- 예외가 있다면 owner, reason, removal condition이 남아 있는가?

## 10. 응답 형식 가이드

이 스킬을 사용해 답변할 때는 아래 형식을 선호한다.

```md
판단: [유지 / 이동 / 승격 / 예외 승인 / 예외 불가]
권장 위치: `src/...`
이유: [Locality First, proven reuse, dependency direction, public API, components-base boundary 중 근거]
수정 제안:
- [import 변경 또는 파일 이동]
- [public API export 추가/삭제]
주의: [예외, 마이그레이션, 후속 작업]
```

간단한 리뷰라면 위 형식을 축약해도 된다. 하지만 구조 변경의 이유와 권장 위치는 반드시 명시한다.

## 11. 문서 유지 원칙

- 프론트엔드 공통 경계가 바뀌면 이 스킬 문서를 갱신한다.
- 구조적 결정은 가능하면 해당 주제의 단일 기준 본문에 반영한다.
- 운영 규칙과 아키텍처 규칙을 섞지 않는다. 네이밍 상세, 테스트 파일명, styling, lint/prettier/import-sort는 별도 문서에서 다룬다.
- 문서가 현행 구현보다 앞설 수 있다. 이 경우 차이는 마이그레이션 항목으로 관리하고, 레거시 구현을 기준 규칙으로 격상하지 않는다.

