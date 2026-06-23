import Lesson1Basics from "./lessons/Lesson1_Basics";
import Lesson2Props from "./lessons/Lesson2_Props";
import Lesson3Immutable from "./lessons/Lesson3_Immutable";
import Lesson4MiniTree from "./lessons/Lesson4_MiniTree";
import MenuTree from "./lessons/MenuTree";
import CheckboxBasics from "./lessons/Checkbox_Basics";
import "./App.css";

// ============================================================
// 지금 보고 싶은 것만 return 하세요. (한 줄만 활성화)
//   <CheckboxBasics />      체크박스 0부터 (1개→여러개→전체→중간상태)  ← 지금
//   <Lesson1Basics />       1과: useState / 이벤트 / 리스트
//   <Lesson2Props />        2과: props / 컴포넌트 / 콜백 / 재귀
//   <Lesson3Immutable />    3과: 불변 업데이트 (map + 스프레드)
//   <Lesson4MiniTree />     4과: 미니 트리 (재귀+불변+동기화)
//   <MenuTree />            내가 만드는 권한 트리
// ============================================================

function App() {
  // return <CheckboxBasics />;
  return <MenuTree />;
}

// 다른 과 import 유지용 (지워도 됨)
void Lesson1Basics;
void Lesson2Props;
void Lesson3Immutable;
void Lesson4MiniTree;
void MenuTree;

export default App;
