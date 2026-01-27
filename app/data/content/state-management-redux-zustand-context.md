# State Management in 2026: Redux vs Zustand vs Context API

The state management landscape has evolved significantly. This comprehensive comparison helps you choose the right solution for your React applications in 2026.

## Table of Contents

1. [State Management Overview](#overview)
2. [Context API](#context-api)
3. [Zustand](#zustand)
4. [Redux Toolkit](#redux)
5. [Performance Comparison](#performance)
6. [Decision Framework](#decision)
7. [Migration Strategies](#migration)

---

## State Management Overview {#overview}

### When Do You Need State Management?

```typescript
// Local state - No library needed
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Shared state - Consider state management
// Multiple components need access to user data, theme, cart, etc.
```

---

## Context API {#context-api}

### Basic Implementation

```typescript
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Optimized Context with useMemo

```typescript
'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Split Contexts for Performance

```typescript
// ❌ Bad: Single context with multiple values causes unnecessary re-renders
interface AppContextType {
  user: User;
  theme: Theme;
  settings: Settings;
}

// ✅ Good: Separate contexts for independent concerns
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### Pros & Cons

**Pros:**

- Built into React (no dependencies)
- Simple API
- Good for small to medium apps
- Server component friendly

**Cons:**

- Can cause unnecessary re-renders
- No built-in devtools
- Requires provider setup
- Boilerplate for multiple contexts

---

## Zustand {#zustand}

### Basic Store

```typescript
import { create } from 'zustand';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: crypto.randomUUID(), text, completed: false }],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));

// Usage in component
export function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <button onClick={() => addTodo('New task')}>Add</button>
    </div>
  );
}
```

### Middleware (Persist & DevTools)

```typescript
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: "user-storage", // LocalStorage key
      },
    ),
  ),
);
```

### Async Actions

```typescript
interface DataStore {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

### Computed Values with Selectors

```typescript
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// Computed selectors
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  );

// Usage
function CartSummary() {
  const total = useCartTotal();
  const count = useCartCount();

  return (
    <div>
      <p>{count} items</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

### Pros & Cons

**Pros:**

- Minimal boilerplate
- Excellent performance (no unnecessary re-renders)
- Built-in devtools support
- Middleware ecosystem
- TypeScript-friendly
- Small bundle size (~1KB)

**Cons:**

- External dependency
- Less structured than Redux
- Learning curve for advanced patterns

---

## Redux Toolkit {#redux}

### Modern Redux Setup

```typescript
import {
  createSlice,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage in component
function UserProfile() {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return <div>{user?.name}</div>;
}
```

### Async Thunks

```typescript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user";
        state.loading = false;
      });
  },
});

// Usage
function UserComponent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser("123"));
  }, [dispatch]);
}
```

### RTK Query

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),
    getUser: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useCreateUserMutation } = api;

// Usage
function UserList() {
  const { data, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Pros & Cons

**Pros:**

- Industry standard
- Excellent devtools
- Predictable state updates
- Great for large applications
- RTK Query for data fetching
- Time-travel debugging

**Cons:**

- More boilerplate
- Steeper learning curve
- Larger bundle size (~11KB)
- Requires provider setup

---

## Performance Comparison {#performance}

### Render Performance

```typescript
// Context API - All consumers re-render
const { user, theme, settings } = useAppContext();

// Zustand - Only components using changed values re-render
const user = useStore((state) => state.user);
const theme = useStore((state) => state.theme);

// Redux - Optimized with selector memoization
const user = useAppSelector((state) => state.user);
```

### Bundle Size Comparison

```
Context API: 0KB (built-in)
Zustand: ~1KB
Redux Toolkit: ~11KB
```

---

## Decision Framework {#decision}

### Choose Context API When:

- Small to medium applications
- Simple state needs
- Infrequent updates
- Server components needed
- No external dependencies desired

### Choose Zustand When:

- Medium to large applications
- Performance critical
- Minimal boilerplate desired
- TypeScript-first approach
- Flexible architecture needed

### Choose Redux When:

- Large, complex applications
- Predictable state updates required
- Time-travel debugging needed
- Team familiar with Redux patterns
- Data fetching with RTK Query

---

## Migration Strategies {#migration}

### Context to Zustand

```typescript
// Before: Context
const { user, setUser } = useAuth();

// After: Zustand
const { user, setUser } = useAuthStore();

// Gradual migration possible!
```

### Redux to Zustand

```typescript
// Before: Redux
const user = useAppSelector((state) => state.user);
const dispatch = useAppDispatch();
dispatch(setUser(newUser));

// After: Zustand
const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
setUser(newUser);
```

---

## Conclusion

In 2026, the choice depends on your specific needs. Context API for simple cases, Zustand for performance and flexibility, Redux for complex enterprise applications. Consider starting with simpler solutions and migrating as needs grow.

### Quick Reference

| Feature        | Context | Zustand   | Redux     |
| -------------- | ------- | --------- | --------- |
| Bundle Size    | 0KB     | 1KB       | 11KB      |
| Performance    | Good    | Excellent | Excellent |
| Boilerplate    | Medium  | Low       | High      |
| DevTools       | No      | Yes       | Yes       |
| Learning Curve | Easy    | Easy      | Medium    |
| TypeScript     | Good    | Excellent | Excellent |
