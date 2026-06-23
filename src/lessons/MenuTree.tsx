// 1. 재귀트리 구조 만들기
// 2. 체크박스
// 3. 전체선택
// 4. 펼치기 접기
// 5. 수정, 취소, 저장 기능
import {useEffect, useRef, useState} from "react";
import {sampleMenu} from "../data/sampleMenu";
import type {MenuItem, PermissionType} from "../types/menu";

type CheckStateType = "unchecked" | "checked" | "indeterminate";

function TriCheckbox({
  state,
  disabled,
  onToggle,
}: {
  state: CheckStateType;
  disabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  const checkRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkRef.current) {
      checkRef.current.indeterminate = state == "indeterminate";
    }
  }, [state]);
  return (
    <input
      ref={checkRef}
      type="checkbox"
      checked={state == "checked"}
      onChange={() => onToggle(state != "checked")}
      disabled={disabled}
    />
  );
}

function getCheckState(item: MenuItem, type: PermissionType): CheckStateType {
  if (!item.children?.length) {
    return item[type] ? "checked" : "unchecked";
  }
  const states = item.children.map((child) => getCheckState(child, type));
  if (states.every((s) => s === "checked")) return "checked";
  if (states.every((s) => s === "unchecked")) return "unchecked";
  return "indeterminate";
}

function MenuRow({
  item,
  isEdit,
  depth = 0,
  onToggle,
}: {
  item: MenuItem;
  isEdit: boolean;
  depth?: number;
  onToggle: (id: string, type: PermissionType, nextValue: boolean) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  return (
    <>
      <tr className={isEdit && (item.view || item.auth) ? "active" : ""}>
        <td
          style={{paddingLeft: depth * 16, fontWeight: depth == 0 ? 700 : 400}}
          className="menu-name"
        >
          {item.menuName}
        </td>
        <td align="center">
          <TriCheckbox
            disabled={!isEdit}
            state={getCheckState(item, "view")}
            onToggle={(nextValue) => onToggle(item.id, "view", nextValue)}
          />
        </td>
        <td align="center">
          <TriCheckbox
            disabled={!isEdit}
            state={getCheckState(item, "auth")}
            onToggle={(nextValue) => onToggle(item.id, "auth", nextValue)}
          />
        </td>
      </tr>
      {hasChildren &&
        item.children.map((child) => (
          <MenuRow
            key={child.id}
            item={child}
            isEdit={isEdit}
            depth={depth + 1}
            onToggle={onToggle}
          />
        ))}
    </>
  );
}

export default function MenuTree() {
  const [tree, setTree] = useState<MenuItem[]>(() =>
    structuredClone(sampleMenu),
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [backup, setBackup] = useState<MenuItem[] | null>(null);

  function setAll(item: MenuItem, type: PermissionType, nextValue: boolean) {
    return {
      ...item,
      [type]: nextValue,
      children: item.children?.map((c) => setAll(c, type, nextValue)),
    };
  }
  const onToggleAll = (type: PermissionType, nextValue: boolean) => {
    setTree((prev) => prev.map((item) => setAll(item, type, nextValue)));
  };

  function toggleNode(
    list: MenuItem[],
    id: string,
    type: PermissionType,
    nextValue: boolean,
  ): MenuItem[] {
    return list.map((i) => {
      if (i.id === id) {
        return setAll(i, type, nextValue);
      }
      if (i.children) {
        const children = toggleNode(i.children, id, type, nextValue);
        const newState = getCheckState({...i, children}, type);
        return {
          ...i,
          children,
          [type]: newState === "checked",
        };
      }
      return i;
    });
  }

  const onToggle = (id: string, type: PermissionType, nextValue: boolean) => {
    setTree((prev) => toggleNode(prev, id, type, nextValue));
  };

  const allView = tree.every((i) => getCheckState(i, "view") === "checked");
  const allAuth = tree.every((i) => getCheckState(i, "auth") === "checked");

  return (
    <div>
      <div className="flex">
        <button
          style={button}
          onClick={() => {
            setBackup(structuredClone(tree));
            setIsEdit(true);
          }}
          className="bg-blue-200 hover:bg-blue-300"
        >
          수정
        </button>
        <button
          style={button}
          onClick={() => {
            setTree(backup ?? []);
            setBackup(null);
            setIsEdit(false);
          }}
          className="bg-slate-200 hover:bg-slate-300"
        >
          취소
        </button>
        <button
          style={button}
          onClick={() => {
            setBackup(null);
            setIsEdit(false);
            console.log(tree);
            return tree;
          }}
          className="bg-green-700 hover:bg-green-600 text-white"
          disabled={!isEdit}
        >
          저장
        </button>
      </div>
      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>메뉴명</th>
            <th style={cell}>
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
            <th style={cell}>
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
        <tbody className="menu-tree">
          {tree.map((item) => (
            <MenuRow
              key={item.id}
              item={item}
              isEdit={isEdit}
              depth={0}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const table: React.CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
  border: "1px solid #ddd",
};

const cell: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const button: React.CSSProperties = {
  borderRadius: "6px",
  padding: "4px 8px",
  minWidth: "45px",
  fontSize: "14px",
  cursor: "pointer",
};
