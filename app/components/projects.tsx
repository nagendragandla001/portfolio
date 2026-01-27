"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { blogs } from "@/lib/blogs";

export function Projects() {
  const [currentPage, setCurrentPage] = useState(0);
  const blogsPerPage = 4;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const currentBlogs = blogs.slice(
    currentPage * blogsPerPage,
    (currentPage + 1) * blogsPerPage,
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section
      id="projects"
      className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Blogs & Discussions</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-4 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sharing insights, best practices, and lessons learned from building
            scalable web applications.
          </p>
        </motion.div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {currentPage * blogsPerPage + 1}-
            {Math.min((currentPage + 1) * blogsPerPage, blogs.length)} of{" "}
            {blogs.length} articles
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPage}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {currentBlogs.map((blog, index) => (
              <motion.article
                key={blog.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group card-hover bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                {/* Category badge */}
                <div className="p-6 pb-0">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full mb-4">
                    {blog.category}
                  </span>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                    {blog.description}
                  </p>

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{blog.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{blog.comments} comments</span>
                    </div> */}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline"
                  >
                    Read Article
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPage
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Blogs Link */}
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            View All {blogs.length} Blog Posts
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
