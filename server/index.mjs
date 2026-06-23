// ============================================================
// 연습용 목(mock) 서버 — Express
//
// 실행:  npm run server   (→ http://localhost:4000)
//
// 엔드포인트:
//   GET /api/items?page=1&pageSize=10&status=배송중&search=김&sort=amount&order=desc
//
// 쿼리 파라미터 (전부 선택):
//   page      현재 페이지 (기본 1)
//   pageSize  페이지당 개수 (기본 10)
//   status    상태 필터 (대기/배송중/완료/취소)
//   search    주문번호·고객명 부분검색
//   sort      정렬 기준 필드 (id/orderNo/customer/status/amount/createdAt)
//   order     asc(오름) | desc(내림), 기본 asc
//
// 응답 모양 (이걸로 프론트에서 ApiResponse<T> 제네릭 타입 연습!):
//   {
//     data: [...],      // 이 페이지 행들
//     page: 1,
//     pageSize: 10,
//     total: 137,       // 필터 적용 후 전체 개수
//     totalPages: 14
//   }
// ============================================================

import express from "express";
import cors from "cors";
import { rows } from "./data.mjs";

const app = express();
app.use(cors()); // 프론트(:5173)에서 호출 허용

app.get("/api/items", (req, res) => {
  const {
    page = "1",
    pageSize = "10",
    status,
    search,
    sort,
    order = "asc",
  } = req.query;

  // 1) 필터 (status, search)
  let result = [...rows];
  if (status) {
    result = result.filter((r) => r.status === status);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        r.orderNo.toLowerCase().includes(q)
    );
  }

  // 2) 정렬
  if (sort) {
    const dir = order === "desc" ? -1 : 1;
    result.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }

  // 3) 페이징 (필터/정렬 끝난 뒤 자르기)
  const total = result.length;
  const p = Math.max(1, Number(page));
  const size = Math.max(1, Number(pageSize));
  const start = (p - 1) * size;
  const data = result.slice(start, start + size);

  // 살짝 지연을 줘서 로딩 상태 연습 가능하게 (200ms)
  setTimeout(() => {
    res.json({
      data,
      page: p,
      pageSize: size,
      total,
      totalPages: Math.ceil(total / size),
    });
  }, 200);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ 목 서버 실행: http://localhost:${PORT}`);
  console.log(`   예) http://localhost:${PORT}/api/items?page=1&pageSize=10`);
});
