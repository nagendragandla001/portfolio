"use client";
import { motion } from "framer-motion";

const experiences = [
  {
    title: "Lead Front-end Developer",
    company: "American Airlines",
    period: "April 2025 - Present",
    location: "Fort Worth, Texas, United States",
    description:
      "Leading the development of a modern web application to streamline airline revenue and pricing workflows. Working with business analysts, product managers, and backend teams to translate complex airline pricing logic into responsive, user-friendly interfaces.",
    achievements: [
      "Built pricing management app integrating with ATPCO, GDS systems, and internal pricing engines",
      "Designed reusable, accessible UI components using ShadCN and Tailwind CSS",
      "Implemented complex data grids with AG Grid for efficient fare structure management",
      "Integrated SSO/OAuth authentication via PingFederate for secure user access",
      "Led unit testing with React Testing Library and E2E testing with Cypress",
      "Optimized application performance using Dynatrace to identify bottlenecks",
      "Improved usability, reduced manual processes, and supported NDC readiness",
    ],
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "ShadCN UI",
      "AG Grid",
      "Tailwind CSS",
      "React Testing Library",
      "Cypress",
      "Spring Boot",
      "OAuth",
      "Dynatrace",
      "Azure",
    ],
  },
  {
    title: "Frontend Team Lead",
    company: "Moniepoint Group",
    period: "August 2024 - February 2025",
    location: "Bengaluru, Karnataka, India",
    description:
      "Led the Settlement, Reconciliation and Accounting Tools team at this fintech company providing digital banking and payment solutions. Built comprehensive dashboards for Ledger, Journal, Netsuite, Invoices, Vendor management, and Approval workflows using micro-frontend architecture.",
    achievements: [
      "Built moniepoint's design framework using micro-frontend with NX platform",
      "Designed and implemented dashboards for financial operations and accounting",
      "Developed reusable components and respective Storybook documentation",
      "Contributed to Moniepoint's internal design framework called KAMONA",
      "Conducted code reviews and maintained high code quality standards",
      "Led frontend architecture decisions for fintech application suite",
    ],
    tags: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Tailwind CSS",
      "Nx Monorepo",
      "Micro-frontends",
      "Storybook",
      "Antd",
      "Design Systems",
      "Fintech",
    ],
  },
  {
    title: "Lead Front-end Developer",
    company: "BeepKart",
    period: "Dec 2022 - July 2024",
    location: "Bengaluru, Karnataka, India",
    description:
      "Led frontend development for BeepKart's digital platform transforming the used vehicle market in India. Oversaw the entire development lifecycle from reporting to delivery, building a seamless, transparent, and secure experience for buying and selling pre-owned vehicles with data-driven insights and end-to-end support.",
    achievements: [
      "Led frontend team and participated in roadmap discussions to align development with strategic goals",
      "Built scalable, high-performance applications using Next.js SSR for fast load times and smooth UX",
      "Integrated React components with Material UI and Antd for consistent design system",
      "Optimized performance with React.memo, useCallback, and useMemo techniques",
      "Led Scrum ceremonies ensuring timely delivery and continuous improvement",
      "Set up AWS EC2, S3, and Nginx hosting, optimizing deployment workflows",
      "Mentored junior developers and conducted code reviews following React best practices",
      "Integrated Google Tag Manager and Google Analytics for data-driven insights",
      "Developed OpenAI-powered agent tools using Next.js for intelligent customer support",
      "Implemented lazy loading, code splitting, and component reuse for optimal performance",
      "Delivered responsive applications optimizing user engagement across all devices",
    ],
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Material UI",
      "Antd",
      "Tailwind CSS",
      "AWS",
      "Nginx",
      "SSR",
      "OpenAI",
      "E-Commerce",
    ],
  },
  {
    title: "Software Development Engineer - III",
    company: "BetterPlace Safety Solutions (Acquired entity from OLX)",
    period: "Dec 2019 - Dec 2022",
    location: "Bengaluru, Karnataka, India",
    description:
      "Developed frontend applications for BetterPlace, a leading workforce management platform providing end-to-end digital solutions for blue-collar workforce hiring, onboarding, compliance, payroll, and upskilling. Built MyRocket (Employer POD) connecting employers with job seekers for seamless hiring and workforce management.",
    achievements: [
      "Developed and maintained frontend applications for MyRocket using Next.js, React, and Antd",
      "Implemented server-side rendering (SSR) and client-side optimizations for enhanced performance and SEO",
      "Utilized React Context API and MobX for efficient state management",
      "Developed reusable components using React Hooks for improved code maintainability",
      "Led UI/UX improvements ensuring responsive, accessible, and high-performing interfaces",
      "Collaborated with backend teams to integrate APIs efficiently using Axios",
      "Conducted code reviews, optimized frontend architecture, and mentored junior developers",
      "Led scrum meetings, managed sprint planning, and facilitated agile processes",
      "Delivered feature development, bug fixes, and enhancements for better user experience",
    ],
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "MobX",
      "Angular",
      "Antd",
      "Tailwind CSS",
      "SSR",
      "HRMS",
      "Git",
    ],
  },
  {
    title: "Senior Frontend Developer",
    company: "Morgan Stanley",
    period: "Nov 2016 - Dec 2019",
    location: "Bengaluru, Karnataka, India",
    description:
      "Developed QWEST (Query Workflow Exception Service Technology), a post-trading activity management application for Morgan Stanley's Operations and Admin teams. Led the migration from legacy Flex to modern Angular framework, enabling efficient management of post-trading activities, inquiries, emails, trading statuses, and analysis.",
    achievements: [
      "Successfully migrated legacy Flex application to Angular framework",
      "Utilized Angular Formly for dynamic and complex forms with SCSS customizations",
      "Implemented NgRx state management for efficient handling of complex application states",
      "Integrated RESTful APIs using HttpClient for data retrieval and updates",
      "Implemented Angular Interceptors to handle HTTP requests and responses",
      "Wrote comprehensive unit tests using Jasmine and Karma",
      "Followed Test-Driven Development (TDD) approach for high code quality",
      "Optimized application for post-trading workflow management and analysis",
    ],
    tags: [
      "Angular",
      "TypeScript",
      "NgRx",
      "Angular Formly",
      "SCSS",
      "Jasmine",
      "Karma",
      "TDD",
      "RESTful APIs",
      "Financial Services",
    ],
  },
  {
    title: "Software Engineering Senior Analyst",
    company: "Credit Suisse (via Accenture)",
    period: "Jul 2014 - Aug 2016",
    location: "Bengaluru, Karnataka, India",
    description:
      "Developed RM Ecosystem, a comprehensive relationship management platform for Credit Suisse, one of the largest private investment banking institutions in Zurich and APAC. Built unified platform enabling relationship managers to manage client relationships, track investments, and access market analyses through seven key modules including workflows, markets, client and portfolio management, and tasks.",
    achievements: [
      "Built AngularJS components, directives, and controllers for Single Page Application (SPA)",
      "Integrated RESTful APIs using HttpClient for data retrieval and updates",
      "Implemented routing and navigation using ngRoute and ui-router",
      "Wrote comprehensive unit tests using Jasmine and Karma",
      "Conducted code reviews and provided feedback to ensure code quality",
      "Mentored junior developers on Angular best practices and coding standards",
      "Documented architecture, components, and services for team alignment",
      "Developed client and portfolio management modules for relationship managers",
    ],
    tags: [
      "AngularJS",
      "JavaScript",
      "RESTful APIs",
      "Jasmine",
      "Karma",
      "SPA",
      "ngRoute",
      "ui-router",
      "Private Banking",
      "Investment Banking",
    ],
  },
  {
    title: "Application Developer",
    company: "AT&T (via IBM India Pvt. Ltd.)",
    period: "May 2013 - July 2014",
    location: "Bengaluru, Karnataka, India",
    description:
      "Developed GIOM BVoIP (Global Integrated Order Manager - Business Voice over IP), an intuitive ordering application for AT&T enabling users to place VoIP phone orders for customer sites. Built middleware solution sourcing data from multiple applications (GCSM, SOE, CSI, Phoenix), processing it, and passing to subsystems (SPP, CADM, GCP) using web services, providing unified one-stop shopping experience for order management.",
    achievements: [
      "Built VoIP ordering application for AT&T telecom services",
      "Developed middleware integration connecting multiple source applications",
      "Implemented web services for seamless data flow between systems",
      "Integrated with GCSM, SOE, CSI, and Phoenix source applications",
      "Connected to SPP, CADM, and GCP subsystems for order processing",
      "Streamlined order management process for improved efficiency",
      "Delivered unified ordering experience for VoIP phone services",
      "Managed end-to-end order workflow for customer sites",
    ],
    tags: [
      "JavaScript",
      "Web Services",
      "Middleware",
      "VoIP",
      "Order Management",
      "System Integration",
      "Telecom",
      "AT&T",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-12"></div>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative md:pl-20"
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-6 top-6 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white dark:border-gray-900"></div>

                <div className="card-hover bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{exp.title}</h3>
                      <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {exp.period}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        {exp.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {exp.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Key Achievements:
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="flex items-center text-gray-600 dark:text-gray-400 text-base"
                        >
                          <span className="text-blue-600 mr-3 text-sm font-bold">
                            •
                          </span>
                          <span className="text-base">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
