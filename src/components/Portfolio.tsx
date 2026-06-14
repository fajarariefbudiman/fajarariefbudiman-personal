import { useState } from "react";
import { Button } from "../components/ui/button";
import { useLanguage } from "../context/LanguageContext";
import { ExternalLink, Download, Clock } from "lucide-react";

import mulqiImg from "../assets/image/mulqi.png";
import digiatImg from "../assets/image/digiat.jpeg";
import kurvaImg from "../assets/image/kurva.png";
import finoraImg from "../assets/image/finora.png";
import kurvaApk from "../assets/app/kurva.apk";
import finoraApk from "../assets/app/finora.apk";

const websiteProjects = [
  {
    id: 1,
    name: "Mulqi Group",
    description: {
      id: "Website resmi Mulqi Group - dibangun untuk klien DiGiat sebagai Fullstack Developer. Menggunakan teknologi modern untuk menghadirkan tampilan profesional dan responsif.",
      en: "Official website for Mulqi Group - built for DiGiat client as a Fullstack Developer. Crafted with modern technologies for a professional and responsive presentation.",
    },
    image: mulqiImg,
    url: "https://mulqigroup.com",
  },
  {
    id: 2,
    name: "DiGiat Group",
    description: {
      id: "Website resmi DiGiat Group - dibangun sebagai Founder dan Leader Group. Platform ini merepresentasikan visi dan layanan DiGiat kepada klien dan mitra bisnis.",
      en: "Official website for DiGiat Group - built as Founder and Leader of the group. This platform represents DiGiat's vision and services to clients and business partners.",
    },
    image: digiatImg,
    url: "https://digiatgroup.com",
  },
  {
    id: 3,
    name: "ERP Dokterhub",
    description: {
      id: "Sistem ERP lengkap untuk manajemen klinik di PT Gerin Mitra Husada, Jakarta. Dibangun dengan Laravel 10 dan Bootstrap 5, mencakup modul pasien, jadwal, inventori, tagihan, dan chat real-time via Pusher. Otomatisasi PDF untuk rekam medis dan resep mengurangi beban admin hingga 80%.",
      en: "Comprehensive ERP system for clinic management at PT Gerin Mitra Husada, Jakarta. Built with Laravel 10 and Bootstrap 5, covering patient, scheduling, inventory, billing, and real-time chat via Pusher. Automated PDF generation for medical records and prescriptions reduced admin workload by 80%.",
    },
    image: "",
    url: null,
  },
];

const mobileProjects = [
  {
    id: 1,
    name: "Kurva - Point of Sale",
    description: {
      id: "Aplikasi POS mobile ringan dengan kemampuan offline, katalog produk, pemrosesan transaksi, riwayat penjualan, dan pelaporan dasar. Dirancang untuk pemilik UMKM non-teknis. Didistribusikan gratis untuk menurunkan hambatan adopsi penjualan digital.",
      en: "Lightweight offline-capable POS app with product catalog, transaction processing, sales history, and basic reporting - designed for non-technical UMKM owners. Distributed free to lower the barrier of digital sales adoption for small businesses.",
    },
    image: kurvaImg,
    downloadUrl: kurvaApk,
  },
  {
    id: 2,
    name: "Finora - Financial Tracker",
    description: {
      id: "Aplikasi keuangan personal dengan pelacakan pemasukan/pengeluaran, pemantauan investasi, target tabungan, anggaran, dan tujuan kebiasaan non-finansial - dibangun berdasarkan prinsip akuntansi double-entry. Dirilis gratis untuk UMKM dan pengusaha muda Indonesia.",
      en: "Personal finance app with income/expense tracking, investment monitoring, savings targets, budget goals, and non-financial habit goals - built on double-entry accounting principles. Released free for Indonesian SMEs and young entrepreneurs to promote financial literacy.",
    },
    image: finoraImg,
    downloadUrl: finoraApk,
  },
];

const featureProjects = [
  {
    id: 1,
    name: "Auto Chart Generator",
    description: {
      id: "Tools berbasis web untuk mengubah file CSV dan Excel menjadi grafik secara otomatis. Mendukung deteksi header otomatis, pemilihan sheet, konfigurasi baris header, dan berbagai jenis chart (Bar, Line, Pie, Scatter). Dibangun dengan React, PapaParse, SheetJS, dan Recharts.",
      en: "Web-based tool to automatically convert CSV and Excel files into charts. Supports auto header detection, sheet selection, header row configuration, and multiple chart types (Bar, Line, Pie, Scatter). Built with React, PapaParse, SheetJS, and Recharts.",
    },
    url: "/portfolio/auto-chart-generator",
  },
];

export const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"website" | "mobile" | "feature">(
    "website",
  );

  const tabs = [
    { id: "website", label: language === "id" ? "Website" : "Website" },
    { id: "mobile", label: language === "id" ? "Mobile" : "Mobile" },
    { id: "feature", label: language === "id" ? "Fitur" : "Features" },
  ];

  const getProjects = () => {
    switch (activeTab) {
      case "website":
        return websiteProjects;
      case "mobile":
        return mobileProjects;
      case "feature":
        return featureProjects;
    }
  };

  return (
    <section id='portfolio' className='py-20 px-4'>
      <div className='container mx-auto max-w-6xl'>
        <h2 className='text-4xl md:text-5xl font-bold text-center mb-4 text-foreground'>
          {t("portfolio.title")}
        </h2>

        {/* Tabs */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className='px-6'
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Project Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {getProjects().map((project) => (
            <div
              key={project.id}
              className='group animate-fade-in bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all hover:scale-105 shadow-lg flex flex-col'
            >
              {/* Image - hanya untuk website & mobile yang punya image */}
              {"image" in project && (
                <div
                  className={`overflow-hidden ${
                    activeTab === "website"
                      ? "aspect-video bg-muted"
                      : "aspect-square bg-muted flex items-center justify-center"
                  }`}
                >
                  {(project as any).image ? (
                    <img
                      src={(project as any).image}
                      alt={project.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-muted'>
                      <span className='text-muted-foreground text-sm'>
                        {project.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Feature tab: ikon besar sebagai pengganti image */}
              {activeTab === "feature" && (
                <div className='aspect-video bg-primary/5 flex items-center justify-center border-b border-border'>
                  <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-primary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M3 13.5h18M3 7.5h18M3 19.5h18M9 4.5v15'
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className='p-6 flex flex-col flex-grow'>
                <div className='flex-grow space-y-3'>
                  <h3 className='text-xl font-semibold text-foreground'>
                    {project.name}
                  </h3>
                  <p className='text-muted-foreground text-justify'>
                    {project.description[language]}
                  </p>
                </div>

                {/* Buttons */}
                <div className='mt-4 space-y-2'>
                  {/* Website: Live Demo jika ada URL */}
                  {activeTab === "website" && (project as any).url && (
                    <Button
                      variant='outline'
                      className='w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                      onClick={() =>
                        window.open((project as any).url, "_blank")
                      }
                    >
                      <ExternalLink className='h-4 w-4' />
                      {t("portfolio.liveDemo")}
                    </Button>
                  )}

                  {/* Mobile: Coming Soon atau Download */}
                  {activeTab === "mobile" &&
                    ((project as any).downloadUrl === "soon" ? (
                      <Button
                        variant='outline'
                        disabled
                        className='w-full gap-2 border-muted-foreground text-muted-foreground cursor-not-allowed'
                      >
                        <Clock className='h-4 w-4' />
                        {language === "id"
                          ? "Segera Hadir di Play Store"
                          : "Coming Soon on Play Store"}
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        className='w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                        onClick={() =>
                          window.open((project as any).downloadUrl, "_blank")
                        }
                      >
                        <Download className='h-4 w-4' />
                        {t("portfolio.download")}
                      </Button>
                    ))}

                  {/* Feature: Coba Sekarang */}
                  {activeTab === "feature" && (
                    <Button
                      variant='outline'
                      className='w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                      onClick={() =>
                        (window.location.href = (project as any).url)
                      }
                    >
                      <ExternalLink className='h-4 w-4' />
                      {language === "id" ? "Coba Sekarang" : "Try It"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
