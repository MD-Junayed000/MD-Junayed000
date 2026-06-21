import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Research from "@/components/sections/Research";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Research />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
