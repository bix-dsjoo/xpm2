# 프론트엔드 아키텍처 상세

## 7. 기준 구조

```text
src/
  app/
    providers/
      index.ts
    routes/
      index.ts
    styles/
    index.tsx

  pages/
    login/
      ui/
      model/
      api/
      index.ts
    workspace/
      ui/
      model/
      api/
      index.ts

  modules/
    header/
      ui/
      model/
      index.ts
    workspace-toolbar/
      ui/
      model/
      api/
      index.ts

  features/
    sign-in/
      ui/
      model/
      api/
      index.ts
    connect-printer/
      ui/
      model/
      api/
      index.ts

  entities/
    user/
      ui/
      model/
      api/
      index.ts
    printer/
      ui/
      model/
      api/
      @x/
        workspace.ts
      index.ts

  components/
    data-table/
      ui/
      model/
      lib/
      index.ts
    filter-panel/
      ui/
      model/
      index.ts

  base/
    ui/
      index.ts
    api/
      index.ts
    lib/
    config/
```

## 8. 코드 배치 결정표

| 질문 | 위치 |
| --- | --- |
| 앱 엔트리포인트, provider, router 구성인가? | `src/app` |
| 한 화면에서만 쓰는가? | `src/pages/{slice}` |
| 의미 있는 화면 블록 또는 큰 조립 단위인가? | `src/modules/{slice}` |
| 여러 화면에서 반복되는 사용자 액션인가? | `src/features/{slice}` |
| 여러 기능이 공유하는 도메인 개념인가? | `src/entities/{slice}` |
| `base/ui`보다 큰 도메인 중립 공통 UI 조합인가? | `src/components/{slice}` |
| 비즈니스 중립 공통 기반 코드인가? | `src/base/{segment}` |

| 사례 | 권장 위치 |
| --- | --- |
| 앱 provider 조립과 router 설정 | `src/app` |
| 프로필 화면에서만 쓰는 form, validation, fetch | `src/pages/profile` |
| 여러 화면에서 쓰는 header block | `src/modules/header` |
| 여러 화면에서 쓰는 로그인 제출 액션 | `src/features/sign-in` |
| 여러 기능에서 쓰는 `printer` 모델과 카드 UI | `src/entities/printer` |
| 도메인과 관련 없는 data table | `src/components/data-table` |
| button, input, dialog primitive | `src/base/ui` |
| 날짜 포맷터, debounce, API client | `src/base/lib`, `src/base/api` |
| 특정 module에서만 쓰는 로컬 상태와 조회 로직 | 해당 `src/modules/{slice}` |

## 9. 임포트 경계 예시

### 9.1 좋은 예

```ts
// src/pages/workspace/ui/workspace-page.tsx
import { ConnectPrinterButton } from "@/features/connect-printer";
import { PrinterCard } from "@/entities/printer";
import { DataTable } from "@/components/data-table";
```

```ts
// src/entities/workspace/model/workspace.ts
import type { Printer } from "@/entities/printer/@x/workspace";
```

```ts
// src/app/routes/index.ts
import { WorkspacePage } from "@/pages/workspace";
import { LoginPage } from "@/pages/login";
```

```ts
// connect-printer feature의 model 파일
import { createPrinterConnection } from "@/entities/printer";
import { apiClient } from "@/base/api";
```

```ts
// src/components/data-table/ui/data-table.tsx
import { Button } from "@/base/ui";
```

### 9.2 나쁜 예

```ts
// save-order feature의 ui 파일
import { SaveLabelButton } from "@/features/save-label";
```

이유: 같은 레이어의 feature slice를 직접 import했다. 공통 사용자 액션으로 승격하거나 상위 조립 계층에서 둘을 조합한다.

```ts
// src/pages/workspace/ui/workspace-page.tsx
import { PrinterCard } from "@/entities/printer/ui/printer-card";
```

이유: entity 내부 파일을 직접 import했다. `@/entities/printer` public API로 import해야 한다.

```ts
// src/base/lib/format-printer-status.ts
import { PrinterStatus } from "@/entities/printer";
```

이유: `base`가 `entities`를 import했다. 비즈니스 중립 formatter로 분리하거나 entity 전용 formatter를 `entities/printer`에 둔다.

```ts
// src/components/data-table/model/use-printer-table.ts
import { PrinterStatus } from "@/entities/printer";
```

이유: `components`가 도메인 entity를 import했다. 도메인별 상태, 컬럼, 문구는 사용하는 layer에서 주입한다.

```ts
// src/modules/header/ui/header.tsx
import { WorkspacePage } from "@/pages/workspace";
```

이유: `modules`가 상위 레이어인 `pages`를 import했다. page에서 module을 조립해야 한다.

## 10. 예외 처리 원칙

예외는 숨기지 않는다. 임시 예외와 장기 예외를 구분한다.

### 10.1 임시 예외

임시 예외는 다음 정보를 남긴다.

```md
아키텍처 예외
- 담당자: @owner
- 위반한 규칙: Public API / 레이어 방향 / slice 격리 / components-base 경계 / 기타
- 이유: 왜 지금 필요한가
- 제거 조건: 어떤 조건에서 제거할 것인가
- 제거 예상: YYYY-MM-DD 또는 마일스톤
```

### 10.2 장기 예외

장기 예외는 해당 단일 기준 문서 본문에 직접 반영한다. 별도 문서, PR 설명, 이슈 댓글에만 남기지 않는다.

장기 예외가 될 수 있는 조건은 다음과 같다.

- 제품 또는 library 제약 때문에 반복적으로 필요한 구조다.
- 우회 비용보다 명시적 예외 관리 비용이 낮다.
- 경계와 책임이 문서화되어 있고, 무분별한 확장을 막을 수 있다.


