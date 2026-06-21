import type { MenuItem, PermissionType } from "../types/menu";
import { getCheckState } from "../hooks/treeUtils";
import { TriCheckbox } from "./TriCheckbox";

// ============================================================
// 재귀 트리 컴포넌트
//
// Vue 는 <template v-for> 를 1depth/2depth/3depth 마다 따로 썼지만
// (AuthGroup.vue 의 item / sub / grand),
// React 는 컴포넌트가 자기 자신을 다시 부르는 "재귀 컴포넌트" 로
// depth 제한 없이 한 번에 처리한다. → 이게 핵심 차이!
// ============================================================

interface RowProps {
  item: MenuItem;
  depth: number;
  isEdit: boolean;
  onToggle: (id: string, type: PermissionType, nextValue: boolean) => void;
  onToggleExpand: (id: string) => void;
}

function MenuRow({ item, depth, isEdit, onToggle, onToggleExpand }: RowProps) {
  const hasChildren = !!item.children?.length;

  return (
    <>
      <tr className={isEdit && (item.view || item.auth) ? "active" : ""}>
        {/* 들여쓰기 + 펼치기 버튼 */}
        <td style={{ paddingLeft: depth * 24 }}>
          {hasChildren && (
            <button
              type="button"
              className="expand-btn"
              onClick={() => onToggleExpand(item.id)}
            >
              {item.showChildren ? "▼" : "▶"}
            </button>
          )}
        </td>

        <td className="menu-name" style={{ fontWeight: depth === 0 ? 700 : 400 }}>
          {item.menuName}
        </td>

        {/* 메뉴위임 (view) */}
        <td className="check-cell">
          <TriCheckbox
            state={getCheckState(item, "view")}
            disabled={!isEdit}
            onToggle={(next) => onToggle(item.id, "view", next)}
          />
        </td>

        {/* 메뉴권한 (auth) */}
        <td className="check-cell">
          <TriCheckbox
            state={getCheckState(item, "auth")}
            disabled={!isEdit}
            onToggle={(next) => onToggle(item.id, "auth", next)}
          />
        </td>
      </tr>

      {/* 펼쳐진 경우에만 자식들을 재귀로 렌더 */}
      {hasChildren &&
        item.showChildren &&
        item.children!.map((child) => (
          <MenuRow
            key={child.id}
            item={child}
            depth={depth + 1}
            isEdit={isEdit}
            onToggle={onToggle}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  );
}

interface TreeProps {
  tree: MenuItem[];
  isEdit: boolean;
  onToggle: (id: string, type: PermissionType, nextValue: boolean) => void;
  onToggleExpand: (id: string) => void;
  onToggleAll: (type: PermissionType, value: boolean) => void;
}

export function MenuTree({
  tree,
  isEdit,
  onToggle,
  onToggleExpand,
  onToggleAll,
}: TreeProps) {
  // 헤더의 "전체 선택" 체크 여부: 모든 최상위 항목이 view/auth=true 인지
  const allView = tree.every((i) => getCheckState(i, "view") === "checked");
  const allAuth = tree.every((i) => getCheckState(i, "auth") === "checked");

  return (
    <table className="menu-tree">
      <thead>
        <tr>
          <th style={{ width: 40 }} />
          <th className="menu-name">메뉴명</th>
          <th className="check-cell">
            <label>
              <input
                type="checkbox"
                disabled={!isEdit}
                checked={allView}
                onChange={(e) => onToggleAll("view", e.target.checked)}
              />{" "}
              메뉴위임
            </label>
          </th>
          <th className="check-cell">
            <label>
              <input
                type="checkbox"
                disabled={!isEdit}
                checked={allAuth}
                onChange={(e) => onToggleAll("auth", e.target.checked)}
              />{" "}
              메뉴권한
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
        {tree.map((item) => (
          <MenuRow
            key={item.id}
            item={item}
            depth={0}
            isEdit={isEdit}
            onToggle={onToggle}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </tbody>
    </table>
  );
}
