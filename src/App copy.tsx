import Lesson1Basics from "./lessons/Lesson1_Basics";
import Lesson2Props from "./lessons/Lesson2_Props";
import Lesson3Immutable from "./lessons/Lesson3_Immutable";
import Lesson4MiniTree from "./lessons/Lesson4_MiniTree";
import { useMenuTree } from "./hooks/useMenuTree";
import { MenuTree } from "./components/MenuTree";
import "./App.css";

// ============================================================
// 지금 보고 싶은 것만 return 하세요. (한 줄만 활성화)
//   <Lesson1Basics />       1과: useState / 이벤트 / 리스트
//   <Lesson2Props />        2과: props / 컴포넌트 / 콜백 / 재귀
//   <Lesson3Immutable />    3과: 불변 업데이트 (map + 스프레드)
//   <Lesson4MiniTree />     4과: 미니 트리 (재귀+불변+동기화)  ← 지금
//   <PermissionTreePage />  원래 권한 트리 실습 (다음!)
// ============================================================

function App() {
  return <Lesson4MiniTree />;
}

// 다른 과 import 유지용 (지워도 됨)
void Lesson1Basics;
void Lesson2Props;
void Lesson3Immutable;

// ↓↓↓ 나중에 돌아올 트리 실습 화면 (지금은 사용 안 함) ↓↓↓
export function PermissionTreePage() {
  const {
    tree,
    isEdit,
    onToggle,
    onToggleAll,
    onToggleExpand,
    onExpandAll,
    startEdit,
    cancelEdit,
    saveEdit,
  } = useMenuTree();

  return (
    <div className="page">
      <header className="page-header">
        <h2>권한그룹별 메뉴권한</h2>
        <div className="actions">
          <button onClick={() => onExpandAll(true)}>전체 펼치기</button>
          <button onClick={() => onExpandAll(false)}>전체 접기</button>
          {!isEdit ? (
            <button className="primary" onClick={startEdit}>
              수정
            </button>
          ) : (
            <>
              <button onClick={cancelEdit}>취소</button>
              <button className="primary" onClick={saveEdit}>
                저장
              </button>
            </>
          )}
        </div>
      </header>

      <MenuTree
        tree={tree}
        isEdit={isEdit}
        onToggle={onToggle}
        onToggleExpand={onToggleExpand}
        onToggleAll={onToggleAll}
      />

      <p className="hint">
        {isEdit
          ? "수정 모드: 체크박스를 눌러보세요. (저장 시 콘솔에 결과 출력)"
          : "‘수정’을 눌러 편집을 시작하세요."}
      </p>
    </div>
  );
}

export default App;
