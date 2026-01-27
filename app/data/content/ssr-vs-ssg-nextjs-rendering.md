# SSR vs SSG: Choosing the Right Next.js Rendering Strategy

Understanding when to use Server-Side Rendering (SSR), Static Site Generation (SSG), or Incremental Static Regeneration (ISR) is crucial for building performant Next.js applications.

## Table of Contents

1. [Rendering Strategies Overview](#overview)
2. [Static Site Generation (SSG)](#ssg)
3. [Server-Side Rendering (SSR)](#ssr)
4. [Incremental Static Regeneration (ISR)](#isr)
5. [Client-Side Rendering (CSR)](#csr)
6. [Performance Comparison](#performance)
7. [Decision Framework](#decision-framework)
8. [Hybrid Approaches](#hybrid)

---

## Rendering Strategies Overview {#overview}

### The Rendering Spectrum

```typescript
// Static Generation (Build Time)
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

// Server-Side Rendering (Request Time)
export const dynamic = "force-dynamic";

// Incremental Static Regeneration (On-demand + Time)
export const revalidate = 60; // 60 seconds
```

---

## Static Site Generation (SSG) {#ssg}

### Basic Implementation

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### With Dynamic Metadata

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### Benefits

- **Fastest Performance**: Pre-rendered at build time
- **CDN Cacheable**: Static files served from edge
- **SEO Optimized**: Complete HTML ready for crawlers
- **Cost Effective**: Minimal server resources

### Use Cases

- Marketing pages
- Blog posts
- Documentation
- Product listings

---

## Server-Side Rendering (SSR) {#ssr}

### Implementation

```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getServerSession();
  const userData = await fetchUserData(session.userId);

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <DashboardContent data={userData} />
    </div>
  );
}
```

### With Dynamic Data

```typescript
async function getRealtimeData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // Ensure fresh data
  });
  return res.json();
}

export default async function Page() {
  const data = await getRealtimeData();

  return <DataDisplay data={data} />;
}
```

### Benefits

- **Always Fresh**: Data fetched on every request
- **Personalized**: User-specific content
- **Secure**: Server-only data access
- **Dynamic**: Real-time information

### Use Cases

- User dashboards
- Personalized feeds
- Real-time pricing
- User-specific content

---

## Incremental Static Regeneration (ISR) {#isr}

### Time-based Revalidation

```typescript
// app/products/[id]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
}
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { path, secret } = await request.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
```

### Using revalidateTag

```typescript
// Fetch with tags
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { tags: ["products"] },
  });
  return res.json();
}

// Revalidate by tag
import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("products");
  return NextResponse.json({ revalidated: true });
}
```

### Benefits

- **Static Performance**: Fast like SSG
- **Fresh Content**: Updates without rebuild
- **Scalable**: Background regeneration
- **Flexible**: Time-based or on-demand

### Use Cases

- E-commerce product pages
- News articles
- Frequently updated content
- High-traffic pages with changing data

---

## Client-Side Rendering (CSR) {#csr}

### Implementation

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### Benefits

- **Interactive**: Rich user interactions
- **Reduced Server Load**: Processing on client
- **Real-time Updates**: WebSocket connections

### Use Cases

- Interactive dashboards
- Real-time chat
- Complex user interactions
- Private user data

---

## Performance Comparison {#performance}

### Metrics Comparison

```typescript
// SSG - Fastest
TTFB: ~20ms (CDN)
FCP: ~500ms
LCP: ~800ms

// ISR - Fast with freshness
TTFB: ~20ms (cached) | ~200ms (regenerating)
FCP: ~500ms
LCP: ~800ms

// SSR - Dynamic but slower
TTFB: ~200-500ms
FCP: ~1000ms
LCP: ~1500ms

// CSR - Slowest initial load
TTFB: ~20ms
FCP: ~1500ms
LCP: ~2500ms
```

### Benchmark Example

```typescript
// Measure performance
export async function measurePerformance() {
  const start = performance.now();

  const data = await fetchData();

  const end = performance.now();
  console.log(`Fetch took ${end - start}ms`);

  return data;
}
```

---

## Decision Framework {#decision-framework}

### Decision Tree

```typescript
function chooseRenderingStrategy(requirements: Requirements): Strategy {
  // Real-time user-specific data?
  if (requirements.realtimeData && requirements.personalized) {
    return "SSR";
  }

  // Static content that rarely changes?
  if (!requirements.dynamic && requirements.seo) {
    return "SSG";
  }

  // Content that updates periodically?
  if (requirements.periodic && requirements.highTraffic) {
    return "ISR";
  }

  // Interactive features only?
  if (requirements.interactive && !requirements.seo) {
    return "CSR";
  }

  // Default to ISR for flexibility
  return "ISR";
}
```

### Content Type Matrix

| Content Type    | SSG | ISR | SSR | CSR |
| --------------- | --- | --- | --- | --- |
| Marketing Pages | ✅  | ⚠️  | ❌  | ❌  |
| Blog Posts      | ✅  | ✅  | ❌  | ❌  |
| Product Pages   | ⚠️  | ✅  | ⚠️  | ❌  |
| User Dashboard  | ❌  | ❌  | ✅  | ✅  |
| Search Results  | ❌  | ❌  | ✅  | ✅  |
| Documentation   | ✅  | ✅  | ❌  | ❌  |

---

## Hybrid Approaches {#hybrid}

### Combining Strategies

```typescript
// Server component (SSR/SSG)
export default async function Page() {
  const staticData = await getStaticData();

  return (
    <div>
      <StaticContent data={staticData} />
      <ClientInteractive /> {/* CSR */}
    </div>
  );
}

// Client component
'use client';
export function ClientInteractive() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch user-specific data
    fetchUserData().then(setData);
  }, []);

  return <div>{/* Interactive UI */}</div>;
}
```

### Progressive Enhancement

```typescript
// Start with static content
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <ProductInfo product={product} />
      <ProductReviews productId={id} /> {/* Client-side loaded */}
    </div>
  );
}

// Reviews loaded on client
'use client';
export function ProductReviews({ productId }: { productId: string }) {
  const { data } = useSWR(`/api/reviews/${productId}`);
  return <ReviewsList reviews={data} />;
}
```

---

## Conclusion

Choosing the right rendering strategy is critical for performance and user experience. Use SSG for static content, ISR for frequently updated content, SSR for personalized data, and CSR for interactive features.

### Best Practices

- Start with static (SSG) when possible
- Use ISR for content that changes periodically
- Reserve SSR for truly dynamic, personalized content
- Combine strategies for optimal performance
- Monitor Core Web Vitals and adjust
