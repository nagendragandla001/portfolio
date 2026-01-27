"use client";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MessageSquare,
  Eye,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogBySlug } from "@/lib/blogs";
import { parseMarkdown } from "@/lib/markdown";
import { useEffect, useState } from "react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = getBlogBySlug(slug);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blog?.contentFile) {
      fetch(`/api/content/${blog.contentFile}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading content:", error);
          setLoading(false);
        });
    } else {
      setContent(blog?.content || null);
      setLoading(false);
    }
  }, [blog]);

  if (!blog) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to all blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <article className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full mb-6">
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {blog.description}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{blog.comments} comments</span>
              </div>
              <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : content ? (
              <div
                className="blog-content text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(content),
                }}
              />
            ) : (
              <>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-12 mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-0">
                    Full blog content will be available soon. Stay tuned for
                    in-depth articles on {blog.category.toLowerCase()} and more.
                  </p>
                </div>

                {/* Sample Content Structure */}
                <h2>Introduction</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This article explores {blog.title.toLowerCase()}, providing
                  practical insights and real-world examples for modern web
                  developers.
                </p>

                <h2>Key Topics Covered</h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  {blog.tags.map((tag) => (
                    <li key={tag}>
                      <strong>{tag}</strong>: Deep dive into best practices and
                      implementation strategies
                    </li>
                  ))}
                </ul>

                <h2>Conclusion</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay tuned for the complete article with code examples,
                  diagrams, and step-by-step tutorials.
                </p>
              </>
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </article>
    </main>
  );
}
