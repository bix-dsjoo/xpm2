---
name: korean-jsdoc-style
description: "Use this skill when adding, reviewing, or refactoring JSDoc/TSDoc comments in this TypeScript/React repository. Trigger for JSDoc, TSDoc, Korean comments, public API docs, IDE hover DX, exported types/components/functions, and requests to make comments more readable or consistent."
---

# Korean JSDoc Style

이 스킬은 TypeScript/React 코드의 JSDoc을 IDE hover에서 읽기 좋은 한국어 문서로 유지하기 위한 기준이다. 목표는 설명을 많이 쓰는 것이 아니라, 사용하는 개발자가 결정을 빨리 내리게 돕는 것이다.

## 1. 적용 대상

JSDoc을 작성하거나 수정할 때는 먼저 문서화 대상이 외부 API인지 확인한다.

- `index.ts` 또는 명시된 public API에서 노출되는 컴포넌트, 타입, 함수는 문서화한다.
- public 타입의 필드는 오용 가능성이 있는 항목만 문서화한다.
- slice 내부에서만 쓰는 `lib`, `ui`, `config` export는 기본적으로 JSDoc을 쓰지 않는다.
- 내부 구현 타입, TanStack/meta adapter, formatter helper처럼 사용자가 직접 고르지 않는 코드는 이름과 타입으로 충분하면 주석을 생략한다.

## 2. 작성 원칙

- 첫 문장은 한 줄 summary로 끝낸다.
- 한국어는 짧고 직접적으로 쓴다.
- `입니다`, `합니다`로 끝나는 설명형 문장을 피하고 명사형이나 짧은 서술로 줄인다.
- 타입 이름, property 이름, 함수 이름을 그대로 풀어 설명하지 않는다.
- 타입으로 이미 보이는 정보는 반복하지 않는다.
- 기본값, 제약, 필수 조건, 부작용, 예외, deprecation처럼 사용 결정에 필요한 정보만 추가한다.
- 상세 설명이 필요할 때만 빈 줄 뒤에 두 번째 문장을 쓴다.
- 예제는 호출 모양이 헷갈리거나 조합 규칙이 있는 public API에만 `@example`로 추가한다.
- `@deprecated`처럼 IDE가 이해하는 태그는 의미가 있을 때 적극 사용한다.

## 3. 좋은 hover 기준

JSDoc을 남기기 전에 아래 질문을 통과해야 한다.

- 이 설명이 없으면 사용자가 잘못 쓸 가능성이 있는가?
- 기본값이나 조건부 필수 값처럼 타입만으로 부족한 정보가 있는가?
- hover에서 읽었을 때 다음 행동이 더 빨라지는가?

셋 다 아니라면 주석을 쓰지 않는다.

## 4. 선호 문장

짧은 명사형 또는 직접 서술형을 선호한다.

```ts
/**
 * 테이블 컬럼 정의.
 */
export type DataTableColumn<TData> = ...

/**
 * 셀 표시 방식.
 *
 * 기본값: `"text"`
 */
type?: Exclude<DataTableColumnType, "option">

/**
 * 옵션 컬럼의 표시 목록.
 *
 * `type: "option"`일 때 필수.
 */
options: Option[]

/**
 * 안정적인 행 ID 지정.
 */
getRowId?: (row: TData, index: number) => string
```

## 5. 피할 문장

이름과 타입만 다시 말하는 문장은 제거한다.

```ts
// 나쁨: header라는 이름과 ReactNode 타입으로 이미 알 수 있다.
/**
 * 테이블 헤더에 표시할 내용.
 */
header: ReactNode

// 나쁨: className이라는 이름이 이미 말한다.
/**
 * 테이블 바깥 래퍼에 추가할 className.
 */
className?: string
```

## 6. 검증

JSDoc을 수정한 뒤에는 다음을 확인한다.

- `rg -n "/\\*\\*" src/...`로 주석이 public API 중심으로 남았는지 확인한다.
- 내부 helper에 붙은 설명성 JSDoc은 제거한다.
- 코드 타입을 건드렸다면 `npm run typecheck`를 실행한다.
- import, dead code, lint 영향을 만들었다면 `npm run lint`를 실행한다.

## 7. 참고 기준

- TypeScript JSDoc Reference: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
- TSDoc `@remarks`: https://tsdoc.org/pages/tags/remarks/
- Google Developer Documentation Style Guide: https://developers.google.com/style/
- Microsoft Writing Style Guide: https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice
