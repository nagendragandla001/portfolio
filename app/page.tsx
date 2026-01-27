import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Resume } from "@/components/resume";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="space-y-24">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Resume />
      <Contact />
    </main>
  );
}
