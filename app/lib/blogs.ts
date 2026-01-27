import blogsData from "@/data/blogs.json";

export interface Blog {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  views: string;
  comments: number;
  tags: string[];
  slug: string;
  content?: string;
  contentFile?: string;
}

export const blogs: Blog[] = blogsData as Blog[];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogs.map((blog) => blog.slug);
}
