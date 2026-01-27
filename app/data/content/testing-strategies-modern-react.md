# Testing Strategies for Modern React Applications

Building robust React applications requires comprehensive testing strategies. This guide covers unit testing, integration testing, E2E testing, and best practices for 2026.

## Table of Contents

1. [Testing Pyramid](#pyramid)
2. [Unit Testing with Jest](#jest)
3. [Component Testing with RTL](#rtl)
4. [Integration Testing](#integration)
5. [E2E Testing with Playwright](#playwright)
6. [Visual Regression Testing](#visual)
7. [Testing Best Practices](#best-practices)

---

## Testing Pyramid {#pyramid}

### Understanding the Testing Pyramid

```
       /\
      /E2E\      Few - Slow - Expensive
     /------\
    /  INT   \   Some - Medium Speed
   /----------\
  /    UNIT    \ Many - Fast - Cheap
 /--------------\
```

### Test Distribution

```typescript
// 70% Unit Tests - Fast, isolated
// 20% Integration Tests - Component interactions
// 10% E2E Tests - Critical user journeys
```

---

## Unit Testing with Jest {#jest}

### Testing Utilities

```typescript
// utils/formatters.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// utils/formatters.test.ts
import { formatCurrency, formatDate } from "./formatters";

describe("formatCurrency", () => {
  it("formats amount as USD currency", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-100)).toBe("-$100.00");
  });
});

describe("formatDate", () => {
  it("formats date in long format", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("January 15, 2024");
  });
});
```

### Testing Custom Hooks

```typescript
// hooks/useCounter.ts
import { useState, useCallback } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

---

## Component Testing with RTL {#rtl}

### Basic Component Tests

```typescript
// components/Button.tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ onClick, children, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant class', () => {
    render(<Button onClick={jest.fn()} variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button onClick={jest.fn()} disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Forms

```typescript
// components/LoginForm.tsx
'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div role="alert">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// components/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders form fields', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required');
  });

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button')).toHaveTextContent('Logging in...');
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Integration Testing {#integration}

### Testing Component Interactions

```typescript
// components/TodoApp.test.tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from './TodoApp';

describe('TodoApp Integration', () => {
  it('adds and completes todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    // Add todo
    const input = screen.getByPlaceholderText(/add todo/i);
    await user.type(input, 'Buy groceries');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Verify todo added
    const todoItem = screen.getByText('Buy groceries');
    expect(todoItem).toBeInTheDocument();

    // Complete todo
    const checkbox = screen.getByRole('checkbox', { name: /buy groceries/i });
    await user.click(checkbox);

    // Verify todo completed
    expect(todoItem).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('filters todos by status', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    // Add multiple todos
    const input = screen.getByPlaceholderText(/add todo/i);
    await user.type(input, 'Todo 1');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await user.clear(input);
    await user.type(input, 'Todo 2');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Complete first todo
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    // Filter by completed
    await user.click(screen.getByRole('button', { name: /completed/i }));

    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();

    // Filter by active
    await user.click(screen.getByRole('button', { name: /active/i }));

    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
});
```

### Testing with API Mocks

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile with API', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile userId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    server.use(
      rest.get('/api/user/:id', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## E2E Testing with Playwright {#playwright}

### Basic E2E Test

```typescript
// e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("successful login", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("http://localhost:3000/dashboard");
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('[name="email"]', "wrong@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toContainText(
      "Invalid credentials",
    );
  });
});
```

### Testing User Journeys

```typescript
// e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Checkout Journey", () => {
  test("complete purchase flow", async ({ page }) => {
    // Navigate to product
    await page.goto("http://localhost:3000");
    await page.click("text=Shop Now");

    // Add to cart
    await page.click("text=Add to Cart");
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText("1");

    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL(/.*cart/);

    // Proceed to checkout
    await page.click("text=Checkout");

    // Fill shipping info
    await page.fill('[name="name"]', "John Doe");
    await page.fill('[name="address"]', "123 Main St");
    await page.fill('[name="city"]', "New York");
    await page.fill('[name="zip"]', "10001");

    // Fill payment info
    await page.fill('[name="cardNumber"]', "4242424242424242");
    await page.fill('[name="expiry"]', "12/25");
    await page.fill('[name="cvc"]', "123");

    // Complete purchase
    await page.click("text=Place Order");

    // Verify success
    await expect(page).toHaveURL(/.*success/);
    await expect(page.locator("text=Order Confirmed")).toBeVisible();
  });
});
```

---

## Visual Regression Testing {#visual}

### Playwright Visual Tests

```typescript
// e2e/visual.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("homepage matches snapshot", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("button states match snapshots", async ({ page }) => {
    await page.goto("http://localhost:3000/components");

    // Default state
    await expect(page.locator('[data-testid="button"]')).toHaveScreenshot(
      "button-default.png",
    );

    // Hover state
    await page.hover('[data-testid="button"]');
    await expect(page.locator('[data-testid="button"]')).toHaveScreenshot(
      "button-hover.png",
    );

    // Focus state
    await page.focus('[data-testid="button"]');
    await expect(page.locator('[data-testid="button"]')).toHaveScreenshot(
      "button-focus.png",
    );
  });
});
```

---

## Testing Best Practices {#best-practices}

### Test Organization

```typescript
describe("Component Name", () => {
  describe("Rendering", () => {
    it("renders correctly", () => {});
    it("renders with props", () => {});
  });

  describe("User Interactions", () => {
    it("handles click", () => {});
    it("handles input", () => {});
  });

  describe("Edge Cases", () => {
    it("handles empty state", () => {});
    it("handles error state", () => {});
  });
});
```

### Custom Test Utilities

```typescript
// test-utils.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
```

---

## Conclusion

Comprehensive testing strategies ensure application reliability. Combine unit tests for logic, component tests for UI, integration tests for features, and E2E tests for critical paths. Prioritize test maintainability and developer experience.

### Testing Checklist

- ✅ Unit test business logic and utilities
- ✅ Component test user interactions
- ✅ Integration test feature workflows
- ✅ E2E test critical user journeys
- ✅ Mock external dependencies
- ✅ Test accessibility
- ✅ Use visual regression for UI
- ✅ Maintain fast test execution
- ✅ Write descriptive test names
- ✅ Keep tests independent
