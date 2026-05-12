# 웹 그래픽 편집기 패턴 상세

## 목차

- 7가지 디자인 패턴
- 구현 절차
- 확장 레시피
- 설계 원칙
- 테스트 체크리스트
- 최소 타입 설계 예시
- 의사결정 가이드
- 구현 순서 추천
- 성능과 안정성 주의점

## 7가지 디자인 패턴

### 1. MVC 패턴

**문제**
사용자의 편집 의도와 컴퓨터의 도메인 데이터는 서로 다르다. 이벤트 처리, 도메인 변경, 화면 갱신을 한곳에 섞으면 도형과 툴이 늘어날수록 코드가 급격히 복잡해진다.

**적용**

```text
Model      = 도메인 데이터
View       = Figure / Canvas / DOM / SVG 표현
Controller = Part / Tool / EditPolicy
```

**규칙**

- 모델은 뷰와 컨트롤러의 존재를 몰라야 한다.
- 뷰는 이벤트를 컨트롤러로 전달하고, 모델 수정 방법을 직접 알지 않는다.
- 컨트롤러는 사용자 요청을 모델 변경 명령으로 바꾼다.
- 동일 모델을 여러 뷰로 보여줄 수 있어야 한다.

**체크리스트**

- [ ] 도메인 모델이 DOM, Canvas context, React component를 직접 참조하지 않는다.
- [ ] 뷰 컴포넌트가 모델 수정 알고리즘을 직접 갖지 않는다.
- [ ] 편집 요청은 `Request` 또는 `Command` 같은 명시적 객체로 표현된다.

### 2. 옵저버 패턴

**문제**
모델 변경 후 어떤 뷰와 컨트롤러를 갱신해야 하는지 모델이 모두 알고 있으면 결합도가 높아진다.

**적용**
모델은 변경 이벤트를 발행하고, 파트/뷰어/패널은 구독한다.

```ts
interface ModelObserver {
  onModelChanged(event: ModelChangeEvent): void;
}

class DocumentModel {
  private observers = new Set<ModelObserver>();

  subscribe(observer: ModelObserver) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify(event: ModelChangeEvent) {
    for (const observer of this.observers) observer.onModelChanged(event);
  }
}
```

**규칙**

- 모델은 구독자의 구체 타입을 몰라야 한다.
- 파트/뷰가 사라질 때 반드시 구독을 해지한다.
- 변경 이벤트는 너무 세밀하지도, 너무 포괄적이지도 않게 설계한다.

**체크리스트**

- [ ] 컴포넌트 unmount/destroy 시 unsubscribe가 호출된다.
- [ ] 모델 변경 이벤트가 command 실행 결과와 일관된다.
- [ ] 중복 렌더링을 막기 위한 batching 또는 transaction 경계가 있다.

### 3. 컴포지트 패턴

**문제**
단일 도형뿐 아니라 그룹, 레이어, 중첩 프레임처럼 부분-전체 구조를 같은 방식으로 다뤄야 한다.

**적용**
개별 Part와 복합 Part를 동일 인터페이스로 취급한다.

```ts
interface Part {
  model: GraphicModel;
  figure: Figure;
  render(): void;
  refresh(): void;
  addChild?(child: Part): void;
  removeChild?(child: Part): void;
}
```

**규칙**

- 그룹, 레이어, 프레임은 자식 Part를 가진 Composite Part가 된다.
- 사각형, 텍스트, 패스처럼 자식을 가질 수 없는 요소는 Leaf Part가 된다.
- 투명성과 타입 안정성의 균형을 잡는다. 모든 Part에 `addChild`를 노출하면 단순하지만, Leaf에서 런타임 에러가 생길 수 있다.

**체크리스트**

- [ ] render/refresh가 트리 전체에 재귀적으로 적용된다.
- [ ] Leaf Part에는 자식 추가가 불가능하다는 정책이 명확하다.
- [ ] 그룹 이동, 레이어 숨김, 선택 영역 계산이 트리 단위로 동작한다.

### 4. 단순 팩토리 패턴

**문제**
모델 타입이 늘어날 때마다 `GraphicViewer`의 `if/else` 또는 `switch`를 수정하면 뷰어가 모든 도형 타입을 알아야 한다.

**적용**
변화하는 생성 로직을 `PartFactory`로 분리한다.

```ts
type ModelType = 'rect' | 'ellipse' | 'path' | 'text' | 'group';

interface GraphicModel {
  id: string;
  type: ModelType;
}

interface PartFactory {
  create(model: GraphicModel): Part;
}

class DefaultPartFactory implements PartFactory {
  create(model: GraphicModel): Part {
    switch (model.type) {
      case 'rect': return new RectPart(model);
      case 'ellipse': return new EllipsePart(model);
      case 'path': return new PathPart(model);
      case 'text': return new TextPart(model);
      case 'group': return new GroupPart(model);
      default: throw new Error(`Unsupported model type: ${(model as any).type}`);
    }
  }
}

class GraphicViewer {
  constructor(private partFactory: PartFactory) {}

  createParts(models: GraphicModel[]) {
    return models.map((model) => this.partFactory.create(model));
  }
}
```

**규칙**

- `GraphicViewer`는 구체 Part 타입을 몰라야 한다.
- 도형 타입 추가 시 수정 범위는 Factory와 신규 Part/Figure로 제한한다.
- 플러그인 구조가 필요하면 registry 기반 factory로 확장한다.

**체크리스트**

- [ ] 새 도형 타입을 추가할 때 Viewer 코드를 수정하지 않는다.
- [ ] Factory 반환 타입은 구체 타입이 아니라 `Part` 추상 타입이다.
- [ ] 지원하지 않는 모델 타입에 대한 에러 메시지가 명확하다.

### 5. 상태 패턴

**문제**
같은 이벤트라도 현재 선택된 툴에 따라 결과가 달라진다. 드래그 이벤트는 선택 툴에서는 이동, 사각형 툴에서는 생성, 펜 툴에서는 경로 입력이 된다.

**적용**
현재 툴을 에디터의 상태로 보고, 이벤트 처리를 각 Tool 클래스에 위임한다.

```ts
interface Tool {
  onPointerDown(event: EditorPointerEvent, context: ToolContext): void;
  onPointerMove(event: EditorPointerEvent, context: ToolContext): void;
  onPointerUp(event: EditorPointerEvent, context: ToolContext): void;
}

class GraphicViewer {
  private currentTool: Tool = new SelectionTool();

  setTool(tool: Tool) {
    this.currentTool = tool;
  }

  receive(event: EditorPointerEvent) {
    if (event.kind === 'pointerdown') this.currentTool.onPointerDown(event, this.context);
    if (event.kind === 'pointermove') this.currentTool.onPointerMove(event, this.context);
    if (event.kind === 'pointerup') this.currentTool.onPointerUp(event, this.context);
  }
}
```

**규칙**

- Viewer가 “현재 툴이 무엇인지”는 알아도 “툴별 편집 알고리즘”은 몰라야 한다.
- 툴은 이벤트를 `Request`로 바꾸는 데 집중한다.
- 툴이 직접 모델을 수정하지 않도록 한다.

**체크리스트**

- [ ] 툴 추가 시 Viewer의 이벤트 분기 코드가 증가하지 않는다.
- [ ] 드래그 시작/진행/종료 상태가 Tool 내부에서 일관되게 관리된다.
- [ ] pointer capture, modifier key, snapping 같은 입력 보정은 공통 기반 클래스 또는 context로 분리된다.

### 6. 전략 패턴 / 편집 정책

**문제**
툴이 모델을 직접 수정하면 모든 파트의 편집 가능 여부와 수정 방식을 알아야 한다. 반대로 Part 안에 모든 수정 로직을 넣으면 Part가 비대해지고 중복이 늘어난다.

**적용**
모델 수정 알고리즘을 `EditPolicy`로 분리하고, Part가 요청에 맞는 정책을 선택한다.

```ts
type RequestType = 'create' | 'move' | 'resize' | 'erase' | 'reorder';

interface Request {
  type: RequestType;
  payload: unknown;
}

interface EditPolicy {
  understands(request: Request): boolean;
  getCommand(request: Request, host: Part): Command | null;
}

class ResizablePolicy implements EditPolicy {
  understands(request: Request) {
    return request.type === 'resize';
  }

  getCommand(request: Request, host: Part) {
    return new ResizeCommand(host.model, request.payload as ResizePayload);
  }
}

class BasePart implements Part {
  private policies: EditPolicy[] = [];

  installPolicy(policy: EditPolicy) {
    this.policies.push(policy);
  }

  getCommand(request: Request): Command | null {
    for (const policy of this.policies) {
      if (policy.understands(request)) return policy.getCommand(request, this);
    }
    return null;
  }
}
```

**규칙**

- Tool은 “무엇을 요청하는지”만 알고, “어떻게 모델을 바꾸는지”는 모른다.
- Part는 어떤 정책을 사용할지 선택한다.
- EditPolicy는 요청을 Command로 바꾼다.
- 같은 정책은 여러 Part에서 재사용한다.

**체크리스트**

- [ ] 지우개 툴이 비트맵/벡터/텍스트별 삭제 가능 여부를 직접 알지 않는다.
- [ ] 편집 로직이 Part 내부에 중복되어 있지 않다.
- [ ] Part별로 설치된 Policy 목록을 테스트할 수 있다.

### 7. 커맨드 패턴

**문제**
모델을 직접 변경하면 undo/redo 히스토리를 만들기 어렵다. 변경 전후 상태, 실행 가능 여부, 취소 가능 여부를 일관되게 관리해야 한다.

**적용**
모든 모델 변경을 `Command` 객체로 캡슐화하고 `CommandStack`이 실행한다.

```ts
interface Command {
  label: string;
  canExecute(): boolean;
  execute(): void;
  undo(): void;
  redo(): void;
}

class CommandStack {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command) {
    if (!command.canExecute()) return;
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo() {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo();
    this.redoStack.push(command);
  }

  redo() {
    const command = this.redoStack.pop();
    if (!command) return;
    command.redo();
    this.undoStack.push(command);
  }
}
```

**규칙**

- 모델 변경은 가능하면 Command를 통해서만 수행한다.
- Command는 실행 전 상태와 실행 후 상태를 복원할 수 있어야 한다.
- 연속 드래그 같은 동작은 하나의 compound command 또는 transaction으로 묶는다.
- Command 실행 후 모델 변경 이벤트가 발행되어 뷰가 갱신된다.

**체크리스트**

- [ ] 모든 사용자 편집 액션에 undo 테스트가 있다.
- [ ] redo 후 모델 상태가 최초 execute 후 상태와 같다.
- [ ] 실패한 command는 히스토리에 쌓이지 않는다.
- [ ] 복수 도형 이동/그룹화는 compound command로 처리한다.

## 구현 절차

### 1단계: 도메인 모델 정의

모델은 화면 기술에 독립적인 데이터여야 한다.

```ts
interface RectModel {
  id: string;
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
}

interface GroupModel {
  id: string;
  type: 'group';
  children: GraphicModel[];
}

type GraphicModel = RectModel | GroupModel;
```

권장 규칙:

- 좌표계, 단위, transform 기준을 먼저 정한다.
- 렌더링 구현체에 종속적인 값을 모델에 넣지 않는다.
- 식별자 `id`는 command, selection, observer 이벤트에서 공통으로 사용한다.

### 2단계: 파트와 화면 표현 분리

```text
Model  -> Part  -> Figure
데이터    제어     표현
```

권장 규칙:

- Part는 모델을 해석하고 Figure를 갱신한다.
- Figure는 화면 표현에 집중한다.
- React/Vue/Svelte를 사용하더라도 Part를 별도 계층으로 두면 편집 정책을 UI 프레임워크에서 분리하기 쉽다.

### 3단계: 팩토리로 파트 생성 분리

도형 타입별 Part 생성 로직은 Viewer에 두지 않는다. `PartFactory` 또는 `PartRegistry`를 둔다.

```ts
class PartRegistry {
  private creators = new Map<string, (model: GraphicModel) => Part>();

  register(type: string, creator: (model: GraphicModel) => Part) {
    this.creators.set(type, creator);
  }

  create(model: GraphicModel) {
    const creator = this.creators.get(model.type);
    if (!creator) throw new Error(`No Part registered for ${model.type}`);
    return creator(model);
  }
}
```

### 4단계: 이벤트 정규화

브라우저 이벤트를 그대로 모든 계층에 전달하지 않는다. 에디터 전용 이벤트로 바꾼다.

```ts
interface EditorPointerEvent {
  kind: 'pointerdown' | 'pointermove' | 'pointerup';
  pointerId: number;
  x: number;
  y: number;
  buttons: number;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  targetPartId?: string;
}
```

권장 규칙:

- mouse, touch, pen 입력은 가능하면 pointer event 계층에서 통합한다.
- 화면 좌표와 문서 좌표 변환을 한곳에서 처리한다.
- hit test 결과를 `targetPartId` 또는 `targetPart`로 명시한다.

### 5단계: 도구는 요청만 만든다

```ts
class SelectionTool implements Tool {
  onPointerDown(event: EditorPointerEvent, context: ToolContext) {
    const target = context.findPart(event.targetPartId);
    context.selection.set(target?.model.id ?? null);
  }

  onPointerMove(event: EditorPointerEvent, context: ToolContext) {
    if (!context.dragging) return;
    const request: Request = {
      type: 'move',
      payload: { dx: context.dragDelta.x, dy: context.dragDelta.y },
    };
    context.sendRequestToSelection(request);
  }

  onPointerUp() {}
}
```

툴이 모델을 직접 수정하기 시작하면 즉시 설계를 되돌아본다.

### 6단계: 파트가 편집 정책에 위임한다

```ts
function handleRequest(part: Part, request: Request, stack: CommandStack) {
  const command = part.getCommand(request);
  if (command) stack.execute(command);
}
```

권장 규칙:

- 요청 처리 가능 여부는 Part/Policy 조합이 결정한다.
- Tool은 실패한 요청을 UI 피드백으로만 처리한다.
- Policy는 Command 생성을 책임진다.

### 7단계: 커맨드 스택으로 히스토리를 완성한다

```text
Tool -> Request -> Part -> EditPolicy -> Command -> CommandStack -> Model -> Observer -> Figure refresh
```

권장 규칙:

- 직접 모델 변경 API와 command 기반 변경 API를 혼용하지 않는다.
- command 실행 중 발생한 모델 이벤트는 transaction 단위로 묶는다.
- command label은 History Panel에 표시할 수 있게 만든다.

## 확장 레시피

### 새 도형 타입 추가

1. `GraphicModel` union에 새 타입을 추가한다.
2. 새 `Part`와 `Figure`를 만든다.
3. `PartFactory` 또는 `PartRegistry`에 등록한다.
4. 필요한 `EditPolicy`를 설치한다.
5. 렌더링, 선택, 이동, undo/redo 테스트를 추가한다.

수정되면 안 되는 영역:

- `GraphicViewer`의 이벤트 처리 로직
- 기존 Tool의 타입 분기
- 기존 CommandStack

### 새 툴 추가

1. `Tool` 인터페이스 구현체를 만든다.
2. 브라우저 이벤트를 직접 받지 말고 정규화된 `EditorPointerEvent`를 사용한다.
3. 모델을 직접 수정하지 말고 `Request`를 만든다.
4. 필요한 경우 새 `EditPolicy`와 `Command`를 만든다.
5. Tool Palette에서 현재 툴을 교체한다.

수정되면 안 되는 영역:

- `GraphicViewer`의 도형별 모델 수정 로직
- 기존 Part 내부의 공통 수정 로직

### 새 편집 동작 추가

예: align, distribute, lock, crop, reorder

1. `RequestType`을 추가한다.
2. 해당 요청을 처리하는 `EditPolicy`를 만든다.
3. 실제 모델 변경은 `Command`로 구현한다.
4. 필요한 Part에 Policy를 설치한다.
5. undo/redo 테스트를 작성한다.

## 설계 원칙

### 변경 지점별 책임 분리

| 변경되는 것 | 고립할 위치 |
|---|---|
| 도형 타입 | `PartFactory`, `PartRegistry` |
| 도형의 화면 표현 | `Figure` |
| 현재 편집 모드 | `Tool` |
| 편집 가능 여부/알고리즘 | `EditPolicy` |
| 모델 변경 이력 | `Command`, `CommandStack` |
| 모델 변경 감지 | `Observer` |
| 중첩 구조 | `Composite Part/Figure` |

### 피해야 할 냄새

- Viewer가 도형 타입별 생성/수정/렌더링을 모두 처리한다.
- Tool이 특정 Part 타입을 모두 알고 있다.
- Model이 DOM 노드, Canvas context, React state setter를 직접 참조한다.
- undo/redo를 위해 모델 스냅샷만 계속 저장한다.
- Part 내부에 resize, move, erase, create 로직이 모두 들어 있다.
- 구독 해지가 없어 뷰가 제거된 뒤에도 모델 이벤트를 받는다.
- Leaf 객체에 `addChild`가 열려 있어 런타임 오류가 자주 발생한다.

## 테스트 체크리스트

### 팩토리

- [ ] 모든 모델 타입이 올바른 Part로 변환된다.
- [ ] 알 수 없는 타입은 명확한 에러를 낸다.
- [ ] 새 도형 추가 시 Viewer 테스트가 깨지지 않는다.

### 컴포지트

- [ ] 그룹/레이어 내부의 모든 자식이 렌더링된다.
- [ ] 부모 transform이 자식 좌표 계산에 반영된다.
- [ ] Leaf Part에 자식을 추가하려 할 때 정책대로 동작한다.

### 도구 / 상태

- [ ] 같은 pointer event가 툴별로 다른 Request를 만든다.
- [ ] 툴 전환 시 이전 툴의 드래그 상태가 정리된다.
- [ ] modifier key 조합이 기대대로 동작한다.

### 편집 정책 / 전략

- [ ] Part별로 허용된 요청과 거부된 요청이 명확하다.
- [ ] 같은 Policy를 여러 Part에서 재사용할 수 있다.
- [ ] 요청 실패 시 command가 생성되지 않는다.

### 커맨드

- [ ] execute → undo → redo 순서에서 모델 상태가 정확히 복원된다.
- [ ] compound command가 부분 실패를 안전하게 처리한다.
- [ ] command 실행 후 모델 변경 이벤트가 한 번 또는 의도한 횟수만 발행된다.

### 옵저버

- [ ] 모델 변경 시 해당 Part/Figure만 갱신된다.
- [ ] destroy/unmount 후 이벤트가 전달되지 않는다.
- [ ] 대량 변경 시 batching이 동작한다.

## 최소 타입 설계 예시

```ts
interface GraphicModel {
  id: string;
  type: string;
}

interface Figure {
  mount(parent: unknown): void;
  update(model: GraphicModel): void;
  unmount(): void;
}

interface Part {
  model: GraphicModel;
  figure: Figure;
  refresh(): void;
  getCommand(request: Request): Command | null;
}

interface ToolContext {
  viewer: GraphicViewer;
  commandStack: CommandStack;
  selection: SelectionModel;
  findPart(id?: string): Part | null;
  sendRequestToSelection(request: Request): void;
}

interface Tool {
  onPointerDown(event: EditorPointerEvent, context: ToolContext): void;
  onPointerMove(event: EditorPointerEvent, context: ToolContext): void;
  onPointerUp(event: EditorPointerEvent, context: ToolContext): void;
}
```

## 의사결정 가이드

### `Simple Factory`와 `Factory Method`와 `Abstract Factory` 비교

- 도형 타입에 따라 Part만 생성하면 `Simple Factory`로 충분하다.
- 하위 클래스가 생성 방식을 바꾸게 하려면 `Factory Method`를 고려한다.
- 서로 연관된 제품군, 예를 들어 `Part + Figure + EditPolicy bundle`을 테마나 플랫폼별로 교체해야 한다면 `Abstract Factory`를 고려한다.

### `State`와 `Strategy` 비교

- 현재 상태에 따라 같은 이벤트의 의미가 달라지면 `State`를 쓴다. 예: 선택 툴, 펜 툴, 사각형 툴.
- 같은 요청을 처리하는 알고리즘을 교체하거나 재사용해야 하면 `Strategy`를 쓴다. 예: resize policy, move policy, erase policy.

### `Snapshot history`와 `Command history` 비교

- 매우 작은 모델이고 편집 빈도가 낮으면 snapshot history도 가능하다.
- 실제 그래픽 편집기처럼 변경 단위, 선택 상태, compound action, redo label이 중요하면 `Command`가 적합하다.

## 구현 순서 추천

1. `Model`과 좌표계 정의
2. `PartFactory`와 기본 Part/Figure 구현
3. `Composite` 기반 그룹/레이어 구조 구현
4. `EventDispatcher`와 정규화 이벤트 구현
5. `Tool` 상태 구조 구현
6. `Request`와 `EditPolicy` 구현
7. `CommandStack`과 undo/redo 구현
8. `Observer` 기반 refresh 구현
9. 단축키/메뉴를 `ActionRegistry`로 연결
10. 성능 최적화: hit test, partial refresh, transaction, batching

## 성능과 안정성 주의점

- hit test는 렌더링 트리와 분리해 캐시할 수 있다.
- 드래그 중에는 매 이벤트마다 command를 쌓지 말고 preview와 commit을 분리한다.
- 대량 모델 변경은 transaction으로 묶어 refresh를 줄인다.
- pointer event 처리 시 좌표 변환, zoom, pan, device pixel ratio를 일관되게 적용한다.
- Canvas 기반이면 Figure가 DOM 노드가 아닐 수 있으므로 `draw()`와 `invalidate()` 중심으로 설계한다.
- React 같은 선언형 UI를 사용해도 Command/Policy 계층은 프레임워크 외부에 두는 편이 테스트하기 쉽다.

## 한 줄 요약

웹 기반 그래픽 편집기의 좋은 구조는 `Event -> Tool(State) -> Request -> Part(MVC Controller) -> EditPolicy(Strategy) -> Command -> Model(Observer) -> Figure(Composite View)` 흐름을 명시적으로 만드는 것이다.

## 참고 자료

- FEConf2023 발표 정리: “웹 기반 그래픽 편집기의 구조와 7가지 디자인 패턴” 1부, 요즘IT, 2024-02-22
- FEConf2023 발표 정리: “웹 기반 그래픽 편집기의 구조와 7가지 디자인 패턴” 2부, 요즘IT, 2024-02-22
- Eclipse Graphical Editing Framework, Eclipse project documentation
- W3C Pointer Events Recommendation
- MDN Web Docs, Pointer events API

