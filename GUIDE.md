# 권한 메뉴 트리 — Vue → React 포팅 실습 가이드

Vue(`AuthGroup.vue` + Pinia store)로 했던 권한 메뉴 트리를 React + TypeScript로 옮기는 실습이에요.
**스캐폴드(틀)는 이미 완성**되어 있고, 핵심 로직 3개만 직접 채우면 됩니다.

---

## 0. 실행

```bash
npm run dev
```

브라우저에서 열고 → **"수정"** 버튼을 누르면 체크박스가 활성화돼요.
지금은 임시 구현이라 **일부러 버그가 있는 상태**입니다. STEP을 따라가며 고치면 완성돼요.

---

## 1. 파일 구조 한눈에

| 파일 | Vue에서의 대응 | 상태 |
|------|----------------|------|
| `src/types/menu.ts` | (없었음) TS 재귀 타입 | ✅ 완성 |
| `src/data/sampleMenu.ts` | API 응답 목 데이터 | ✅ 완성 |
| `src/hooks/useMenuTree.ts` | Pinia store (state + actions) | ✅ 완성 |
| `src/hooks/treeUtils.ts` | store의 toggle/indeterminate 함수들 | ⛔ **여기 3개 TODO** |
| `src/components/MenuTree.tsx` | `<template>`의 `v-for` 트리 | ✅ 완성 (재귀 컴포넌트) |
| `src/components/TriCheckbox.tsx` | `<v-checkbox-btn>` | ✅ 완성 |
| `src/App.tsx` | `AuthGroup.vue` 화면 조립 | ✅ 완성 |
| `src/hooks/treeUtils.solution.ts` | — | 📗 정답지 (막히면 비교) |

---

## 2. 먼저 알아야 할 Vue ↔ React 차이

가장 중요한 건 **불변성(immutability)** 이에요.

```ts
// Vue: 객체를 직접 바꿔도 반응성이 동작
item.view = true;
item.children.forEach(c => c.view = true);

// React: state를 직접 바꾸면 화면이 안 바뀜!
//        항상 "새 객체/새 배열"을 만들어 교체해야 한다
return { ...item, view: true };
```

| Vue | React |
|-----|-------|
| `ref` / `reactive` | `useState` |
| `computed` | 그냥 함수 호출 or `useMemo` |
| `v-model="item.view"` | `checked={...} onChange={...}` (수동) |
| `v-for` + depth마다 분기 | **재귀 컴포넌트** 하나로 |
| `item.view = x` (직접 변경) | `{ ...item, view: x }` (새 객체) |
| Pinia `state` + `actions` | `useState` + 변경 함수들 |

> Vue 코드는 `toggleItem`/`toggleChild`/`toggleGrand`로 depth별 함수가 3개였지만,
> React는 **재귀 함수 하나**로 depth 무제한 처리할 수 있어요. 이게 이번 실습의 핵심 수확.

---

## 3. 작업 순서

`src/hooks/treeUtils.ts`를 열면 위쪽에 **완성된 예시 2개**(`setAll`, `updateNodeById`)가 있어요.
이 패턴(`...item`, `children?.map(...)`)을 흉내내서 아래 TODO 3개를 채웁니다.

---

### STEP 4 — `getCheckState` (TODO #1, 제일 쉬움)

체크박스가 **checked / unchecked / indeterminate** 중 뭘로 보일지 계산.

- 자식 없으면: `item[type]` 보고 끝
- 자식 있으면: 자식들 상태를 재귀로 구해서
  - 전부 checked → `"checked"`
  - 전부 unchecked → `"unchecked"`
  - 섞임 → `"indeterminate"`

> Vue의 `indeterminate()` + `hasAllChecked()` + `hasAnyChecked()` 를 한 함수로 합친 것.

✅ **확인:** 자식 일부만 체크하면 부모 체크박스가 **회색 중간 상태**로 바뀌면 성공.

---

### STEP 5 — `toggleNode` (TODO #2, 핵심!)

체크박스 클릭 시: **자신+모든 자손을 통일**하고 **부모는 자식 기준으로 재계산**.

핵심 아이디어 — 트리를 `.map()`으로 재귀하며:

```ts
list.map((item) => {
  if (item.id === id) return setAll(item, type, nextValue); // 나 + 자손 통일
  if (item.children?.length) {
    const children = toggleNode(item.children, id, type, nextValue); // 자식 먼저 재귀
    return { ...item, children, [type]: children.every(c => c[type]) }; // 부모 재계산
  }
  return item;
});
```

> Vue의 `toggleItem`(아래로) + `toggleChild`/`toggleGrand`(위로) 를 **재귀 하나**로 통합.
> 직속 자식이 **전부 true**여야 부모도 true (`every`) — Vue 로직과 동일.

✅ **확인:** 부모를 켜면 자식 전부 켜지고, 자식 하나를 끄면 부모가 풀리면 성공.

---

### STEP 6 — `toggleAll` (TODO #3)

헤더 "전체 선택" → 전 depth 통일. `setAll`을 최상위 각 항목에 적용:

```ts
return list.map((item) => setAll(item, type, value));
```

> Vue의 `toggleViewAll` / `toggleAuthAll`.

✅ **확인:** 헤더 체크박스로 전체가 한 번에 켜지고 꺼지면 성공.

---

## 4. 다 끝나면 (응용 과제)

- **3-depth 더 깊게:** `sampleMenu.ts`에 손자의 자식(4depth)을 추가해도 재귀라 그냥 동작하는지 확인
- **수정/취소/저장:** `useMenuTree.ts`의 `startEdit`/`cancelEdit`이 어떻게 백업·복원하는지 읽어보기 (Vue의 `originSys` JSON deep copy ↔ `structuredClone`)
- **다음 단계:** 추천2 데이터 테이블 + Tanstack Query / Zustand 로 확장

막히면 `treeUtils.solution.ts`와 비교하세요. 검증: `npx tsc -b` (타입 OK), `npm run dev` (동작 확인).
