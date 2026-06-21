import type { MenuItem, PermissionType, CheckState } from "../types/menu";

// ============================================================
// 📗 정답지 (막히면 여기 비교). 실제 앱은 treeUtils.ts 를 쓴다.
//    스스로 먼저 풀어본 뒤에 열어보길 권장.
// ============================================================

export function setAll(
  item: MenuItem,
  type: PermissionType,
  value: boolean
): MenuItem {
  return {
    ...item,
    [type]: value,
    children: item.children?.map((c) => setAll(c, type, value)),
  };
}

// ---- TODO #1 정답 ----
export function getCheckState(
  item: MenuItem,
  type: PermissionType
): CheckState {
  // 말단 노드: 자기 값으로 끝
  if (!item.children?.length) {
    return item[type] ? "checked" : "unchecked";
  }
  // 자식들의 상태를 재귀로 구함
  const childStates = item.children.map((c) => getCheckState(c, type));
  const allChecked = childStates.every((s) => s === "checked");
  const noneChecked = childStates.every((s) => s === "unchecked");

  if (allChecked) return "checked";
  if (noneChecked) return "unchecked";
  return "indeterminate"; // 섞여 있으면 중간 상태
}

// ---- TODO #2 정답 ----
export function toggleNode(
  list: MenuItem[],
  id: string,
  type: PermissionType,
  nextValue: boolean
): MenuItem[] {
  return list.map((item) => {
    // 1) 목표 노드를 만나면: 자신 + 모든 자손을 nextValue 로 통일
    if (item.id === id) {
      return setAll(item, type, nextValue);
    }
    // 2) 자식이 있으면: 자식을 먼저 재귀 처리한 뒤, 부모 값을 자식 기준으로 재계산
    if (item.children?.length) {
      const children = toggleNode(item.children, id, type, nextValue);
      return {
        ...item,
        children,
        // 직속 자식이 전부 true 여야 부모도 true (Vue 의 every 로직과 동일)
        [type]: children.every((c) => c[type]),
      };
    }
    // 3) 그 외 말단 노드는 그대로
    return item;
  });
}

// ---- TODO #3 정답 ----
export function toggleAll(
  list: MenuItem[],
  type: PermissionType,
  value: boolean
): MenuItem[] {
  return list.map((item) => setAll(item, type, value));
}
