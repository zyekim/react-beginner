// 목(mock) 데이터 생성 — 실제 DB 대신.
// 특송/주문 느낌의 137건. 서버 켜질 때 한 번 만들어 메모리에 들고 있는다.

const CUSTOMERS = [
  "김민준", "이서연", "박지후", "최예준", "정하윤",
  "강도윤", "조시우", "윤주원", "장지유", "임은우",
  "한서준", "오유나", "신건우", "권채원", "황민서",
];
const STATUSES = ["대기", "배송중", "완료", "취소"];

function pad(n, len = 4) {
  return String(n).padStart(len, "0");
}

function makeRows(count) {
  const rows = [];
  // 고정 시드 느낌으로 단순 규칙 생성 (매번 같은 데이터)
  for (let i = 1; i <= count; i++) {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const status = STATUSES[i % STATUSES.length];
    const amount = ((i * 37) % 90 + 10) * 1000; // 10,000 ~ 99,000원
    // 2026-01-01 부터 하루씩
    const date = new Date(2026, 0, 1);
    date.setDate(date.getDate() + i);
    rows.push({
      id: i,
      orderNo: `ORD-2026-${pad(i)}`,
      customer,
      status,
      amount,
      createdAt: date.toISOString().slice(0, 10), // YYYY-MM-DD
    });
  }
  return rows;
}

export const rows = makeRows(137);
