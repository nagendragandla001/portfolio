"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function Hero() {
  // Generate confetti data once to avoid hydration mismatch
  const confettiData = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-cyan-500",
      ];
      return {
        color: colors[i % colors.length],
        delay: (i * 0.1) % 2,
        duration: 3 + (i % 4),
        x: (i * 3.33) % 100,
        direction: i % 2 === 0 ? 1 : -1,
      };
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10"></div>

      {/* Available Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute top-8 right-8 z-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="text-sm font-semibold">
            Available for opportunities
          </span>
        </div>
      </motion.div>

      {/* Confetti Effect */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiData.map((confetti, i) => (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: `${confetti.x}%`,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: 360 * confetti.direction,
            }}
            transition={{
              duration: confetti.duration,
              delay: confetti.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute w-2 h-2 ${confetti.color} rounded-sm`}
            style={{
              left: `${confetti.x}%`,
            }}
          />
        ))}
      </div> */}

      {/* Animated floating bubbles */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/3 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-pink-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 35, 0],
            x: [0, -25, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-1/3 w-20 h-20 bg-violet-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-teal-400/10 rounded-full blur-xl"
        />
      </div> */}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
              {/* Animated gradient ring - Thinner border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                style={{ padding: "2px" }}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
              </motion.div>

              {/* Profile Image Container */}
              <div className="absolute inset-[2px] rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                {/* Placeholder - Replace with actual image */}
                <img
                  src="/profile.jpg"
                  alt="Nagendra Gandla"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image not found
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      (
                        e.currentTarget.nextElementSibling as HTMLElement
                      ).style.display = "flex";
                    }
                  }}
                />
                {/* Fallback initials */}
                <div className="hidden w-full h-full items-center justify-center text-4xl md:text-5xl font-bold gradient-text">
                  NG
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Hi, I'm <span className="gradient-text">Nagendra Gandla</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4"
          >
            Lead Frontend Developer & Frontend Architect
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8"
          >
            Building scalable, SEO-friendly, and high-performance web
            applications with 12+ years of experience in React, Next.js,
            Angular, and modern frontend architectures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#projects"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:scale-105 transition-all"
            >
              Get In Touch
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex gap-6 justify-center text-gray-500"
          >
            <a
              href="https://www.linkedin.com/in/nagendra-gandla-5a1221248/"
              className="hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://github.com/nagendragandla001"
              className="hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="mailto:nagendragandla006@gmail.com"
              className="hover:text-blue-600 transition-colors"
              aria-label="Email"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-gray-400 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
