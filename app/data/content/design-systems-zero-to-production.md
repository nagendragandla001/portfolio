# Design Systems: From Zero to Production

Building a design system is one of the most impactful investments a team can make. This guide covers creating a scalable, maintainable design system from foundational principles to production deployment.

## Table of Contents

1. [Design System Fundamentals](#fundamentals)
2. [Design Tokens](#tokens)
3. [Component Architecture](#architecture)
4. [Documentation](#documentation)
5. [Testing Strategy](#testing)
6. [Versioning & Distribution](#distribution)
7. [Adoption & Migration](#adoption)
8. [Governance](#governance)

---

## Design System Fundamentals {#fundamentals}

### What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications.

### Core Principles

```typescript
// Design system principles
export const principles = {
  consistency: "Same components behave the same way",
  accessibility: "WCAG 2.1 AA compliance minimum",
  flexibility: "Composable and adaptable",
  performance: "Optimized for speed",
  documentation: "Self-documenting with examples",
};
```

---

## Design Tokens {#tokens}

### Foundation Tokens

```typescript
// tokens/colors.ts
export const colors = {
  // Primitives
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Semantic tokens
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    disabled: "#9CA3AF",
    inverse: "#FFFFFF",
  },

  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F3F4F6",
  },

  border: {
    default: "#E5E7EB",
    hover: "#D1D5DB",
    focus: "#3B82F6",
  },
};
```

### Typography Tokens

```typescript
// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    mono: '"SF Mono", Monaco, "Cascadia Code", monospace',
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing Tokens

```typescript
// tokens/spacing.ts
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
};
```

---

## Component Architecture {#architecture}

### Button Component

```typescript
// components/Button/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2">
              <Spinner size="sm" />
            </span>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Input Component

```typescript
// components/Input/Input.tsx
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:ring-blue-600',
        error: 'border-red-500 focus-visible:ring-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputVariants({ variant: error ? 'error' : variant, className })}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### Card Component

```typescript
// components/Card/Card.tsx
import { forwardRef, type HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  )
);

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  )
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  )
);
```

---

## Documentation {#documentation}

### Storybook Setup

```typescript
// .storybook/preview.tsx
import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

### Component Story

```typescript
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    isLoading: true,
  },
};
```

---

## Testing Strategy {#testing}

### Unit Tests

```typescript
// components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('disables button when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Tests

```typescript
// components/Button/Button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes when loading', () => {
    const { getByRole } = render(<Button isLoading>Submit</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
});
```

### Visual Regression Tests

```typescript
// components/Button/Button.visual.test.tsx
import { test, expect } from "@playwright/test";

test.describe("Button Visual Tests", () => {
  test("matches snapshot", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/?path=/story/components-button--primary",
    );
    await expect(page).toHaveScreenshot("button-primary.png");
  });

  test("hover state matches snapshot", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/?path=/story/components-button--primary",
    );
    await page.hover("button");
    await expect(page).toHaveScreenshot("button-primary-hover.png");
  });
});
```

---

## Versioning & Distribution {#distribution}

### Package Configuration

```json
{
  "name": "@company/design-system",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    },
    "./tokens": {
      "require": "./dist/tokens.js",
      "import": "./dist/tokens.mjs",
      "types": "./dist/tokens.d.ts"
    }
  },
  "files": ["dist"]
}
```

### Build Configuration

```typescript
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/tokens/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
});
```

### Changelog Generation

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Adoption & Migration {#adoption}

### Migration Guide

```typescript
// Migration from v1 to v2
// Before (v1)
<Button color="blue" size="large">
  Click me
</Button>

// After (v2)
<Button variant="primary" size="lg">
  Click me
</Button>

// Codemod for automated migration
export function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: 'Button' } },
    })
    .forEach((path) => {
      const attrs = path.value.openingElement.attributes;

      // Replace color with variant
      attrs.forEach((attr) => {
        if (attr.name.name === 'color') {
          attr.name.name = 'variant';
        }
      });
    });

  return root.toSource();
}
```

---

## Governance {#governance}

### Contribution Guidelines

```markdown
# Contributing to the Design System

## Proposing New Components

1. Create an RFC (Request for Comments)
2. Discuss with the design system team
3. Get approval from design and engineering
4. Implement with tests and documentation
5. Submit pull request

## Component Checklist

- [ ] Accessible (WCAG 2.1 AA)
- [ ] Responsive
- [ ] Documented in Storybook
- [ ] Unit tests (>80% coverage)
- [ ] Visual regression tests
- [ ] TypeScript types
- [ ] Examples provided
```

---

## Conclusion

A well-designed system accelerates development, ensures consistency, and improves collaboration. Start small, iterate based on feedback, and grow your system organically with your team's needs.
