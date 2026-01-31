---
name: coding-conventions
description: 이 프로젝트의 코딩 컨벤션과 스타일 가이드. 새 파일 생성, 코드 수정, 리팩토링 시 참조.
---

# Seconds Out - Coding Conventions

## 개행 규칙 (Compact Style)

- useEffect, 함수 선언 등 관련 코드 블록 사이에 **빈 줄 없이** 연결
- 논리적으로 다른 섹션만 빈 줄로 구분
```typescript
// Good
useEffect(() => { ... }, [deps1]);
useEffect(() => { ... }, [deps2]);

// Bad
useEffect(() => { ... }, [deps1]);

useEffect(() => { ... }, [deps2]);
```

## Import 순서 (그룹별 빈 줄 구분)

```typescript
// 1) 외부 라이브러리
import { useEffect, useState } from 'react';

// 2) 내부 절대 경로 (~/)
import { useEventCallback } from '~/hooks';

// 3) 상대 경로 (컴포넌트, 훅, 유틸)
import Controls from './components/Controls';
import { useTimerSequence } from './hooks';

// 4) 스타일
import css from './Component.module.scss';

// 5) 타입 (import type)
import type { TimerConfig } from './types';
import type { FC } from 'react';
```

## Export 규칙

**배럴 파일 (index.ts):**
```typescript
// 컴포넌트 default re-export
export { default } from './Component';

// 모듈 named re-export
export { default as moduleName } from './moduleName';

// 타입 re-export
export type { TypeName } from './types';
```

**개별 파일:** 파일 끝에 `export default`

**타입 파일:**
```typescript
// types/TimerConfig.ts
interface TimerConfig { ... }
export default TimerConfig;
export type { ThemeName, BellName };

// types/index.ts
export type { default as TimerConfig, ThemeName } from './TimerConfig';
```

## 필수 훅 사용

### useEventCallback

- 콜백 함수는 `useEventCallback`으로 감싸서 안정적인 참조 유지
```typescript
const handleClick = useEventCallback(() => { ... });
```

### useMounted

- localStorage 연동 시 hydration 문제 방지
```typescript
const mounted = useMounted();
useEffect(() => {
  if (mounted) {
    // localStorage 접근
  }
}, [mounted]);
```

## 스타일링

- CSS Modules + SCSS: `import css from './Component.module.scss'`
- 클래스 사용: `className={css.root}`
- 조건부 클래스: `cn()` 유틸 사용
```typescript
import { cn } from '~/lib/utils';

<div className={cn(css.root, {
  [css.active]: isActive,
})} />
```
- CSS 변수로 테마 주입: `style={{ '--color': value } as CSSProperties}`

## 디렉토리 구조

```
src/
├── components/
│   ├── [Domain]/              # 도메인별 컴포넌트
│   │   ├── Component.tsx
│   │   ├── Component.module.scss
│   │   ├── index.ts           # 배럴 파일
│   │   ├── components/        # 하위 컴포넌트
│   │   ├── hooks/             # 도메인 전용 훅
│   │   ├── types/             # 도메인 전용 타입
│   │   └── utils/             # 도메인 전용 유틸
│   └── ui/                    # shadcn/ui 컴포넌트
├── hooks/                     # 공통 훅
├── lib/                       # 공통 유틸리티
├── providers/                 # Context Providers
└── main.tsx
```

## shadcn/ui 컴포넌트

- **function 선언 방식** 사용 (화살표 함수 X)
- **data-slot 속성** 추가
- **Radix UI** namespace import
```typescript
import * as DialogPrimitive from '@radix-ui/react-dialog';

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
```

## 외부 라이브러리 Import

```typescript
// Radix UI - namespace import
import * as SelectPrimitive from '@radix-ui/react-select';

// lucide-react - named import
import { PlusCircle, Check } from 'lucide-react';
```

## 기타

- 주석은 **한국어** 사용
- eslint-disable 주석은 export 바로 위에 작성
```typescript
// eslint-disable-next-line react-refresh/only-export-components
export { useMyContext };
```
