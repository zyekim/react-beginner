// 1. 재귀트리 구조 만들기
// 2. 체크박스
// 3. 전체선택
// 4. 펼치기 접기
// 5. 수정, 취소, 저장 기능
import {useState} from "react";
import {sampleMenu} from "../data/sampleMenu";
import type {MenuItem, PermissionType} from "../types/menu";

type CheckStateType = "unchecked" | "checked" | "indeterminate";

function TriCheckbox({
  state,
  disabled,
  toggleNode,
}: {
  state: CheckStateType;
  disabled: boolean;
  toggleNode: (next: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={state == "checked"}
      onChange={(e) => toggleNode(e.target.checked)}
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
      <tr key={item.id} style={{paddingLeft: depth * 16}}>
        <td>{item.menuName}</td>
        <td align="center">
          <TriCheckbox
            disabled={!isEdit}
            state={getCheckState(item, "view")}
            toggleNode={(nextValue) => onToggle(item.id, "view", nextValue)}
          />
        </td>
        <td align="center">
          <TriCheckbox
            disabled={!isEdit}
            state={getCheckState(item, "auth")}
            toggleNode={(nextValue) => onToggle(item.id, "auth", nextValue)}
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

  const onToggleAll = (type: PermissionType, nextValue: boolean) => {
    setTree((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          [type]: nextValue,
        };
      });
    });
  };

  const onToggle = (id: string, type: PermissionType, nextValue: boolean) => {
    setTree((prev) => {
      return prev.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            [type]: nextValue,
          };
        }
        if (i.children) {
          return {
            ...i,
            children: i.children.map((c) => {
              if (c.id === id) {
                return {
                  ...c,
                  [type]: nextValue,
                };
              }
              return c;
            }),
          };
        }
        return i;
      });
    });
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
        <tbody>
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
