# Optimizing React Performance: Beyond React.memo

React performance optimization goes far beyond wrapping components in `React.memo`. This comprehensive guide covers advanced techniques for building lightning-fast React applications.

## Table of Contents

1. [Understanding React Rendering](#rendering)
2. [Advanced Memoization](#memoization)
3. [Code Splitting & Lazy Loading](#code-splitting)
4. [Virtual Lists](#virtual-lists)
5. [Web Workers](#web-workers)
6. [Performance Profiling](#profiling)
7. [Bundle Optimization](#bundle)

---

## Understanding React Rendering {#rendering}

### Render Phases

```typescript
// React rendering process
1. Trigger: State/Props change
2. Render Phase: React calls components
3. Commit Phase: React updates DOM
4. Browser Paint: Browser renders pixels
```

### Why Components Re-render

```typescript
'use client';

import { useState } from 'react';

// Parent re-render causes child re-render
export function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child /> {/* Re-renders even though it has no props */}
    </div>
  );
}

function Child() {
  console.log('Child rendered');
  return <div>I re-render unnecessarily</div>;
}
```

---

## Advanced Memoization {#memoization}

### React.memo with Custom Comparison

```typescript
import { memo } from 'react';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    preferences: object;
  };
}

// Custom comparison function
function areEqual(prevProps: Props, nextProps: Props) {
  // Only re-render if id or name changes
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name
  );
}

export const UserCard = memo(({ user }: Props) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}, areEqual);
```

### useMemo for Expensive Calculations

```typescript
'use client';

import { useMemo } from 'react';

interface DataItem {
  id: string;
  value: number;
  category: string;
}

export function DataAnalysis({ data }: { data: DataItem[] }) {
  // Expensive calculation - only recalculate when data changes
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;

    const byCategory = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    return { total, average, byCategory };
  }, [data]);

  return (
    <div>
      <p>Total: {statistics.total}</p>
      <p>Average: {statistics.average}</p>
    </div>
  );
}
```

### useCallback for Stable Function References

```typescript
'use client';

import { useState, useCallback, memo } from 'react';

interface ItemProps {
  item: string;
  onRemove: (item: string) => void;
}

// Child component with memo
const ListItem = memo(({ item, onRemove }: ItemProps) => {
  console.log(`Rendering: ${item}`);
  return (
    <div>
      {item}
      <button onClick={() => onRemove(item)}>Remove</button>
    </div>
  );
});

export function TodoList() {
  const [items, setItems] = useState(['Task 1', 'Task 2', 'Task 3']);
  const [count, setCount] = useState(0);

  // Without useCallback, this creates a new function on every render
  // causing ListItem to re-render even with memo
  const handleRemove = useCallback((item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, []); // Empty deps - function never changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
      {items.map((item) => (
        <ListItem key={item} item={item} onRemove={handleRemove} />
      ))}
    </div>
  );
}
```

---

## Code Splitting & Lazy Loading {#code-splitting}

### Dynamic Imports

```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('@/components/HeavyChart'));
const HeavyEditor = lazy(() => import('@/components/HeavyEditor'));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>

      <Suspense fallback={<EditorSkeleton />}>
        <HeavyEditor />
      </Suspense>
    </div>
  );
}
```

### Route-based Code Splitting

```typescript
// app/dashboard/page.tsx
import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR if component uses browser APIs
});

export default function DashboardPage() {
  return <DashboardContent />;
}
```

### Preloading Components

```typescript
import { lazy } from 'react';

// Preload on hover
const HeavyModal = lazy(() => import('@/components/HeavyModal'));

export function OpenModalButton() {
  const handleMouseEnter = () => {
    // Preload component when user hovers
    import('@/components/HeavyModal');
  };

  return (
    <button onMouseEnter={handleMouseEnter}>
      Open Modal
    </button>
  );
}
```

---

## Virtual Lists {#virtual-lists}

### React Virtual Implementation

```typescript
'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface Item {
  id: string;
  title: string;
  content: string;
}

export function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5, // Render 5 items outside viewport
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={item.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="border-b p-4"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Window Virtualization

```typescript
import { useWindowVirtualizer } from '@tanstack/react-virtual';

export function WindowVirtualList({ items }: { items: Item[] }) {
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <div
          key={virtualItem.index}
          data-index={virtualItem.index}
          ref={virtualizer.measureElement}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItem.start}px)`,
          }}
        >
          {items[virtualItem.index].title}
        </div>
      ))}
    </div>
  );
}
```

---

## Web Workers {#web-workers}

### Heavy Computation in Worker

```typescript
// workers/calculator.worker.ts
self.addEventListener("message", (e: MessageEvent) => {
  const { numbers } = e.data;

  // Expensive calculation
  const result = numbers.reduce((acc: number, num: number) => {
    return acc + Math.sqrt(num) * Math.random();
  }, 0);

  self.postMessage({ result });
});
```

### Using Worker in React

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';

export function HeavyCalculation() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('@/workers/calculator.worker.ts', import.meta.url)
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      setResult(e.data.result);
      setLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleCalculate = () => {
    setLoading(true);
    const numbers = Array.from({ length: 1000000 }, (_, i) => i);
    workerRef.current?.postMessage({ numbers });
  };

  return (
    <div>
      <button onClick={handleCalculate} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
```

### Custom Worker Hook

```typescript
import { useEffect, useRef, useState } from "react";

export function useWorker<T, R>(
  workerUrl: string,
): [(data: T) => void, R | null, boolean] {
  const [result, setResult] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL(workerUrl, import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent<R>) => {
      setResult(e.data);
      setLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerUrl]);

  const execute = (data: T) => {
    setLoading(true);
    workerRef.current?.postMessage(data);
  };

  return [execute, result, loading];
}
```

---

## Performance Profiling {#profiling}

### React DevTools Profiler

```typescript
import { Profiler, type ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  });
};

export function ProfiledComponent() {
  return (
    <Profiler id="MyComponent" onRender={onRender}>
      <MyComponent />
    </Profiler>
  );
}
```

### Performance Monitoring Hook

```typescript
import { useEffect, useRef } from 'react';

export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });

  return renderCount.current;
}

// Usage
export function MyComponent() {
  useRenderCount('MyComponent');

  return <div>Content</div>;
}
```

### Custom Performance Hook

```typescript
import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);

  renderStartTime.current = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;

    const avgRenderTime = totalRenderTime.current / renderCount.current;

    console.log(`${componentName} Performance:`, {
      currentRender: `${renderTime.toFixed(2)}ms`,
      averageRender: `${avgRenderTime.toFixed(2)}ms`,
      renderCount: renderCount.current,
    });
  });
}
```

---

## Bundle Optimization {#bundle}

### Tree Shaking

```typescript
// ❌ Bad: Imports entire library
import _ from "lodash";
const result = _.debounce(fn, 300);

// ✅ Good: Imports only needed function
import debounce from "lodash/debounce";
const result = debounce(fn, 300);

// ✅ Better: Use native or lighter alternatives
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

### Dynamic Imports for Large Dependencies

```typescript
// Only load heavy library when needed
async function handleExport() {
  const { default: Papa } = await import("papaparse");
  const csv = Papa.unparse(data);
  downloadFile(csv);
}
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});

# Run analysis
ANALYZE=true npm run build
```

---

## Conclusion

React performance optimization requires understanding rendering behavior, strategic memoization, code splitting, and profiling. Measure first, optimize based on data, and always prioritize user experience.

### Performance Checklist

- ✅ Use React DevTools Profiler to identify bottlenecks
- ✅ Apply `React.memo` to expensive pure components
- ✅ Use `useMemo` for expensive calculations
- ✅ Use `useCallback` for stable function references
- ✅ Implement code splitting for large components
- ✅ Use virtual lists for large datasets
- ✅ Move heavy computations to Web Workers
- ✅ Optimize bundle size with tree shaking
- ✅ Monitor Core Web Vitals in production
