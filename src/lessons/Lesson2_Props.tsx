import {useState} from "react";

interface Fruit {
  id: number;
  name: string;
  emoji: string;
}

function FruitChip({
  fruit,
  onAddFruit,
}: {
  fruit: Fruit;
  onAddFruit: (id: number) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-200 px-3 py-1 text-sm hover:bg-indigo-300 cursor-pointer">
      <span>{fruit.emoji}</span>
      {fruit.name}
      <button onClick={() => onAddFruit(fruit.id)}>+</button>
    </span>
  );
}

function FruitRow({
  fruit,
  onRemove,
}: {
  fruit: Fruit;
  onRemove: (id: number) => void;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <span className="flex items-center gap-2">
        <span className="text-lg">{fruit.emoji}</span>
        <span>{fruit.name}</span>
      </span>
      <button
        className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50"
        onClick={() => onRemove(fruit.id)} // ← 자식이 부모 함수 호출
      >
        삭제
      </button>
    </li>
  );
}

interface Node {
  label: string;
  children?: Node[];
}
const nested: Node = {
  label: "과일",
  children: [
    {
      label: "여름과일",
      children: [{label: "수박"}, {label: "참외"}],
    },
    {label: "사과"},
  ],
};

function TreeNode({node, depth = 0}: {node: Node; depth?: number}) {
  return (
    <div style={{paddingLeft: depth * 16}} className="text-sm">
      • {node.label}
      {node.children && node.children.length > 0 ? (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.label} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Lesson2Props() {
  const availableFruits: Fruit[] = [
    {id: 1, name: "수박", emoji: "🍉"},
    {id: 2, name: "참외", emoji: "🍈"},
    {id: 3, name: "복숭아", emoji: "🍑"},
  ];
  const [fruits, setFruits] = useState<Fruit[]>([]);

  const addFruit = (id: number) => {
    const fruit = availableFruits.find((f) => f.id == id);
    if (!fruit) return;
    const isAlreadyHave = fruits.some((f) => f.id == id);
    if (isAlreadyHave) return alert("이미 추가되어있는 과일입니다.");

    setFruits((prev) => [...prev, fruit]);
  };

  const removeFruit = (id: number) => {
    setFruits((prev) => prev.filter((f) => f.id != id));
  };

  return (
    <div style={{maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif"}}>
      <h2 className="mb-4 text-xl font-bold">기초 2과 — props & 컴포넌트</h2>
      <section className="mb-4 rounded-xl border border-gray-200 p-4">
        <h3 className="mb-2 font-semibold">
          1. props (같은 컴포넌트, 다른 값)
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableFruits.map((fruit) => {
            return (
              <FruitChip key={fruit.id} fruit={fruit} onAddFruit={addFruit} />
            );
          })}
        </div>
      </section>
      <section className="mb-4 rounded-xl border border-gray-200 p-4">
        <h3 className="mb-2 font-semibold">2. 콜백 props (자식 → 부모)</h3>
        <div className="flex flex-wrap gap-2">
          {fruits.length == 0 && <p>추가한 과일이 없습니다.</p>}
          {fruits.length != 0 && (
            <div className="flex flex-col w-full">
              <button
                onClick={() => setFruits([])}
                className="text-sm mb-3 ml-auto rounded-md px-2 py-1 text-red-500 hover:bg-red-50"
              >
                전체삭제
              </button>
              <ul className="space-y-2 w-full">
                {fruits.map((fruit) => (
                  <FruitRow
                    key={fruit.id}
                    fruit={fruit}
                    onRemove={removeFruit}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <section className="mb-4 rounded-xl border border-gray-200 p-4">
        <h3>3. 재귀</h3>
        <TreeNode node={nested} />
      </section>
    </div>
  );
}
