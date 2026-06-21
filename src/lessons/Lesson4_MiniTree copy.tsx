import { useState } from "react";
import { TriCheckbox } from "../components/TriCheckbox";
import type { CheckState } from "../types/menu";

// ============================================================
// React 기초 4과 — 미니 트리 (재귀 + 불변 + 체크박스 동기화)
//
// 2과(재귀 컴포넌트) + 3과(불변 업데이트) 를 합친 게 트리다.
// 권한 트리의 '한 종류 체크박스' 버전이라고 보면 됨. (실전은 view/auth 2개)
//
// 동작 3가지:
//   ① 부모를 켜면 → 모든 자식이 따라 켜짐  (아래로 전파)
//   ② 자식 일부만 켜면 → 부모는 '중간상태(indeterminate)'  (위로 반영)
//   ③ 자식 전부 켜면 → 부모도 자동 켜짐
// ============================================================

interface TreeItem {
  id: string;
  label: string;
  checked: boolean;
  children?: TreeItem[];
}

const initialTree: TreeItem[] = [
  {
    id: "fruit",
    label: "과일",
    checked: false,
    children: [
      {
        id: "summer",
        label: "여름과일",
        checked: false,
        children: [
          { id: "watermelon", label: "수박", checked: false },
          { id: "melon", label: "참외", checked: false },
        ],
      },
      { id: "apple", label: "사과", checked: false },
    ],
  },
  {
    id: "veg",
    label: "채소",
    checked: false,
    children: [
      { id: "carrot", label: "당근", checked: false },
      { id: "onion", label: "양파", checked: false },
    ],
  },
];

// ── 순수 함수 1: 나 + 모든 자손을 value 로 통일 (새 객체 반환)
//    3과의 "스프레드 + 새 객체" 를 재귀로 (2과). 이게 합쳐지는 지점!
function setAll(item: TreeItem, value: boolean): TreeItem {
  return {
    ...item,
    checked: value,
    children: item.children?.map((c) => setAll(c, value)),
  };
}

// ── 순수 함수 2: 화면에 보일 체크 상태 계산 (자손까지 보고 판단)
function getState(item: TreeItem): CheckState {
  if (!item.children?.length) {
    return item.checked ? "checked" : "unchecked";
  }
  const states = item.children.map(getState); // 재귀로 자식들 상태
  if (states.every((s) => s === "checked")) return "checked";
  if (states.every((s) => s === "unchecked")) return "unchecked";
  return "indeterminate"; // 섞이면 중간
}

// ── 순수 함수 3: id 노드 토글 (아래로 전파 + 위로 재계산)
//    map 으로 트리를 새로 만들면서:
//      · 목표 노드 → setAll (나+자손 통일)
//      · 자식 있는 노드 → 자식 먼저 재귀, 그 결과로 내 checked 재계산
//      · 나머지 → 그대로
function toggleNode(
  list: TreeItem[],
  id: string,
  value: boolean
): TreeItem[] {
  return list.map((item) => {
    if (item.id === id) return setAll(item, value);
    if (item.children?.length) {
      const children = toggleNode(item.children, id, value);
      return { ...item, children, checked: children.every((c) => c.checked) };
    }
    return item;
  });
}

// ── 재귀 컴포넌트: 자기 자신을 다시 부른다 (2과에서 한 그것!)
function TreeRow({
  item,
  depth,
  onToggle,
}: {
  item: TreeItem;
  depth: number;
  onToggle: (id: string, value: boolean) => void;
}) {
  return (
    <>
      <div
        className="flex items-center gap-2 py-1"
        style={{ paddingLeft: depth * 20 }}
      >
        <TriCheckbox
          state={getState(item)}
          onToggle={(next) => onToggle(item.id, next)}
        />
        <span>{item.label}</span>
      </div>
      {item.children?.map((child) => (
        <TreeRow
          key={child.id}
          item={child}
          depth={depth + 1}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}

export default function Lesson4MiniTree() {
  const [tree, setTree] = useState<TreeItem[]>(initialTree);

  // 체크박스 클릭 → 불변 토글 (prev 기반!)
  const handleToggle = (id: string, value: boolean) => {
    setTree((prev) => toggleNode(prev, id, value));
  };

  return (
    <div className="mx-auto mt-10 max-w-md font-sans">
      <h2 className="mb-4 text-xl font-bold">기초 4과 — 미니 트리</h2>
      <div className="rounded-xl border border-gray-200 p-4">
        {tree.map((item) => (
          <TreeRow
            key={item.id}
            item={item}
            depth={0}
            onToggle={handleToggle}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        👉 "과일" 을 켜보세요(자식 전부 켜짐). "수박" 만 끄면 "여름과일"·"과일" 이
        중간상태(회색)로 바뀌어요. 이게 권한 트리의 핵심이에요.
      </p>
    </div>
  );
}
