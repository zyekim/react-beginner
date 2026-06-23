import { useEffect, useRef, useState } from "react";

// ============================================================
// 체크박스 0부터 — 트리/재귀 없음! 평평한 목록만.
//
//   STEP 1. 체크박스 1개
//   STEP 2. 체크박스 여러 개 (배열)
//   STEP 3. 전체선택 (부모 체크박스)
//   STEP 4. 중간상태 indeterminate
//
// 이거 4개만 이해하면 트리는 "여기에 재귀만 얹은 것" 이 돼요.
// ============================================================

// ============================================================
// STEP 1. 체크박스 딱 1개
//
// 핵심: 체크박스는 항상 두 개가 짝이에요.
//   checked   = "지금 상태를 화면에 보여줘" (보여주기)
//   onChange  = "클릭하면 상태를 바꿔줘"   (반응하기)
// 둘 중 하나라도 빠지면 이상하게 동작해요.
//   Vue 의 v-model="agree" 를 손으로 둘로 나눈 것.
// ============================================================
function Step1() {
  const [agree, setAgree] = useState(false); // 체크 여부 (true/false)

  return (
    <section className="mb-4 rounded-xl border border-gray-200 p-4">
      <h3 className="mb-2 font-semibold">STEP 1. 체크박스 1개</h3>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={agree} // ← 상태를 화면에 반영
          onChange={(e) => setAgree(e.target.checked)} // ← 클릭하면 상태 변경
        />
        약관에 동의합니다
      </label>
      <p className="mt-2 text-sm text-gray-500">
        지금 상태: {agree ? "✅ 동의함" : "⬜ 동의 안 함"}
      </p>
    </section>
  );
}

// ============================================================
// STEP 2. 체크박스 여러 개 (배열 state)
//
// 각 항목이 checked 를 들고 있고, 클릭한 항목만 뒤집는다.
//   → 3과에서 한 "map 으로 한 항목만 교체" 패턴 그대로!
// ============================================================
interface Item {
  id: number;
  label: string;
  checked: boolean;
}

function Step2() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: "수박", checked: false },
    { id: 2, label: "참외", checked: false },
    { id: 3, label: "복숭아", checked: false },
  ]);

  // id 항목의 checked 만 뒤집기 (나머지는 그대로)
  const toggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <section className="mb-4 rounded-xl border border-gray-200 p-4">
      <h3 className="mb-2 font-semibold">STEP 2. 여러 개</h3>
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggle(item.id)}
          />
          {item.label}
        </label>
      ))}
    </section>
  );
}

// ============================================================
// STEP 3. 전체선택 (부모 체크박스)
//
// ★ 부모 체크박스는 자기만의 state 가 없어요!
//   "자식들이 전부 켜졌나?" 를 계산해서 보여줄 뿐. (= 파생/derived)
//   - 보여주기: allChecked = items.every(켜짐?)
//   - 클릭하면: 자식 전부를 그 값으로 set
// ============================================================
function Step3() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: "수박", checked: false },
    { id: 2, label: "참외", checked: false },
    { id: 3, label: "복숭아", checked: false },
  ]);

  // 자식 하나 토글 (STEP 2 와 동일)
  const toggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 전체 토글: 모든 자식을 next 로
  const toggleAll = (next: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: next })));
  };

  // 부모 체크박스 표시 = 자식 전부 켜졌는지 계산 (state 아님!)
  const allChecked = items.every((item) => item.checked);

  return (
    <section className="mb-4 rounded-xl border border-gray-200 p-4">
      <h3 className="mb-2 font-semibold">STEP 3. 전체선택</h3>
      <label className="flex items-center gap-2 font-bold">
        <input
          type="checkbox"
          checked={allChecked} // ← 자식들 계산 결과
          onChange={(e) => toggleAll(e.target.checked)} // ← 자식 전부 set
        />
        전체선택
      </label>
      <hr className="my-2" />
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggle(item.id)}
          />
          {item.label}
        </label>
      ))}
    </section>
  );
}

// ============================================================
// STEP 4. 중간상태 (indeterminate)
//
// 일부만 켜졌을 때 부모를 "회색 줄(─)" 로 보이게.
//   isIndeterminate = 일부 켜짐(some) && 전부는 아님(!every)
//
// ★ 문제: indeterminate 는 checked 처럼 JSX 속성으로 못 줘요.
//   오직 JS 로 DOM 을 직접 만져야 함 → useRef + useEffect 필요.
//   (checked 는 "참/거짓" 2개뿐이라 indeterminate 3번째 상태는 못 담음)
// ============================================================
function Step4() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: "수박", checked: false },
    { id: 2, label: "참외", checked: false },
    { id: 3, label: "복숭아", checked: false },
  ]);

  const toggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const toggleAll = (next: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: next })));
  };

  const allChecked = items.every((item) => item.checked);
  const someChecked = items.some((item) => item.checked);
  const isIndeterminate = someChecked && !allChecked; // 일부만 켜짐

  // 부모 체크박스 DOM 을 잡아서 indeterminate 를 직접 설정
  const parentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]); // 값 바뀔 때마다 다시 설정

  return (
    <section className="mb-4 rounded-xl border border-indigo-200 p-4">
      <h3 className="mb-2 font-semibold text-indigo-700">
        STEP 4. 중간상태 (indeterminate)
      </h3>
      <label className="flex items-center gap-2 font-bold">
        <input
          ref={parentRef} // ← DOM 직접 접근용
          type="checkbox"
          checked={allChecked}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        전체선택 {isIndeterminate && "(일부만)"}
      </label>
      <hr className="my-2" />
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggle(item.id)}
          />
          {item.label}
        </label>
      ))}
      <p className="mt-2 text-sm text-gray-500">
        👉 하나만 켜보세요. 위 전체선택이 "회색 줄(─)" 로 바뀌어요.
      </p>
    </section>
  );
}

export default function CheckboxBasics() {
  return (
    <div className="mx-auto mt-10 max-w-md font-sans">
      <h2 className="mb-4 text-xl font-bold">체크박스 0부터</h2>
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
    </div>
  );
}
