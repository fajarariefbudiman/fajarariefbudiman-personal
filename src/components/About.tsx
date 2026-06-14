import { Button } from "../components/ui/button";
import { useLanguage } from "../context/LanguageContext";
import {
  Download,
  Brain,
  Users,
  Lightbulb,
  Clock,
  MessageSquare,
  Layers,
} from "lucide-react";
import {
  SiGo,
  SiLaravel,
  SiReact,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiMysql,
  SiBootstrap,
  SiGit,
  SiFlutter,
  SiTypescript,
  SiDocker,
  SiPostgresql,
  SiRedis,
} from "react-icons/si";

const skills = [
  { icon: SiGo, name: "Go (Golang)" },
  { icon: SiLaravel, name: "Laravel" },
  { icon: SiFlutter, name: "Flutter" },
  { icon: SiReact, name: "React.js" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiMysql, name: "MySQL" },
  { icon: SiRedis, name: "Redis" },
  { icon: SiTailwindcss, name: "Tailwind CSS" },
  { icon: SiBootstrap, name: "Bootstrap 5" },
  { icon: SiHtml5, name: "HTML5" },
  // { icon: SiCss3, name: "CSS3" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiGit, name: "Git" },
];

const extraSkills = [{ icon: Layers, name: "Odoo ERP" }];

const softSkills = [
  { icon: Brain, name: "Problem Solving" },
  { icon: Users, name: "Team Collaboration" },
  { icon: Lightbulb, name: "Creative Thinking" },
  { icon: Clock, name: "Time Management" },
  { icon: MessageSquare, name: "Communication" },
];

export const About = () => {
  const { t, language } = useLanguage();

  return (
    <section id='about' className='py-20 px-4 bg-muted/30'>
      <div className='container mx-auto max-w-6xl'>
        {/* Two-column layout: Photo + About text */}
        <div className='grid md:grid-cols-2 gap-12 items-start'>
          {/* Profile Image */}
          <div className='animate-fade-in'>
            <div className='relative w-full max-w-md mx-auto'>
              <div className='aspect-square rounded-2xl overflow-hidden border-4 border-primary shadow-2xl relative'>
                <img
                  src='/img/personal.jpeg'
                  alt='Fajar Arief Budiman'
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/40'></div>
              </div>
            </div>
          </div>

          {/* About text */}
          <div className='animate-slide-up space-y-6 text-justify'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground'>
              {t("about.title")}
            </h2>

            <h3 className='text-lg font-semibold text-primary uppercase tracking-wide'>
              {language === "id"
                ? "FULLSTACK DEVELOPER · BACKEND-FOCUSED"
                : "FULLSTACK DEVELOPER · BACKEND-FOCUSED"}
            </h3>

            {language === "id" ? (
              <>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  Halo, nama saya{" "}
                  <span className='text-foreground font-semibold'>
                    Fajar Arief Budiman
                  </span>
                  . Saya Fullstack Developer dengan pengalaman 2+ tahun
                  merancang dan mengapalkan sistem production-grade di berbagai
                  industri - dari healthcare ERP, platform POS franchise, hingga
                  aplikasi keuangan mobile.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  Saya spesialis di backend engineering menggunakan Go dan PHP
                  (Laravel), merancang RESTful API yang dikonsumsi ribuan
                  pengguna harian, mengimplementasikan autentikasi JWT/RBAC
                  dengan isolasi multi-tenant, serta berpengalaman dengan
                  kustomisasi{" "}
                  <span className='text-foreground font-semibold'>
                    Odoo ERP
                  </span>{" "}
                  dan integrasi payment gateway{" "}
                  <span className='text-foreground font-semibold'>Xendit</span>.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  Saya juga merilis dua aplikasi mobile gratis -{" "}
                  <span className='text-foreground font-semibold'>Finora</span>{" "}
                  dan{" "}
                  <span className='text-foreground font-semibold'>Kurva</span> -
                  untuk UMKM dan pengusaha muda Indonesia.
                </p>
              </>
            ) : (
              <>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  Hello, my name is{" "}
                  <span className='text-foreground font-semibold'>
                    Fajar Arief Budiman
                  </span>
                  . I'm a Fullstack Developer with 2+ years of experience
                  architecting and shipping production-grade systems across
                  diverse industries - from healthcare ERP and franchise POS
                  platforms to personal finance mobile apps.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  I specialize in backend engineering with Go and PHP (Laravel),
                  designing RESTful APIs consumed by thousands of daily users,
                  implementing JWT/RBAC authentication with multi-tenant
                  isolation, and have hands-on experience with{" "}
                  <span className='text-foreground font-semibold'>
                    Odoo ERP
                  </span>{" "}
                  customization and{" "}
                  <span className='text-foreground font-semibold'>Xendit</span>{" "}
                  payment gateway integration.
                </p>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  I've also independently designed and shipped two free mobile
                  apps -{" "}
                  <span className='text-foreground font-semibold'>Finora</span>{" "}
                  and{" "}
                  <span className='text-foreground font-semibold'>Kurva</span> -
                  for Indonesian SMEs and young entrepreneurs.
                </p>
              </>
            )}

            {/* Download Resume */}
            <a
              href='/resume/resume-fajar-arief-budiman.pdf'
              download
              className='inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg font-semibold'
            >
              <Download className='h-5 w-5' />
              {language === "id" ? "Unduh Resume" : "Download Resume"}
            </a>
          </div>
        </div>

        {/* Skills Section */}
        <div className='mt-16 space-y-12'>
          {/* Technical Skills */}
          <div>
            <h3 className='text-xl font-semibold mb-4 text-foreground'>
              {language === "id" ? "Keahlian Teknis" : "Technical Skills"}
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center gap-2 p-4 rounded-lg bg-background border border-border hover:border-primary transition-all hover:scale-105'
                >
                  <skill.icon className='h-8 w-8 text-primary' />
                  <span className='text-sm font-medium text-center'>
                    {skill.name}
                  </span>
                </div>
              ))}
              {extraSkills.map((skill, index) => (
                <div
                  key={`extra-${index}`}
                  className='flex flex-col items-center gap-2 p-4 rounded-lg bg-background border border-border hover:border-primary transition-all hover:scale-105'
                >
                  <skill.icon className='h-8 w-8 text-primary' />
                  <span className='text-sm font-medium text-center'>
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className='text-xl font-semibold mb-4 text-foreground'>
              {language === "id" ? "Kemampuan Lain" : "Soft Skills"}
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
              {softSkills.map((skill, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center gap-2 p-4 rounded-lg bg-background border border-border hover:border-primary transition-all hover:scale-105'
                >
                  <skill.icon className='h-8 w-8 text-primary' />
                  <span className='text-sm font-medium text-center'>
                    {language === "id"
                      ? (
                          {
                            "Problem Solving": "Pemecahan Masalah",
                            "Team Collaboration": "Kolaborasi Tim",
                            "Creative Thinking": "Berpikir Kreatif",
                            "Time Management": "Manajemen Waktu",
                            Communication: "Komunikasi",
                          } as Record<string, string>
                        )[skill.name] || skill.name
                      : skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience highlight */}
          <div>
            <h3 className='text-xl font-semibold mb-4 text-foreground'>
              {language === "id" ? "Pengalaman Terkini" : "Recent Experience"}
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='p-5 rounded-xl bg-background border border-border hover:border-primary transition-all'>
                <p className='text-xs text-primary font-semibold uppercase tracking-wide mb-1'>
                  Dec 2025 – Present
                </p>
                <h4 className='font-semibold text-foreground mb-1'>
                  Backend Developer
                </h4>
                <p className='text-sm text-muted-foreground'>
                  PT Kuliner Kreasindo Inovasi
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  {language === "id"
                    ? "Membangun platform POS & kemitraan terpusat dengan 30+ endpoint API, JWT multi-tenant, integrasi Xendit, dan kustomisasi Odoo ERP."
                    : "Built centralized POS & partnership platform with 30+ API endpoints, JWT multi-tenant auth, Xendit integration, and Odoo ERP customization."}
                </p>
              </div>
              <div className='p-5 rounded-xl bg-background border border-border hover:border-primary transition-all'>
                <p className='text-xs text-primary font-semibold uppercase tracking-wide mb-1'>
                  Dec 2024 – Nov 2025
                </p>
                <h4 className='font-semibold text-foreground mb-1'>
                  Freelance Fullstack Developer
                </h4>
                <p className='text-sm text-muted-foreground'>
                  PT Gerin Mitra Husada
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  {language === "id"
                    ? "Mengapalkan ERP klinik Dokterhub (Laravel 10 + Bootstrap 5) dengan otomatisasi PDF yang mengurangi beban admin 80%, chat real-time, dan RBAC multi-role."
                    : "Delivered Dokterhub clinic ERP (Laravel 10 + Bootstrap 5) with PDF automation reducing admin workload by 80%, real-time chat, and multi-role RBAC."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
