import type {MenuItem, PermissionType} from "../types/menu";

// ============================================================
// 트리 조작 유틸 (순수 함수)
//
// 여기 있는 함수들은 state 와 무관한 "순수 함수" 다.
// React 의 핵심 규칙: state(트리)를 직접 바꾸지 말고,
//   항상 "새 객체 / 새 배열" 을 만들어서 반환한다. (불변성)
//
// Vue 였다면:  item.view = true   (직접 변경 → 반응성 동작)
// React 라면:  { ...item, view: true }  (새 객체를 만들어 교체)
// ============================================================

/**
 * ✅ [완성된 예시 — 그대로 두세요]
 *
 * item 과 그 아래 모든 자손의 view/auth 를 value 로 통일해서
 * "새로운 트리 노드" 를 반환한다.
 *
 * 이게 React 식 불변 재귀의 기본형이다. 아래 TODO 들을 채울 때
 * 이 함수의 패턴(전개 연산자 ...item, children?.map(...))을 흉내내면 된다.
 *
 * 👉 Vue 의 toggleItem / toggleViewAll 에 해당.
 */
export function setAll(
  item: MenuItem,
  type: PermissionType,
  value: boolean,
): MenuItem {
  return {
    ...item, // 1) 기존 필드 복사
    [type]: value, // 2) view 또는 auth 만 새 값으로 덮어쓰기
    children: item.children?.map((c) => setAll(c, type, value)), // 3) 자식도 재귀로 똑같이
  };
}

/**
 * ✅ [완성된 예시 — 그대로 두세요]
 *
 * 트리를 따라 내려가며 id 가 일치하는 노드에 updater 를 적용한 새 트리를 반환.
 * 펼치기/접기(showChildren) 처럼 "특정 노드 하나만" 바꿀 때 쓴다.
 */
export function updateNodeById(
  list: MenuItem[],
  id: string,
  updater: (item: MenuItem) => MenuItem,
): MenuItem[] {
  return list.map((item) => {
    if (item.id === id) return updater(item);
    if (item.children) {
      return {...item, children: updateNodeById(item.children, id, updater)};
    }
    return item;
  });
}

// ============================================================
// 👇👇👇 여기서부터 김지혜님이 채울 부분 (GUIDE.md 참고) 👇👇👇
// ============================================================

/**
 * 🟦 TODO #1 — 체크박스 상태 계산 (순수 함수)
 *
 * 한 노드가 화면에서 어떤 체크 상태로 보여야 하는지 계산한다.
 *  - 자식이 없으면(말단 노드): item[type] 이 true 면 "checked", 아니면 "unchecked"
 *  - 자식이 있으면:
 *      · 모든 자손이 checked  → "checked"
 *      · 일부만 checked       → "indeterminate"
 *      · 아무도 checked 아님   → "unchecked"
 *
 * 💡 Vue 의 indeterminate(item, type) + hasAllChecked/hasAnyChecked 를
 *    한 함수로 합친 버전이라고 생각하면 된다.
 * 💡 재귀로 "말단까지 내려가서" every / some 으로 판단.
 */
export function getCheckState(
  item: MenuItem,
  type: PermissionType,
): "checked" | "unchecked" | "indeterminate" {
  // ⛔ 임시 구현 (얕음): 자기 값만 보고 판단 → indeterminate 가 절대 안 나온다.
  //    앱은 돌아가지만 "부모 체크가 회색(중간)으로 안 변하는" 버그가 보일 것.
  //    아래 한 줄을 지우고 재귀로 제대로 구현하세요.

  return item[type] ? "checked" : "unchecked";
}

/**
 * 🟦 TODO #2 — 노드 토글 (가장 중요!)
 *
 * id 노드의 type(view/auth) 값을 nextValue 로 바꾼다.
 *  - 해당 노드 + 그 아래 모든 자손을 nextValue 로 통일  → setAll() 활용!
 *  - 그리고 위쪽 부모들은 "자식들 상태에 맞게" 다시 계산해야 한다.
 *    (자식이 전부 true면 부모 true, 하나라도 false면 부모 false)
 *
 * 💡 핵심 아이디어: 트리 전체를 재귀로 다시 만들면서(rebuild),
 *    - 목표 노드를 만나면 → setAll(item, type, nextValue) 로 교체
 *    - 자식이 있는 노드는 → 자식들을 먼저 재귀 처리한 뒤,
 *                          item[type] = 새 자식들.every(c => c[type]) 로 재계산
 *    - 그 외 말단 노드는 → 그대로 반환
 *
 * 💡 Vue 의 toggleItem + toggleChild + toggleGrand 3개 함수를
 *    React 에선 이 재귀 함수 하나로 끝낼 수 있다. (depth 무제한!)
 */
export function toggleNode(
  list: MenuItem[],
  id: string,
  type: PermissionType,
  nextValue: boolean,
): MenuItem[] {
  // ⛔ 임시 구현: 클릭한 노드 하나만 바꾼다 → 자식/부모 동기화가 안 된다.
  //    "부모를 켜도 자식이 안 켜지는" 버그가 보일 것. 제대로 구현하세요.
  return updateNodeById(list, id, (item) => ({...item, [type]: nextValue}));
}

/**
 * 🟦 TODO #3 — 전체 토글
 *
 * 트리의 모든 노드(전 depth)의 type 값을 value 로 통일한다.
 * 💡 setAll() 을 최상위 각 항목에 적용하면 끝. list.map(...)
 * 👉 Vue 의 toggleViewAll / toggleAuthAll 에 해당.
 */
export function toggleAll(
  list: MenuItem[],
  type: PermissionType,
  value: boolean,
): MenuItem[] {
  // ⛔ 임시 구현: 아무것도 안 한다 → 헤더 "전체 선택" 이 안 먹힌다.
  //    setAll() 을 활용해 제대로 구현하세요.
  console.debug("toggleAll 임시 — 미구현", type, value);
  return list;
}
