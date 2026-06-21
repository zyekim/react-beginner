// ============================================================
// 재귀 타입 정의
// Vue의 AuthGroup.ts 에선 menuList 가 any[] 였지만,
// 여기선 TypeScript 재귀 타입으로 트리 구조를 명시한다.
// ============================================================

/** view = 메뉴위임, auth = 메뉴권한 (Vue 코드와 동일한 두 종류 체크) */
export type PermissionType = "view" | "auth";

export interface MenuItem {
  id: string;
  menuName: string;
  /** 메뉴위임 체크 여부 */
  view: boolean;
  /** 메뉴권한 체크 여부 */
  auth: boolean;
  /** 트리 펼침 상태 (Vue 의 showChildren 과 동일) */
  showChildren?: boolean;
  /** 자식 노드 — 재귀! children 안에 또 children */
  children?: MenuItem[];
}

/** 체크박스가 가질 수 있는 3가지 상태 */
export type CheckState = "checked" | "unchecked" | "indeterminate";
