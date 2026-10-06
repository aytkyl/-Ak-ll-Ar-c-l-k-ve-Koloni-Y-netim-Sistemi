import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  ChevronRight,
  Calculator,
  ShieldAlert,
  Sparkles,
  Scroll,
  Layers,
  Thermometer,
  Scale,
  Droplets,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FlaskConical,
  Leaf,
  Wind,
  Stethoscope,
  Activity,
  Flame,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Bug,
  HelpCircle,
  HeartPulse,
  AlertOctagon,
  FileText,
  Info,
  X,
} from "lucide-react";
import { BEEKEEPING_LIBRARY } from "../data/libraryData";
import { BEE_DISEASES_DATA, SYMPTOM_CHECKER_LIST } from "../data/diseasesData";
import { BookChapter, BookChapterSubSection, BeeDiseaseInfo } from "../types";

interface LibraryViewProps {
  onNavigateToHealthTab?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigateToHealthTab }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    BEEKEEPING_LIBRARY[0]?.id || "bolum-1"
  );
  const [selectedSubSectionId, setSelectedSubSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"book" | "diseases" | "calculators">("book");

  // Disease Atlas & Diagnostic Wizard states
  const [diseaseSearch, setDiseaseSearch] = useState<string>("");
  const [selectedDiseaseCategory, setSelectedDiseaseCategory] = useState<
    "all" | "brood" | "pest" | "adult" | "comb_disorder"
  >("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>("ayc");
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  // Calculator states
  // 1. Syrup calculator
  const [syrupType, setSyrupType] = useState<"1:1" | "2:1">("1:1");
  const [syrupHives, setSyrupHives] = useState<number>(10);
  const [syrupLitersPerHive, setSyrupLitersPerHive] = useState<number>(1.0);

  // 2. Bee candy (Arı keki) calculator
  const [candyBatches, setCandyBatches] = useState<number>(5); // kg candy

  // 3. Organik Asit & Uçucu Yağ Hesaplayıcı
  const [acidType, setAcidType] = useState<"lactic" | "formic" | "oxalic" | "essential">("formic");
  const [acidHives, setAcidHives] = useState<number>(10);
  const [formicDay, setFormicDay] = useState<"day1" | "day2">("day2");
  const [lacticSprayPerHive, setLacticSprayPerHive] = useState<number>(40); // ml
  const [essentialSyrupLiters, setEssentialSyrupLiters] = useState<number>(10); // litre
  const [oxalicMethod, setOxalicMethod] = useState<"towel" | "sublimation">("towel");

  const selectedChapter: BookChapter = useMemo(() => {
    return (
      BEEKEEPING_LIBRARY.find((c) => c.id === selectedChapterId) ||
      BEEKEEPING_LIBRARY[0]
    );
  }, [selectedChapterId]);

  // Filtered chapters when search query exists
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return BEEKEEPING_LIBRARY;
    const q = searchQuery.toLowerCase();
    return BEEKEEPING_LIBRARY.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.subsections.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.summary.toLowerCase().includes(q) ||
            s.content.some((text) => text.toLowerCase().includes(q))
        )
    );
  }, [searchQuery]);

  // Syrup calculation math
  const totalVolumeWanted = syrupHives * syrupLitersPerHive;
  const sugarKg =
    syrupType === "1:1"
      ? (totalVolumeWanted * (1 / 1.62)).toFixed(1)
      : (totalVolumeWanted * (2 / 2.24)).toFixed(1);

  const waterLiters =
    syrupType === "1:1"
      ? (totalVolumeWanted * (1 / 1.62)).toFixed(1)
      : (totalVolumeWanted * (1 / 2.24)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span>Kapsamlı Arıcılık Ansiklopedisi & Geleneksel Yöntemler</span>
          </h2>
          <p className="text-sm text-stone-700 mt-0.5">
            Temel ekipmanlardan ana arı biyolojisine, kovan sağlığından karakovan ve sepet arıcılığına tam rehber
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("book")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "book"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            📚 Ciltleri İncele
          </button>
          <button
            onClick={() => setActiveTab("diseases")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "diseases"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
            <span>Petek & Arı Hastalık Atlası</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === "diseases"
                  ? "bg-white text-rose-700"
                  : "bg-rose-600 text-white"
              }`}
            >
              15+ Teşhis & Tedavi
            </span>
          </button>
          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "calculators"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Şerbet & İlaç Hesaplayıcı</span>
          </button>
        </div>
      </div>

      {activeTab === "book" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Chapters & Search */}
          <div className="lg:col-span-1 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kitaplıkta ara (varroa, oğul, şerbet, karakovan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-amber-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
            </div>

            <div className="space-y-2">
              {filteredChapters.map((chapter) => {
                const isSelected = selectedChapterId === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setSelectedChapterId(chapter.id);
                      setSelectedSubSectionId(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                        : "bg-white text-stone-800 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider block ${
                            isSelected ? "text-amber-100" : "text-amber-700"
                          }`}
                        >
                          {chapter.badge}
                        </span>
                        <h4 className="text-xs font-bold leading-tight">
                          {chapter.title}
                        </h4>
                        <p
                          className={`text-[11px] line-clamp-1 ${
                            isSelected ? "text-amber-50" : "text-stone-500"
                          }`}
                        >
                          {chapter.subtitle}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mt-1 ${
                          isSelected ? "text-white" : "text-stone-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Reading Canvas */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chapter Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                  {selectedChapter.badge}
                </span>
                <span className="text-xs text-stone-500">
                  {selectedChapter.subsections.length} Alt Konu & Uygulama Rehberi
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                {selectedChapter.title}
              </h1>
              <p className="text-base font-semibold text-amber-900 mt-1">
                {selectedChapter.subtitle}
              </p>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                {selectedChapter.description}
              </p>
            </div>

            {/* Subsections List */}
            <div className="space-y-5">
              {selectedChapter.subsections.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-100">
                    <div>
                      <span className="text-xs font-bold text-amber-700 block">
                        Konu {idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                        {sub.title}
                      </h3>
                      <p className="text-xs font-medium text-stone-600 mt-1 italic">
                        "{sub.summary}"
                      </p>
                    </div>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="mt-4 space-y-2.5 text-xs text-stone-700 leading-relaxed">
                    {sub.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Step By Step Guide if available */}
                  {sub.stepByStep && sub.stepByStep.length > 0 && (
                    <div className="mt-4 p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Adım Adım Uygulama Yönergesi:</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-stone-800">
                        {sub.stepByStep.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="font-bold text-amber-800 shrink-0">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Traditional Solutions if available */}
                  {sub.traditionalSolutions && sub.traditionalSolutions.length > 0 && (
                    <div className="mt-3 p-4 bg-orange-50/60 rounded-xl border border-orange-200">
                      <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-2">
                        <Scroll className="w-4 h-4 text-orange-700" />
                        <span>Geleneksel & Doğal Çözümler (Eski Usta Usulü):</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-orange-950">
                        {sub.traditionalSolutions.map((trad, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="font-bold text-orange-800 shrink-0">🍯</span>
                            <span>{trad}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modern Solutions if available */}
                  {sub.modernSolutions && sub.modernSolutions.length > 0 && (
                    <div className="mt-3 p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                      <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span>Modern ve Bilimsel Yaklaşım:</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-blue-950">
                        {sub.modernSolutions.map((mod, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2">
                            <span className="font-bold text-blue-800 shrink-0">🔬</span>
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings if available */}
                  {sub.warnings && sub.warnings.length > 0 && (
                    <div className="mt-3 p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-rose-900 space-y-1">
                        {sub.warnings.map((w, wIdx) => (
                          <p key={wIdx} className="font-medium">
                            {w}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculator shortcut if available */}
                  {sub.calculatorType && (
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500 font-medium">
                        Bu konuya ait interaktif saha dozaj ve karışım hesaplayıcısı:
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab("calculators");
                          if (sub.calculatorType === "formic" || sub.calculatorType === "oxalic") {
                            setAcidType(sub.calculatorType === "oxalic" ? "oxalic" : "formic");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Hesaplayıcıyı Aç</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PETEK & ARI HASTALIKLARI TEŞHİS VE TEDAVİ ATLASI TAB */}
      {activeTab === "diseases" && (
        <div className="space-y-6">
          {/* Top Atlas Header Banner */}
          <div className="bg-gradient-to-br from-rose-500/10 via-white to-amber-50 rounded-2xl p-6 border border-rose-200/90 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                      <span>Petek & Arı Hastalıkları, Zararlıları ve Tedavi Atlası</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                        15+ Detaylı Protokol
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Semptom bazlı hızlı saha teşhisi, kibrit testleri, organik asit ve uçucu yağ tedavileri, Tarım Bakanlığı mevzuat bildirimleri
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <span className="text-xs font-semibold text-stone-500">
                  Toplam İncelenen Durum:
                </span>
                <span className="text-sm font-black text-rose-700 bg-rose-100/80 px-3 py-1 rounded-xl border border-rose-200">
                  {BEE_DISEASES_DATA.length} Hastalık & Zararlı
                </span>
              </div>
            </div>
          </div>

          {onNavigateToHealthTab && (
            <div className="bg-gradient-to-r from-rose-900 via-stone-900 to-rose-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-rose-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <span>Özel Petek Muayenesi, Asit Dozajı & Kovan Tedavi Günlüğü Merkezi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                      Yeni Panel
                    </span>
                  </h4>
                  <p className="text-xs text-rose-200 mt-0.5">
                    Petek belirtileriyle anında interaktif teşhis koyun, organik asit seyreltme hesaplayın ve kovanlarınıza hasat bekleme süreli tedavi başlatın.
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToHealthTab}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-xl font-bold text-xs hover:from-rose-500 hover:to-amber-500 shadow-md shrink-0 transition-transform active:scale-95"
              >
                Petek & Tedavi Paneline Git →
              </button>
            </div>
          )}

          {/* 🔬 INTERACTIVE SYMPTOM DIAGNOSTIC WIZARD */}
          <div className="bg-white rounded-2xl p-6 border-2 border-rose-400/40 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Activity className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <span>Hızlı Semptom Teşhis Sihirbazı</span>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                      Saha Karar Motoru
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500">
                    Peteklerinizde veya arılarınızda gözlemlediğiniz belirtileri işaretleyin, olası hastalıkları ve ilk müdahale adımlarını anında görün.
                  </p>
                </div>
              </div>

              {selectedSymptomIds.length > 0 && (
                <button
                  onClick={() => setSelectedSymptomIds([])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 self-start sm:self-center"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Seçimleri Sıfırla ({selectedSymptomIds.length})</span>
                </button>
              )}
            </div>

            {/* Symptom Checklist Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Petekte veya Kovanda Ne Görüyorsunuz? (Bir veya birden fazla seçebilirsiniz):
              </label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_CHECKER_LIST.map((symp) => {
                  const isChecked = selectedSymptomIds.includes(symp.id);
                  return (
                    <button
                      key={symp.id}
                      onClick={() => {
                        setSelectedSymptomIds((prev) =>
                          isChecked ? prev.filter((id) => id !== symp.id) : [...prev, symp.id]
                        );
                      }}
                      className={`text-xs px-3 py-2 rounded-xl font-medium border text-left transition-all flex items-center gap-2 ${
                        isChecked
                          ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-rose-50 hover:border-rose-300"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? "bg-white text-rose-700 border-white"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{symp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Diagnostic Results Box when symptoms are selected */}
            {selectedSymptomIds.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50/90 border-2 border-rose-300 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Tespit Edilen Olası Hastalık & Zararlı Eşleşmeleri:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from(
                    new Set(
                      selectedSymptomIds.flatMap(
                        (id) =>
                          SYMPTOM_CHECKER_LIST.find((s) => s.id === id)?.possibleDiseases || []
                      )
                    )
                  ).map((diseaseName, idx) => {
                    const matchedData = BEE_DISEASES_DATA.find((d) =>
                      diseaseName.includes(d.name.split(" ")[0]) || d.name.includes(diseaseName)
                    );
                    return (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <h5 className="font-bold text-stone-900 text-xs">
                              {matchedData ? matchedData.name : diseaseName}
                            </h5>
                            {matchedData && (
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${matchedData.dangerColor}`}
                              >
                                {matchedData.severity}
                              </span>
                            )}
                          </div>
                          {matchedData && (
                            <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                              {matchedData.overview}
                            </p>
                          )}
                        </div>

                        {matchedData && (
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-[10px] text-stone-500 font-semibold">
                              {matchedData.categoryName}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedDiseaseCategory("all");
                                setExpandedDiseaseId(matchedData.id);
                                const el = document.getElementById(`disease-${matchedData.id}`);
                                el?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="text-xs font-bold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1"
                            >
                              <span>Reçeteyi Aç</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 📚 COMPREHENSIVE DISEASE CATALOG & TREATMENT ATLAS */}
          <div className="space-y-4">
            {/* Search and Category Filters */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Hastalık adı, semptom, organik asit veya tedavi ara..."
                    value={diseaseSearch}
                    onChange={(e) => setDiseaseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Severity quick selector */}
                <div className="flex items-center gap-1.5 self-start sm:self-center text-xs">
                  <span className="text-stone-500 font-bold">Tehlike:</span>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="all">Tüm Seviyeler</option>
                    <option value="Kritik (Acil İhbar)">Kritik (Acil İhbar)</option>
                    <option value="Yüksek Tehlike">Yüksek Tehlike</option>
                    <option value="Orta Risk">Orta Risk</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100 text-xs">
                <button
                  onClick={() => setSelectedDiseaseCategory("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDiseaseCategory === "all"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Tümü ({BEE_DISEASES_DATA.length})
                </button>
                <button
                  onClick={() => setSelectedDiseaseCategory("brood")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDiseaseCategory === "brood"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  🪺 Yavru & Petek Hastalıkları (AYÇ, EYÇ, Kireç, Taş)
                </button>
                <button
                  onClick={() => setSelectedDiseaseCategory("pest")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDiseaseCategory === "pest"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  🕷️ Petek Zararlıları & Parazitler (Varroa, Güve, Böcek)
                </button>
                <button
                  onClick={() => setSelectedDiseaseCategory("adult")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDiseaseCategory === "adult"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  🐝 Yetişkin Arı Hastalıkları (Nosema, Felç, Zehirlenme)
                </button>
                <button
                  onClick={() => setSelectedDiseaseCategory("comb_disorder")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDiseaseCategory === "comb_disorder"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  ⚠️ Petek & Fizyolojik Kusurlar (Yalancı Ana, Çökme, Yağma)
                </button>
              </div>
            </div>

            {/* Disease Cards List */}
            <div className="space-y-4">
              {BEE_DISEASES_DATA.filter((d) => {
                if (selectedDiseaseCategory !== "all" && d.category !== selectedDiseaseCategory)
                  return false;
                if (selectedSeverity !== "all" && d.severity !== selectedSeverity)
                  return false;
                if (diseaseSearch.trim()) {
                  const q = diseaseSearch.toLowerCase();
                  const matchName = d.name.toLowerCase().includes(q);
                  const matchSci = d.scientificName.toLowerCase().includes(q);
                  const matchOverview = d.overview.toLowerCase().includes(q);
                  const matchSymptom = d.combSymptoms.some((s) => s.toLowerCase().includes(q));
                  const matchTreat = d.treatmentProtocol.organicTreatment.some((t) =>
                    t.toLowerCase().includes(q)
                  );
                  if (!matchName && !matchSci && !matchOverview && !matchSymptom && !matchTreat)
                    return false;
                }
                return true;
              }).map((disease) => {
                const isExpanded = expandedDiseaseId === disease.id;
                return (
                  <div
                    id={`disease-${disease.id}`}
                    key={disease.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? "border-rose-400 shadow-md ring-1 ring-rose-400/30"
                        : "border-stone-200 hover:border-rose-300 shadow-2xs"
                    }`}
                  >
                    {/* Disease Header Bar */}
                    <div
                      onClick={() => setExpandedDiseaseId(isExpanded ? null : disease.id)}
                      className={`p-5 cursor-pointer flex items-start justify-between gap-4 transition-colors ${
                        isExpanded ? "bg-rose-50/40 border-b border-rose-100" : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full ${disease.dangerColor}`}
                          >
                            {disease.severity}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                            {disease.categoryName}
                          </span>
                          {disease.legalStatus && (
                            <span className="text-[11px] font-bold text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-md border border-rose-300">
                              ⚖️ {disease.legalStatus}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-black text-stone-900 mt-1">
                          {disease.name}
                        </h4>
                        <p className="text-xs text-stone-500 italic">
                          Bilimsel Adı: {disease.scientificName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-stone-500 hidden sm:inline">
                          {isExpanded ? "Detayları Gizle" : "Tedavi & Belirtiler"}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                            isExpanded
                              ? "bg-rose-600 text-white border-rose-700"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Disease Details */}
                    {isExpanded && (
                      <div className="p-6 space-y-6 text-xs">
                        {/* Overview Box */}
                        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-stone-800 leading-relaxed text-sm">
                          {disease.overview}
                        </div>

                        {/* Symptoms Grid: Comb vs Bee */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Comb & Cell Symptoms */}
                          <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                            <h5 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs pb-1 border-b border-stone-100">
                              <span>🪺 Petek & Hücre Görünümü Belirtileri</span>
                            </h5>
                            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
                              {disease.combSymptoms.map((symp, i) => (
                                <li key={i} className="leading-snug">
                                  {symp}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Adult Bee & Behavior Symptoms */}
                          <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                            <h5 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs pb-1 border-b border-stone-100">
                              <span>🐝 Yetişkin Arı & Koloni Davranış Belirtileri</span>
                            </h5>
                            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
                              {disease.beeSymptoms.map((symp, i) => (
                                <li key={i} className="leading-snug">
                                  {symp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Rapid Field Test Box if available */}
                        {disease.rapidFieldTest && (
                          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
                              <FlaskConical className="w-4 h-4 text-rose-600" />
                              <span>Usta Arıcı Hızlı Saha Teşhis Testi:</span>
                            </div>
                            <p className="text-xs leading-relaxed text-rose-900">
                              {disease.rapidFieldTest}
                            </p>
                          </div>
                        )}

                        {/* Complete Treatment Protocols */}
                        <div className="space-y-4 pt-2 border-t border-stone-200">
                          <h5 className="text-sm font-black text-stone-900 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Müdahale, Tedavi & Dezenfeksiyon Protokolü</span>
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Urgent Action Steps */}
                            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                              <h6 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>1. İlk ve Acil Eylem Adımları</span>
                              </h6>
                              <ul className="space-y-1.5 text-rose-900 list-disc list-inside text-xs leading-relaxed">
                                {disease.treatmentProtocol.urgentActionSteps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Organic Treatments */}
                            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                              <h6 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                <span>2. Organik Asit & Uçucu Yağ Reçeteleri</span>
                              </h6>
                              {disease.treatmentProtocol.organicTreatment.length > 0 ? (
                                <ul className="space-y-1.5 text-emerald-900 list-disc list-inside text-xs leading-relaxed">
                                  {disease.treatmentProtocol.organicTreatment.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-stone-500 italic text-[11px]">
                                  Bu patolojide doğrudan kimyasal veya asit uygulanmaz; biyolojik ve kültürel önlemler esastır.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Cultural & Biological Methods */}
                          {disease.treatmentProtocol.culturalAndBiological.length > 0 && (
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                              <h6 className="font-bold text-stone-800 text-xs">
                                🌿 Kültürel, Mekanik ve Biyolojik Tedbirler:
                              </h6>
                              <ul className="space-y-1 text-stone-700 list-disc list-inside text-xs">
                                {disease.treatmentProtocol.culturalAndBiological.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Prohibited Actions Alert */}
                          {disease.treatmentProtocol.prohibitedActions.length > 0 && (
                            <div className="p-3.5 bg-red-100/70 rounded-xl border border-red-300 text-red-950 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-red-900">
                                <ShieldAlert className="w-4 h-4 text-red-700" />
                                <span>KESİNLİKLE YAPILMAMASI GEREKEN TEHLİKELİ UYGULAMALAR:</span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-red-900 font-medium">
                                {disease.treatmentProtocol.prohibitedActions.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Prevention Tips */}
                          {disease.preventionTips.length > 0 && (
                            <div className="pt-2 text-stone-600 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-stone-800">Önleyici Koruma: </span>
                                <span>{disease.preventionTips.join(" ")}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "calculators" && (
        <div className="space-y-6">
          {/* ⭐ 1. ORGANİK ASİTLER VE UÇUCU YAĞLAR SAHA DOZAJ HESAPLAYICISI */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">
                      Organik Asitler & Uçucu Yağlar Dozaj ve Karışım Hesaplayıcı
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Varroa Doğal Mücadele
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Laktik Asit (%15 sulandırma), Formik Asit (10 cc kuralı), Oksalik Asit (gliserin & buhar) ve Uçucu Esansiyel Yağ reçeteleri
                  </p>
                </div>
              </div>

              {/* Sub-selector for acid type */}
              <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setAcidType("lactic")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    acidType === "lactic"
                      ? "bg-white text-emerald-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  💧 Laktik Asit (%15)
                </button>
                <button
                  onClick={() => setAcidType("formic")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    acidType === "formic"
                      ? "bg-white text-emerald-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  🐜 Formik Asit (10 cc)
                </button>
                <button
                  onClick={() => setAcidType("oxalic")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    acidType === "oxalic"
                      ? "bg-white text-emerald-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  ❄️ Oksalik Asit (Kışlık)
                </button>
                <button
                  onClick={() => setAcidType("essential")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    acidType === "essential"
                      ? "bg-white text-emerald-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  🌿 Uçucu Esansiyel Yağlar
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Parameter Inputs */}
              <div className="lg:col-span-1 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Uygulama Yapılacak Kovan Sayısı
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={acidHives}
                    onChange={(e) => setAcidHives(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-sm"
                  />
                </div>

                {acidType === "lactic" && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Kovan Başına Püskürtme Hacmi (ml)
                    </label>
                    <div className="flex gap-2">
                      {[30, 40, 50].map((vol) => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => setLacticSprayPerHive(vol)}
                          className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                            lacticSprayPerHive === vol
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {vol} ml
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-1">
                      (Standart 10 çerçeveli kovan için 30-50 ml buğu tavsiye edilir)
                    </span>
                  </div>
                )}

                {acidType === "formic" && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Uygulama Aşaması (Protokol)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormicDay("day1")}
                        className={`py-2 px-2.5 rounded-xl font-bold border text-left text-xs transition-colors ${
                          formicDay === "day1"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div>1. Gün: Alıştırma</div>
                        <div className="text-[10px] opacity-85 font-normal">3 cc / kovan (Stres önleme)</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormicDay("day2")}
                        className={`py-2 px-2.5 rounded-xl font-bold border text-left text-xs transition-colors ${
                          formicDay === "day2"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div>2. Gün: Tam Doz</div>
                        <div className="text-[10px] opacity-85 font-normal">10 cc / kovan (Tamamlama)</div>
                      </button>
                    </div>
                  </div>
                )}

                {acidType === "oxalic" && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Oksalik Asit Uygulama Yolu
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOxalicMethod("towel")}
                        className={`py-2 px-2 rounded-xl font-bold border text-left text-xs transition-colors ${
                          oxalicMethod === "towel"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div>Gliserinli Mendil</div>
                        <div className="text-[10px] opacity-85 font-normal">Temasla yayılır</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOxalicMethod("sublimation")}
                        className={`py-2 px-2 rounded-xl font-bold border text-left text-xs transition-colors ${
                          oxalicMethod === "sublimation"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div>Isıtmalı Buhar</div>
                        <div className="text-[10px] opacity-85 font-normal">Süblimasyon (Gaz maskeli)</div>
                      </button>
                    </div>
                  </div>
                )}

                {acidType === "essential" && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Hazırlanacak Teşvik Şerbeti Hacmi (Litre)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={essentialSyrupLiters}
                      onChange={(e) => setEssentialSyrupLiters(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-sm"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Her kovan için ortalama 0.5 - 1.0 litre şerbet verilir
                    </span>
                  </div>
                )}
              </div>

              {/* Middle Column: Calculated Quantities */}
              <div className="lg:col-span-1 bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>Hesaplanan Reçete ({acidHives} Kovan İçin)</span>
                  </div>

                  {/* Lactic Acid Results */}
                  {acidType === "lactic" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <span className="text-stone-700 font-medium">Toplam Püskürtme Solüsyonu:</span>
                        <span className="font-black text-stone-900 text-sm">
                          {(acidHives * lacticSprayPerHive) >= 1000
                            ? `${((acidHives * lacticSprayPerHive) / 1000).toFixed(2)} Litre`
                            : `${acidHives * lacticSprayPerHive} ml`}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Saf Laktik Asit (%15):</div>
                          <div className="text-[10px] text-stone-500">Kovanda arı üzerine püskürtülür</div>
                        </div>
                        <span className="font-black text-emerald-700 text-base">
                          {((acidHives * lacticSprayPerHive) * 0.15).toFixed(0)} ml
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-blue-900">Temiz İçme Suyu (%85):</div>
                          <div className="text-[10px] text-stone-500">Klorsuz temiz su</div>
                        </div>
                        <span className="font-black text-blue-700 text-base">
                          {((acidHives * lacticSprayPerHive) * 0.85).toFixed(0)} ml
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Formic Acid Results */}
                  {acidType === "formic" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <span className="text-stone-700 font-medium">Kovan Başı Doz:</span>
                        <span className="font-black text-stone-900 text-sm">
                          {formicDay === "day1" ? "3 cc (Alıştırma)" : "10 cc (Tam Doz Sınırı)"}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Gereken Saf Formik Asit:</div>
                          <div className="text-[10px] text-stone-500">Dihidrat form, kaliteli ürün</div>
                        </div>
                        <span className="font-black text-emerald-700 text-lg">
                          {formicDay === "day1" ? acidHives * 3 : acidHives * 10} cc (ml)
                        </span>
                      </div>
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                        <strong>Kritik Kural:</strong> Kovana 10 cc'yi geçemez! Açık yavruya yakıcı etkisi vardır. Alttan kesinlikle verilmez, üstten çıtaların üzerine buharlaşma aparatı ile yerleştirilir.
                      </div>
                    </div>
                  )}

                  {/* Oxalic Acid Results */}
                  {acidType === "oxalic" && oxalicMethod === "towel" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <span className="text-stone-700 font-medium">Emici Selüloz Mendil Adedi:</span>
                        <span className="font-black text-stone-900 text-sm">
                          {acidHives} - {acidHives * 2} adet (kovan başı 1-2 mendil)
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Bitkisel Doğal Gliserin:</div>
                          <div className="text-[10px] text-stone-500">60°C'de ısıtılır</div>
                        </div>
                        <span className="font-black text-emerald-700 text-base">
                          {acidHives * 10} ml
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-blue-900">Oksalik Asit Dihidrat:</div>
                          <div className="text-[10px] text-stone-500">Gliserin içinde eritilir</div>
                        </div>
                        <span className="font-black text-blue-700 text-base">
                          {acidHives * 10} gram
                        </span>
                      </div>
                    </div>
                  )}

                  {acidType === "oxalic" && oxalicMethod === "sublimation" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <span className="text-stone-700 font-medium">Kovan Başına Buhar Dozu:</span>
                        <span className="font-black text-stone-900 text-sm">1.5 - 2.0 gram</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Toplam Saf Oksalik Asit:</div>
                          <div className="text-[10px] text-stone-500">Elektrikli buharlaştırıcı için</div>
                        </div>
                        <span className="font-black text-emerald-700 text-lg">
                          {(acidHives * 1.5).toFixed(0)} - {(acidHives * 2).toFixed(0)} gram
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Essential Oils Results */}
                  {acidType === "essential" && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Kekik Yağı (Timol/Karvakrol):</div>
                          <div className="text-[10px] text-stone-500">Akar vantuzlarını gevşetip düşürür</div>
                        </div>
                        <span className="font-black text-emerald-800 text-sm">
                          {Math.max(1, Math.round(essentialSyrupLiters * 0.7))} damla
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Okaliptüs Yağı (Sineol):</div>
                          <div className="text-[10px] text-stone-500">Trake akarına karşı korur</div>
                        </div>
                        <span className="font-black text-emerald-800 text-sm">
                          {Math.max(1, Math.round(essentialSyrupLiters * 0.6))} damla
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Nane Yağı (Mentol):</div>
                          <div className="text-[10px] text-stone-500">Tımar & grooming refleksini uyarır</div>
                        </div>
                        <span className="font-black text-emerald-800 text-sm">
                          {Math.max(1, Math.round(essentialSyrupLiters * 0.4))} damla
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-emerald-900">Çay Ağacı Yağı:</div>
                          <div className="text-[10px] text-stone-500">Kireç ve küf önleyici bariyer</div>
                        </div>
                        <span className="font-black text-emerald-800 text-sm">
                          {Math.max(1, Math.round(essentialSyrupLiters * 0.3))} damla
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-900">
                  ✅ <strong>Hazırlama Önerisi:</strong> Tüm bileşenleri belirtilen oranlarda hazırlayınız; asla tahmini aşırı dozaj yapmayınız.
                </div>
              </div>

              {/* Right Column: Key Rules & Field Warnings */}
              <div className="lg:col-span-1 space-y-3">
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Thermometer className="w-4 h-4 text-amber-700" />
                    <span>Saha Uygulama & Sıcaklık Emniyeti</span>
                  </div>
                  {acidType === "lactic" && (
                    <div className="text-amber-900 space-y-1.5 text-[11px] leading-relaxed">
                      <p>• <strong>Doğallık:</strong> Canlılar efor harcayınca kaslarda yorgunluk veren doğal bir asittir. Aşırı asidik ve aşırı yakıcı değildir.</p>
                      <p>• <strong>Yavru Güvenliği:</strong> Açık ve kapalı yavruya, yumurtaya ve yetişkin arıya zarar vermez. Yavrulu dönemde güvenle kullanılır.</p>
                      <p>• <strong>Uygulama:</strong> Çalkalayıp kovan üzerinden arıların üzerine fıskırtılır. Ani şok etkisi yoktur; düzenli kullanımda akar popülasyonunu temizler.</p>
                    </div>
                  )}
                  {acidType === "formic" && (
                    <div className="text-amber-900 space-y-1.5 text-[11px] leading-relaxed">
                      <p>• <strong>Hava Sıcaklığı:</strong> Mutlaka <strong>15°C - 25°C</strong> aralığında olmalı ve yağmur olmamalıdır. 20-28°C kritik sınırını aşarsa hızlı buharlaşır ve kovan söner!</p>
                      <p>• <strong>Havalandırma & Ana Arı:</strong> Arı dışarı çıkabilmeli ve kovan havalandırması iyi olmalı; aksi halde arılar anayı keser veya kovanı terk eder.</p>
                      <p>• <strong>Dihidrat Formu:</strong> Piyasada çok form var, arıcılık için dihidrat formu tercih edilmelidir. Sanayi tipleri yabancı madde içerir, son derece problemlidir; ucuza kaçılmamalıdır.</p>
                      <p>• <strong>Üstten Uygulama:</strong> Buhar havadan ağırdır; alttan uygulanamaz, üstten çıtaların üzerine konur. 2 gün boyunca kovan içine yayılarak ciddi akar döker.</p>
                    </div>
                  )}
                  {acidType === "oxalic" && (
                    <div className="text-amber-900 space-y-1.5 text-[11px] leading-relaxed">
                      <p>• <strong>Hava Sıcaklığı:</strong> Kışın <strong>0°C - 5°C</strong> olmalıdır; fazlası olursa arıya zarar verir. Yavrunun en az olduğu veya bittiği tarihte kullanılır.</p>
                      <p>• <strong>Gliserinli Mendil:</strong> Doğal gliserinle karıştırılıp mendile emdirilir. Arılar mendili kemirip parçalayarak kovan dışına atmaya çalışırken temasla tüm kovana yayar.</p>
                      <p>• <strong>Sürekli Kullanılmaz:</strong> Devamlı kullanılırsa arının ağız ve sindirim sistemine zarar verir. Yılda 1 defa yavrusuz kış salkımında yapılmalıdır.</p>
                    </div>
                  )}
                  {acidType === "essential" && (
                    <div className="text-amber-900 space-y-1.5 text-[11px] leading-relaxed">
                      <p>• <strong>Emülsiyon Kuralı:</strong> Yağlar şerbete doğrudan katıldığında yüzeyde toplanır. Önce yarım çay bardağı suda 1 tatlı kaşığı organik elma sirkesi ile çalkalanıp emülsifiye edilmelidir.</p>
                      <p>• <strong>Körük Dumanı:</strong> Kuru kekik ve defne yaprağı körüğe eklendiğinde arıları sakinleştirirken akarları sersemletir.</p>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-rose-950 space-y-1">
                    <p className="font-bold text-rose-900">İş Sağlığı ve Güvenliği Uyarısı:</p>
                    <p>
                      Formik asit ve oksalik asit buharı yakıcıdır ve solunması akciğerlere zarar verir. Uygulama esnasında mutlaka <strong>asit filtreli gaz maskesi</strong>, <strong>kimyasal koruyucu gözlük</strong> ve <strong>aside dayanıklı eldiven</strong> takınız!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. SYRUP DOSAGE CALCULATOR */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Şerbet Hazırlama & Su/Şeker Oranı Hesaplayıcı
                  </h3>
                  <p className="text-xs text-stone-500">İlkbahar teşvik ve sonbahar kışlatma beslemesi</p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1.5">Şerbet Tipi Seçin</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSyrupType("1:1")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        syrupType === "1:1"
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-stone-50 text-stone-800 border-stone-200"
                      }`}
                    >
                      <span className="font-black text-sm block">1 : 1 İlkbahar Şerbeti</span>
                      <span className="text-[11px] opacity-85 mt-0.5 block">
                        Yavru teşviki & petek kabartma
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSyrupType("2:1")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        syrupType === "2:1"
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-stone-50 text-stone-800 border-stone-200"
                      }`}
                    >
                      <span className="font-black text-sm block">2 : 1 Sonbahar Şerbeti</span>
                      <span className="text-[11px] opacity-85 mt-0.5 block">
                        Kış stoku & hızlı sırlama
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Beslenecek Kovan Sayısı</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={syrupHives}
                      onChange={(e) => setSyrupHives(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Kovan Başı Verilecek Şerbet (Litre)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={syrupLitersPerHive}
                      onChange={(e) => setSyrupLitersPerHive(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-xl border border-amber-300 shadow-2xs">
              <span className="text-xs font-bold text-amber-900 block mb-2">
                Gereken Toplam Malzeme (Toplam {totalVolumeWanted.toFixed(1)} Litre Şerbet İçin):
              </span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white rounded-lg border border-amber-200 shadow-2xs">
                  <span className="text-stone-500 text-xs block">Toz Şeker</span>
                  <span className="text-xl font-black text-amber-900">{sugarKg} kg</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200 shadow-2xs">
                  <span className="text-stone-500 text-xs block">Temiz İçme Suyu</span>
                  <span className="text-xl font-black text-blue-900">{waterLiters} Litre</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                💡 <strong>Kritik Uyarı:</strong> Şekeri asla kaynayan suyun içinde kaynatmayın
                (HMF toksisitesi oluşur). Suyu kaynatıp ocaktan alın, 50°C'ye gelince şekeri ekleyip
                karıştırarak eritin. Ekşimeyi önlemek için litreye 1 çay kaşığı limon suyu ekleyin.
              </p>
            </div>
          </div>

          {/* 2. BEE CANDY (ARI KEKİ) CALCULATOR */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Kış ve Bahar Arı Keki (Fondan) Formülü
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sıvı besleme yapılamayan soğuk havalarda çerçeve üzerine konulan kek
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Üretmek İstediğiniz Arı Keki Miktarı (kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={candyBatches}
                    onChange={(e) => setCandyBatches(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between font-medium text-stone-800">
                    <span>Saf Pudra Şekeri (Nişastasız):</span>
                    <span className="font-bold">{(candyBatches * 0.75).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between font-medium text-stone-800">
                    <span>Koyu İnvert Şurup veya Güvenli Süzme Bal:</span>
                    <span className="font-bold">{(candyBatches * 0.22).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between font-medium text-stone-800">
                    <span>Ilık Su + Limon Suyu:</span>
                    <span className="font-bold">{(candyBatches * 0.03 * 1000).toFixed(0)} ml</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Organic Acid Safety Table */}
            <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1">
                <Thermometer className="w-4 h-4 text-rose-600" />
                <span>Organik Asit (Varroa) Sıcaklık Emniyet Eşiği</span>
              </div>
              <ul className="list-disc list-inside text-rose-800 space-y-1 text-[11px] leading-relaxed">
                <li>
                  <strong>Formik Asit:</strong> 15°C ile 25°C arası uygulanır. 25°C üstünde buharlaşma
                  patlaması yapar; ana arı kaybı ve yavru ölümü gerçekleşir!
                </li>
                <li>
                  <strong>Oksalik Asit:</strong> Kışın kovan yavrusuzken (Kasım-Ocak), hava 4°C - 10°C
                  arasındayken sublimasyon veya ılık şerbet damlatma ile uygulanır.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
