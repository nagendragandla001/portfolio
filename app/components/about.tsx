"use client";
import { motion } from "framer-motion";

export function About() {
  const stats = [
    { label: "Years Experience", value: "12+" },
    { label: "Projects Delivered", value: "10+" },
    { label: "Team Members Led", value: "5+" },
    { label: "Technologies", value: "20+" },
  ];

  return (
    <section id="about" className="py-6 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-12"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
              <p>
                I'm a <strong>Lead Frontend Developer</strong> with deep
                expertise in frontend architecture, micro-frontends, design
                systems, and SEO-driven development. I specialize in building
                scalable, performant web applications that deliver exceptional
                user experiences.
              </p>
              <p>
                Throughout my career, I've had the privilege of leading teams,
                architecting frontend solutions, and delivering enterprise-grade
                platforms for fintech, e-commerce, and SaaS companies. I'm
                passionate about code quality, performance optimization, and
                mentoring developers.
              </p>
              <p>
                My approach combines technical excellence with strategic
                thinking, ensuring that every solution not only meets current
                needs but scales for future growth.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="card-hover p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-center bg-white dark:bg-gray-900"
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
