import {useState} from "react";

export default function Lesson1Basics() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const summerFruits = ["수박", "참외", "복숭아"];
  return (
    <div style={{maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif"}}>
      <h2>기초 복습</h2>

      <section style={box}>
        <h3>① 카운터 (useState + 클릭 이벤트)</h3>
        <p>현재 값: {count}</p>
        <button style={btn} onClick={() => setCount(count + 1)}>
          {" "}
          + 1{" "}
        </button>
        <button style={btn} onClick={() => setCount(count - 1)}>
          {" "}
          - 1{" "}
        </button>
        <button style={btn} onClick={() => setCount(0)}>
          리셋
        </button>
        {/* JSX 안에서 JS 값을 쓸 땐 중괄호 { } 로 감싼다.
            Vue 의 {{ count }} 와 같은 자리. (React 는 중괄호 1개) */}
        <p>
          현재 값: <b>{count}</b>
        </p>
      </section>
      <section style={box}>
        <h3>② 입력창 (Vue 의 v-model 직접 만들기)</h3>

        <input
          type="text"
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요."
        />
        {name == "" ? (
          <p>-</p>
        ) : (
          <p>
            안녕하세요, <b>{name}님</b>
          </p>
        )}
      </section>
      <section style={box}>
        <h3>③ 리스트 (Vue 의 v-for → .map)</h3>
        <ul>
          {summerFruits.map((fruit) => (
            <li key={fruit}>{fruit}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ── 스타일 (지금은 신경 안 써도 됨)
const box: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "12px 18px",
  marginBottom: 16,
};
const btn: React.CSSProperties = {
  marginRight: 8,
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #d0d4dd",
  background: "#fff",
  cursor: "pointer",
};
const input: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d0d4dd",
  fontSize: 14,
  width: "100%",
  marginBottom: 8,
};
