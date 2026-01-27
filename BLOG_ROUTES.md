# Blog Routes Documentation

## Overview

Created a complete blog routing system for the portfolio with 13 blog posts covering various frontend development topics.

## Routes Created

### Main Blog Pages

1. `/blog` - All blog posts listing page
2. `/blog/[slug]` - Individual blog post pages (dynamic route)

### Blog Post URLs (13 total)

1. **`/blog/future-of-frontend-ai-fullstack`**
   - The Future of Frontend: AI-Powered Development & Fullstack Evolution
   - Category: Future Tech

2. **`/blog/mcp-ui-trends-ai-integration`**
   - Model Context Protocol (MCP) & UI Trends: The Future of AI Integration
   - Category: AI & UI/UX

3. **`/blog/angular-evolution-angularjs-to-angular20`**
   - Angular Evolution: From AngularJS to Angular 20
   - Category: Angular

4. **`/blog/scalable-micro-frontends-module-federation`**
   - Building Scalable Micro-frontends with Module Federation
   - Category: Architecture

5. **`/blog/ssr-vs-ssg-nextjs-rendering-strategy`**
   - SSR vs SSG: Choosing the Right Next.js Rendering Strategy
   - Category: Performance

6. **`/blog/design-systems-zero-to-production`**
   - Design Systems: From Zero to Production
   - Category: Design Systems

7. **`/blog/real-time-data-visualization-react-websockets`**
   - Real-time Data Visualization with React and WebSockets
   - Category: Real-time

8. **`/blog/optimizing-react-performance-beyond-memo`**
   - Optimizing React Performance: Beyond React.memo
   - Category: Performance

9. **`/blog/typescript-advanced-patterns-react`**
   - TypeScript Advanced Patterns for React Developers
   - Category: TypeScript

10. **`/blog/accessible-web-applications-aria`**
    - Building Accessible Web Applications with ARIA
    - Category: Accessibility

11. **`/blog/state-management-redux-zustand-context-api`**
    - State Management in 2026: Redux vs Zustand vs Context API
    - Category: State Management

12. **`/blog/testing-strategies-modern-react-applications`**
    - Testing Strategies for Modern React Applications
    - Category: Testing

13. **`/blog/css-in-js-vs-tailwind-css-comparison`**
    - CSS-in-JS vs Tailwind CSS: A Practical Comparison
    - Category: Styling

## File Structure

```
app/
├── lib/
│   └── blogs.ts              # Blog data and utility functions
├── blog/
│   ├── page.tsx              # All blogs listing page
│   └── [slug]/
│       └── page.tsx          # Individual blog post page
└── components/
    └── projects.tsx          # Updated to use blog routes
```

## Features

### Blog Listing Page (`/blog`)

- Grid layout showing all 13 blog posts
- Category badges
- Read time and date
- View count and comment count
- Tag system
- Back to portfolio link
- Hover effects and animations

### Individual Blog Page (`/blog/[slug]`)

- Full blog post layout
- Category badge
- Meta information (date, read time, views, comments)
- Share button
- Tag system
- "Coming Soon" placeholder for content
- Back to blogs link
- Proper 404 handling for invalid slugs

### Homepage Integration

- Carousel showing 4 blogs per page
- Navigation arrows (Previous/Next)
- Pagination dots
- "View All X Blog Posts" button linking to `/blog`
- Click "Read Article" on any blog card to go to `/blog/[slug]`

## Navigation Flow

1. **From Homepage**: Click "Read Article" → `/blog/[slug]`
2. **From Homepage**: Click "View All X Blog Posts" → `/blog`
3. **From Blog Listing**: Click any blog card → `/blog/[slug]`
4. **From Blog Post**: Click "Back to Blogs" → `/blog`
5. **From Blog Listing**: Click "Back to Portfolio" → `/#projects`

## Data Management

All blog data is centralized in `/app/lib/blogs.ts`:

- `blogs` array with all blog posts
- `getBlogBySlug()` function to fetch individual posts
- `getAllBlogSlugs()` function for potential static generation
- TypeScript interface for type safety

## Next Steps

To add content to blogs:

1. Edit `/app/lib/blogs.ts`
2. Add `content` property to blog objects (Markdown or HTML)
3. Update `/app/blog/[slug]/page.tsx` to render the content
4. Consider adding MDX support for rich content
