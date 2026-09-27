import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Journey } from "../components/Journey";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className='min-h-screen'>
          <Navbar />
          <Hero />
          <About />
          <Journey />
          <Portfolio />
          <Contact />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
