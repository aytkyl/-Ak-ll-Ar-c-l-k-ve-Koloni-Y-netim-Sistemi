import React, { useState, useMemo } from "react";
import {
  Stethoscope,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Leaf,
  Bug,
  HeartPulse,
  Layers,
  Droplets,
  Flame,
  ShieldCheck,
  Thermometer,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Search,
  HelpCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  X,
  Award,
  Crown,
  MapPin,
  TrendingUp,
  BarChart3,
  Filter,
  Compass,
  AlertOctagon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  BEE_DISEASES_DATA,
  SYMPTOM_CHECKER_LIST,
  COMMON_TREATMENT_OPTIONS,
  DISEASE_HEATMAP_DATA,
  REGIONAL_DISEASE_RISKS,
  DiseaseHeatmapRow,
  HeatmapMonthCell,
  RegionalDiseaseRisk,
  MONTH_NAMES,
  FULL_MONTH_NAMES,
} from "../data/diseasesData";
import { BeeDiseaseInfo, TreatmentRecord, Hive } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomHeatmapTrendTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 text-xs space-y-2 max-w-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="font-black text-rose-400 text-sm">{data.fullName} Tehdit Raporu</span>
          <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-800">
            İndeks: {data.totalRiskIndex}/100
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-stone-300">Toplam Tehdit:</span>
            <span className="font-bold text-rose-300">{data.totalRiskIndex} puan</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-amber-300">Parazit & Güve:</span>
            <span className="font-bold text-amber-400">{data.pestRisk} puan</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Yavru & Petek:</span>
            <span className="font-bold text-stone-200">{data.broodRisk} puan</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Yetişkin & Nosema:</span>
            <span className="font-bold text-stone-200">{data.adultRisk} puan</span>
          </div>
        </div>
        {data.varroaScore >= 3 && (
          <div className="text-[10px] text-amber-200 bg-amber-950/60 p-1.5 rounded-lg border border-amber-800/60">
            ⚠️ <strong>Varroa Alarmı:</strong> Bu ayda akar baskısı kritik seviyede!
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface PetekHealthTreatmentViewProps {
  hives: Hive[];
  treatments: TreatmentRecord[];
  onAddTreatment: (record: TreatmentRecord) => void;
  onUpdateTreatment?: (record: TreatmentRecord) => void;
  onDeleteTreatment: (id: string) => void;
  onOpenAiAssistantWithPrompt?: (prompt: string) => void;
}

export const PetekHealthTreatmentView: React.FC<PetekHealthTreatmentViewProps> = ({
  hives,
  treatments,
  onAddTreatment,
  onDeleteTreatment,
  onOpenAiAssistantWithPrompt,
}) => {
  // Main Subtabs
  const [activeSubTab, setActiveSubTab] = useState<
    "heatmap" | "atlas" | "comb_care" | "dosing" | "treatment_log" | "checker"
  >("heatmap");

  // --- HEATMAP & REGIONAL RISK STATES ---
  const [heatmapMode, setHeatmapMode] = useState<"matrix" | "regional" | "trend">("matrix");
  const [heatmapCategoryFilter, setHeatmapCategoryFilter] = useState<
    "all" | "brood" | "pest" | "adult" | "comb_disorder"
  >("all");
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    row: DiseaseHeatmapRow;
    cell: HeatmapMonthCell;
  } | null>(() => {
    const defaultRow = DISEASE_HEATMAP_DATA[0]; // Varroa
    const currentM = new Date().getMonth(); // Current month index
    return { row: defaultRow, cell: defaultRow.months[currentM] || defaultRow.months[8] };
  });
  const [selectedRegionId, setSelectedRegionId] = useState<string>("ege");
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | "all">("all");

  // --- ATLAS STATES ---
  const [diseaseSearch, setDiseaseSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "brood" | "pest" | "adult" | "comb_disorder"
  >("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>("varroa");

  // --- SYMPTOM CHECKER STATES ---
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  // --- COMB INSPECTION WIZARD STATES ---
  const [combAge, setCombAge] = useState<"new" | "mid" | "old">("mid");
  const [broodPattern, setBroodPattern] = useState<"compact" | "mosaic" | "sunken" | "drone_lay">("compact");
  const [larvaeColor, setLarvaeColor] = useState<"pearly" | "yellow" | "sac" | "chalk" | "ropy">("pearly");
  const [infestationSign, setInfestationSign] = useState<"none" | "webbing" | "ferment" | "mites" | "head_in_cells">("none");
  const [combOdor, setCombOdor] = useState<"honey_fresh" | "sour_vinegar" | "fish_glue" | "moldy">("honey_fresh");

  // --- COMB ROTATION CALCULATOR STATES ---
  const [totalHivesCount, setTotalHivesCount] = useState<number>(hives.length || 10);
  const [framesPerHive, setFramesPerHive] = useState<number>(10);

  // --- DOSING CALCULATOR STATES ---
  const [calcAcidType, setCalcAcidType] = useState<"formic" | "oxalic_glycerin" | "oxalic_sublimation" | "oxalic_trickle" | "lactic" | "thymol" | "sulfur">("formic");
  const [dosingHivesCount, setDosingHivesCount] = useState<number>(hives.length || 10);
  const [currentAmbienceTemp, setCurrentAmbienceTemp] = useState<number>(19);
  const [depotVolumeM3, setDepotVolumeM3] = useState<number>(15);

  // --- TREATMENT LOG MODAL STATE ---
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState<boolean>(false);
  const [formHiveId, setFormHiveId] = useState<string>(hives[0]?.id || "");
  const [formDiseaseId, setFormDiseaseId] = useState<string>("varroa");
  const [formTreatmentPresetId, setFormTreatmentPresetId] = useState<string>("treat-formic-flash");
  const [formTreatmentName, setFormTreatmentName] = useState<string>("Formik Asit (%65 Buharlaştırma)");
  const [formTreatmentType, setFormTreatmentType] = useState<TreatmentRecord["treatmentType"]>("organic_acid");
  const [formDosage, setFormDosage] = useState<string>("Kovan başına 12 ml");
  const [formStartDate, setFormStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [formWithdrawalDays, setFormWithdrawalDays] = useState<number>(14);
  const [formNotes, setFormNotes] = useState<string>("");

  // Handle Preset Change
  const handleSelectPreset = (presetId: string) => {
    setFormTreatmentPresetId(presetId);
    const preset = COMMON_TREATMENT_OPTIONS.find((p) => p.id === presetId);
    if (preset) {
      setFormTreatmentName(preset.name);
      setFormTreatmentType(preset.type);
      setFormWithdrawalDays(preset.withdrawalDays);
      setFormDosage(preset.standardDosage);
    }
  };

  // Submit New Treatment
  const handleCreateTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHive = hives.find((h) => h.id === formHiveId);
    const targetDisease = BEE_DISEASES_DATA.find((d) => d.id === formDiseaseId);

    const start = new Date(formStartDate);
    const safeDate = new Date(start);
    safeDate.setDate(safeDate.getDate() + (Number(formWithdrawalDays) || 0));
    const safeHarvestDateStr = safeDate.toISOString().split("T")[0];

    const newRecord: TreatmentRecord = {
      id: `treat-${Date.now()}`,
      hiveId: formHiveId,
      hiveNumber: targetHive ? targetHive.hiveNumber : "Genel Koloni",
      diseaseId: formDiseaseId,
      diseaseName: targetDisease ? targetDisease.name : "Varroa & Petek Sağlığı",
      treatmentName: formTreatmentName,
      treatmentType: formTreatmentType,
      dosageDetails: formDosage,
      startDate: formStartDate,
      withdrawalDays: Number(formWithdrawalDays) || 0,
      safeHarvestDate: safeHarvestDateStr,
      status: "active",
      notes: formNotes,
      effectivenessRating: 5,
    };

    onAddTreatment(newRecord);
    setIsAddTreatmentModalOpen(false);
    setFormNotes("");
    setActiveSubTab("treatment_log");
  };

  // Filtered Diseases
  const filteredDiseases = useMemo(() => {
    return BEE_DISEASES_DATA.filter((d) => {
      if (selectedCategory !== "all" && d.category !== selectedCategory) return false;
      if (selectedSeverity !== "all" && d.severity !== selectedSeverity) return false;
      if (diseaseSearch.trim()) {
        const q = diseaseSearch.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchSci = d.scientificName.toLowerCase().includes(q);
        const matchOverview = d.overview.toLowerCase().includes(q);
        const matchSymp = d.combSymptoms.some((s) => s.toLowerCase().includes(q));
        const matchTreat = d.treatmentProtocol.organicTreatment.some((t) =>
          t.toLowerCase().includes(q)
        );
        if (!matchName && !matchSci && !matchOverview && !matchSymp && !matchTreat)
          return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSeverity, diseaseSearch]);

  // Symptom checker matches
  const matchedFromChecker = useMemo(() => {
    if (selectedSymptomIds.length === 0) return [];
    const diseaseScoreMap = new Map<string, number>();

    selectedSymptomIds.forEach((sId) => {
      const symp = SYMPTOM_CHECKER_LIST.find((s) => s.id === sId);
      if (symp) {
        if (symp.primaryMatch) {
          diseaseScoreMap.set(
            symp.primaryMatch,
            (diseaseScoreMap.get(symp.primaryMatch) || 0) + 3
          );
        }
        symp.possibleDiseases.forEach((dName) => {
          const matched = BEE_DISEASES_DATA.find((bd) =>
            dName.toLowerCase().includes(bd.name.toLowerCase().split(" ")[0])
          );
          if (matched) {
            diseaseScoreMap.set(
              matched.id,
              (diseaseScoreMap.get(matched.id) || 0) + 1
            );
          }
        });
      }
    });

    return Array.from(diseaseScoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({
        disease: BEE_DISEASES_DATA.find((d) => d.id === id)!,
        score,
      }))
      .filter((item) => item.disease);
  }, [selectedSymptomIds]);

  // Interactive Comb Inspection Result Evaluation
  const combEvaluation = useMemo(() => {
    const alerts: string[] = [];
    const diagnoses: string[] = [];
    let riskLevel: "Normal" | "Uyarı" | "Kritik" = "Normal";

    if (combAge === "old") {
      alerts.push("3 yıldan eski esmer petek: Hücre çapı daralmış, patojen ve spor deposudur. Yavru çıkışı bitince imha edilmelidir.");
      diagnoses.push("Eski Esmer Petek Dejenerasyonu");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    }

    if (broodPattern === "sunken") {
      alerts.push("Sırları delikli ve içeri çökmüş kapalı yavru gözleri! AYÇ, EYÇ veya ağır Varroa virüs yüküne işaret eder.");
      diagnoses.push("Amerikan / Avrupa Yavru Çürüklüğü Şüphesi");
      riskLevel = "Kritik";
    } else if (broodPattern === "drone_lay") {
      alerts.push("İşçi peteğinde kubbe gibi kambur erkek gözleri ve çeperlere dağılmış yumurtalar: Koloni yalancı anaya kaçmış.");
      diagnoses.push("Yalancı Anaya Kaçma (Laying Workers)");
      riskLevel = "Kritik";
    } else if (broodPattern === "mosaic") {
      alerts.push("Alacalı/mozaik yavru: Kraliçe yaşlı veya genetik akrabalık (inbreeding) ya da yavru üşümesi.");
      diagnoses.push("Düzensiz Kuluçka Deseni");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    }

    if (larvaeColor === "ropy") {
      alerts.push("Kahverengi peltemsi çürük: Kibrit çöpü testi yapınız! 2-3 cm uzuyorsa kesin AYÇ.");
      diagnoses.push("Amerikan Yavru Çürüklüğü (AYÇ)");
      riskLevel = "Kritik";
    } else if (larvaeColor === "yellow") {
      alerts.push("Açık gözde 'C' şeklini kaybetmiş sararmış kıvrık larva: Avrupa Yavru Çürüklüğü.");
      diagnoses.push("Avrupa Yavru Çürüklüğü (EYÇ)");
      riskLevel = "Kritik";
    } else if (larvaeColor === "chalk") {
      alerts.push("Tebeşir gibi taşlaşmış beyaz-gri mumyalar: Kireç hastalığı mantarı.");
      diagnoses.push("Kireç Hastalığı (Chalkbrood)");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    } else if (larvaeColor === "sac") {
      alerts.push("Kayık şeklinde başı yukarı kalkık, su dolu tulum larvası.");
      diagnoses.push("Tulumsu Yavru Çürüklüğü (Sacbrood - SBV)");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    }

    if (infestationSign === "webbing") {
      alerts.push("Beyaz ipeksi örümcek ağı tünelleri ve siyah toz: Balmumu güvesi tahribatı.");
      diagnoses.push("Balmumu Güvesi (Galleria mellonella)");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    } else if (infestationSign === "mites") {
      alerts.push("Petek gözlerinde susam büyüklüğünde kahverengi akarlar: Acil Varroa mücadelesi gerektirir.");
      diagnoses.push("Varroa Akarları İstilası");
      riskLevel = "Kritik";
    } else if (infestationSign === "head_in_cells") {
      alerts.push("Arılar kafalarını petek gözünün dibine sokmuş donup kalmış: Koloni AÇLIKTAN ölüyor!");
      diagnoses.push("Erken İlkbahar Açlığı & Soğuk Vurgunu");
      riskLevel = "Kritik";
    } else if (infestationSign === "ferment") {
      alerts.push("Köpüren, mayalanan ve çürümüş portakal kokan bal: Küçük kovan böceği riski!");
      diagnoses.push("Küçük Kovan Böceği (Aethina tumida)");
      riskLevel = "Kritik";
    }

    if (combOdor === "fish_glue") {
      alerts.push("Balık tutkalı veya çürümüş et kokusu: Ağır yavru çürüklüğü belirtisidir.");
      if (!diagnoses.includes("Amerikan Yavru Çürüklüğü (AYÇ)")) diagnoses.push("AYÇ Şüphesi");
      riskLevel = "Kritik";
    } else if (combOdor === "sour_vinegar") {
      alerts.push("Ekşi sirke ve maya kokusu: Avrupa Yavru Çürüklüğü veya mayalanan bal.");
      if (riskLevel === "Normal") riskLevel = "Uyarı";
    }

    return {
      riskLevel,
      diagnoses: Array.from(new Set(diagnoses)),
      alerts,
      isClean: diagnoses.length === 0,
    };
  }, [combAge, broodPattern, larvaeColor, infestationSign, combOdor]);

  // Filtered heatmap rows by category
  const filteredHeatmapRows = useMemo(() => {
    if (heatmapCategoryFilter === "all") return DISEASE_HEATMAP_DATA;
    return DISEASE_HEATMAP_DATA.filter((r) => r.category === heatmapCategoryFilter);
  }, [heatmapCategoryFilter]);

  // Selected region data
  const selectedRegion = useMemo(() => {
    return (
      REGIONAL_DISEASE_RISKS.find((r) => r.regionId === selectedRegionId) ||
      REGIONAL_DISEASE_RISKS[0]
    );
  }, [selectedRegionId]);

  // Monthly aggregated data for Recharts Trend curve
  const monthlyRiskTrendData = useMemo(() => {
    const shortMonths = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const fullMonths = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((mIdx) => {
      let totalRisk = 0;
      let varroaRisk = 0;
      let broodRisk = 0;
      let pestRisk = 0;
      let adultRisk = 0;

      DISEASE_HEATMAP_DATA.forEach((row) => {
        const sc = row.months[mIdx].score;
        totalRisk += sc;
        if (row.diseaseId === "varroa") varroaRisk = sc;
        if (row.category === "brood") broodRisk += sc;
        if (row.category === "pest") pestRisk += sc;
        if (row.category === "adult") adultRisk += sc;
      });

      return {
        monthIndex: mIdx,
        shortName: shortMonths[mIdx],
        fullName: fullMonths[mIdx],
        totalRiskIndex: Math.round(totalRisk * 2.8),
        varroaScore: varroaRisk,
        pestRisk,
        broodRisk,
        adultRisk,
      };
    });
  }, []);

  // Current Month index
  const currentMonthIdx = new Date().getMonth();

  // Today's Date for withdrawal comparison
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/60">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Petek & Arı Sağlığı Merkezi</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                18+ Detaylı Hastalık, Teşhis & Tedavi
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Organik Asit Reçeteleri & Hasat Güvenliği
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Petek & Arı Hastalıkları, Saha Teşhisi ve Tedavi Takvimi
            </h2>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              AYÇ, EYÇ, Varroa, Kireç, Tropilaelaps, Balmumu Güvesi, Nosema ve eski petek dejenerasyonlarına karşı
              uzman arıcılık standartlarında saha teşhis testleri, kimyasalsız organik asit protokolleri ve kovan bazlı tedavi takip günlüğü.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddTreatmentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 ring-2 ring-rose-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Tedavi Kaydı Başlat</span>
            </button>
            {onOpenAiAssistantWithPrompt && (
              <button
                onClick={() =>
                  onOpenAiAssistantWithPrompt(
                    "Peteklerimde şüpheli bir görüntü var. Amerikan Yavru Çürüklüğü, Varroa ve Mum Güvesi ayrımı için bana adım adım teşhis rehberi sun."
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Hızlı Danışman</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Subtab Navigation Bar */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab("heatmap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "heatmap"
                ? "bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white shadow-md ring-2 ring-amber-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>🔥 Hastalık Isı Haritası & Riskli Bölgeler</span>
            <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-black">
              12 Ay / 7 Bölge
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("atlas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "atlas"
                ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>1. Hastalık & Zararlı Atlası</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded-full text-[10px]">
              {BEE_DISEASES_DATA.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("comb_care")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "comb_care"
                ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Petek Muayenesi & Balmumu Hijyeni</span>
          </button>

          <button
            onClick={() => setActiveSubTab("dosing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "dosing"
                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>3. Organik Asit & İlaç Dozaj Hesaplayıcı</span>
          </button>

          <button
            onClick={() => setActiveSubTab("treatment_log")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "treatment_log"
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4. Kovan Tedavi Günlüğü & Hasat Takvimi</span>
            <span className="bg-blue-900/60 px-1.5 py-0.5 rounded-full text-[10px]">
              {treatments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("checker")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === "checker"
                ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-300"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>5. Hızlı Semptom Eşleştirici</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 0: HASTALIK ISI HARİTASI & BÖLGESEL RİSKLER (HEATMAP) */}
      {/* ========================================================================= */}
      {activeSubTab === "heatmap" && (
        <div className="space-y-6">
          {/* Top Control Bar & Mode Toggles */}
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
                    <Flame className="w-5 h-5 text-rose-600" />
                  </span>
                  <h3 className="text-lg font-black text-stone-900">
                    Arı Hastalıkları Yoğunluk Isı Haritası & Bölgesel Tehdit Analizi
                  </h3>
                </div>
                <p className="text-xs text-stone-600">
                  Aylara göre patojenlerin patlama yaptığı kritik dönemler, iklimsel tetikleyiciler ve Türkiye'nin 7 coğrafi bölgesindeki risk profili.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl self-start lg:self-center">
                <button
                  onClick={() => setHeatmapMode("matrix")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    heatmapMode === "matrix"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>12 Aylık Isı Matrisi (Grid)</span>
                </button>

                <button
                  onClick={() => setHeatmapMode("regional")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    heatmapMode === "regional"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Türkiye 7 Bölge Risk Haritası</span>
                </button>

                <button
                  onClick={() => setHeatmapMode("trend")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    heatmapMode === "trend"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Yıllık Tehdit Eğrisi (Recharts)</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills (if in matrix mode) */}
            {heatmapMode === "matrix" && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setHeatmapCategoryFilter("all")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      heatmapCategoryFilter === "all"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    Tüm Hastalıklar ({DISEASE_HEATMAP_DATA.length})
                  </button>
                  <button
                    onClick={() => setHeatmapCategoryFilter("pest")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      heatmapCategoryFilter === "pest"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    🕷️ Parazitler (Varroa, Güve, Eşek Arısı, Tropilaelaps)
                  </button>
                  <button
                    onClick={() => setHeatmapCategoryFilter("brood")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      heatmapCategoryFilter === "brood"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    🪺 Yavru & Petek (AYÇ, EYÇ, Kireç)
                  </button>
                  <button
                    onClick={() => setHeatmapCategoryFilter("adult")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      heatmapCategoryFilter === "adult"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    🐝 Yetişkin Hastalıkları (Nosema, Zehirlenme)
                  </button>
                  <button
                    onClick={() => setHeatmapCategoryFilter("comb_disorder")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      heatmapCategoryFilter === "comb_disorder"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    ⚠️ Kovan Afetleri (Açlık, Yağma)
                  </button>
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-600 bg-stone-50 px-3 py-1 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700">Isı Skalası:</span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-300" />
                    <span>0: Güvenli</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-emerald-200 border border-emerald-300" />
                    <span>1: Düşük</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-amber-200 border border-amber-300" />
                    <span>2: Orta</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-orange-500 border border-orange-600" />
                    <span>3: Yüksek</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-rose-600 border border-rose-700" />
                    <span>4: PİK KRİZ</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* MODE 1: 12-MONTH INTERACTIVE HEATMAP MATRIX GRID */}
          {heatmapMode === "matrix" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm overflow-hidden space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-600" />
                    <span>Aylık Hastalık Yoğunluk Matrisi (Hücreye Tıklayarak Detay İnceleyin)</span>
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    Mevcut Ay: <span className="text-rose-700 font-extrabold font-mono">Ekim ({MONTH_NAMES[currentMonthIdx]})</span>
                  </span>
                </div>

                {/* Heatmap Table Grid */}
                <div className="overflow-x-auto pb-2">
                  <table className="w-full min-w-[760px] text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-stone-200">
                        <th className="p-2.5 text-left font-black text-stone-800 w-64 bg-stone-50/70 rounded-l-xl">
                          Hastalık / Zararlı
                        </th>
                        <th className="p-2 text-left font-bold text-stone-600 w-36 bg-stone-50/70 hidden lg:table-cell">
                          Pik Dönemi
                        </th>
                        {MONTH_NAMES.map((mName, mIdx) => {
                          const isCurrent = mIdx === currentMonthIdx;
                          return (
                            <th
                              key={mIdx}
                              className={`p-2 text-center font-black ${
                                isCurrent
                                  ? "bg-rose-100 text-rose-950 border-x-2 border-rose-400"
                                  : "text-stone-700 bg-stone-50/70"
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span>{mName}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-extrabold text-rose-700 uppercase leading-none mt-0.5">
                                    Aktif
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredHeatmapRows.map((row) => (
                        <tr key={row.diseaseId} className="hover:bg-stone-50/60 transition-colors">
                          <td className="p-2.5 font-bold text-stone-900">
                            <div className="space-y-0.5">
                              <span className="block leading-tight">{row.name}</span>
                              <span className="text-[10px] font-semibold text-stone-500 block">
                                {row.categoryName}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-stone-600 font-medium text-[11px] hidden lg:table-cell">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold block truncate">
                              {row.peakPeriodText}
                            </span>
                          </td>
                          {row.months.map((cell) => {
                            const isSelected =
                              selectedHeatmapCell?.row.diseaseId === row.diseaseId &&
                              selectedHeatmapCell?.cell.monthIndex === cell.monthIndex;
                            const isCurrent = cell.monthIndex === currentMonthIdx;

                            return (
                              <td key={cell.monthIndex} className="p-1 text-center">
                                <button
                                  onClick={() => setSelectedHeatmapCell({ row, cell })}
                                  title={`${row.name} — ${cell.monthName}: ${cell.label}`}
                                  className={`w-full py-2.5 px-1 rounded-lg text-[11px] transition-all flex flex-col items-center justify-center border ${
                                    cell.colorClass
                                  } ${
                                    isSelected
                                      ? "ring-2 ring-stone-900 scale-105 shadow-md z-10 font-black"
                                      : "hover:scale-105"
                                  } ${isCurrent ? "font-black" : ""}`}
                                >
                                  <span>{cell.score === 0 ? "—" : cell.score}</span>
                                  {cell.score === 4 && (
                                    <span className="text-[8px] font-black uppercase leading-none tracking-tighter">
                                      PİK
                                    </span>
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Cell Inspection Drawer / Card */}
              {selectedHeatmapCell && (
                <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-rose-800/60 space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider">
                          Seçilen Hücre Analizi
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950">
                          {selectedHeatmapCell.cell.monthName} Ayı
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            selectedHeatmapCell.cell.score === 4
                              ? "bg-rose-500 text-white"
                              : selectedHeatmapCell.cell.score === 3
                              ? "bg-orange-500 text-white"
                              : selectedHeatmapCell.cell.score === 2
                              ? "bg-amber-400 text-stone-950"
                              : "bg-emerald-400 text-stone-950"
                          }`}
                        >
                          Tehdit Skoru: {selectedHeatmapCell.cell.score} / 4 ({selectedHeatmapCell.cell.label})
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-white mt-1">
                        {selectedHeatmapCell.row.name}
                      </h4>
                      <p className="text-xs text-rose-200">
                        Kategori: {selectedHeatmapCell.row.categoryName} | Genel Pik: {selectedHeatmapCell.row.peakPeriodText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setFormDiseaseId(selectedHeatmapCell.row.diseaseId);
                          setFormTreatmentName(`${selectedHeatmapCell.row.name} (${selectedHeatmapCell.cell.monthName} Müdahalesi)`);
                          setIsAddTreatmentModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Bu Ay İçin Tedavi Başlat</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    {/* Cause */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-amber-300">
                        <Thermometer className="w-4 h-4 text-amber-400" />
                        <span>Mevsimsel & İklimsel Tetikleyici:</span>
                      </div>
                      <p className="text-stone-200 leading-relaxed font-medium">
                        {selectedHeatmapCell.cell.seasonCause}
                      </p>
                    </div>

                    {/* Action Advice */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Usta Arıcı Acil Eylem Yönergesi:</span>
                      </div>
                      <p className="text-stone-200 leading-relaxed font-medium">
                        {selectedHeatmapCell.cell.actionAdvice}
                      </p>
                    </div>

                    {/* Riskiest Regions */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-rose-300">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>En Riskli Coğrafi Bölgeler:</span>
                      </div>
                      <ul className="text-stone-200 list-disc list-inside space-y-1 font-medium">
                        {selectedHeatmapCell.row.highestRiskRegions.map((reg, i) => (
                          <li key={i}>{reg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: TÜRKİYE 7 COĞRAFİ BÖLGE RİSK HARİTASI & PROFİLİ */}
          {heatmapMode === "regional" && (
            <div className="space-y-6">
              {/* Region Selector Pills */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <Compass className="w-4 h-4 text-rose-600" />
                    <span>Türkiye Coğrafi Bölgeleri Arı Sağlığı ve İklim Tehdit Profili</span>
                  </h4>
                  <span className="text-xs text-stone-500 font-semibold">
                    Bölge seçerek riskleri filtreleyin
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {REGIONAL_DISEASE_RISKS.map((reg) => {
                    const isSelected = selectedRegionId === reg.regionId;
                    return (
                      <button
                        key={reg.regionId}
                        onClick={() => setSelectedRegionId(reg.regionId)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all ${
                          isSelected
                            ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-400 scale-102"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{reg.regionName.split(" ")[0]} {reg.regionName.split(" ")[1]}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                            reg.overallThreatLevel === "Kritik"
                              ? "bg-rose-800 text-white"
                              : "bg-amber-500 text-stone-950"
                          }`}
                        >
                          {reg.overallThreatLevel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Region Detailed Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white">
                        {selectedRegion.overallThreatLevel} Tehdit Seviyesi
                      </span>
                      <span className="text-xs text-stone-500 font-semibold">
                        Kapsanan İller: {selectedRegion.provinces.join(", ")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">
                      {selectedRegion.regionName}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setFormDiseaseId("varroa");
                      setFormTreatmentName(`${selectedRegion.regionName} Bölgesel Kürü`);
                      setIsAddTreatmentModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Bu Bölge İçin Kovan İlaçlaması Başlat</span>
                  </button>
                </div>

                {/* Climate & Season Alert */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <span className="font-black text-amber-900 block flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-amber-600" />
                      <span>Bölgesel İklim ve Arıcılık Dinamiği:</span>
                    </span>
                    <p className="text-stone-700 leading-relaxed font-medium">
                      {selectedRegion.climateFactor}
                    </p>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                    <span className="font-black text-rose-950 block flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Kritik Bölgesel Uyarı & Sezon Alarmı:</span>
                    </span>
                    <p className="text-rose-900 leading-relaxed font-medium">
                      {selectedRegion.seasonalAlert}
                    </p>
                  </div>
                </div>

                {/* Top Risk Diseases in this Region */}
                <div className="space-y-3">
                  <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>{selectedRegion.regionName} İçin En Yıkıcı 3-4 Hastalık & Saha Çözümleri</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedRegion.topRiskDiseases.map((d, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="font-black text-stone-900 text-xs">
                              {d.diseaseName}
                            </h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                              Risk {d.riskScore}/4
                            </span>
                          </div>

                          <div className="text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded-md font-bold border border-amber-200">
                            Pik Dönemi: {d.riskiestMonths}
                          </div>

                          <p className="text-[11px] text-stone-600 leading-snug">
                            <strong>Neden:</strong> {d.regionalCause}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-200 text-[11px] text-emerald-950 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                          <span className="font-bold text-emerald-900 block mb-0.5">
                            🛡️ Tavsiye Edilen Çözüm:
                          </span>
                          <span className="leading-snug">{d.criticalSolution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: ANNUAL THREAT PROGRESSION CURVE (RECHARTS AREA CHART) */}
          {heatmapMode === "trend" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="font-black text-stone-900 text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-rose-600" />
                      <span>12 Aylık Arı Hastalıkları Toplam Tehdit Eğrisi (Recharts)</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      İlkbahar kuluçka genişlemesi (Nisan-Mayıs) ve Hasat sonu varroa/eşek arısı (Ağustos-Ekim) pik dalgaları
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-rose-600">
                      <span className="w-3 h-3 rounded-full bg-rose-600" />
                      <span>Kümülatif Tehdit İndeksi</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Parazit Riski (Varroa & Güve)</span>
                    </span>
                  </div>
                </div>

                {/* Recharts Area Chart */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyRiskTrendData}
                      margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorTotalRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorPest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="shortName"
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<CustomHeatmapTrendTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="totalRiskIndex"
                        name="Toplam Tehdit İndeksi"
                        stroke="#e11d48"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotalRisk)"
                      />
                      <Area
                        type="monotone"
                        dataKey="pestRisk"
                        name="Parazit & Zararlı Baskısı"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPest)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* October & Seasonal Action Plan Card */}
              <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-900 text-white uppercase tracking-wider">
                      Mevcut Ay ({MONTH_NAMES[currentMonthIdx]} - Sonbahar Kışı Hazırlığı)
                    </span>
                    <h4 className="text-xl font-black text-white">
                      Bu Ayın 3 Kritik Tehlikesi & Kovan Eylem Planı
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setFormDiseaseId("varroa");
                      setFormTreatmentName("Ekim Ayı Kış Öncesi Varroa & Kışlatma Kürü");
                      setIsAddTreatmentModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-black text-xs shadow-md shrink-0 transition-transform active:scale-95"
                  >
                    Ekim Ayı Tedavisini Kaydet →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
                    <span className="font-black text-amber-200 block">1. Varroa İkinci İlaçlaması:</span>
                    <p className="text-white leading-relaxed">
                      Kuluçka alanı hızla küçülmektedir. Kış arılarının sağlıklı kışlaması için Oksalik asit veya Formik asit son seanslarını hava 12°C üzerindeyken tamamlayın.
                    </p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
                    <span className="font-black text-amber-200 block">2. Eşek Arısı & Yağmacılık:</span>
                    <p className="text-white leading-relaxed">
                      Nektar akımı durduğu için güçlü kovanlar zayıfları basar. Kovan uçuş deliklerini tek arı geçecek kadar (1 cm) daraltın; bira tuzaklarını dolu tutun.
                    </p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
                    <span className="font-black text-amber-200 block">3. Kışlatma Daraltması & Bal Stoku:</span>
                    <p className="text-white leading-relaxed">
                      Arının sarmadığı boş petekleri alın, bölme tahtasıyla sıkıştırın. Her kovanda en az 15-20 kg kapalı sırlı bal kemeri bulundurun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 1: HASTALIK & ZARARLI ATLASI (ATLAS) */}
      {/* ========================================================================= */}
      {activeSubTab === "atlas" && (
        <div className="space-y-6">
          {/* Search, Severity & Category Filters */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Hastalık adı, semptom, organik asit veya test ara..."
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 self-start md:self-center text-xs">
                <span className="text-stone-500 font-bold">Tehlike Derecesi:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 font-bold text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="all">Tüm Risk Seviyeleri</option>
                  <option value="Kritik (Acil İhbar)">Kritik (Acil İhbar)</option>
                  <option value="Yüksek Tehlike">Yüksek Tehlike</option>
                  <option value="Orta Risk">Orta Risk</option>
                </select>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Tümü ({BEE_DISEASES_DATA.length})
              </button>
              <button
                onClick={() => setSelectedCategory("brood")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === "brood"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                🪺 Yavru & Petek Hastalıkları (AYÇ, EYÇ, Kireç, Taş, SBV)
              </button>
              <button
                onClick={() => setSelectedCategory("pest")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === "pest"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                🕷️ Parazit & Zararlılar (Varroa, Tropilaelaps, Güve, Eşek Arısı)
              </button>
              <button
                onClick={() => setSelectedCategory("adult")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === "adult"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                🐝 Yetişkin Arı Hastalıkları (Nosema, Felç, DWV, Zehirlenme)
              </button>
              <button
                onClick={() => setSelectedCategory("comb_disorder")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === "comb_disorder"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                ⚠️ Petek & Kovan Afetleri (Eski Petek, Yalancı Ana, Çökme, Açlık)
              </button>
            </div>
          </div>

          {/* Disease Cards List */}
          <div className="space-y-4">
            {filteredDiseases.map((disease) => {
              const isExpanded = expandedDiseaseId === disease.id;
              return (
                <div
                  id={`atlas-disease-${disease.id}`}
                  key={disease.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? "border-rose-400 shadow-md ring-1 ring-rose-400/30"
                      : "border-stone-200 hover:border-rose-300 shadow-2xs"
                  }`}
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => setExpandedDiseaseId(isExpanded ? null : disease.id)}
                    className={`p-5 cursor-pointer flex items-start justify-between gap-4 transition-colors ${
                      isExpanded ? "bg-rose-50/50 border-b border-rose-100" : "hover:bg-stone-50"
                    }`}
                  >
                    <div className="space-y-1.5">
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
                          <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300">
                            ⚖️ {disease.legalStatus}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-stone-900 mt-1">
                        {disease.name}
                      </h4>
                      <p className="text-xs text-stone-500 italic">
                        Bilimsel Sınıflandırma: {disease.scientificName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormDiseaseId(disease.id);
                          setFormTreatmentName(`${disease.name} Müdahalesi`);
                          setIsAddTreatmentModalOpen(true);
                        }}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
                        title="Bu hastalık için tedavi kaydı aç"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tedavi Başlat</span>
                      </button>

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

                  {/* Expanded Disease Details */}
                  {isExpanded && (
                    <div className="p-6 space-y-6 text-xs">
                      {/* Overview */}
                      <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-stone-800 leading-relaxed text-sm">
                        {disease.overview}
                      </div>

                      {/* Symptoms Grid: Comb vs Bee */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Comb Symptoms */}
                        <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                          <h5 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-stone-100">
                            <Layers className="w-4 h-4 text-amber-600" />
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

                        {/* Bee & Colony Symptoms */}
                        <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                          <h5 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-stone-100">
                            <Bug className="w-4 h-4 text-amber-600" />
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

                      {/* Rapid Field Test */}
                      {disease.rapidFieldTest && (
                        <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-black text-xs text-rose-900">
                            <FlaskConical className="w-4 h-4 text-rose-600" />
                            <span>Usta Arıcı Hızlı Saha Teşhis Testi:</span>
                          </div>
                          <p className="text-xs leading-relaxed text-rose-900 font-medium">
                            {disease.rapidFieldTest}
                          </p>
                        </div>
                      )}

                      {/* Complete Treatment Protocols */}
                      <div className="space-y-4 pt-2 border-t border-stone-200">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-black text-stone-900 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Müdahale, Tedavi & Dezenfeksiyon Protokolü</span>
                          </h5>
                          <button
                            onClick={() => {
                              setFormDiseaseId(disease.id);
                              setFormTreatmentName(`${disease.name} Müdahalesi`);
                              setIsAddTreatmentModalOpen(true);
                            }}
                            className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                          >
                            <span>Bu Tedaviyi Kovana Uygula</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Urgent Action Steps */}
                          <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 space-y-2">
                            <h6 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>1. İlk ve Acil Eylem Adımları</span>
                            </h6>
                            <ul className="space-y-1.5 text-rose-950 list-disc list-inside text-xs leading-relaxed">
                              {disease.treatmentProtocol.urgentActionSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Organic Treatments */}
                          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2">
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
                          <div className="p-3.5 bg-red-100 rounded-xl border border-red-300 text-red-950 text-xs space-y-1">
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
                            <LightbulbIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: PETEK MUAYENESİ, KUSUR TEŞHİSİ & BALMUMU YÖNETİMİ (COMB_CARE) */}
      {/* ========================================================================= */}
      {activeSubTab === "comb_care" && (
        <div className="space-y-6">
          {/* Interactive Comb Inspection & Diagnostic Wizard */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-amber-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  🪺 İnteraktif Petek Sağlık Sihirbazı
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  Petek Muayene Semptomları ile Hızlı Teşhis
                </h3>
                <p className="text-xs text-stone-600">
                  Kovanı açtığınızda peteğin rengi, kuluçka deseni, larvaların rengi ve koku gibi özellikleri işaretleyin; sistem anında risk analizi ve tedavi adımlarını çıkarsın.
                </p>
              </div>
              <button
                onClick={() => {
                  setCombAge("new");
                  setBroodPattern("compact");
                  setLarvaeColor("pearly");
                  setInfestationSign("none");
                  setCombOdor("honey_fresh");
                }}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>
            </div>

            {/* Checkpoint Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {/* 1. Comb Age & Color */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-stone-900 block">
                  1. Petek Rengi & Kullanım Yaşı:
                </label>
                <select
                  value={combAge}
                  onChange={(e) => setCombAge(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="new">Taze Açık Sarı / Beyaz (1. Yıl - Kusursuz)</option>
                  <option value="mid">Açık Kahverengi (2. Yıl - Standart Kuluçkalık)</option>
                  <option value="old">Zift Siyahı / Taşlaşmış (3+ Yıl - Kritik Riskli)</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Eski esmer peteklerin hücre çapı küçülür ve yavru hastalık sporları birikir.
                </p>
              </div>

              {/* 2. Brood Pattern */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-stone-900 block">
                  2. Yavru & Sırlanma Düzeni:
                </label>
                <select
                  value={broodPattern}
                  onChange={(e) => setBroodPattern(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="compact">Kusursuz Kompakt (Duvardan duvara sıkı sır)</option>
                  <option value="mosaic">Alacalı / Mozaik (Gözler arası dağınık boşluklar)</option>
                  <option value="sunken">Sırlar Delikli, İçeri Çökmüş & Yağlı (AYÇ/EYÇ)</option>
                  <option value="drone_lay">Kambur Kubbeli Erkek Gözleri (Yalancı Ana)</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Kapalı gözlerin içbükeyleşip delinmesi bakteriyel çürüklüklerin ilk işaretidir.
                </p>
              </div>

              {/* 3. Larvae Color & Texture */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-stone-900 block">
                  3. Açık Larva Rengi & Kıvamı:
                </label>
                <select
                  value={larvaeColor}
                  onChange={(e) => setLarvaeColor(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="pearly">Sedef Beyazı Parlak 'C' (Sağlıklı Canlı Larva)</option>
                  <option value="yellow">Donuk Sarı / Bükülmüş Larva (EYÇ Belirtisi)</option>
                  <option value="sac">Su Dolu Tulum / Kayık Şeklinde (SBV Virüsü)</option>
                  <option value="chalk">Beyaz/Gri Tebeşir Mumyası (Kireç Hastalığı)</option>
                  <option value="ropy">Koyu Kahve Yapışkan Sakız (Kibrit Testi Uzuyor - AYÇ)</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Sağlıklı larva parlak sedef beyazıdır; sararma veya kuruma hastalık habercisidir.
                </p>
              </div>

              {/* 4. Infestation & Structural Defects */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-stone-900 block">
                  4. İstila, Tünel & Petek Kusuru:
                </label>
                <select
                  value={infestationSign}
                  onChange={(e) => setInfestationSign(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="none">Sorun Yok (Petek düzgün & sağlam)</option>
                  <option value="webbing">Beyaz İpeksi Tüneller & Ağlar (Balmumu Güvesi)</option>
                  <option value="mites">Hücrelerde Susam Büyüklüğünde Akarlar (Varroa)</option>
                  <option value="head_in_cells">Arılar Kafalarını Gözlere Gömmüş (Açlık Donması)</option>
                  <option value="ferment">Bal Mayalanmış & Köpürüyor (Küçük Kovan Böceği)</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Boş bırakılan petekler sıcakta güve larvaları tarafından hızla tahrip edilir.
                </p>
              </div>

              {/* 5. Comb Odor */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-stone-900 block">
                  5. Kovan Kapağı Açıldığında Koku:
                </label>
                <select
                  value={combOdor}
                  onChange={(e) => setCombOdor(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="honey_fresh">Taze Bal, Propolis ve Balmumu Kokusu (Sağlıklı)</option>
                  <option value="fish_glue">Balık Tutkalı / Çürümüş Et Kokusu (Ağır AYÇ)</option>
                  <option value="sour_vinegar">Ekşi Sirke ve Maya Kokusu (EYÇ veya Mayalı Bal)</option>
                  <option value="moldy">Küflü Rutubet Kokusu (Taş / Kireç / Nem)</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Kovan kokusu muayenede en keskin erken uyarı göstergesidir.
                </p>
              </div>

              {/* Instant Evaluation Card */}
              <div
                className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  combEvaluation.riskLevel === "Kritik"
                    ? "bg-rose-50 border-rose-300 text-rose-950"
                    : combEvaluation.riskLevel === "Uyarı"
                    ? "bg-amber-50 border-amber-300 text-amber-950"
                    : "bg-emerald-50 border-emerald-300 text-emerald-950"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                    <span className="font-extrabold text-xs">Petek Sağlık Durumu:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        combEvaluation.riskLevel === "Kritik"
                          ? "bg-rose-600 text-white"
                          : combEvaluation.riskLevel === "Uyarı"
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {combEvaluation.riskLevel}
                    </span>
                  </div>

                  {combEvaluation.isClean ? (
                    <div className="pt-2 space-y-1">
                      <p className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Kusursuz ve Sağlıklı Petek Yapısı</span>
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Belirtilen parametrelerde herhangi bir patoloji tespit edilmedi. Standart bakıma devam ediniz.
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 space-y-1">
                      <span className="font-bold text-[11px] block">Olası Teşhisler:</span>
                      <ul className="list-disc list-inside font-bold text-xs space-y-0.5">
                        {combEvaluation.diagnoses.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {!combEvaluation.isClean && (
                  <button
                    onClick={() => {
                      setActiveSubTab("treatment_log");
                      setIsAddTreatmentModalOpen(true);
                      setFormTreatmentName(`${combEvaluation.diagnoses[0] || "Petek"} Müdahalesi`);
                    }}
                    className="mt-3 w-full py-1.5 px-3 bg-stone-900 text-white rounded-xl font-bold text-[11px] hover:bg-stone-800 transition-colors shadow-2xs flex items-center justify-center gap-1"
                  >
                    <span>Tedavi Kaydına Ekle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Diagnostic Alert List */}
            {combEvaluation.alerts.length > 0 && (
              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-2">
                <h5 className="font-black text-rose-950 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Saha Muayenesi Kritik Bulguları & Eylem Yönergeleri:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-rose-900 list-disc list-inside font-medium leading-relaxed">
                  {combEvaluation.alerts.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 2: Comb Hygiene, Wax Moth Defense & Rotation Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Golden 30% Rotation Rule & Calculator */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  %30
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm">
                    Altın %30 Petek Rotasyon Kuralı & Hesaplayıcı
                  </h4>
                  <p className="text-xs text-stone-500">
                    Kovan sağlığı için hiçbir petek kuluçkalıkta 3 yıldan eski tutulamaz!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-stone-600 font-bold block mb-1">Kovan Sayınız:</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={totalHivesCount}
                    onChange={(e) => setTotalHivesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-stone-600 font-bold block mb-1">Kovan Başı Çıta:</label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={framesPerHive}
                    onChange={(e) => setFramesPerHive(Math.max(5, Number(e.target.value)))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-stone-700">
                  <span>Toplam Kuluçkalık Çerçeve:</span>
                  <span className="font-black text-stone-900">{totalHivesCount * framesPerHive} Adet</span>
                </div>
                <div className="flex justify-between items-center text-amber-900">
                  <span className="font-bold">Yıllık Eritilecek Eski Petek (%30):</span>
                  <span className="font-black text-base text-amber-700">
                    {Math.round(totalHivesCount * framesPerHive * 0.3)} Adet
                  </span>
                </div>
                <div className="flex justify-between items-center text-emerald-900">
                  <span className="font-bold">Gereken Yeni Ham Petek:</span>
                  <span className="font-black text-emerald-700">
                    {Math.round(totalHivesCount * framesPerHive * 0.3)} Tabaka (~{(totalHivesCount * framesPerHive * 0.3 * 0.08).toFixed(1)} kg)
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600 pt-1 border-t border-amber-200">
                  <span>Tahmini Geri Kazanılacak Saf Balmumu:</span>
                  <span className="font-bold">
                    ~{(totalHivesCount * framesPerHive * 0.3 * 0.12).toFixed(1)} kg
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                💡 <strong>Uygulama İpucu:</strong> Her ilkbaharda kenarlara kaydırdığınız koyu çerçeveleri yavru çıkınca alın. Çıtaların üst kulağına tükenmez veya kurşun kalemle yılı yazın (ör: <strong>2026</strong>).
              </p>
            </div>

            {/* Wax Moth (Balmumu Güvesi) Prevention Protocols */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm">
                    Mum Güvesine Karşı %100 Organik Koruma Yöntemleri
                  </h4>
                  <p className="text-xs text-stone-500">
                    Asla Naftalin Kullanmayın! Kanserojendir ve bala geçer.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Derin Dondurucu Şoklama (-18°C)</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-snug">
                    Depoya kaldırılacak tüm petekler 24 saat derin dondurucuda tutulursa tüm güve yumurta, larva ve pupaları anında ölür. Ardından hava alan telli sandıklarda saklanır.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Biyolojik Bakteri (Bacillus thuringiensis - B401)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Suyla seyreltilip petek yüzeyine püskürtülen doğal bakteri sporu, sadece güve kurtçuklarının midesini deler; arıya, bala ve insana %100 zararsızdır.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-amber-600" />
                    <span>3. Asetik Asit (%80 Sirke Asidi) Buharı</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Üst üste dizilen ballıkların en üstüne tabak içinde konulur. Ağır buhar aşağı çökerek hem güveyi hem de Nosema sporlarını tamamen yok eder.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Drone Brood Trapping Guide & Wood Disinfection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drone Brood Varroa Trapping */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-3">
              <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Erkek Arı Petek Tuzağı (Biyolojik Varroa İmhası)</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Varroa akarları, erkek arı gözlerinin kuluçka süresi daha uzun (24 gün) olduğu için erkek gözlerini işçi gözlerine göre <strong>8 kat daha fazla</strong> tercih eder.
              </p>
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <p className="font-bold text-emerald-900">Uygulama Aşamaları:</p>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                  <li>İlkbaharda kuluçkalığın 2 veya 9. sırasına kılavuz çıta veya boş çıta verin.</li>
                  <li>İşçiler alt kısma doğal olarak erkek arı gözleri örecek ve ana arı dölsüz yumurta atacaktır.</li>
                  <li>Gözler tamamen sırlandığı anda (larvalar henüz çıkmadan) petek altını bıçakla kesin ve eritin.</li>
                  <li>Bu tek işlemle kovandaki akarların %60-70'i kimyasalsız yok edilmiş olur!</li>
                </ol>
              </div>
            </div>

            {/* Hive & Frame Disinfection with Caustic Soda & Torch */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <span>Ahşap Kovan ve Çerçeve Sterilizasyonu</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Amerikan Yavru Çürüklüğü sporları ve Nosema kistleri ahşap gözeneklerinde 40 yıl canlı kalabilir. Standart yıkama yeterli değildir.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block">🔥 Pürmüz ile Dağlama:</span>
                  <span className="text-stone-600 text-[11px]">
                    Boş kovan gövdesi, tabanı ve kapağı pürmüz aleviyle ahşap hafif kahverengi kavrulma rengi alana kadar yakılır.
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block">🧪 %4 Kostik Soda (Sodyum Hidroksit):</span>
                  <span className="text-stone-600 text-[11px]">
                    Kaynar suda eritilen %4 kostik soda ile kirli çerçeveler 15 dakika haşlanır. Tüm propolis, eski mum ve sporlar sökülür, ahşap ilk günkü gibi parlar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: ORGANİK ASİT & İLAÇ DOZAJ HESAPLAYICI (DOSING) */}
      {/* ========================================================================= */}
      {activeSubTab === "dosing" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    Organik Asit ve Doğal İlaç Saha Dozaj Hesaplayıcısı
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sıcaklık kısıtlamaları, seyreltme oranları ve kovan başı güvenli mililitre hesapları
                  </p>
                </div>
              </div>

              {/* Acid Selector Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => setCalcAcidType("formic")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "formic"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Formik Asit (%65)
                </button>
                <button
                  onClick={() => setCalcAcidType("oxalic_glycerin")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "oxalic_glycerin"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Oksalik + Gliserin Şerit
                </button>
                <button
                  onClick={() => setCalcAcidType("oxalic_sublimation")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "oxalic_sublimation"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Oksalik Buhar (Kış)
                </button>
                <button
                  onClick={() => setCalcAcidType("oxalic_trickle")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "oxalic_trickle"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Oksalik Damlatma
                </button>
                <button
                  onClick={() => setCalcAcidType("lactic")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "lactic"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Laktik Asit (%15)
                </button>
                <button
                  onClick={() => setCalcAcidType("thymol")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "thymol"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Timol & Kekik
                </button>
                <button
                  onClick={() => setCalcAcidType("sulfur")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    calcAcidType === "sulfur"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Kükürt Fitili (Depo)
                </button>
              </div>
            </div>

            {/* Inputs: Hives count and temp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <label className="font-bold text-stone-700 block">Uygulanacak Kovan Sayısı:</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={dosingHivesCount}
                  onChange={(e) => setDosingHivesCount(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-black text-stone-900"
                />
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <label className="font-bold text-stone-700 block">Arılık Sıcaklığı (°C):</label>
                <input
                  type="number"
                  min={-15}
                  max={45}
                  value={currentAmbienceTemp}
                  onChange={(e) => setCurrentAmbienceTemp(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-black text-stone-900"
                />
              </div>

              {calcAcidType === "sulfur" ? (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                  <label className="font-bold text-stone-700 block">Petek Deposu Hacmi (m³):</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={depotVolumeM3}
                    onChange={(e) => setDepotVolumeM3(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-black text-stone-900"
                  />
                </div>
              ) : (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col justify-center">
                  <span className="font-bold text-stone-500">Bal Hasat Bekleme Süresi:</span>
                  <span className="font-black text-sm text-stone-900 mt-1">
                    {calcAcidType === "formic"
                      ? "14 Gün (Bal akımında uygulanmaz)"
                      : calcAcidType === "thymol"
                      ? "21 Gün (Koku geçişi riski)"
                      : "0 Gün (Kalıntısız Doğal Bileşen)"}
                  </span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            {calcAcidType === "formic" && (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-black text-emerald-950 text-sm">
                    %65 Formik Asit Yavaş Buharlaştırma Protokolü
                  </h4>
                  {currentAmbienceTemp >= 12 && currentAmbienceTemp <= 25 ? (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black">
                      ✓ Sıcaklık Uygulama İçin İdeal (12-25°C)
                    </span>
                  ) : currentAmbienceTemp > 25 ? (
                    <span className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-black">
                      ⚠️ DİKKAT: 25°C üstünde buharlaşma arı ve ana öldürebilir!
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-black">
                      ⚠️ 12°C altında buharlaşma yetersiz kalır.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-stone-500 font-bold block">Kovan Başı Günlük:</span>
                    <span className="text-base font-black text-emerald-900">12 - 15 ml</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-stone-500 font-bold block">Toplam 1 Uygulama İhtiyacı:</span>
                    <span className="text-base font-black text-emerald-900">
                      {dosingHivesCount * 15} ml (~{((dosingHivesCount * 15) / 1000).toFixed(2)} Litre)
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-stone-500 font-bold block">4 Seanslık Tam Kür İhtiyacı:</span>
                    <span className="text-base font-black text-emerald-900">
                      {((dosingHivesCount * 15 * 4) / 1000).toFixed(2)} Litre %65 Asit
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-900 leading-relaxed">
                  💡 <strong>Nasıl Uygulanır?</strong> %85'lik asit satın aldıysanız, 100 ml asite 30 ml saf su katarak %65'e seyreltin (daima asidi suya ekleyin!). Nassenheider veya Liebig buharlaştırıcı aparat ile çerçeve üstüne yerleştirin. 4 gün arayla 3-4 kez tekrarlanır.
                </p>
              </div>
            )}

            {calcAcidType === "oxalic_glycerin" && (
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-4">
                <h4 className="font-black text-blue-950 text-sm">
                  Oksalik Asit + Saf Bitkisel Gliserin Şerit Reçetesi (Uzun Salınımlı)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-stone-500 font-bold block">Toplam Şerit Adedi:</span>
                    <span className="text-base font-black text-blue-900">{dosingHivesCount * 2} Şerit</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-stone-500 font-bold block">Gereken Dihidrat Oksalik Asit:</span>
                    <span className="text-base font-black text-blue-900">
                      {(dosingHivesCount * 20).toFixed(0)} Gram
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-stone-500 font-bold block">Gereken Saf Gliserin:</span>
                    <span className="text-base font-black text-blue-900">
                      {(dosingHivesCount * 20).toFixed(0)} ml
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <span className="text-stone-500 font-bold block">Etki Süresi:</span>
                    <span className="text-base font-black text-blue-900">4 - 6 Hafta</span>
                  </div>
                </div>

                <p className="text-xs text-blue-900 leading-relaxed">
                  💡 <strong>Hazırlama Yöntemi:</strong> Gliserini 65°C'ye kadar benmari usulü ısıtın. Oksalik asit tozunu ekleyip tamamen şeffaflaşana kadar karıştırın. Selüloz karton veya temiz pamuklu mendilleri solüsyona batırın. Kovan başına 2 şerit çıtaların üzerine asılır.
                </p>
              </div>
            )}

            {calcAcidType === "oxalic_sublimation" && (
              <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 space-y-4">
                <h4 className="font-black text-purple-950 text-sm">
                  Oksalik Asit Süblimasyon (Buharlaştırma - Kış Yavrusuz Dönem)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-purple-200">
                    <span className="text-stone-500 font-bold block">Kovan Başına Dozaj:</span>
                    <span className="text-base font-black text-purple-900">2.0 - 2.5 Gram</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200">
                    <span className="text-stone-500 font-bold block">Toplam Toz İhtiyacı:</span>
                    <span className="text-base font-black text-purple-900">
                      {(dosingHivesCount * 2.2).toFixed(1)} Gram Toz
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200">
                    <span className="text-stone-500 font-bold block">Hedeflenen Başarı:</span>
                    <span className="text-base font-black text-emerald-700">%98+ Varroa Temizliği</span>
                  </div>
                </div>
                <p className="text-xs text-purple-950 font-medium">
                  ⚠️ <strong>ÖNEMLİ GÜVENLİK UYARISI:</strong> Buharlaşan oksalik asit akciğerlerde kalıcı hasar bırakır. Uygulayıcı MUTLAKA <strong>asit buharına dayanıklı gaz maskesi</strong> (FFP3 / A2P3 filtre) ve koruyucu gözlük takmalıdır. Uçuş deliği süngerle tıkanıp 10 dakika kapalı tutulur.
                </p>
              </div>
            )}

            {calcAcidType === "oxalic_trickle" && (
              <div className="p-5 bg-stone-100 rounded-2xl border border-stone-300 space-y-4">
                <h4 className="font-black text-stone-900 text-sm">
                  Oksalik Asit Damlatma Solüsyonu (Kış Salkımı)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">Kovan Başı Çıta Arasına:</span>
                    <span className="text-base font-black text-stone-900">30 - 45 ml</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">Gereken 1:1 Ilık Şerbet:</span>
                    <span className="text-base font-black text-stone-900">
                      {((dosingHivesCount * 40) / 1000).toFixed(2)} Litre
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">Gereken Oksalik Asit:</span>
                    <span className="text-base font-black text-stone-900">
                      {(((dosingHivesCount * 40) / 1000) * 35).toFixed(1)} Gram (1L şerbete 35g)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-600">
                  Şırınga ile çıta arasındaki arı salkımının üzerine ılık solüsyon damlatılır. Yılda sadece 1 kez yapılır.
                </p>
              </div>
            )}

            {calcAcidType === "lactic" && (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-4">
                <h4 className="font-black text-amber-950 text-sm">
                  %15 Laktik Asit Çıta Arası Buğulama
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-stone-500 font-bold block">Kovan Başı Doz:</span>
                    <span className="text-base font-black text-amber-900">40 - 50 ml</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-stone-500 font-bold block">Toplam Hazır Solüsyon:</span>
                    <span className="text-base font-black text-amber-900">
                      {((dosingHivesCount * 45) / 1000).toFixed(2)} Litre
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-stone-500 font-bold block">Yavru Durumu:</span>
                    <span className="text-base font-black text-emerald-800">Yavrulu/Yavrusuz Güvenli</span>
                  </div>
                </div>
              </div>
            )}

            {calcAcidType === "thymol" && (
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-black text-stone-900 text-sm">
                  Timol Kristalleri & Doğal Kekik Yağı Protokolü
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">Kovan Başı Jel / Kristal:</span>
                    <span className="text-base font-black text-stone-900">15 Gram Timol</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">Toplam Timol İhtiyacı:</span>
                    <span className="text-base font-black text-stone-900">
                      {dosingHivesCount * 15} Gram
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-bold block">İdeal Sıcaklık:</span>
                    <span className="text-base font-black text-stone-900">15°C - 30°C</span>
                  </div>
                </div>
              </div>
            )}

            {calcAcidType === "sulfur" && (
              <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-200 space-y-4">
                <h4 className="font-black text-yellow-950 text-sm">
                  Petek Deposu Kükürt Fitili Dumanlama Hesabı (Mum Güvesi İmhası)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-yellow-200">
                    <span className="text-stone-500 font-bold block">Depo Hacmi:</span>
                    <span className="text-base font-black text-yellow-900">{depotVolumeM3} m³</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-yellow-200">
                    <span className="text-stone-500 font-bold block">m³ Başına Standart Kükürt:</span>
                    <span className="text-base font-black text-yellow-900">25 Gram / m³</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-yellow-200">
                    <span className="text-stone-500 font-bold block">Gereken Toplam Kükürt Fitili:</span>
                    <span className="text-base font-black text-yellow-900">
                      {depotVolumeM3 * 25} Gram (~{Math.ceil((depotVolumeM3 * 25) / 50)} Fitil)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-yellow-950 leading-relaxed font-medium">
                  ⚠️ <strong>DİKKAT:</strong> Sadece petek saklama depolarında boş peteklere uygulanır! Kovan içinde arı varken kükürt yakılamaz; arıları anında öldürür. Dumanlama sonrası oda 48 saat havalandırılmalıdır.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: KOVAN TEDAVİ TAKİP GÜNLÜĞÜ (TREATMENT_LOG) */}
      {/* ========================================================================= */}
      {activeSubTab === "treatment_log" && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Kovan Tedavi Günlüğü & Bal Hasat Güvenlik Takvimi</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Koloni bazında uygulanan ilaçlama, organik asit kürleri ve arınma günleri geri sayımı
              </p>
            </div>

            <button
              onClick={() => setIsAddTreatmentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Tedavi Kaydet</span>
            </button>
          </div>

          {/* Treatments List */}
          {treatments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-800">
                Henüz Kayıtlı Bir Tedavi Yok
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Kolonilerinize uyguladığınız organik asit, timol veya diğer koruyucu tedavileri kaydederek hasat bekleme sürelerini takip edebilirsiniz.
              </p>
              <button
                onClick={() => setIsAddTreatmentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>İlk Tedavi Kaydını Ekle</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {treatments.map((record) => {
                const isHarvestSafe =
                  record.safeHarvestDate <= todayStr || record.withdrawalDays === 0;
                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-stone-900 text-white">
                          Kovan {record.hiveNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                            record.status === "completed"
                              ? "bg-stone-100 text-stone-700"
                              : record.status === "quarantine"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.status === "completed"
                            ? "Tamamlandı"
                            : record.status === "quarantine"
                            ? "Karantinada"
                            : "Aktif Tedavi"}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-stone-900 text-sm">
                          {record.treatmentName}
                        </h4>
                        <p className="text-xs font-semibold text-rose-700 mt-0.5">
                          Hedef: {record.diseaseName}
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-700">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Dozaj:</span>
                          <span className="font-bold text-stone-900">{record.dosageDetails}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Başlangıç:</span>
                          <span className="font-bold">{record.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Bekleme Süresi:</span>
                          <span className="font-bold">
                            {record.withdrawalDays === 0
                              ? "0 Gün (Kalıntısız)"
                              : `${record.withdrawalDays} Gün`}
                          </span>
                        </div>
                      </div>

                      {/* Harvest Safety Pill */}
                      <div
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isHarvestSafe
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isHarvestSafe ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-600" />
                          )}
                          <span>
                            {isHarvestSafe
                              ? "Bal Hasadı Güvenli"
                              : `Arınma: ${record.safeHarvestDate}`}
                          </span>
                        </div>
                        <span className="font-extrabold text-[11px]">
                          {isHarvestSafe ? "Arınma Tam" : "Beklemede"}
                        </span>
                      </div>

                      {record.notes && (
                        <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg">
                          "{record.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">
                        ID: {record.id.slice(-6)}
                      </span>
                      <button
                        onClick={() => onDeleteTreatment(record.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                        title="Bu kaydı sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: HIZLI SEMPTOM EŞLEŞTİRİCİ (CHECKER) */}
      {/* ========================================================================= */}
      {activeSubTab === "checker" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-purple-100 pb-4">
              <div>
                <span className="text-xs font-black text-purple-800 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  🔍 Saha Semptom Teşhis Algoritması
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  Kovanda Gözlemlediğiniz Belirtileri İşaretleyin
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Aşağıdaki 18 karakteristik saha belirtisinden kovanınızda görülenleri seçiniz; sistem olası hastalıkları olasılık puanına göre sıralar.
                </p>
              </div>

              {selectedSymptomIds.length > 0 && (
                <button
                  onClick={() => setSelectedSymptomIds([])}
                  className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
                >
                  Seçimleri Temizle ({selectedSymptomIds.length})
                </button>
              )}
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SYMPTOM_CHECKER_LIST.map((symp) => {
                const isChecked = selectedSymptomIds.includes(symp.id);
                return (
                  <div
                    key={symp.id}
                    onClick={() => {
                      setSelectedSymptomIds((prev) =>
                        isChecked ? prev.filter((id) => id !== symp.id) : [...prev, symp.id]
                      );
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isChecked
                        ? "bg-purple-50/90 border-purple-500 shadow-xs ring-1 ring-purple-400"
                        : "bg-stone-50/50 border-stone-200 hover:border-purple-300 hover:bg-stone-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? "bg-purple-600 text-white"
                          : "border-2 border-stone-300 bg-white"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-snug">
                        {symp.label}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {symp.possibleDiseases.join(", ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Grid */}
            {matchedFromChecker.length > 0 ? (
              <div className="p-6 bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 rounded-2xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Teşhis Sonuçları & Olası Hastalıklar ({matchedFromChecker.length})</span>
                  </h4>
                  <span className="text-xs font-bold text-stone-500">
                    Eşleşme skoruna göre sıralandı
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedFromChecker.map(({ disease, score }) => (
                    <div
                      key={disease.id}
                      className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${disease.dangerColor}`}
                          >
                            {disease.severity}
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Skor: {score} Puan
                          </span>
                        </div>
                        <h5 className="font-black text-stone-900 text-sm">
                          {disease.name}
                        </h5>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {disease.overview}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setActiveSubTab("atlas");
                            setExpandedDiseaseId(disease.id);
                            setTimeout(() => {
                              const el = document.getElementById(`atlas-disease-${disease.id}`);
                              el?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                          }}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                        >
                          <span>Reçeteyi İncele</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setActiveSubTab("treatment_log");
                            setFormDiseaseId(disease.id);
                            setFormTreatmentName(`${disease.name} Müdahalesi`);
                            setIsAddTreatmentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[11px] font-bold hover:bg-stone-800"
                        >
                          Tedavi Et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              selectedSymptomIds.length === 0 && (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                  Yukarıdaki belirtilerden en az birini işaretleyerek teşhis algoritmasını çalıştırabilirsiniz.
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD TREATMENT MODAL */}
      {/* ========================================================================= */}
      {isAddTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    Yeni Kovan Tedavisi Kaydet
                  </h3>
                  <p className="text-xs text-stone-500">
                    İlaçlama, organik asit ve hasat arınma takvimi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTreatmentModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTreatment} className="space-y-4 text-xs">
              {/* Hive Selector */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Hedef Kovan:</label>
                <select
                  value={formHiveId}
                  onChange={(e) => setFormHiveId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                  required
                >
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hiveNumber} — {h.queenRace} Irk ({h.totalFrames} Çıta)
                    </option>
                  ))}
                  {hives.length === 0 && <option value="h-genel">Genel Koloni</option>}
                </select>
              </div>

              {/* Disease Selector */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Hastalık / Teşhis:</label>
                <select
                  value={formDiseaseId}
                  onChange={(e) => setFormDiseaseId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                  required
                >
                  {BEE_DISEASES_DATA.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.categoryName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preset Treatment Selector */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Hazır Tedavi Protokolü Seç:
                </label>
                <select
                  value={formTreatmentPresetId}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-blue-900"
                >
                  {COMMON_TREATMENT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} — Hasat Bekleme: {opt.withdrawalDays} Gün
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Name & Dosage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tedavi Adı:</label>
                  <input
                    type="text"
                    value={formTreatmentName}
                    onChange={(e) => setFormTreatmentName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Dozaj / Miktar:</label>
                  <input
                    type="text"
                    value={formDosage}
                    onChange={(e) => setFormDosage(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              {/* Start Date & Withdrawal Days */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Başlangıç Tarihi:</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Bal Hasadı Bekleme (Gün):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={formWithdrawalDays}
                    onChange={(e) => setFormWithdrawalDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Uygulama Notları:</label>
                <textarea
                  rows={2}
                  placeholder="Hava sıcaklığı, döküm durumu, gözlem notları..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddTreatmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-700 font-bold hover:bg-stone-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
                >
                  Tedaviyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
