import type { MenuItem } from "../types/menu";

// ============================================================
// 목(mock) 데이터 — 실제 API 대신 사용.
// 3-depth 구조: 회사관리 > 브랜드 > 매장  같은 느낌.
// 처음엔 전부 false 로 시작한다.
// ============================================================

export const sampleMenu: MenuItem[] = [
  {
    id: "dashboard",
    menuName: "대시보드",
    view: false,
    auth: false,
    showChildren: true,
  },
  {
    id: "company",
    menuName: "회사 관리",
    view: false,
    auth: false,
    showChildren: true,
    children: [
      {
        id: "company-brand",
        menuName: "브랜드 관리",
        view: false,
        auth: false,
        showChildren: true,
        children: [
          { id: "brand-list", menuName: "브랜드 목록", view: false, auth: false },
          { id: "brand-store", menuName: "매장 관리", view: false, auth: false },
        ],
      },
      {
        id: "company-admin",
        menuName: "관리자 계정",
        view: false,
        auth: false,
      },
    ],
  },
  {
    id: "sales",
    menuName: "매출 관리",
    view: false,
    auth: false,
    showChildren: true,
    children: [
      { id: "sales-daily", menuName: "일별 매출", view: false, auth: false },
      { id: "sales-monthly", menuName: "월별 매출", view: false, auth: false },
    ],
  },
  {
    id: "permission",
    menuName: "권한 관리",
    view: false,
    auth: false,
    showChildren: true,
    children: [
      { id: "perm-group", menuName: "권한 그룹", view: false, auth: false },
      { id: "perm-user", menuName: "사용자 권한", view: false, auth: false },
    ],
  },
];
