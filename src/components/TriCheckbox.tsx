import { useEffect, useRef } from "react";
import type { CheckState } from "../types/menu";

// ============================================================
// 3-state 체크박스 (checked / unchecked / indeterminate)
//
// HTML 체크박스의 indeterminate(중간) 상태는 HTML 속성이 아니라
// JS 로만 설정할 수 있다 → DOM 에 직접 접근해야 한다.
//
// Vue:   <v-checkbox-btn :indeterminate="..."/>  (라이브러리가 처리)
// React: useRef 로 input DOM 을 잡고 useEffect 에서 .indeterminate 설정
//        → "DOM 을 직접 만져야 할 때 ref 를 쓴다" 는 React 패턴 학습 포인트.
// ============================================================

interface Props {
  state: CheckState;
  disabled?: boolean;
  /** 체크박스를 눌렀을 때 "이제 켜야 하는지(true)" 를 넘겨준다 */
  onToggle: (nextChecked: boolean) => void;
}

export function TriCheckbox({ state, disabled, onToggle }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  // state 가 바뀔 때마다 DOM 의 indeterminate 속성을 동기화
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = state === "indeterminate";
    }
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      disabled={disabled}
      checked={state === "checked"}
      // indeterminate 거나 unchecked 면 → 클릭 시 켜고(true), checked 면 끈다(false)
      onChange={() => onToggle(state !== "checked")}
    />
  );
}
