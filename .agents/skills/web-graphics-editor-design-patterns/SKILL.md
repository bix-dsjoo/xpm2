---
name: web-graphics-editor-design-patterns
description: "Use this skill when designing, implementing, reviewing, or refactoring a web graphics editor, canvas editor, SVG/DOM/WebGL shape editor, annotation tool, diagram editor, prototyping tool, whiteboard, or image editor with editable objects. Trigger for undo/redo, selection, dragging, resizing, grouping, layers, hit testing, tool modes, editor commands, model-view separation, canvas architecture, MVC, Observer, Composite, Factory, State, Strategy/EditPolicy, Command patterns, 캔버스 편집기, 도형 편집기, 어노테이션, 다이어그램, 화이트보드. Do not use for static image viewers or simple one-off prototypes unless they may become product code."
---

# 웹 기반 그래픽 편집기의 구조와 7가지 디자인 패턴

## 목적

이 스킬은 웹 기반 그래픽 편집기를 설계할 때 반복적으로 발생하는 문제를 패턴 단위로 분리해, 변경에 강한 구조를 만드는 데 사용한다. 핵심 관점은 다음 한 문장이다.

> 편집 작업은 사용자 입력 이벤트를 에디터의 고수준 요청으로 바꾸고, 그 요청을 모델 변경과 화면 갱신으로 연결하는 과정이다.

따라서 구현의 초점은 “도형을 어떻게 그릴까?”보다 “이벤트, 모델, 뷰, 편집 정책, 히스토리를 어떻게 분리할까?”에 둔다.

## 사용할 때

- 웹 캔버스, SVG, DOM, WebGL 기반 그래픽 편집기를 설계할 때
- UI 프로토타이핑 도구, 다이어그램 편집기, 이미지 편집기, 어노테이션 툴을 만들 때
- 도형 타입, 툴, 편집 동작, 히스토리 기능이 계속 늘어나는 코드베이스를 리팩터링할 때
- `if/else` 또는 `switch`가 도형 타입, 툴 타입, 편집 모드에 따라 계속 증가할 때
- undo/redo, 선택, 드래그, 리사이즈, 그룹, 레이어, 단축키 구조를 일관되게 설계해야 할 때

## 사용하지 않아도 되는 경우

- 단순 이미지 뷰어처럼 사용자가 모델을 편집하지 않는 경우
- 도형 타입과 편집 동작이 거의 고정되어 있고 확장 가능성이 낮은 경우
- 일회성 프로토타입이라 구조보다 빠른 검증이 중요한 경우

단, 프로토타입이 제품 코드로 전환될 가능성이 있다면 최소한 `Model`, `Viewer`, `Tool`, `CommandStack`의 경계는 먼저 잡는다.

## 핵심 멘탈 모델

도화지에 그림을 그릴 때는 “도구를 움직인다 → 도구의 흔적이 전달된다 → 도화지 상태가 변한다”는 흐름이 있다. 웹 편집기도 같다.

```text
입력 장치 이동
  -> 브라우저 이벤트 발생
  -> 에디터 이벤트/요청으로 변환
  -> 컨트롤러가 모델 변경 명령 생성
  -> 모델 변경
  -> 뷰 갱신
```

이 구조의 목표는 사용자의 멘탈 모델과 컴퓨터의 데이터 모델 사이의 간극을 줄이는 것이다. 사용자는 “도형을 직접 잡아 움직인다”고 느끼지만, 실제 구현은 이벤트, 요청, 정책, 커맨드, 모델, 뷰 갱신의 연쇄로 이루어진다.

## 기본 아키텍처

```text
Workbench
  ├─ Toolbar / Menu / Shortcut
  ├─ Tool Palette
  ├─ GraphicViewer / Canvas
  │   ├─ RootPart
  │   │   └─ Part tree
  │   │       └─ Figure tree
  │   └─ EventDispatcher
  ├─ Property Panel
  ├─ Layer Panel
  └─ History Panel
      └─ CommandStack
```

### 주요 컴포넌트

| 컴포넌트 | 책임 | 직접 알면 안 되는 것 |
|---|---|---|
| `Model` | 편집 가능한 도메인 데이터. 예: 사각형, 원, 패스, 그룹, 레이어 | 구체적인 뷰와 컨트롤러 |
| `GraphicViewer` | 캔버스/편집 영역. 모델을 파트로 변환하고 이벤트를 현재 툴로 전달 | 도형별 생성 세부 로직, 툴별 동작 분기 |
| `EventDispatcher` | 브라우저의 저수준 이벤트를 에디터의 고수준 이벤트로 정규화 | 모델 수정 로직 |
| `Tool` | 현재 편집 상태. 예: 선택 툴, 사각형 툴, 펜 툴, 지우개 툴 | 모든 파트의 수정 가능 여부와 수정 방식 |
| `Request` | 툴이 만든 고수준 편집 요청. 예: move, resize, erase, create | 명령 실행 이력 |
| `Part` | 모델과 뷰 사이의 컨트롤러. 이벤트 요청을 해석하고 정책을 선택 | 구체적인 모든 편집 알고리즘 |
| `Figure` | 실제 화면 표현. DOM/SVG/Canvas draw primitive 등 | 도메인 규칙 |
| `EditPolicy` | 특정 편집 요청을 처리하는 마이크로 컨트롤러/전략 | 툴의 UI 상태 |
| `Command` | 모델 변경을 캡슐화한 실행/취소 가능한 명령 | 브라우저 이벤트 |
| `CommandStack` | undo/redo 히스토리 관리 | 도형 렌더링 방식 |
| `ActionRegistry` | 단축키/메뉴 액션과 커맨드 연결 | 개별 도형의 렌더링 세부사항 |

## 표준 흐름

```text
1. GraphicEditor가 저장된 Model을 읽는다.
2. GraphicViewer가 PartFactory에 모델별 Part 생성을 요청한다.
3. Part는 Figure를 만들고, 자식 Part/Figure를 트리로 구성한다.
4. EventDispatcher가 pointer/mouse/keyboard 이벤트를 정규화한다.
5. GraphicViewer가 현재 Tool에 에디터 이벤트를 전달한다.
6. Tool은 이벤트를 Request로 바꾼다.
7. 대상 Part는 Request를 해석하고 적절한 EditPolicy에 위임한다.
8. EditPolicy는 Command를 생성한다.
9. CommandStack이 Command를 실행하고 undo 히스토리에 쌓는다.
10. Model 변경이 Observer를 통해 전파되고 Part/Figure가 갱신된다.
```


## 핵심 판단 규칙

- 이벤트는 브라우저 이벤트 그대로 퍼뜨리지 말고 editor-level event 또는 `Request`로 정규화한다.
- `Tool`은 현재 편집 상태를 담당하고, 모델을 직접 수정하지 않는다.
- `Part`는 모델과 화면 표현 사이의 controller 역할을 하며, 요청 처리는 `EditPolicy`에 위임한다.
- 실제 모델 변경은 `Command`로 캡슐화하고 `CommandStack`을 통해 실행한다.
- 모델 변경 후 화면 갱신은 observer/transaction 경계를 통해 전파한다.
- 도형 타입 추가가 `GraphicViewer`의 이벤트 처리 분기를 늘리면 factory/registry 경계가 부족한 신호다.

## 상세 참고 자료

- 7가지 패턴별 문제, 규칙, 타입 예시, 구현 절차, 확장 레시피, 테스트 체크리스트는 `references/patterns-and-recipes.md`를 필요할 때만 읽는다.
