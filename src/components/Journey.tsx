import { useLanguage } from "../context/LanguageContext";
import {
  GraduationCap,
  Code2,
  Stethoscope,
  UtensilsCrossed,
  Rocket,
  Smartphone,
} from "lucide-react";

interface JourneyItem {
  date: string;
  icon: React.ComponentType<{ className?: string }>;
  title: { id: string; en: string };
  org: string;
  desc: { id: string; en: string };
}

const journey: JourneyItem[] = [
  {
    date: "2023",
    icon: GraduationCap,
    title: {
      id: "Memulai Kuliah Ilmu Komputer",
      en: "Started Computer Science Degree",
    },
    org: "Universitas Pamulang",
    desc: {
      id: "Mulai kuliah Informatika sambil belajar fundamental pemrograman secara otodidak — dari sinilah ketertarikan pada backend engineering dimulai.",
      en: "Began Informatics Engineering studies while self-teaching programming fundamentals — this is where the interest in backend engineering started.",
    },
  },
  {
    date: "Dec 2024 - Nov 2025",
    icon: Stethoscope,
    title: {
      id: "Fullstack Developer",
      en: "Fullstack Developer",
    },
    org: "PT Gerin Mitra Husada",
    desc: {
      id: "Proyek profesional pertama: mengapalkan Dokterhub, ERP klinik berbasis Laravel dengan chat real-time pasien-dokter dan otomatisasi PDF yang memangkas beban admin 80%.",
      en: "First professional project: shipped Dokterhub, a Laravel-based clinic ERP with real-time patient-doctor chat and PDF automation that cut admin workload by 80%.",
    },
  },
  {
    date: "Nov 2025 - Present",
    icon: Rocket,
    title: {
      id: "Mendirikan DiGiat Group",
      en: "Founded DiGiat Group",
    },
    org: "Founder & Lead Developer",
    desc: {
      id: "Mendirikan agensi digital sendiri untuk melayani UMKM Indonesia, sambil tetap bekerja penuh waktu. Berhasil menutup kerja sama awal yang kini berkembang menjadi Mulqi Group, sebuah holding company yang sedang dikembangkan.",
      en: "Founded a digital agency serving Indonesian SMEs, while still working full-time. Personally closed the initial partnership that is now growing into Mulqi Group, a holding company currently under development.",
    },
  },
  {
    date: "Dec 2025 - Present",
    icon: UtensilsCrossed,
    title: {
      id: "Fullstack Developer",
      en: "Fullstack Developer",
    },
    org: "PT Kuliner Kreasindo Inovasi",
    desc: {
      id: "Membangun platform POS & kemitraan terpusat untuk ratusan mitra franchise, mencakup 30+ endpoint API, autentikasi JWT multi-tenant, dan integrasi payment gateway Xendit.",
      en: "Building a centralized POS & partnership platform for hundreds of franchise partners, covering 30+ API endpoints, multi-tenant JWT authentication, and Xendit payment gateway integration.",
    },
  },
  {
    date: "2026",
    icon: Smartphone,
    title: {
      id: "Merilis Navila & Kurva",
      en: "Shipped Navila & Kurva",
    },
    org: "DiGiat Group",
    desc: {
      id: "Merancang dan merilis dua aplikasi mobile gratis di bawah DiGiat Group — Navila untuk keuangan pasangan & wedding planner, dan Kurva sebagai kasir digital untuk UMKM.",
      en: "Designed and shipped two free mobile apps under DiGiat Group — Navila for couple finance & wedding planning, and Kurva as a digital point-of-sale for SMEs.",
    },
  },
];

export const Journey = () => {
  const { language } = useLanguage();
  const rowHeight = 260; // px per item, desktop
  const totalHeight = rowHeight * journey.length;

  return (
    <section id='journey' className='py-20 px-4'>
      <div className='container mx-auto max-w-4xl'>
        <div className='text-center mb-16 animate-fade-in'>
          <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-3'>
            {language === "id" ? "Perjalanan Karir" : "Career Journey"}
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            {language === "id"
              ? "Dari bangku kuliah hingga membangun agensi digital sendiri."
              : "From university to building my own digital agency."}
          </p>
        </div>

        {/* ===== Desktop: serpentine (curved zigzag) timeline ===== */}
        <div
          className='hidden md:block relative'
          style={{ height: totalHeight }}
        >
          <svg
            className='absolute inset-0 w-full h-full pointer-events-none'
            viewBox={`0 0 100 ${totalHeight}`}
            preserveAspectRatio='none'
          >
            <path
              d={journey
                .map((_, i) => {
                  const cx = i % 2 === 0 ? 78 : 22; // dot x position (%) mapped to 0-100 viewBox
                  const cy = rowHeight * i + rowHeight / 2;
                  if (i === 0) return `M ${cx} ${cy}`;
                  const prevCx = (i - 1) % 2 === 0 ? 78 : 22;
                  const prevCy = rowHeight * (i - 1) + rowHeight / 2;
                  const midY = (prevCy + cy) / 2;
                  return `C ${prevCx} ${midY}, ${cx} ${midY}, ${cx} ${cy}`;
                })
                .join(" ")}
              fill='none'
              className='stroke-border'
              strokeWidth='0.6'
              vectorEffect='non-scaling-stroke'
            />
          </svg>

          {journey.map((item, index) => {
            const isRight = index % 2 === 0; // dot at 78% (right-ish), card sits left of it... see below
            return (
              <div
                key={index}
                className='absolute left-0 right-0 flex items-center animate-slide-up'
                style={{ top: rowHeight * index, height: rowHeight }}
              >
                {/* Dot */}
                <div
                  className='absolute flex items-center justify-center w-14 h-14 rounded-full bg-background border-4 border-primary z-10 -translate-x-1/2'
                  style={{
                    left: `${isRight ? 78 : 22}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <item.icon className='h-5 w-5 text-primary' />
                </div>

                {/* Card */}
                <div
                  className='absolute w-[42%]'
                  style={{
                    left: isRight ? "2%" : undefined,
                    right: isRight ? undefined : "2%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <JourneyCard
                    item={item}
                    language={language}
                    align={isRight ? "right" : "left"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Mobile: simple straight vertical timeline ===== */}
        <div className='md:hidden relative'>
          <div className='absolute left-[27px] top-0 bottom-0 w-px bg-border' />
          <div className='space-y-10'>
            {journey.map((item, index) => (
              <div
                key={index}
                className='relative flex gap-4 w-full animate-slide-up'
              >
                <div className='flex flex-col items-center shrink-0'>
                  <div className='flex items-center justify-center w-14 h-14 rounded-full bg-background border-4 border-primary z-10'>
                    <item.icon className='h-5 w-5 text-primary' />
                  </div>
                </div>
                <JourneyCard item={item} language={language} align='left' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const JourneyCard = ({
  item,
  language,
  align,
}: {
  item: JourneyItem;
  language: "id" | "en";
  align: "left" | "right";
}) => (
  <div
    className={`w-full p-5 rounded-xl bg-muted/30 border border-border hover:border-primary transition-all ${
      align === "right" ? "text-left md:text-right" : "text-left"
    }`}
  >
    <p className='text-xs text-primary font-semibold uppercase tracking-wide mb-1'>
      {item.date}
    </p>
    <h4 className='font-semibold text-foreground mb-0.5'>
      {language === "id" ? item.title.id : item.title.en}
    </h4>
    <p className='text-sm text-muted-foreground mb-2'>{item.org}</p>
    <p className='text-sm text-muted-foreground leading-relaxed'>
      {language === "id" ? item.desc.id : item.desc.en}
    </p>
  </div>
);
