import { useState } from "react";
import type { MenuItem, PermissionType } from "../types/menu";
import { sampleMenu } from "../data/sampleMenu";
import {
  updateNodeById,
  toggleNode,
  toggleAll,
  setAll,
} from "./treeUtils";

// ============================================================
// 메뉴 트리 상태 관리 커스텀 훅
//
// Vue 의 Pinia store(AuthGroup.ts) 역할.
// Vue:   state() { return { sysMenuList: [] } }  + actions
// React: useState + 상태를 바꾸는 함수들을 return
//
// 이 파일은 (거의) 완성본이다. 실제 트리 변형 로직은
// treeUtils.ts 의 TODO 함수들을 호출만 한다 → 그쪽을 채우면 동작한다.
// ============================================================

export function useMenuTree() {
  // structuredClone: 목 데이터 원본을 건드리지 않도록 깊은 복사
  const [tree, setTree] = useState<MenuItem[]>(() =>
    structuredClone(sampleMenu)
  );
  const [isEdit, setIsEdit] = useState(false);

  // 수정 취소용 백업 (Vue 의 originSys/originUser)
  const [backup, setBackup] = useState<MenuItem[] | null>(null);

  /** 체크박스 클릭 → 해당 노드+자손 통일 + 부모 재계산 */
  const onToggle = (id: string, type: PermissionType, nextValue: boolean) => {
    setTree((prev) => toggleNode(prev, id, type, nextValue));
  };

  /** 헤더의 "전체 선택" 체크박스 */
  const onToggleAll = (type: PermissionType, value: boolean) => {
    setTree((prev) => toggleAll(prev, type, value));
  };

  /** 펼치기/접기 (특정 노드 하나) */
  const onToggleExpand = (id: string) => {
    setTree((prev) =>
      updateNodeById(prev, id, (item) => ({
        ...item,
        showChildren: !item.showChildren,
      }))
    );
  };

  /** 전체 펼치기/접기 */
  const onExpandAll = (expand: boolean) => {
    const apply = (list: MenuItem[]): MenuItem[] =>
      list.map((item) => ({
        ...item,
        showChildren: item.children ? expand : item.showChildren,
        children: item.children ? apply(item.children) : undefined,
      }));
    setTree((prev) => apply(prev));
  };

  // ---- 수정 / 취소 / 저장 ----
  const startEdit = () => {
    setBackup(structuredClone(tree)); // 현재 상태 백업
    setIsEdit(true);
  };

  const cancelEdit = () => {
    if (backup) setTree(backup); // 백업으로 되돌리기
    setBackup(null);
    setIsEdit(false);
  };

  const saveEdit = () => {
    // 실제론 여기서 API 호출. 지금은 콘솔로 결과만 확인.
    console.log("저장된 트리:", tree);
    setBackup(null);
    setIsEdit(false);
    return tree;
  };

  return {
    tree,
    isEdit,
    onToggle,
    onToggleAll,
    onToggleExpand,
    onExpandAll,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}

// setAll 은 treeUtils 에서 re-export (다른 곳에서 쓰기 편하게)
export { setAll };
