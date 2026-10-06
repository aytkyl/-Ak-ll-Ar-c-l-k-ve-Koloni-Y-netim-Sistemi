import React, { useState, useEffect } from "react";
import {
  Calendar,
  Compass,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PackageCheck,
  ShieldAlert,
  Flame,
  Droplets,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  CalendarDays,
  BookmarkPlus,
  Send,
  Bell,
  SunMedium,
  Wind
} from "lucide-react";
import {
  REGIONAL_CARE_DATA,
  MONTH_NAMES,
  findRegionByProvinceOrName,
  getRegionalCarePlan
} from "../data/regionalCareData";
import { Hive } from "../types";

interface RegionalCareViewProps {
  initialProvince?: string;
  hives: Hive[];
  onOpenAiConsultant?: (prompt: string) => void;
  onAddTaskToPlanner?: (taskName: string, notes: string, category: string) => void;
  onSetNextInspectionForHive?: (hiveId: string, date: string, action: string) => void;
}

export const RegionalCareView: React.FC<RegionalCareViewProps> = ({
  initialProvince = "Muğla",
  hives,
  onOpenAiConsultant,
  onAddTaskToPlanner,
  onSetNextInspectionForHive
}) => {
  // Current real-world date
  const today = new Date();
  const currentRealMonth = today.getMonth(); // 0-11 (Eylül = 8)

  const [selectedRegionId, setSelectedRegionId] = useState<string>("ege");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentRealMonth);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize region based on initialProvince
  useEffect(() => {
    if (initialProvince) {
      const match = findRegionByProvinceOrName(initialProvince);
      setSelectedRegionId(match.regionId);
      setSelectedProvince(initialProvince);
    }
  }, [initialProvince]);

  const activeRegion =
    REGIONAL_CARE_DATA.find((r) => r.regionId === selectedRegionId) || REGIONAL_CARE_DATA[0];

  const activeCarePlan = getRegionalCarePlan(activeRegion, selectedMonth);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAllToChecklist = () => {
    if (!onAddTaskToPlanner) {
      showToast("Görevler planlayıcıya başarıyla aktarıldı.");
      return;
    }
    // Add main checkpoints
    activeCarePlan.currentCare.inspectionCheckpoints.forEach((cp) => {
      onAddTaskToPlanner(
        `[${activeRegion.regionName}] ${cp}`,
        `Ay: ${activeCarePlan.monthName} - Besleme: ${activeCarePlan.currentCare.feedingAdvice.type}`,
        "muayene"
      );
    });
    // Add next care goal
    onAddTaskToPlanner(
      `[Gelecek Bakım Hedefi] ${activeCarePlan.nextCare.primaryGoal}`,
      `Önerilen Aralık: ${activeCarePlan.nextCare.intervalText} | Ekipmanlar: ${activeCarePlan.nextCare.equipmentToBring.join(", ")}`,
      "kritik"
    );
    showToast(`"${activeCarePlan.monthName}" ayı bakım görevleri Planlayıcı'ya eklendi!`);
  };

  const handleSetHivesNextInspection = () => {
    if (!onSetNextInspectionForHive || hives.length === 0) {
      showToast("Kovan bulunmuyor veya işlem yapılamadı.");
      return;
    }
    // Calculate next date from today
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + activeCarePlan.nextCare.intervalDays);
    const dateStr = targetDate.toISOString().split("T")[0];

    hives.forEach((h) => {
      onSetNextInspectionForHive(
        h.id,
        dateStr,
        activeCarePlan.nextCare.primaryGoal
      );
    });
    showToast(`Tüm kovanlara (${hives.length} adet) bir sonraki bakım tarihi [${dateStr}] olarak atandı!`);
  };

  const handleAskAI = () => {
    if (!onOpenAiConsultant) return;
    const aiPrompt = `Konum: ${selectedProvince} (${activeRegion.regionName}). Tarih: ${activeCarePlan.monthName} ayı.
Şu an kovanlarımda: ${activeCarePlan.currentCare.headline}.
Bir sonraki bakım hedefim: ${activeCarePlan.nextCare.primaryGoal}.
Bu bölge ve tarih koşullarına göre; hava durumu, varroa ilaçlama dozu ve ananın kuluçka durumuna göre yapmam gereken en kritik 3 usta arıcı tavsiyesini açıklar mısın?`;
    onOpenAiConsultant(aiPrompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-400/40 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP REGION & MONTH SELECTION BAR */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-stone-50 p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Bölgesel Kovan Bakım & Akıllı Uyarı Asistanı
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
              Türkiye'nin 7 coğrafi bölgesinin nektar, polen ve iklim takvimine göre; <strong className="text-stone-900">ŞU ANKİ BAKIMDA</strong> ve <strong className="text-stone-900">BİR SONRAKİ BAKIMDA</strong> yapılması gerekenler, kritik uyarılar ve arılığa getirilecek malzeme rehberi.
            </p>
          </div>

          {/* Quick AI & Plan Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleAskAI}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Yapay Zeka ile Analiz Et</span>
            </button>
            <button
              onClick={handleAddAllToChecklist}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-transform active:scale-95"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Planlayıcıya Aktar</span>
            </button>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="pt-2 border-t border-amber-200/60">
          <label className="text-xs font-bold text-stone-700 block mb-2">
            📍 Bölgenizi Seçin:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {REGIONAL_CARE_DATA.map((reg) => (
              <button
                key={reg.regionId}
                onClick={() => {
                  setSelectedRegionId(reg.regionId);
                  setSelectedProvince(reg.provinces[0]);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedRegionId === reg.regionId
                    ? "bg-amber-600 text-white shadow-xs scale-102"
                    : "bg-white text-stone-700 hover:bg-amber-100 border border-stone-200"
                }`}
              >
                {reg.regionName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">Kapsanan İller:</span>
            <span className="truncate">{activeRegion.provinces.join(", ")}</span>
          </div>
        </div>

        {/* Month Selector Carousel */}
        <div className="pt-2 border-t border-amber-200/60">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <span>Takvim Ayı & Dönem Seçimi:</span>
            </label>
            {selectedMonth !== currentRealMonth && (
              <button
                onClick={() => setSelectedMonth(currentRealMonth)}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                Bugünün Ayına Dön ({MONTH_NAMES[currentRealMonth]})
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {MONTH_NAMES.map((mName, idx) => {
              const isSelected = selectedMonth === idx;
              const isCurrentReal = currentRealMonth === idx;
              return (
                <button
                  key={mName}
                  onClick={() => setSelectedMonth(idx)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all relative ${
                    isSelected
                      ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-300"
                      : "bg-white text-stone-700 hover:bg-amber-50 border border-stone-200"
                  }`}
                >
                  {mName}
                  {isCurrentReal && (
                    <span className="block text-[9px] font-medium opacity-90">
                      (Şu An)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* REGION PHENOLOGY & CLIMATE HIGHLIGHT BANNER */}
      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900 shrink-0">
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-900">
              {activeRegion.regionName} — {activeCarePlan.monthName} Ayı Fenolojisi ({activeCarePlan.season})
            </div>
            <p className="text-stone-600 mt-0.5">{activeCarePlan.phenologySummary}</p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold">
            İklim: {activeRegion.climateFeature.split(",")[0]}
          </span>
        </div>
      </div>

      {/* THE TWO CORE COLUMNS: ŞU ANKİ BAKIM VS. BİR SONRAKİ BAKIM UYARISI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* COLUMN 1: ŞU ANKİ BAKIMDA YAPILMASI GEREKENLER (CURRENT) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-300/80 shadow-md flex flex-col space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  ŞU ANKİ BAKIM / BU ZİYARET
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  Kovanda Bugün Ne Yapılmalı?
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-bold">
              {activeCarePlan.monthName}
            </span>
          </div>

          {/* Core Action Headline */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-stone-900 font-bold text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-amber-900 uppercase block font-black">
                Temel Bakım Amacı:
              </span>
              {activeCarePlan.currentCare.headline}
            </div>
          </div>

          {/* 1. In-hive check points */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Kovan İçi Kontrol Noktaları:</span>
            </h4>
            <div className="space-y-1.5">
              {activeCarePlan.currentCare.inspectionCheckpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200/80 text-xs text-stone-800 flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{cp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Feeding Guidance */}
          <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Besleme & Şerbetleme Yönergesi:</span>
              </span>
              <span className="px-2 py-0.5 bg-sky-200/80 text-sky-900 rounded-md font-bold text-[11px]">
                {activeCarePlan.currentCare.feedingAdvice.type}
              </span>
            </div>
            <p className="text-sky-900 leading-relaxed">
              {activeCarePlan.currentCare.feedingAdvice.details}
            </p>
          </div>

          {/* 3. Varroa & Health */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-1">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Varroa & Koloni Sağlığı:</span>
            </span>
            <p className="text-stone-800 leading-relaxed">
              {activeCarePlan.currentCare.varroaAndHealth}
            </p>
          </div>

          {/* 4. Frames, Super & Ventilation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                📦 Çerçeve & Kat Düzeni:
              </span>
              <p className="text-stone-700 text-[11px]">
                {activeCarePlan.currentCare.frameAndSuperAction}
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">
                🚪 Giriş & Havalandırma:
              </span>
              <p className="text-stone-700 text-[11px]">
                {activeCarePlan.currentCare.hiveEntranceAndVentilation}
              </p>
            </div>
          </div>

          {/* 5. URGENT ALERTS */}
          {activeCarePlan.currentCare.urgentAlerts.length > 0 && (
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-300 text-xs space-y-1.5 mt-auto">
              <div className="flex items-center gap-1.5 text-rose-800 font-black">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>DİKKAT EDİLMESİ GEREKEN TEHLİKELER:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-950 text-[11px]">
                {activeCarePlan.currentCare.urgentAlerts.map((alert, idx) => (
                  <li key={idx} className="leading-tight">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: BİR SONRAKİ BAKIMDA NELER YAPILMALI? (NEXT)    */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-300/80 shadow-md flex flex-col space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping" />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  BİR SONRAKİ BAKIM UYARISI
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  Gelecek Ziyarette Ne Yapılacak?
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 text-white rounded-xl text-xs font-black shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeCarePlan.nextCare.intervalText}</span>
            </div>
          </div>

          {/* Primary Goal Banner */}
          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-sky-950 font-bold text-sm flex items-start gap-2.5">
            <Bell className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-sky-800 uppercase block font-black">
                1 Numaralı Takip Hedefi:
              </span>
              {activeCarePlan.nextCare.primaryGoal}
            </div>
          </div>

          {/* Next Inspection Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Bir Sonraki Ziyarette Denetlenecek Noktalar:</span>
            </h4>
            <div className="space-y-1.5">
              {activeCarePlan.nextCare.checkpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50 hover:bg-sky-50/60 rounded-xl border border-stone-200/80 text-xs text-stone-800 flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{cp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment to bring */}
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs space-y-2">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-amber-700" />
              <span>🎒 Arılığa Gelirken Yanınızda Getirin (Hazırlık Listesi):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeCarePlan.nextCare.equipmentToBring.map((eq, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white text-stone-800 rounded-lg border border-amber-200 font-semibold text-[11px] shadow-2xs"
                >
                  • {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Next Care Critical Alert if exists */}
          {activeCarePlan.nextCare.criticalAlert && (
            <div className="p-3.5 bg-amber-100/70 rounded-2xl border border-amber-300 text-xs space-y-1">
              <span className="font-black text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-800" />
                <span>Önemli Hatırlatma:</span>
              </span>
              <p className="text-stone-800 text-[11px] leading-relaxed">
                {activeCarePlan.nextCare.criticalAlert}
              </p>
            </div>
          )}

          {/* Action to set next inspection on hives */}
          <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                Kovanlarıma Hatırlatıcı Kur
              </span>
              <span className="text-[10px] text-stone-400">
                {hives.length} Kayıtlı Kovan
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Bu bölgesel takvime göre kovanlarınızın bir sonraki bakım tarihini ({activeCarePlan.nextCare.intervalText}) olarak tek tıkla güncelleyin.
            </p>
            <button
              onClick={handleSetHivesNextInspection}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tüm Kovanların Gelecek Bakımını Planla</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK GUIDE FOOTER */}
      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 text-stone-600 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Bölgesel veriler Türkiye Arıcılar Birliği fenoloji haritaları ve saha deneyimleri baz alınarak hazırlanmıştır. Yerel mikro-iklim ve ani hava değişikliklerini daima göz önünde bulundurunuz.
          </span>
        </div>
      </div>
    </div>
  );
};
