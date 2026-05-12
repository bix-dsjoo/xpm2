# 프론트엔드 아키텍처 근거 자료

## 15. 근거 자료

이 스킬은 아래 자료를 기준으로 작성되었다.

- OpenAI Codex Agent Skills: `SKILL.md`는 필수 지침/메타데이터 파일이며 `name`, `description`을 포함해야 한다. Codex는 description을 통해 암시적 호출을 판단한다.  
  https://developers.openai.com/codex/skills
- OpenAI Codex Customization: 저장소별 스킬은 `.agents/skills`에 둘 수 있고, Codex는 메타데이터 → `SKILL.md` → references/scripts 순서로 점진적 공개를 사용한다.  
  https://developers.openai.com/codex/concepts/customization
- Feature-Sliced Design — Layers: 레이어 간 책임 분리와 단방향 의존성 원칙을 참고한다.  
  https://feature-sliced.design/docs/reference/layers
- Feature-Sliced Design — Slices and Segments: slice 격리, segment 구조, public API 규칙을 참고한다.  
  https://feature-sliced.design/docs/reference/slices-segments
- Feature-Sliced Design — Public API: public API를 slice와 외부 코드 사이의 계약으로 보고, 필요한 것만 노출하며, entity cross-import는 `@x` 표기법으로 제한한다.  
  https://feature-sliced.design/docs/reference/public-api
- Feature-Sliced Design v2.1 — Pages come first: 재사용되지 않는 큰 UI, form, data logic을 사용하는 위치 가까이에 둔다는 방향을 참고한다.  
  https://github.com/feature-sliced/documentation/discussions/756
- React Documentation: React 애플리케이션의 component composition과 root rendering 개념을 참고한다.  
  https://react.dev/
- GitLab Architecture Design Documents: 아키텍처 문서를 기술 비전과 원칙을 담은 버전 관리 기준선으로 유지한다는 관점을 따른다.  
  https://handbook.gitlab.com/handbook/engineering/architecture/design-documents/
- 카카오페이 기술 블로그 FSD 적용기: 실무에서 레이어 기반 구조가 코드 위치 명확성, 의존성 통제, 유지보수성 개선에 사용된 사례를 참고한다.  
  https://tech.kakaopay.com/post/fsd/

