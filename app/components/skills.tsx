"use client";
import { motion } from "framer-motion";
import {
  Boxes,
  Code2,
  Palette,
  Building2,
  TestTube2,
  Cloud,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frameworks",
    skills: [
      "React",
      "Next.js",
      "Angular",
      "Node.js",
      "Spring Boot",
      "Redux Toolkit",
    ],
    Icon: Boxes,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
  },
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "HTML5", "CSS3", "Java"],
    Icon: Code2,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/10",
  },
  {
    title: "Styling & UI",
    skills: ["Tailwind CSS", "ShadCN UI", "Material UI", "Styled Components"],
    Icon: Palette,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/10",
  },
  {
    title: "Architecture",
    skills: ["Micro-frontends", "Design Systems", "SSR/SSG", "Microservices"],
    Icon: Building2,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/10",
  },
  {
    title: "Testing",
    skills: ["Playwright", "Jest", "React Testing Library", "Cypress"],
    Icon: TestTube2,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/10",
  },
  {
    title: "Tools & Cloud",
    skills: [
      "AWS",
      "Docker",
      "Git",
      "Webpack",
      "Vite",
      "CI/CD",
      "Dynatrace",
      "Azure",
    ],
    Icon: Cloud,
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Core <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-4 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expertise across modern frontend technologies, frameworks, and best
            practices
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Gradient border effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${category.color} rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur`}
              ></div>

              {/* Card content */}
              <div
                className={`relative ${category.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full transition-all duration-300 group-hover:scale-[1.02]`}
              >
                {/* Icon with gradient background */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}
                  >
                    <category.Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Skills grid */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + skillIndex * 0.05,
                      }}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-md transition-all hover:scale-105 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
