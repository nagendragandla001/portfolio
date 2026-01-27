# Building Scalable Micro-frontends with Module Federation

Micro-frontends have evolved from an experimental architecture to a production-proven approach for building large-scale applications. With Webpack Module Federation, implementing micro-frontends has become more accessible and powerful than ever.

## Table of Contents

1. [Understanding Micro-frontends](#understanding)
2. [Module Federation Basics](#module-federation)
3. [Architecture Patterns](#architecture)
4. [Implementation Guide](#implementation)
5. [Shared Dependencies](#shared-deps)
6. [Communication Patterns](#communication)
7. [Deployment Strategies](#deployment)
8. [Best Practices](#best-practices)

---

## Understanding Micro-frontends {#understanding}

### What Are Micro-frontends?

Micro-frontends extend microservices concepts to frontend development, allowing teams to:

- Work independently on different parts of an application
- Deploy features independently
- Use different frameworks within the same app
- Scale teams and codebases effectively

### Module Federation

```javascript
// host/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

---

## Module Federation Basics {#module-federation}

### Remote Module

```javascript
// remote/webpack.config.js
new ModuleFederationPlugin({
  name: "remoteApp",
  filename: "remoteEntry.js",
  exposes: {
    "./Button": "./src/components/Button",
    "./Header": "./src/components/Header",
  },
  shared: ["react", "react-dom"],
});
```

### Host Application

```typescript
// host/src/App.tsx
import React, { Suspense, lazy } from 'react';

const RemoteButton = lazy(() => import('remoteApp/Button'));
const RemoteHeader = lazy(() => import('remoteApp/Header'));

export function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteHeader />
        <RemoteButton onClick={() => alert('Clicked!')} />
      </Suspense>
    </div>
  );
}
```

---

## Architecture Patterns {#architecture}

### 1. Shell Pattern

```typescript
// Shell application loads micro-frontends
export function Shell() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/products/*" element={<ProductsApp />} />
        <Route path="/checkout/*" element={<CheckoutApp />} />
        <Route path="/profile/*" element={<ProfileApp />} />
      </Routes>
    </Router>
  );
}
```

### 2. Shared State Management

```typescript
import { create } from "zustand";

// Shared store across micro-frontends
export const useGlobalStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  cart: [],
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
}));
```

### 3. Communication Bus

```typescript
class EventBus {
  private events: Map<string, Function[]> = new Map();

  subscribe(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  publish(event: string, data: any) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }
}

export const eventBus = new EventBus();
```

---

## Implementation Guide {#implementation}

### Step 1: Setup Remote App

```typescript
// products-app/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "productsApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/ProductList",
        "./ProductDetail": "./src/ProductDetail",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};
```

### Step 2: Setup Host App

```typescript
// host-app/webpack.config.js
new ModuleFederationPlugin({
  name: "hostApp",
  remotes: {
    productsApp: "productsApp@http://localhost:3001/remoteEntry.js",
    checkoutApp: "checkoutApp@http://localhost:3002/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
  },
});
```

### Step 3: Dynamic Imports

```typescript
// host-app/src/App.tsx
const ProductList = lazy(() => import('productsApp/ProductList'));
const CheckoutFlow = lazy(() => import('checkoutApp/CheckoutFlow'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Shared Dependencies {#shared-deps}

### Version Management

```javascript
// Strict version sharing
shared: {
  react: {
    singleton: true,
    strictVersion: true,
    requiredVersion: '^18.2.0',
  },
  'react-dom': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '^18.2.0',
  },
}
```

### Eager Loading

```javascript
// Load shared dependencies eagerly
shared: {
  'lodash': {
    eager: true, // Load immediately
    singleton: true,
  },
}
```

---

## Communication Patterns {#communication}

### Props Drilling

```typescript
// Host passes props to remote
<RemoteComponent
  user={currentUser}
  onAction={(data) => handleAction(data)}
/>
```

### Custom Events

```typescript
// Remote component
const handleClick = () => {
  window.dispatchEvent(
    new CustomEvent("product:selected", {
      detail: { productId: "123" },
    }),
  );
};

// Host component
useEffect(() => {
  const handler = (e: CustomEvent) => {
    console.log("Product selected:", e.detail.productId);
  };

  window.addEventListener("product:selected", handler);
  return () => window.removeEventListener("product:selected", handler);
}, []);
```

### Shared Context

```typescript
// Shared context provider
export const AppContext = createContext(null);

// Host
<AppContext.Provider value={sharedState}>
  <RemoteApp />
</AppContext.Provider>

// Remote
const shared = useContext(AppContext);
```

---

## Deployment Strategies {#deployment}

### Independent Deployment

```yaml
# products-app/deploy.yml
name: Deploy Products App
on:
  push:
    branches: [main]
    paths: ["apps/products/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
      - name: Deploy to CDN
        run: aws s3 sync dist/ s3://micro-frontends/products-app/
```

### Versioning Strategy

```javascript
// Dynamic version loading
const remotes = {
  productsApp: `productsApp@https://cdn.example.com/products-app/${version}/remoteEntry.js`,
};
```

---

## Best Practices {#best-practices}

### 1. Error Boundaries

```typescript
class MicroFrontendBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

### 2. Performance Optimization

```typescript
// Preload remotes
const preloadRemote = (remoteName: string) => {
  const script = document.createElement("script");
  script.src = remotes[remoteName];
  document.head.appendChild(script);
};
```

### 3. Type Safety

```typescript
// Shared types package
declare module "productsApp/ProductList" {
  export interface ProductListProps {
    onSelect: (id: string) => void;
  }
  export const ProductList: React.FC<ProductListProps>;
}
```

---

## Conclusion

Module Federation enables true micro-frontend architectures with independent deployment, shared code, and seamless integration. Follow these patterns and best practices to build scalable, maintainable micro-frontend applications.

### Key Takeaways

- Module Federation simplifies micro-frontend implementation
- Independent deployment enables faster iteration
- Proper communication patterns are crucial
- Type safety and error handling are essential
- Performance optimization is critical for user experience
