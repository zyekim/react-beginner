// 1. 재귀트리 구조 만들기
// 2. 체크박스
// 3. 전체선택
// 4. 펼치기 접기
// 5. 수정, 취소, 저장 기능
import {useState} from "react";
import type {MenuItem} from "../types/menu";
import {sampleMenu} from "../data/sampleMenu";

export function useMenuTree() {
  const [tree, setTree] = useState<MenuItem[]>(() =>
    structuredClone(sampleMenu),
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [backup, setBackup] = useState<MenuItem[] | null>(null);

  return {
    tree,
    setTree,
    isEdit,
    setIsEdit,
    backup,
    setBackup,
  };
}
