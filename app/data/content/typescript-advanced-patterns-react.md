# TypeScript Advanced Patterns for React Developers

Master advanced TypeScript patterns that will make your React code more type-safe, maintainable, and developer-friendly.

## Table of Contents

1. [Generic Components](#generic-components)
2. [Discriminated Unions](#discriminated-unions)
3. [Utility Types](#utility-types)
4. [Type Guards](#type-guards)
5. [Template Literal Types](#template-literals)
6. [Conditional Types](#conditional-types)
7. [Mapped Types](#mapped-types)

---

## Generic Components {#generic-components}

### Generic List Component

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage with full type inference
interface User {
  id: string;
  name: string;
  email: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      renderItem={(user) => ( // user is typed as User!
        <div>
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      )}
      keyExtractor={(user) => user.id}
    />
  );
}
```

### Generic Form Field

```typescript
interface FieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  validate?: (value: T) => string | undefined;
}

function Field<T extends string | number>({
  value,
  onChange,
  validate,
}: FieldProps<T>) {
  const [error, setError] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (
      typeof value === 'number' ? Number(e.target.value) : e.target.value
    ) as T;

    onChange(newValue);

    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  };

  return (
    <div>
      <input
        type={typeof value === 'number' ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

---

## Discriminated Unions {#discriminated-unions}

### Action Types Pattern

```typescript
// Define discriminated union for actions
type Action =
  | { type: "SET_USER"; payload: { id: string; name: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

// Reducer with exhaustive checking
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload, // payload is correctly typed!
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload, // boolean type inferred!
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload, // string type inferred!
      };
    case "RESET":
      return initialState; // no payload needed
    default:
      // TypeScript ensures all cases are handled
      const _exhaustive: never = action;
      return state;
  }
}
```

### Status Component Pattern

```typescript
type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: User }
  | { type: 'error'; error: string };

function UserProfile({ status }: { status: Status }) {
  switch (status.type) {
    case 'idle':
      return <div>Click to load user</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      // status.data is available and typed as User!
      return (
        <div>
          <h1>{status.data.name}</h1>
          <p>{status.data.email}</p>
        </div>
      );
    case 'error':
      // status.error is available and typed as string!
      return <div className="error">{status.error}</div>;
  }
}
```

---

## Utility Types {#utility-types}

### Built-in Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
}

// Pick - Select subset of properties
type UserPreview = Pick<User, "id" | "name">;
// { id: string; name: string; }

// Omit - Exclude properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number; role: 'admin' | 'user' }

// Partial - Make all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; ... }

// Required - Make all properties required
type RequiredUser = Required<PartialUser>;

// Readonly - Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Record - Create object type with specific keys
type UserRoles = Record<string, User[]>;
// { [key: string]: User[] }

// ReturnType - Extract return type of function
function getUser() {
  return { id: "1", name: "John" };
}
type User = ReturnType<typeof getUser>;
// { id: string; name: string; }

// Parameters - Extract parameter types
function updateUser(id: string, data: Partial<User>) {}
type UpdateUserParams = Parameters<typeof updateUser>;
// [string, Partial<User>]
```

### Custom Utility Types

```typescript
// Make specific properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: string;
  name: string;
  email: string;
}

type UserWithOptionalEmail = Optional<User, "email">;
// { id: string; name: string; email?: string }

// Make specific properties required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

type UserWithRequiredEmail = RequireFields<Partial<User>, "email">;
// { id?: string; name?: string; email: string }

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  api: {
    url: string;
    timeout: number;
  };
  features: {
    analytics: boolean;
  };
}

type PartialConfig = DeepPartial<Config>;
// All nested properties are optional
```

---

## Type Guards {#type-guards}

### User-Defined Type Guards

```typescript
interface Cat {
  type: "cat";
  meow: () => void;
}

interface Dog {
  type: "dog";
  bark: () => void;
}

type Animal = Cat | Dog;

// Type guard function
function isCat(animal: Animal): animal is Cat {
  return animal.type === "cat";
}

function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript knows it's a Cat
  } else {
    animal.bark(); // TypeScript knows it's a Dog
  }
}
```

### Generic Type Guard

```typescript
function isArrayOf<T>(
  value: unknown,
  check: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every(check);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// Usage
const data: unknown = ["1", "2", "3"];

if (isArrayOf(data, isString)) {
  // data is typed as string[]
  data.map((str) => str.toUpperCase());
}
```

### React Component Type Guards

```typescript
import { isValidElement, type ReactElement } from "react";

function isReactComponent<P>(
  component: unknown,
): component is React.ComponentType<P> {
  return (
    typeof component === "function" ||
    (typeof component === "object" && component !== null)
  );
}

function isReactElement(value: unknown): value is ReactElement {
  return isValidElement(value);
}
```

---

## Template Literal Types {#template-literals}

### CSS Property Types

```typescript
type CSSLength = `${number}${"px" | "em" | "rem" | "%" | "vh" | "vw"}`;
type CSSColor = `#${string}` | `rgb(${string})` | `rgba(${string})`;

interface BoxStyles {
  width: CSSLength;
  height: CSSLength;
  backgroundColor: CSSColor;
  margin: CSSLength;
}

const box: BoxStyles = {
  width: "100px", // ✓ Valid
  height: "50%", // ✓ Valid
  backgroundColor: "#FF0000", // ✓ Valid
  margin: "10rem", // ✓ Valid
  // margin: '10px10px', // ✗ Error: Type '"10px10px"' is not assignable
};
```

### Event Handler Types

```typescript
type EventType = "click" | "hover" | "focus";
type EventHandler<T extends EventType> = `on${Capitalize<T>}`;

type Handlers = {
  [K in EventType as EventHandler<K>]: () => void;
};

// Results in:
// {
//   onClick: () => void;
//   onHover: () => void;
//   onFocus: () => void;
// }

const handlers: Handlers = {
  onClick: () => console.log("clicked"),
  onHover: () => console.log("hovered"),
  onFocus: () => console.log("focused"),
};
```

### API Route Types

```typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts" | "comments";
type APIRoute = `/${Lowercase<HTTPMethod>}/${Endpoint}`;

const routes: Record<APIRoute, string> = {
  "/get/users": "Fetch users",
  "/post/users": "Create user",
  "/put/users": "Update user",
  "/delete/users": "Delete user",
  // ... other routes
};
```

---

## Conditional Types {#conditional-types}

### Extract API Response Type

```typescript
type APIResponse<T> = T extends { data: infer D } ? D : never;

interface UserResponse {
  data: { id: string; name: string };
  status: number;
}

type UserData = APIResponse<UserResponse>;
// { id: string; name: string }
```

### Flatten Type

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type StringArray = Flatten<string[]>; // string
type NumberType = Flatten<number>; // number
```

### Extract Function Arguments

```typescript
type FirstArg<T> = T extends (arg: infer U, ...args: any[]) => any ? U : never;

function updateUser(user: User, options: UpdateOptions) {}

type UserArg = FirstArg<typeof updateUser>; // User
```

### Conditional Props

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'link';
  href?: string;
}

type ConditionalButtonProps<T extends ButtonProps['variant']> = T extends 'link'
  ? ButtonProps & { href: string } // href required for link
  : ButtonProps & { href?: never }; // href not allowed for others

function Button<T extends ButtonProps['variant']>(
  props: ConditionalButtonProps<T>
) {
  if (props.variant === 'link') {
    return <a href={props.href}>Link</a>;
  }
  return <button>Button</button>;
}

// Usage
<Button variant="link" href="/about" /> // ✓ href required
<Button variant="primary" /> // ✓ href not needed
<Button variant="link" /> // ✗ Error: href required
<Button variant="primary" href="/about" /> // ✗ Error: href not allowed
```

---

## Mapped Types {#mapped-types}

### Form State Types

```typescript
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
  };
};

interface UserForm {
  name: string;
  email: string;
  age: number;
}

type UserFormState = FormState<UserForm>;
// {
//   name: { value: string; error?: string; touched: boolean };
//   email: { value: string; error?: string; touched: boolean };
//   age: { value: number; error?: string; touched: boolean };
// }
```

### Getters Type

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

### Event Map

```typescript
type EventMap<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

interface FormFields {
  username: string;
  password: string;
  remember: boolean;
}

type FormHandlers = EventMap<FormFields>;
// {
//   onUsernameChange: (value: string) => void;
//   onPasswordChange: (value: string) => void;
//   onRememberChange: (value: boolean) => void;
// }
```

---

## Conclusion

Advanced TypeScript patterns enable you to build robust, type-safe React applications. These patterns catch bugs at compile time, improve developer experience, and make code more maintainable.

### Key Takeaways

- Use generics for reusable, type-safe components
- Leverage discriminated unions for complex state management
- Create custom utility types for common patterns
- Implement type guards for runtime type safety
- Use template literals for strongly-typed strings
- Apply conditional types for dynamic type logic
- Create mapped types for transforming interfaces
