import React from "react";
import {
  Compass,
  CloudSun,
  Flower2,
  CalendarCheck,
  BookOpen,
  Sparkles,
  Download,
  Upload,
  Plus,
  Crown,
  Camera,
  QrCode,
  CalendarClock,
  Stethoscope,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { WeatherData } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  weather: WeatherData | null;
  onOpenAiAssistant: () => void;
  onOpenQueenFinder: () => void;
  onOpenVisionScanner?: () => void;
  onOpenQrScanner?: () => void;
  onAddHive: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hiveCount: number;
  alertCount?: number;
  onOpenAlertModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenAiAssistant,
  onOpenQueenFinder,
  onOpenVisionScanner,
  onOpenQrScanner,
  onAddHive,
  onExportData,
  onImportData,
  hiveCount,
  alertCount = 0,
  onOpenAlertModal,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top utility strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-400/30">
            <svg
              className="w-6 h-6 text-amber-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Custom stylized honeybee path */}
              <circle cx="12" cy="12" r="3" />
              <path d="M12 9V4" />
              <path d="M12 20v-5" />
              <path d="M8 8L4 5" />
              <path d="M16 8l4-3" />
              <path d="M7 16l-3 2" />
              <path d="M17 16l3 2" />
              <path d="M9 12h6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Kovanım</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-200/80 text-amber-900 rounded-full border border-amber-300">
                Arıcılık Asistanı
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              Akıllı Koloni Yönetimi, Flora & Hava Durumu, Bakım Planlayıcı ve Kapsamlı Arı Kitaplığı
            </p>
          </div>
        </div>

        {/* Quick Weather & AI Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {weather && (
            <button
              onClick={() => setActiveTab("weather")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 border border-amber-200 text-stone-700 text-xs hover:border-amber-400 transition-colors shadow-2xs"
              title="Hava ve Arı Uçuş Durumu Detayları"
            >
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-stone-900">{weather.city}:</span>
              <span>{weather.temperature}°C</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${weather.flightSuitability.badgeColor}`}
              >
                {weather.flightSuitability.status}
              </span>
            </button>
          )}

          {onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 ${
                alertCount > 0
                  ? "bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 ring-2 ring-rose-400/30"
                  : "bg-white text-stone-700 border border-amber-200 hover:border-amber-300"
              }`}
              title="Meteorolojik Tehdit & Güvenlik Uyarıları"
            >
              <Bell className={`w-3.5 h-3.5 ${alertCount > 0 ? "text-rose-600 animate-bounce" : "text-amber-600"}`} />
              <span className="hidden sm:inline">Hava Uyarısı</span>
              {alertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-black animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>
          )}

          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:border-amber-400 text-stone-800 font-bold text-xs shadow-2xs transition-all transform active:scale-95"
              title="Kovan QR Kodunu Tara veya Yazdır"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Kovan QR</span>
            </button>
          )}

          {onOpenVisionScanner && (
            <button
              onClick={onOpenVisionScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-xs shadow-sm transition-all transform active:scale-95 ring-2 ring-rose-300/40"
              title="Kamera ile kovan arı sayma, varroalı arı sayma ve görüntüden gösterme, petek muayenesi"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Arı & Varroa Sayımı</span>
            </button>
          )}

          <button
            onClick={onOpenQueenFinder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-sm transition-all transform active:scale-95 border border-amber-300 ring-2 ring-amber-400/30"
            title="Kamera ile petek üzerinde ana arıyı bul & işaretle"
          >
            <Crown className="w-3.5 h-3.5 fill-current text-stone-950" />
            <span className="hidden sm:inline">Ana Arı Bulucu</span>
            <span className="sm:hidden">Ana Arı</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-all transform active:scale-95"
            title="Kovan Sorunları & Hastalık Danışmanı"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">AI Danışman</span>
          </button>

          <button
            onClick={onAddHive}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-2xs"
            title="Yeni Kovan Kaydet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Kovan Ekle</span>
          </button>

          <div className="flex items-center gap-1 pl-1 border-l border-amber-200">
            <button
              onClick={onExportData}
              title="Verileri Yedekle (JSON İndir)"
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-amber-100 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Yedekten Geri Yükle"
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-amber-100 rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Navigation tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 py-1 min-w-max">
          <button
            onClick={() => setActiveTab("hives")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "hives"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Kolonilerim ({hiveCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("regional-care")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "regional-care"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Bölgesel Bakım & Uyarılar</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "planner"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Bakım Planlayıcı (Günlük/3 Günlük/Aylık)</span>
          </button>

          <button
            onClick={() => setActiveTab("weather")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "weather"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Hava & Arı Uçuş İndeksi</span>
          </button>

          <button
            onClick={() => setActiveTab("flora")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "flora"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <Flower2 className="w-4 h-4" />
            <span>Bitki Örtüsü & Flora</span>
          </button>

          <button
            onClick={() => setActiveTab("harvest-finance")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "harvest-finance"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <span className="font-black text-sm w-4 text-center leading-none">₺</span>
            <span>Hasat, Finans & Malzeme Fiyatları</span>
          </button>

          <button
            onClick={() => setActiveTab("petek-health")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "petek-health"
                ? "bg-rose-600 text-white shadow-xs font-bold"
                : "text-stone-700 hover:text-rose-900 hover:bg-rose-50"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-rose-500" />
            <span>Petek & Arı Sağlığı (Hastalık / Tedavi)</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "library"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-stone-700 hover:text-stone-900 hover:bg-amber-100/70"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Arı Bakım Kitaplığı & Ansiklopedi</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
