import { useState } from "react";

// ============================================================
// React 기초 3과 — 불변성(immutability) 으로 state 바꾸기
//
// 트리의 마지막 준비물! 핵심 한 문장:
//   "React state 는 직접 고치지 말고, '새 객체/새 배열' 을 만들어 교체한다."
//
//   Vue:   item.qty++            (직접 변경 OK, 반응성 동작)
//   React: setItems(prev => prev.map(...))  (새 배열로 교체해야 화면 갱신)
//
// 왜? React 는 "참조(주소)가 바뀌었는지" 로 다시 그릴지 판단한다.
//     같은 배열을 그대로 다시 넣으면 → "안 바뀌었네" 하고 무시함.
// ============================================================

interface Item {
  id: number;
  name: string;
  emoji: string;
  qty: number;
  fav: boolean;
}

export default function Lesson3Immutable() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "수박", emoji: "🍉", qty: 1, fav: false },
    { id: 2, name: "참외", emoji: "🍈", qty: 1, fav: false },
    { id: 3, name: "복숭아", emoji: "🍑", qty: 1, fav: false },
  ]);

  // ──────────────────────────────────────────────
  // ★ 핵심 패턴: 배열에서 "한 항목만" 바꾸기
  //   map 으로 전체를 돌면서
  //    - 바꿀 항목(id 일치)이면 → { ...item, 바꿀필드: 새값 } (새 객체)
  //    - 나머지는 → 그대로 (그대로 두면 됨)
  //   결과적으로 "새 배열 + 바뀐 항목만 새 객체" 가 된다.
  // ──────────────────────────────────────────────
  const changeQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(0, item.qty + delta) } // ← 새 객체
          : item // ← 안 바뀌는 항목은 그대로
      )
    );
  };

  const toggleFav = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, fav: !item.fav } : item
      )
    );
  };

  // ──────────────────────────────────────────────
  // ❌ 잘못된 예 — 직접 변경 (학습용. 일부러 안 됨!)
  //   item.qty 를 직접 올리고, '같은 배열' 을 그대로 다시 넣으면
  //   참조가 안 바뀌어서 React 가 화면을 다시 안 그린다.
  // ──────────────────────────────────────────────
  const brokenAdd = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) item.qty += 1; // 직접 변경 (Vue 라면 됐겠지만...)
    setItems(items); // 같은 배열 그대로 → React 가 무시 → 화면 안 바뀜
    console.log("데이터는 바뀜:", items.find((i) => i.id === id)?.qty, "근데 화면은 그대로!");
  };

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="mx-auto mt-10 max-w-md font-sans">
      <h2 className="mb-1 text-xl font-bold">기초 3과 — 불변 업데이트</h2>
      <p className="mb-4 text-sm text-gray-500">담은 총 개수: {totalQty}개</p>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
          >
            <span className="flex items-center gap-2">
              {/* ⭐ 즐겨찾기 토글 (boolean 필드 하나만 뒤집기) */}
              <button
                onClick={() => toggleFav(item.id)}
                className="text-lg"
                title="즐겨찾기"
              >
                {item.fav ? "⭐" : "☆"}
              </button>
              <span className="text-lg">{item.emoji}</span>
              <span className={item.fav ? "font-bold" : ""}>{item.name}</span>
            </span>

            <span className="flex items-center gap-2">
              {/* 수량 +/- (number 필드 바꾸기) */}
              <button
                onClick={() => changeQty(item.id, -1)}
                className="h-7 w-7 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => changeQty(item.id, 1)}
                className="h-7 w-7 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </span>
          </li>
        ))}
      </ul>

      {/* 잘못된 예 데모 */}
      <div className="mt-5 rounded-xl border border-dashed border-red-300 p-4">
        <h3 className="mb-2 font-semibold text-red-600">
          ❌ 직접 변경하면 왜 안 되나
        </h3>
        <p className="mb-2 text-sm text-gray-600">
          아래 버튼은 <code>item.qty += 1</code> 로 직접 바꾸고 같은 배열을 넣어요.
          눌러도 화면이 안 바뀝니다. (콘솔엔 데이터가 바뀐 게 찍혀요)
        </p>
        <button
          onClick={() => brokenAdd(1)}
          className="rounded-md bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
        >
          수박 수량 직접 +1 (안 먹힘)
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        👉 위 +/- 와 ⭐ 는 잘 되고, ❌ 버튼만 안 되는 이유를 비교해 보세요.
        이 <b>map + 스프레드(...)</b> 패턴이 곧 트리에서 그대로 쓰여요.
      </p>
    </div>
  );
}
