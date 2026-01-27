# Building Accessible Web Applications with ARIA

Creating accessible web applications is not just good practice—it's essential. This guide covers implementing WCAG 2.1 AA compliance with ARIA patterns and best practices.

## Table of Contents

1. [Accessibility Fundamentals](#fundamentals)
2. [ARIA Basics](#aria-basics)
3. [Common Patterns](#patterns)
4. [Keyboard Navigation](#keyboard)
5. [Screen Reader Support](#screen-readers)
6. [Form Accessibility](#forms)
7. [Testing Accessibility](#testing)

---

## Accessibility Fundamentals {#fundamentals}

### Semantic HTML First

```typescript
// ❌ Bad: Using divs for everything
<div onClick={handleClick}>Click me</div>

// ✅ Good: Using semantic elements
<button onClick={handleClick}>Click me</button>

// ❌ Bad: Custom heading
<div className="text-2xl font-bold">Page Title</div>

// ✅ Good: Semantic heading
<h1>Page Title</h1>
```

### The Accessibility Tree

```typescript
// React component with proper semantics
export function Article({ title, content, author }: ArticleProps) {
  return (
    <article>
      <header>
        <h2>{title}</h2>
        <p>By {author}</p>
      </header>
      <div>{content}</div>
    </article>
  );
}
```

---

## ARIA Basics {#aria-basics}

### ARIA Roles

```typescript
// Landmark roles
<nav role="navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main role="main">
  <h1>Main Content</h1>
</main>

<aside role="complementary">
  <h2>Related Links</h2>
</aside>

// Widget roles
<div role="button" tabIndex={0} onClick={handleClick}>
  Custom Button
</div>

<div role="alert" aria-live="assertive">
  Error: Please fix the form
</div>
```

### ARIA States and Properties

```typescript
interface ButtonProps {
  isPressed?: boolean;
  isExpanded?: boolean;
  label: string;
}

export function ToggleButton({ isPressed, isExpanded, label }: ButtonProps) {
  return (
    <button
      aria-pressed={isPressed}
      aria-expanded={isExpanded}
      aria-label={label}
    >
      {label}
    </button>
  );
}
```

---

## Common Patterns {#patterns}

### Modal Dialog

```typescript
'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      previousActiveElement.current?.focus();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
```

### Accordion

```typescript
'use client';

import { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  id: string;
}

function AccordionItem({ title, children, id }: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b">
      <h3>
        <button
          id={`accordion-button-${id}`}
          aria-expanded={isExpanded}
          aria-controls={`accordion-panel-${id}`}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          {title}
          <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-button-${id}`}
        hidden={!isExpanded}
        className="p-4"
      >
        {children}
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: AccordionItemProps[] }) {
  return (
    <div role="region" aria-label="Frequently Asked Questions">
      {items.map((item) => (
        <AccordionItem key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Dropdown Menu

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';

interface MenuItem {
  id: string;
  label: string;
  onClick: () => void;
}

export function DropdownMenu({ items }: { items: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          items[focusedIndex].onClick();
          setIsOpen(false);
          break;
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, items]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        Menu
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute mt-2 w-48 rounded-md bg-white shadow-lg"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              role="menuitem"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                index === focusedIndex ? 'bg-gray-100' : ''
              }`}
              tabIndex={index === focusedIndex ? 0 : -1}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Keyboard Navigation {#keyboard}

### Focus Management

```typescript
"use client";

import { useRef, useEffect } from "react";

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, [isActive]);

  return containerRef;
}
```

### Skip Links

```typescript
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-blue-600 focus:p-4 focus:text-white"
    >
      Skip to main content
    </a>
  );
}

// In layout
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SkipLink />
      <nav>Navigation</nav>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
```

---

## Screen Reader Support {#screen-readers}

### Live Regions

```typescript
'use client';

import { useState } from 'react';

export function SearchResults() {
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const handleSearch = async (query: string) => {
    setStatus('Searching...');
    const data = await fetchResults(query);
    setResults(data);
    setStatus(`Found ${data.length} results for "${query}"`);
  };

  return (
    <div>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        aria-describedby="search-status"
      />

      {/* Screen reader announcement */}
      <div
        id="search-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {status}
      </div>

      <ul aria-label="Search results">
        {results.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Descriptive Labels

```typescript
export function UserCard({ user }: { user: User }) {
  return (
    <article aria-labelledby={`user-${user.id}-name`}>
      <img
        src={user.avatar}
        alt={`${user.name}'s profile picture`}
      />
      <h2 id={`user-${user.id}-name`}>{user.name}</h2>
      <p aria-label="User email">{user.email}</p>
      <button aria-label={`Send message to ${user.name}`}>
        Message
      </button>
    </article>
  );
}
```

---

## Form Accessibility {#forms}

### Accessible Form

```typescript
'use client';

import { useState } from 'react';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validation
    const newErrors: FormErrors = {};
    if (!formData.get('name')) {
      newErrors.name = 'Name is required';
    }
    if (!formData.get('email')) {
      newErrors.email = 'Email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitStatus('Please fix the errors and try again');
      return;
    }

    // Submit
    setSubmitStatus('Form submitted successfully');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium">
          Name <span aria-label="required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="w-full rounded border px-3 py-2"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block font-medium">
          Email <span aria-label="required">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Submit
      </button>

      {submitStatus && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4"
        >
          {submitStatus}
        </div>
      )}
    </form>
  );
}
```

---

## Testing Accessibility {#testing}

### Jest-axe Tests

```typescript
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
});
```

### Testing with React Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Modal Accessibility', () => {
  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={jest.fn()} />);

    const firstButton = screen.getByRole('button', { name: /close/i });
    const lastButton = screen.getByRole('button', { name: /confirm/i });

    // Tab forward
    await user.tab();
    expect(lastButton).toHaveFocus();

    // Tab reaches end, wraps to beginning
    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('closes on Escape key', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
```

---

## Conclusion

Building accessible applications requires attention to semantic HTML, ARIA patterns, keyboard navigation, and thorough testing. Accessibility benefits everyone and is essential for inclusive web experiences.

### Accessibility Checklist

- ✅ Use semantic HTML elements
- ✅ Provide text alternatives for images
- ✅ Ensure sufficient color contrast (4.5:1 minimum)
- ✅ Make all functionality keyboard accessible
- ✅ Provide clear focus indicators
- ✅ Use ARIA attributes appropriately
- ✅ Test with screen readers
- ✅ Implement skip links
- ✅ Use proper heading hierarchy
- ✅ Test with automated tools (axe, Lighthouse)
