import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // White text only pre-scroll + light mode (floating over the hero).
  // Once scrolled (solid bg) or in dark mode, fall back to normal foreground color.
  const forceWhite = !scrolled && theme !== "dark";
  const navTextClass = forceWhite
    ? "!text-white hover:!text-white/80"
    : "text-foreground hover:text-primary";
  const brandTextClass = forceWhite ? "!text-white" : "text-foreground";
  const iconButtonClass = forceWhite
    ? "!text-white hover:bg-white/10 hover:!text-white"
    : "text-foreground hover:bg-muted";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div
            className={`text-xl font-bold transition-colors duration-300 ${brandTextClass}`}
          >
            {t("hero.name")}
          </div>

          <div className='hidden md:flex items-center gap-8'>
            <button
              onClick={() => scrollToSection("home")}
              className={`transition-colors duration-300 ${navTextClass}`}
            >
              {t("nav.home")}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`transition-colors duration-300 ${navTextClass}`}
            >
              {t("nav.about")}
            </button>
            <button
              onClick={() => scrollToSection("journey")}
              className={`transition-colors duration-300 ${navTextClass}`}
            >
              {t("nav.journey")}
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className={`transition-colors duration-300 ${navTextClass}`}
            >
              {t("nav.portfolio")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`transition-colors duration-300 ${navTextClass}`}
            >
              {t("nav.contact")}
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              className={`transition-colors duration-300 ${iconButtonClass}`}
            >
              {theme === "dark" ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={toggleLanguage}
              className={`gap-1 transition-colors duration-300 ${iconButtonClass}`}
            >
              <Globe className='h-4 w-4' />
              <span className='text-xs font-medium'>
                {language.toUpperCase()}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
