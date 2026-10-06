import React, { useState } from "react";
import {
  TrendingUp,
  Package,
  Calendar,
  Plus,
  Trash2,
  PieChart,
  ShoppingBag,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Landmark,
  ShieldCheck,
  BarChart3,
  Award,
  Crown,
  CheckCircle2,
  Layers,
  ChevronRight,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import { HarvestRecord, FinancialRecord, EquipmentItem, Hive } from "../types";
import { SubsidiesTaxCalculator } from "./SubsidiesTaxCalculator";

interface HarvestFinanceViewProps {
  hives: Hive[];
  harvests: HarvestRecord[];
  finances: FinancialRecord[];
  equipment: EquipmentItem[];
  onAddHarvest: (record: HarvestRecord) => void;
  onDeleteHarvest: (id: string) => void;
  onAddFinance: (record: FinancialRecord) => void;
  onDeleteFinance: (id: string) => void;
  onAddEquipment: (item: EquipmentItem) => void;
  onDeleteEquipment: (id: string) => void;
}

export const HarvestFinanceView: React.FC<HarvestFinanceViewProps> = ({
  hives,
  harvests,
  finances,
  equipment,
  onAddHarvest,
  onDeleteHarvest,
  onAddFinance,
  onDeleteFinance,
  onAddEquipment,
  onDeleteEquipment,
}) => {
  const [subTab, setSubTab] = useState<"harvest" | "equipment" | "finance" | "subsidies">("harvest");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [eqCategoryFilter, setEqCategoryFilter] = useState<string>("all");

  // Annual Honey Production Chart States
  const [harvestCompareMode, setHarvestCompareMode] = useState<"compare" | "single">("compare");
  const [selectedPrimaryYear, setSelectedPrimaryYear] = useState<string>("2026");
  const [harvestProductFilter, setHarvestProductFilter] = useState<"honey_only" | "all">("honey_only");
  const [selectedChartMonth, setSelectedChartMonth] = useState<string | null>(null);
  const [annualChartDisplayType, setAnnualChartDisplayType] = useState<"bar" | "line">("bar");

  // Seasonal Honey Production & Annual Trends Line Chart States
  const [seasonalTrendMetric, setSeasonalTrendMetric] = useState<"monthly" | "cumulative" | "normalized">("monthly");
  const [seasonalIncludedYears, setSeasonalIncludedYears] = useState<string[]>(["2025", "2026"]);
  const [showSeasonalBenchmark, setShowSeasonalBenchmark] = useState<boolean>(true);
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<"all" | "spring" | "summer" | "autumn">("all");

  // 12-Month Rolling Honey Production Trend States (All Hives Combined)
  const [trendViewMode, setTrendViewMode] = useState<"monthly_trend" | "cumulative" | "per_hive">("monthly_trend");
  const [selectedTrendMonth, setSelectedTrendMonth] = useState<string | null>(null);

  // Hive Productivity Comparison States: Brood Frames vs. Honey Frames
  const [productivitySortBy, setProductivitySortBy] = useState<
    "honey_desc" | "brood_desc" | "total_frames" | "ratio_desc" | "hive_number"
  >("honey_desc");
  const [productivityChartMode, setProductivityChartMode] = useState<"grouped" | "stacked">("grouped");
  const [productivityFilter, setProductivityFilter] = useState<"all" | "supers_only" | "strong_only">("all");
  const [selectedProductiveHiveId, setSelectedProductiveHiveId] = useState<string | null>(null);

  // Finance Filters
  const [finYearFilter, setFinYearFilter] = useState<string>("all");
  const [finMonthFilter, setFinMonthFilter] = useState<string>("all");
  const [finTypeFilter, setFinTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [finCategoryFilter, setFinCategoryFilter] = useState<string>("all");

  // Modals
  const [showAddHarvest, setShowAddHarvest] = useState<boolean>(false);
  const [showAddEquipment, setShowAddEquipment] = useState<boolean>(false);
  const [showAddFinance, setShowAddFinance] = useState<boolean>(false);

  // New Harvest Form
  const [hHiveId, setHHiveId] = useState<string>(hives[0]?.id || "");
  const [hDate, setHDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hProduct, setHProduct] = useState<HarvestRecord["productType"]>("Suzme Cicek Bali");
  const [hQty, setHQty] = useState<number>(15);
  const [hMoisture, setHMoisture] = useState<number>(17.2);
  const [hGrade, setHGrade] = useState<HarvestRecord["qualityGrade"]>("Yuksek Kalite");
  const [hNotes, setHNotes] = useState<string>("");

  // New Equipment Form
  const [eqName, setEqName] = useState<string>("");
  const [eqCategory, setEqCategory] = useState<EquipmentItem["category"]>("Besleme & Şerbetlik");
  const [eqDate, setEqDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [eqUnitPrice, setEqUnitPrice] = useState<number>(1500);
  const [eqQuantity, setEqQuantity] = useState<number>(1);
  const [eqSupplier, setEqSupplier] = useState<string>("");
  const [eqNotes, setEqNotes] = useState<string>("");

  // New Finance Form
  const [fType, setFType] = useState<"income" | "expense">("income");
  const [fCategory, setFCategory] = useState<FinancialRecord["category"]>("Bal Satışı");
  const [fAmount, setFAmount] = useState<number>(5000);
  const [fDate, setFDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [fDesc, setFDesc] = useState<string>("");

  // Calculations
  const totalHarvestKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0);
  const totalIncome = finances
    .filter((f) => f.type === "income")
    .reduce((acc, f) => acc + f.amount, 0);
  const totalExpense = finances
    .filter((f) => f.type === "expense")
    .reduce((acc, f) => acc + f.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const totalEquipmentCost = equipment.reduce((acc, eq) => acc + eq.totalPrice, 0);

  // Honey & Bee Product Incomes
  const totalHoneyIncome = finances
    .filter(
      (f) =>
        f.type === "income" &&
        (f.category === "Bal Satışı" || f.category === "Polen / Propolis Satışı")
    )
    .reduce((acc, f) => acc + f.amount, 0);

  const perHiveYield = hives.length > 0 ? (totalHarvestKg / hives.length).toFixed(1) : "0.0";
  const perHiveNetProfit = hives.length > 0 ? Math.round(netBalance / hives.length) : 0;
  const unitRevenuePerKg = totalHarvestKg > 0 ? Math.round(totalHoneyIncome / totalHarvestKg) : 0;
  const avgMoisture =
    harvests.filter((h) => h.moisturePercent).length > 0
      ? (
          harvests
            .filter((h) => h.moisturePercent)
            .reduce((acc, h) => acc + (h.moisturePercent || 0), 0) /
          harvests.filter((h) => h.moisturePercent).length
        ).toFixed(1)
      : null;

  // Kasa Durumu Detaylı İstatistikleri
  const incomeCount = finances.filter((f) => f.type === "income").length;
  const expenseCount = finances.filter((f) => f.type === "expense").length;
  const profitMargin =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;
  const cashflowTotal = totalIncome + totalExpense;
  const incomeRatio =
    cashflowTotal > 0 ? Math.round((totalIncome / cashflowTotal) * 100) : 50;
  const expenseRatio = 100 - incomeRatio;

  // Filtered finances
  const filteredFinances = finances.filter((f) => {
    if (finYearFilter !== "all" && !f.date.startsWith(finYearFilter)) return false;
    if (finMonthFilter !== "all") {
      const monthPart = f.date.split("-")[1];
      if (monthPart !== finMonthFilter) return false;
    }
    if (finTypeFilter !== "all" && f.type !== finTypeFilter) return false;
    if (finCategoryFilter !== "all" && f.category !== finCategoryFilter) return false;
    return true;
  });

  const filteredIncome = filteredFinances
    .filter((f) => f.type === "income")
    .reduce((acc, f) => acc + f.amount, 0);
  const filteredExpense = filteredFinances
    .filter((f) => f.type === "expense")
    .reduce((acc, f) => acc + f.amount, 0);
  const filteredNet = filteredIncome - filteredExpense;

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const hive = hives.find((h) => h.id === hHiveId);
    const newRecord: HarvestRecord = {
      id: "harv-" + Date.now(),
      hiveId: hHiveId,
      hiveNumber: hive ? hive.hiveNumber : "Genel",
      date: hDate,
      productType: hProduct,
      quantityKg: hQty,
      moisturePercent: hMoisture,
      qualityGrade: hGrade,
      notes: hNotes,
    };
    onAddHarvest(newRecord);
    setShowAddHarvest(false);
    setHNotes("");
  };

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const monthYear = eqDate.slice(0, 7); // YYYY-MM
    const total = eqUnitPrice * eqQuantity;
    const newItem: EquipmentItem = {
      id: "eq-" + Date.now(),
      name: eqName,
      category: eqCategory,
      purchaseDate: eqDate,
      monthYear,
      unitPrice: eqUnitPrice,
      quantity: eqQuantity,
      totalPrice: total,
      supplier: eqSupplier,
      notes: eqNotes,
    };
    onAddEquipment(newItem);

    // Also optionally log as expense
    const newFinance: FinancialRecord = {
      id: "fin-" + Date.now(),
      date: eqDate,
      type: "expense",
      category:
        eqCategory === "Besleme & Şerbetlik"
          ? "Şeker & Besin Alımı"
          : eqCategory === "Kovan Parçaları"
          ? "Kovan & Çerçeve"
          : eqCategory === "Hastalık Mücadelesi"
          ? "Varroa & İlaç Mücadelesi"
          : "Kıyafet & Ekipman",
      amount: total,
      description: `${eqName} (${eqQuantity} adet)`,
    };
    onAddFinance(newFinance);

    setShowAddEquipment(false);
    setEqName("");
  };

  const handleCreateFinance = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: FinancialRecord = {
      id: "fin-" + Date.now(),
      date: fDate,
      type: fType,
      category: fCategory,
      amount: fAmount,
      description: fDesc,
    };
    onAddFinance(newRec);
    setShowAddFinance(false);
    setFDesc("");
  };

  // Filtered equipment by year, month, and category
  const filteredEquipment = equipment.filter((eq) => {
    if (yearFilter !== "all" && !eq.purchaseDate.startsWith(yearFilter)) return false;
    if (monthFilter !== "all") {
      const monthPart = eq.purchaseDate.split("-")[1];
      if (monthPart !== monthFilter) return false;
    }
    if (eqCategoryFilter !== "all" && eq.category !== eqCategoryFilter) return false;
    return true;
  });

  const filteredEquipmentTotal = filteredEquipment.reduce((acc, eq) => acc + eq.totalPrice, 0);

  // --- 12 MONTHS HONEY PRODUCTION & COMPARISON CHART LOGIC ---
  const MONTHS_CONFIG = [
    { key: "01", short: "Oca", full: "Ocak", nectarPhase: "Kışlatma Dinlenmesi" },
    { key: "02", short: "Şub", full: "Şubat", nectarPhase: "Erken Polen Uyanışı" },
    { key: "03", short: "Mar", full: "Mart", nectarPhase: "İlkbahar Gelişimi" },
    { key: "04", short: "Nis", full: "Nisan", nectarPhase: "Meyve Çiçekleri Nektarı" },
    { key: "05", short: "May", full: "Mayıs", nectarPhase: "Akasya & Bahar Nektarı" },
    { key: "06", short: "Haz", full: "Haziran", nectarPhase: "Kır & Yayla Çiçeği Sağımı" },
    { key: "07", short: "Tem", full: "Temmuz", nectarPhase: "Kestane & Ihlamur Sağımı" },
    { key: "08", short: "Ağu", full: "Ağustos", nectarPhase: "Ayçiçeği & Yaz Sağımı" },
    { key: "09", short: "Eyl", full: "Eylül", nectarPhase: "Çam Balı (Basra) 1. Sağım" },
    { key: "10", short: "Eki", full: "Ekim", nectarPhase: "Çam Balı 2. Sağım & Karakovan" },
    { key: "11", short: "Kas", full: "Kasım", nectarPhase: "Püren & Kışa Hazırlık" },
    { key: "12", short: "Ara", full: "Aralık", nectarPhase: "Kış Salkımı" },
  ];

  const isHoneyProductType = (productType: string) => {
    const p = (productType || "").toLowerCase();
    return p.includes("bal") || p.includes("bali") || p.includes("karakovan");
  };

  // Find all distinct years in harvest records
  const distinctHarvestYears = Array.from(
    new Set(harvests.map((h) => h.date.slice(0, 4)).filter(Boolean))
  ).sort();
  const availableYears = distinctHarvestYears.length > 0 ? distinctHarvestYears : ["2025", "2026"];

  // Monthly data array for Recharts
  const monthlyChartData = MONTHS_CONFIG.map((m) => {
    const item: Record<string, any> = {
      monthKey: m.key,
      name: m.short,
      fullName: m.full,
      nectarPhase: m.nectarPhase,
      totalAllYears: 0,
      batches: [] as HarvestRecord[],
    };

    availableYears.forEach((yr) => {
      const yearMonthHarvests = harvests.filter((h) => {
        const matchesDate = h.date.startsWith(`${yr}-${m.key}`);
        if (!matchesDate) return false;
        if (harvestProductFilter === "honey_only") {
          return isHoneyProductType(h.productType);
        }
        return true;
      });

      const kgSum = Math.round(yearMonthHarvests.reduce((acc, h) => acc + h.quantityKg, 0) * 10) / 10;
      item[`year_${yr}`] = kgSum;
      item.totalAllYears += kgSum;
      item.batches.push(...yearMonthHarvests);
    });

    return item;
  });

  // Calculate annual totals per year
  const annualTotals: Record<string, number> = {};
  availableYears.forEach((yr) => {
    annualTotals[yr] = Math.round(
      monthlyChartData.reduce((acc, m) => acc + (m[`year_${yr}`] || 0), 0) * 10
    ) / 10;
  });

  // Find peak months per year
  const peakMonthPerYear: Record<string, { month: string; kg: number }> = {};
  availableYears.forEach((yr) => {
    let maxKg = 0;
    let peakM = "-";
    monthlyChartData.forEach((m) => {
      const kg = m[`year_${yr}`] || 0;
      if (kg > maxKg) {
        maxKg = kg;
        peakM = m.fullName;
      }
    });
    peakMonthPerYear[yr] = { month: peakM, kg: maxKg };
  });

  // Latest 2 years for year-over-year comparison
  const latestYear = availableYears[availableYears.length - 1] || "2026";
  const previousYear = availableYears.length > 1 ? availableYears[availableYears.length - 2] : null;

  const latestYearTotal = annualTotals[latestYear] || 0;
  const previousYearTotal = previousYear ? annualTotals[previousYear] || 0 : 0;
  const yearGrowthPercent = previousYearTotal > 0
    ? Math.round(((latestYearTotal - previousYearTotal) / previousYearTotal) * 1000) / 10
    : null;

  // Year theme colors
  const getYearPalette = (yr: string) => {
    if (yr === "2026") return { fill: "#10b981", stroke: "#059669", bg: "bg-emerald-500", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (yr === "2025") return { fill: "#f59e0b", stroke: "#d97706", bg: "bg-amber-500", text: "text-amber-700", badge: "bg-amber-100 text-amber-800 border-amber-300" };
    if (yr === "2024") return { fill: "#0ea5e9", stroke: "#0284c7", bg: "bg-sky-500", text: "text-sky-700", badge: "bg-sky-100 text-sky-800 border-sky-300" };
    return { fill: "#8b5cf6", stroke: "#7c3aed", bg: "bg-purple-500", text: "text-purple-700", badge: "bg-purple-100 text-purple-800 border-purple-300" };
  };

  const selectedMonthData = selectedChartMonth
    ? monthlyChartData.find((m) => m.monthKey === selectedChartMonth)
    : null;

  // Tooltip component
  const CustomHarvestTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/80 text-xs min-w-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700">
            <div>
              <span className="font-bold text-sm text-amber-300">{data.fullName} Ayı</span>
              <span className="text-stone-400 text-[11px] block mt-0.5">{data.nectarPhase}</span>
            </div>
            <span className="text-lg">🍯</span>
          </div>

          <div className="space-y-1.5 font-medium">
            {payload.map((entry: any, index: number) => {
              const yr = entry.dataKey.replace("year_", "");
              const palette = getYearPalette(yr);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-xs"
                      style={{ backgroundColor: entry.color || palette.fill }}
                    />
                    <span className="text-stone-300">{yr} Sezonu:</span>
                  </div>
                  <span className="font-black text-white text-sm">
                    {entry.value} <span className="text-xs font-normal text-stone-400">kg</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Growth comparison if 2+ years present */}
          {payload.length >= 2 && payload[0].value > 0 && payload[1].value > 0 && (
            <div className="mt-2.5 pt-2 border-t border-stone-800 text-[11px] flex items-center justify-between">
              <span className="text-stone-400">Yıllık Fark:</span>
              <span className={payload[0].value >= payload[1].value ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {payload[0].value >= payload[1].value ? "+" : ""}
                {(payload[0].value - payload[1].value).toFixed(1)} kg
                {payload[1].value > 0
                  ? ` (%${Math.round(((payload[0].value - payload[1].value) / payload[1].value) * 100)})`
                  : ""}
              </span>
            </div>
          )}

          {data.batches && data.batches.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-stone-800 text-[10px]">
              <span className="font-semibold text-stone-400 block mb-1">Hasat Edilen Çeşitler:</span>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(data.batches.map((b: HarvestRecord) => b.productType))).map((pt: any, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-200">
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // --- LAST 12 MONTHS HONEY PRODUCTION TREND (ALL HIVES COMBINED) ---
  const TURKISH_MONTH_NAMES_LIST = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const TURKISH_MONTH_SHORT_LIST = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
  ];

  const last12MonthsTrendData = React.useMemo(() => {
    let anchorYear = 2026;
    let anchorMonth = 9; // October (0-indexed: 9)

    const honeyHarvests = harvests.filter((h) => isHoneyProductType(h.productType));
    if (honeyHarvests.length > 0) {
      const sorted = [...honeyHarvests].sort((a, b) => a.date.localeCompare(b.date));
      const latest = sorted[sorted.length - 1].date;
      const parts = latest.split("-");
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          anchorYear = y;
          anchorMonth = m;
        }
      }
    }

    const months: Array<{
      key: string;
      year: number;
      monthIndex: number;
      shortLabel: string;
      fullLabel: string;
      totalHoneyKg: number;
      cumulativeHoneyKg: number;
      activeHivesCount: number;
      avgPerHiveKg: number;
      batchesCount: number;
      batches: HarvestRecord[];
      movingAverage: number;
      productBreakdown: Record<string, number>;
    }> = [];

    let runningTotal = 0;

    for (let i = 11; i >= 0; i--) {
      const d = new Date(anchorYear, anchorMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const mKey = String(m + 1).padStart(2, "0");
      const ym = `${y}-${mKey}`;

      // All hives combined for this specific month
      const monthlyBatches = harvests.filter((h) => {
        return h.date.startsWith(ym) && isHoneyProductType(h.productType);
      });

      const totalKg = Math.round(
        monthlyBatches.reduce((acc, h) => acc + (h.quantityKg || 0), 0) * 10
      ) / 10;

      runningTotal = Math.round((runningTotal + totalKg) * 10) / 10;

      const hiveIdentifiers = new Set(monthlyBatches.map((h) => h.hiveNumber || h.hiveId));

      const breakdown: Record<string, number> = {};
      monthlyBatches.forEach((h) => {
        breakdown[h.productType] = Math.round(((breakdown[h.productType] || 0) + h.quantityKg) * 10) / 10;
      });

      months.push({
        key: ym,
        year: y,
        monthIndex: m,
        shortLabel: `${TURKISH_MONTH_SHORT_LIST[m]} '${String(y).slice(-2)}`,
        fullLabel: `${TURKISH_MONTH_NAMES_LIST[m]} ${y}`,
        totalHoneyKg: totalKg,
        cumulativeHoneyKg: runningTotal,
        activeHivesCount: hiveIdentifiers.size,
        avgPerHiveKg: hives.length > 0 ? Math.round((totalKg / hives.length) * 10) / 10 : 0,
        batchesCount: monthlyBatches.length,
        batches: monthlyBatches,
        movingAverage: 0,
        productBreakdown: breakdown,
      });
    }

    // 3-Month Moving Average (Trendline)
    for (let i = 0; i < months.length; i++) {
      const start = Math.max(0, i - 2);
      const slice = months.slice(start, i + 1);
      const sum = slice.reduce((acc, item) => acc + item.totalHoneyKg, 0);
      months[i].movingAverage = Math.round((sum / slice.length) * 10) / 10;
    }

    return months;
  }, [harvests, hives]);

  // 12-Month Trend Key Metrics
  const trendTotal12Kg = Math.round(
    last12MonthsTrendData.reduce((acc, m) => acc + m.totalHoneyKg, 0) * 10
  ) / 10;
  const trendMonthlyAverageKg = Math.round((trendTotal12Kg / 12) * 10) / 10;
  const trendPeakMonth = [...last12MonthsTrendData].sort((a, b) => b.totalHoneyKg - a.totalHoneyKg)[0];
  const trendAvgPerHiveKg = hives.length > 0
    ? Math.round((trendTotal12Kg / hives.length) * 10) / 10
    : 0;

  // Recent 3 months vs previous 3 months comparison
  const trendLast3MonthsKg = last12MonthsTrendData.slice(9, 12).reduce((s, m) => s + m.totalHoneyKg, 0);
  const trendPrev3MonthsKg = last12MonthsTrendData.slice(6, 9).reduce((s, m) => s + m.totalHoneyKg, 0);
  const trendQuarterlyDiff = trendPrev3MonthsKg > 0
    ? Math.round(((trendLast3MonthsKg - trendPrev3MonthsKg) / trendPrev3MonthsKg) * 100)
    : null;

  const selectedTrendMonthData = selectedTrendMonth
    ? last12MonthsTrendData.find((m) => m.key === selectedTrendMonth)
    : null;

  // Custom Tooltip for 12-Month Trend Chart
  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/80 text-xs min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700">
            <div>
              <span className="font-bold text-sm text-amber-300">{data.fullLabel}</span>
              <span className="text-stone-400 text-[11px] block mt-0.5">Tüm Kovanlar Birleşik Hasadı</span>
            </div>
            <span className="text-lg">🍯</span>
          </div>

          <div className="space-y-1.5 font-medium">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Aylık Bal Üretimi:</span>
              <span className="font-black text-amber-400 text-sm">
                {data.totalHoneyKg} kg
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300">3 Aylık Trend Ortalaması:</span>
              <span className="font-black text-emerald-400 text-xs">
                {data.movingAverage} kg
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300">12 Aylık Kümülatif:</span>
              <span className="font-bold text-white text-xs">
                {data.cumulativeHoneyKg} kg
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Katkı Veren Koloniler:</span>
              <span className="font-bold text-amber-200 text-xs">
                {data.activeHivesCount} kovan ({data.batchesCount} sağım partisi)
              </span>
            </div>
            {hives.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Kovan Başına Düşen:</span>
                <span className="font-bold text-sky-300 text-xs">
                  {data.avgPerHiveKg} kg/kovan
                </span>
              </div>
            )}
          </div>

          {Object.keys(data.productBreakdown || {}).length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-stone-800 text-[10px]">
              <span className="font-semibold text-stone-400 block mb-1">Hasat Türleri Dağılımı:</span>
              <div className="space-y-1">
                {Object.entries(data.productBreakdown).map(([prod, kg]: any) => (
                  <div key={prod} className="flex justify-between items-center text-stone-300">
                    <span className="truncate max-w-[150px]">• {prod}</span>
                    <span className="font-bold text-white">{kg} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // --- HIVES PRODUCTIVITY COMPARISON: BROOD FRAMES VS. HONEY FRAMES ---
  const hiveProductivityList = React.useMemo(() => {
    return hives.map((h) => {
      const hiveTotalHarvestKg = harvests
        .filter((hr) => hr.hiveId === h.id || hr.hiveNumber === h.hiveNumber)
        .reduce((sum, hr) => sum + (hr.quantityKg || 0), 0);

      const totalFrames = h.totalFrames || 10;
      const broodFrames = h.broodFrames || 0;
      const honeyFrames = h.honeyFrames || 0;
      const otherFrames = Math.max(0, totalFrames - broodFrames - honeyFrames);
      const ratio = broodFrames > 0 ? Math.round((honeyFrames / broodFrames) * 10) / 10 : honeyFrames;

      let category: "Pik Verimli" | "Yüksek Verimli" | "Dengeli Koloni" | "Kuluçka Odaklı" | "Gelişmekte / Zayıf" =
        "Dengeli Koloni";
      let categoryColor = "text-amber-800 bg-amber-100 border-amber-300";
      let assessment = "Koloni dengeli seyrediyor; yavru alanı ve bal stoku stabil.";

      if (honeyFrames >= 7 || (honeyFrames >= 5 && (h.honeySuperCount || 0) > 0)) {
        category = "Pik Verimli";
        categoryColor = "text-emerald-800 bg-emerald-100 border-emerald-300";
        assessment = "🏆 Hasada hazır veya kat ilavesi isteyen en yüksek verimli baş aktör koloni.";
      } else if (honeyFrames >= 5) {
        category = "Yüksek Verimli";
        categoryColor = "text-teal-800 bg-teal-100 border-teal-300";
        assessment = "🍯 Yüksek bal depolama gücü; tarlacı arı oranı mükemmel.";
      } else if (broodFrames >= 6 && honeyFrames < 4) {
        category = "Kuluçka Odaklı";
        categoryColor = "text-amber-900 bg-amber-200/80 border-amber-400";
        assessment = "🌱 Güçlü yavru artışı; nektar akımı öncesi hızla nüfus katlıyor.";
      } else if (totalFrames <= 5 || (broodFrames <= 2 && honeyFrames <= 2)) {
        category = "Gelişmekte / Zayıf";
        categoryColor = "text-stone-700 bg-stone-100 border-stone-300";
        assessment = "⚠️ Destek veya şerbetleme gerektirebilir; kovan daraltması önerilir.";
      }

      return {
        id: h.id,
        hiveNumber: h.hiveNumber,
        shortNumber: h.hiveNumber.replace(/^Kovan\s*/i, "").trim() || h.hiveNumber,
        type: h.type,
        queenRace: h.queenRace,
        queenYear: h.queenYear,
        totalFrames,
        broodFrames,
        honeyFrames,
        otherFrames,
        honeySuperCount: h.honeySuperCount || 0,
        healthStatus: h.healthStatus,
        swarmTendency: h.swarmTendency,
        totalHarvestKg: Math.round(hiveTotalHarvestKg * 10) / 10,
        productivityRatio: ratio,
        category,
        categoryColor,
        assessment,
      };
    });
  }, [hives, harvests]);

  // Filtered and Sorted list for chart
  const filteredAndSortedProductivity = React.useMemo(() => {
    let list = [...hiveProductivityList];

    // Filter
    if (productivityFilter === "supers_only") {
      list = list.filter((item) => item.honeySuperCount > 0);
    } else if (productivityFilter === "strong_only") {
      list = list.filter((item) => item.totalFrames >= 8);
    }

    // Sort
    list.sort((a, b) => {
      if (productivitySortBy === "honey_desc") {
        if (b.honeyFrames !== a.honeyFrames) return b.honeyFrames - a.honeyFrames;
        return b.totalHarvestKg - a.totalHarvestKg;
      }
      if (productivitySortBy === "brood_desc") {
        return b.broodFrames - a.broodFrames;
      }
      if (productivitySortBy === "total_frames") {
        return b.totalFrames - a.totalFrames;
      }
      if (productivitySortBy === "ratio_desc") {
        return b.productivityRatio - a.productivityRatio;
      }
      if (productivitySortBy === "hive_number") {
        return a.hiveNumber.localeCompare(b.hiveNumber, undefined, { numeric: true });
      }
      return 0;
    });

    return list;
  }, [hiveProductivityList, productivityFilter, productivitySortBy]);

  // Overall apiary stats for Brood vs Honey comparison
  const totalApiaryHoneyFrames = hiveProductivityList.reduce((acc, h) => acc + h.honeyFrames, 0);
  const totalApiaryBroodFrames = hiveProductivityList.reduce((acc, h) => acc + h.broodFrames, 0);
  const avgApiaryHoneyFrames =
    hiveProductivityList.length > 0
      ? Math.round((totalApiaryHoneyFrames / hiveProductivityList.length) * 10) / 10
      : 0;
  const avgApiaryBroodFrames =
    hiveProductivityList.length > 0
      ? Math.round((totalApiaryBroodFrames / hiveProductivityList.length) * 10) / 10
      : 0;
  const mostProductiveHive = [...hiveProductivityList].sort((a, b) => {
    if (b.honeyFrames !== a.honeyFrames) return b.honeyFrames - a.honeyFrames;
    return b.totalHarvestKg - a.totalHarvestKg;
  })[0];
  const mostBroodHive = [...hiveProductivityList].sort((a, b) => b.broodFrames - a.broodFrames)[0];
  const readyForHarvestCount = hiveProductivityList.filter((h) => h.honeyFrames >= 6).length;

  const selectedProductiveHiveData = selectedProductiveHiveId
    ? hiveProductivityList.find((h) => h.id === selectedProductiveHiveId)
    : null;

  const CustomProductivityTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/80 text-xs min-w-[250px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700">
            <div>
              <span className="font-bold text-sm text-amber-300">{data.hiveNumber}</span>
              <span className="text-stone-400 text-[11px] block">
                {data.queenRace} Ana Arı ({data.queenYear}) • {data.type}
              </span>
            </div>
            <span className="text-lg">🐝</span>
          </div>

          <div className="space-y-1.5 font-medium">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Ballı Çerçeve:</span>
              </span>
              <span className="font-black text-amber-300 text-sm">{data.honeyFrames} çerçeve</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-orange-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Yavrulu Çerçeve:</span>
              </span>
              <span className="font-black text-orange-400 text-sm">{data.broodFrames} çerçeve</span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span>Toplam Çerçeve Kapasitesi:</span>
              <span className="font-bold text-white">{data.totalFrames} çerçeve</span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span>Bal / Yavru Oranı:</span>
              <span className="font-bold text-emerald-400">{data.productivityRatio}x</span>
            </div>
            {data.totalHarvestKg > 0 && (
              <div className="flex items-center justify-between text-stone-300 pt-1 border-t border-stone-800">
                <span>Kayıtlı Toplam Hasat:</span>
                <span className="font-black text-emerald-300">{data.totalHarvestKg} kg</span>
              </div>
            )}
            <div className="pt-1 border-t border-stone-800 text-[11px]">
              <span className="text-stone-400">Durum: </span>
              <span className="font-bold text-amber-200">{data.category}</span>
              {data.honeySuperCount > 0 && (
                <span className="text-stone-400 block mt-0.5">
                  ({data.honeySuperCount} katlı ballık)
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // --- SEASONAL HONEY PRODUCTION & ANNUAL TRENDS LINE CHART LOGIC ---
  const seasonalMonthlyData = React.useMemo(() => {
    const cumTracker: Record<string, number> = {};
    availableYears.forEach((yr) => {
      cumTracker[yr] = 0;
    });

    // Regional benchmark curve (Turkey's standard floral, clover, chestnut & pine nectar bell curve potential in kg)
    const benchmarkPattern = [0, 0, 0, 6, 18, 42, 58, 38, 52, 40, 5, 0];

    return MONTHS_CONFIG.map((m, idx) => {
      const seasonKey: "winter" | "spring" | "summer" | "autumn" =
        idx >= 2 && idx <= 4
          ? "spring"
          : idx >= 5 && idx <= 7
          ? "summer"
          : idx >= 8 && idx <= 10
          ? "autumn"
          : "winter";

      const seasonName =
        seasonKey === "spring"
          ? "İlkbahar"
          : seasonKey === "summer"
          ? "Yaz"
          : seasonKey === "autumn"
          ? "Sonbahar"
          : "Kış";

      const seasonBadgeColor =
        seasonKey === "spring"
          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
          : seasonKey === "summer"
          ? "bg-amber-100 text-amber-800 border-amber-300"
          : seasonKey === "autumn"
          ? "bg-orange-100 text-orange-800 border-orange-300"
          : "bg-stone-100 text-stone-700 border-stone-300";

      const row: Record<string, any> = {
        monthKey: m.key,
        shortName: m.short,
        fullName: m.full,
        seasonKey,
        seasonName,
        seasonBadgeColor,
        nectarPhase: m.nectarPhase,
        benchmark: benchmarkPattern[idx] || 0,
        batches: [] as HarvestRecord[],
      };

      let sumYearsKg = 0;
      let countYears = 0;

      availableYears.forEach((yr) => {
        const yrHarvests = harvests.filter((h) => {
          if (!h.date.startsWith(`${yr}-${m.key}`)) return false;
          if (harvestProductFilter === "honey_only") {
            return isHoneyProductType(h.productType);
          }
          return true;
        });

        const monthKg = Math.round(yrHarvests.reduce((acc, h) => acc + (h.quantityKg || 0), 0) * 10) / 10;
        cumTracker[yr] = Math.round((cumTracker[yr] + monthKg) * 10) / 10;

        const annualTotal = annualTotals[yr] || 1;
        const sharePercent = annualTotal > 0 ? Math.round((monthKg / annualTotal) * 1000) / 10 : 0;

        row[`val_${yr}`] = monthKg;
        row[`cum_${yr}`] = cumTracker[yr];
        row[`share_${yr}`] = sharePercent;
        row.batches.push(...yrHarvests);

        if (monthKg > 0) {
          sumYearsKg += monthKg;
          countYears++;
        }
      });

      row["multiYearAvg"] = countYears > 0 ? Math.round((sumYearsKg / countYears) * 10) / 10 : 0;

      return row;
    });
  }, [MONTHS_CONFIG, availableYears, harvests, harvestProductFilter, annualTotals]);

  // Seasonal aggregate breakdown (İlkbahar, Yaz, Sonbahar, Kış)
  const seasonalBreakdown = React.useMemo(() => {
    const activeYr = selectedPrimaryYear || availableYears[availableYears.length - 1] || "2026";
    const totalActiveYr = annualTotals[activeYr] || 0;

    let springKg = 0;
    let summerKg = 0;
    let autumnKg = 0;
    let winterKg = 0;

    seasonalMonthlyData.forEach((m, idx) => {
      const kg = m[`val_${activeYr}`] || 0;
      if (idx >= 2 && idx <= 4) springKg += kg;
      else if (idx >= 5 && idx <= 7) summerKg += kg;
      else if (idx >= 8 && idx <= 10) autumnKg += kg;
      else winterKg += kg;
    });

    springKg = Math.round(springKg * 10) / 10;
    summerKg = Math.round(summerKg * 10) / 10;
    autumnKg = Math.round(autumnKg * 10) / 10;
    winterKg = Math.round(winterKg * 10) / 10;

    const springShare = totalActiveYr > 0 ? Math.round((springKg / totalActiveYr) * 100) : 0;
    const summerShare = totalActiveYr > 0 ? Math.round((summerKg / totalActiveYr) * 100) : 0;
    const autumnShare = totalActiveYr > 0 ? Math.round((autumnKg / totalActiveYr) * 100) : 0;
    const winterShare = totalActiveYr > 0 ? Math.round((winterKg / totalActiveYr) * 100) : 0;

    const seasonsList = [
      { id: "spring", name: "İlkbahar Sezonu", period: "Mart - Mayıs", kg: springKg, share: springShare, icon: "🌸", color: "text-emerald-700 bg-emerald-50 border-emerald-300", flora: "Narenciye, Akasya & Kır Çiçekleri" },
      { id: "summer", name: "Yaz Ana Hasadı", period: "Haziran - Ağustos", kg: summerKg, share: summerShare, icon: "☀️", color: "text-amber-800 bg-amber-50 border-amber-300", flora: "Kestane, Yayla Çiçeği & Ayçiçeği" },
      { id: "autumn", name: "Sonbahar Salgı Hasadı", period: "Eylül - Kasım", kg: autumnKg, share: autumnShare, icon: "🌲", color: "text-orange-800 bg-orange-50 border-orange-300", flora: "Basra Çam Salgısı & Püren" },
      { id: "winter", name: "Kışlatma & Stok", period: "Aralık - Şubat", kg: winterKg, share: winterShare, icon: "❄️", color: "text-stone-700 bg-stone-50 border-stone-300", flora: "Kış Salkımı & Dinlenme Dönemi" },
    ];

    const peak = [...seasonsList].sort((a, b) => b.kg - a.kg)[0];

    return {
      activeYr,
      totalActiveYr,
      springKg,
      summerKg,
      autumnKg,
      winterKg,
      seasonsList,
      peak,
    };
  }, [seasonalMonthlyData, selectedPrimaryYear, availableYears, annualTotals]);

  // Filtered seasonal dataset if user clicked a specific season
  const filteredSeasonalMonthlyData = React.useMemo(() => {
    if (selectedSeasonFilter === "all") return seasonalMonthlyData;
    return seasonalMonthlyData.filter((m) => m.seasonKey === selectedSeasonFilter);
  }, [seasonalMonthlyData, selectedSeasonFilter]);

  // Tooltip component for Seasonal Line Chart
  const CustomSeasonalLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/80 text-xs min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-amber-300">{data.fullName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${data.seasonBadgeColor}`}>
                  {data.seasonName}
                </span>
              </div>
              <span className="text-stone-400 text-[11px] block mt-0.5">{data.nectarPhase}</span>
            </div>
            <span className="text-lg">📈</span>
          </div>

          <div className="space-y-1.5 font-medium">
            {payload.map((entry: any, index: number) => {
              if (entry.dataKey === "benchmark") {
                return (
                  <div key={index} className="flex items-center justify-between text-stone-400 pt-1 border-t border-stone-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-stone-400" />
                      <span>{entry.name}:</span>
                    </span>
                    <span className="font-semibold text-stone-300">{entry.value} kg potansiyel</span>
                  </div>
                );
              }

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-stone-300">{entry.name}:</span>
                  </div>
                  <span className="font-black text-white text-sm">
                    {entry.value}
                    <span className="text-xs font-normal text-stone-400 ml-1">
                      {seasonalTrendMetric === "normalized" ? "%" : "kg"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {data.batches && data.batches.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-stone-800 text-[10px]">
              <span className="font-semibold text-stone-400 block mb-1">Kayıtlı Çeşitler:</span>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(data.batches.map((b: HarvestRecord) => b.productType))).map((pt: any, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-200">
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KASA DURUMU ÖZET KARTI */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Card Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 rounded-2xl shadow-md ring-2 ring-amber-400/40">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Kasa Durumu
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Canlı Bakiye
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      netBalance >= 0
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {netBalance >= 0 ? `Net Kârda (%${profitMargin} Marj)` : "Gider / Yatırım Dönemi"}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Arılık işletmesinin toplam nakit girişi, operasyonel harcamaları ve net kâr bilançosu
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
              <button
                onClick={() => {
                  setSubTab("finance");
                  setShowAddFinance(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Gelir / Gider Ekle</span>
              </button>

              <button
                onClick={() => setSubTab("finance")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                  subTab === "finance"
                    ? "bg-white/20 text-white"
                    : "bg-white/10 hover:bg-white/15 text-stone-200"
                }`}
              >
                <span>Deftere Git</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Main KPI Metrics: Toplam Gelir, Toplam Gider, Net Kâr */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Toplam Gelir */}
            <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Toplam Gelir</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 font-semibold">
                  {incomeCount} Gelir Kaydı
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight">
                +{totalIncome.toLocaleString("tr-TR")}{" "}
                <span className="text-sm font-semibold text-emerald-300/80">TL</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                Bal, polen, propolis satışları, ana arı ve arıcılık destekleme gelirleri
              </p>
            </div>

            {/* 2. Toplam Gider */}
            <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Toplam Gider</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/60 font-semibold">
                  {expenseCount} Gider Kaydı
                </span>
              </div>
              <div className="text-3xl font-black text-rose-400 tracking-tight">
                -{totalExpense.toLocaleString("tr-TR")}{" "}
                <span className="text-sm font-semibold text-rose-300/80">TL</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                Şeker, fondan kek, varroa ilaçları, kovan, çıta, petek ve yakıt masrafları
              </p>
            </div>

            {/* 3. Net Kâr (Kasa Bakiyesi) */}
            <div
              className={`rounded-2xl p-5 border backdrop-blur-md space-y-2 ${
                netBalance >= 0
                  ? "bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/20"
                  : "bg-rose-950/40 border-rose-500/40 ring-1 ring-rose-500/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium">
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    netBalance >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Net Kâr / Bakiye</span>
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border ${
                    netBalance >= 0
                      ? "bg-emerald-900/70 text-emerald-200 border-emerald-600"
                      : "bg-rose-900/70 text-rose-200 border-rose-600"
                  }`}
                >
                  {hives.length > 0
                    ? `${perHiveNetProfit.toLocaleString("tr-TR")} TL / kovan`
                    : "Net Sonuç"}
                </span>
              </div>
              <div
                className={`text-3xl font-black tracking-tight ${
                  netBalance >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {netBalance >= 0 ? `+${netBalance.toLocaleString("tr-TR")}` : netBalance.toLocaleString("tr-TR")}{" "}
                <span className="text-sm font-semibold text-white/80">TL</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                {netBalance >= 0
                  ? `Tüm harcamalar düşüldükten sonra net kâr marjı: %${profitMargin}.`
                  : "Sezonda yapılan yatırımlar gelirleri aşıyor (Gelişim & Donanım Aşaması)."}
              </p>
            </div>
          </div>

          {/* Cashflow Proportion Visual Progress Bar */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Gelir Hacmi: %{incomeRatio} (+{totalIncome.toLocaleString("tr-TR")} TL)</span>
              </span>
              <span className="text-stone-300 font-bold flex items-center gap-1.5">
                <span>Gider Hacmi: %{expenseRatio} (-{totalExpense.toLocaleString("tr-TR")} TL)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              </span>
            </div>
            <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${incomeRatio}%` }}
                title={`Gelir: ${totalIncome.toLocaleString("tr-TR")} TL (%${incomeRatio})`}
              />
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-full transition-all duration-500"
                style={{ width: `${expenseRatio}%` }}
                title={`Gider: ${totalExpense.toLocaleString("tr-TR")} TL (%${expenseRatio})`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Production & Inventory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Toplam Hasat Miktarı</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">
            {totalHarvestKg.toFixed(1)} <span className="text-sm font-normal text-stone-600">kg/ürün</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Kovan başına ortalama verim: <strong className="text-stone-800">{perHiveYield} kg</strong> ({hives.length} aktif kovan)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Kovan Başına Net Kâr</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div
            className={`text-2xl font-black mt-2 ${
              perHiveNetProfit >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {perHiveNetProfit >= 0 ? `+${perHiveNetProfit.toLocaleString("tr-TR")}` : perHiveNetProfit.toLocaleString("tr-TR")}{" "}
            <span className="text-sm font-normal text-stone-600">TL/kovan</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Toplam {hives.length} aktif kovana dağıtılmış net bilanço
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Toplam Malzeme & Ekipman Değeri</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">
            {totalEquipmentCost.toLocaleString("tr-TR")}{" "}
            <span className="text-sm font-normal text-stone-600">TL</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {equipment.length} kalem kayıtlı demirbaş ve malzeme envanteri
          </p>
        </div>
      </div>

      {/* Sub-tab switcher and Add buttons */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab("harvest")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              subTab === "harvest"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            🍯 Bal & Ürün Hasatları ({harvests.length})
          </button>

          <button
            onClick={() => setSubTab("equipment")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              subTab === "equipment"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            📦 Malzeme & Aylık/Yıllık Fiyat Kaydı ({equipment.length})
          </button>

          <button
            onClick={() => setSubTab("finance")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              subTab === "finance"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            💰 Gelir - Gider Defteri ({finances.length})
          </button>

          <button
            onClick={() => setSubTab("subsidies")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              subTab === "subsidies"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-700" />
            <span>2025/2026 Destekleme & Vergi Rehberi</span>
          </button>
        </div>

        <div>
          {subTab === "harvest" && (
            <button
              onClick={() => setShowAddHarvest(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Hasat Kaydı Ekle</span>
            </button>
          )}

          {subTab === "equipment" && (
            <button
              onClick={() => setShowAddEquipment(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Malzeme Fiyatı Kaydet</span>
            </button>
          )}

          {subTab === "finance" && (
            <button
              onClick={() => setShowAddFinance(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Gelir / Gider Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. HARVEST TAB CONTENT */}
      {subTab === "harvest" && (
        <div className="space-y-6">
          {/* 12-MONTH HONEY PRODUCTION TREND OVER TIME (ALL HIVES COMBINED) */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs ring-2 ring-amber-400/20">
                  <TrendingUp className="w-5 h-5 text-amber-50" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      Tüm Kovanlar İçin Son 12 Aylık Bal Üretim Trendi
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                      <span>🍯</span> Recharts 12 Aylık Eğri
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Arılıktaki tüm kolonilerin son 12 aydaki birleşik hasat seyri, 3 aylık hareketli trend çizgisi ve kümülatif büyüme hacmi
                  </p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start lg:self-center">
                <button
                  onClick={() => setTrendViewMode("monthly_trend")}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    trendViewMode === "monthly_trend"
                      ? "bg-white text-stone-900 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aylık Hasat & 3A Trend</span>
                </button>
                <button
                  onClick={() => setTrendViewMode("cumulative")}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    trendViewMode === "cumulative"
                      ? "bg-white text-stone-900 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kümülatif Toplam</span>
                </button>
                <button
                  onClick={() => setTrendViewMode("per_hive")}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    trendViewMode === "per_hive"
                      ? "bg-white text-stone-900 shadow-xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-sky-600" />
                  <span>Kovan Başına (kg)</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Stats for the 12-Month Period */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Son 12 Ay Toplam Bal</span>
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-950 mt-1">
                  {trendTotal12Kg.toFixed(1)} <span className="text-xs font-normal text-stone-600">kg</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Tüm kovanlar birleşik üretim
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>12 Aylık Aylık Ortalama</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {trendMonthlyAverageKg.toFixed(1)} <span className="text-xs font-normal text-stone-600">kg/ay</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {trendQuarterlyDiff !== null ? (
                    <span className="flex items-center gap-0.5">
                      {trendQuarterlyDiff >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-rose-600" />
                      )}
                      Son çeyrekte %{Math.abs(trendQuarterlyDiff)} {trendQuarterlyDiff >= 0 ? "artış" : "düşüş"}
                    </span>
                  ) : (
                    "Dengeli sezon akışı"
                  )}
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>En Yüksek Hasat Ayı</span>
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {trendPeakMonth?.fullLabel || "-"}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Pik hasat: {trendPeakMonth?.totalHoneyKg || 0} kg
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Koloni Başına 12 Ay</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-900 mt-1">
                  {trendAvgPerHiveKg.toFixed(1)}{" "}
                  <span className="text-xs font-normal text-stone-600">kg/kovan</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {hives.length} aktif kovan üzerinden
                </div>
              </div>
            </div>

            {/* Recharts Chart Canvas */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {trendViewMode === "monthly_trend" ? (
                  <ComposedChart
                    data={last12MonthsTrendData}
                    margin={{ top: 20, right: 25, bottom: 20, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="honeyTrendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.7} />
                        <stop offset="90%" stopColor="#d97706" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="shortLabel"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      stroke="#92400e"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, (dataMax: number) => Math.max(15, Math.ceil(dataMax * 1.15))]}
                      tickFormatter={(val) => `${val} kg`}
                      label={{
                        value: "Üretim (kg)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#92400e", fontSize: 11 },
                      }}
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                    />
                    <ReferenceLine
                      y={trendMonthlyAverageKg}
                      stroke="#d97706"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `12A Ort.: ${trendMonthlyAverageKg} kg`,
                        position: "insideTopLeft",
                        fill: "#92400e",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalHoneyKg"
                      name="Aylık Bal Üretimi (Tüm Kovanlar) (kg)"
                      fill="url(#honeyTrendAreaGrad)"
                      stroke="#d97706"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#d97706", stroke: "#ffffff", strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: "#b45309", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="movingAverage"
                      name="3 Aylık Trend Çizgisi (Hareketli Ort.)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                ) : trendViewMode === "cumulative" ? (
                  <AreaChart
                    data={last12MonthsTrendData}
                    margin={{ top: 20, right: 25, bottom: 20, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="cumulativeTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
                        <stop offset="90%" stopColor="#059669" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="shortLabel"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      stroke="#065f46"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, (dataMax: number) => Math.max(20, Math.ceil(dataMax * 1.1))]}
                      tickFormatter={(val) => `${val} kg`}
                      label={{
                        value: "Kümülatif Toplam (kg)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#065f46", fontSize: 11 },
                      }}
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeHoneyKg"
                      name="12 Aylık Kümülatif Bal Üretimi (kg)"
                      fill="url(#cumulativeTrendGrad)"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#059669", stroke: "#ffffff", strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: "#047857", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                ) : (
                  <AreaChart
                    data={last12MonthsTrendData}
                    margin={{ top: 20, right: 25, bottom: 20, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="perHiveTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.7} />
                        <stop offset="90%" stopColor="#0284c7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="shortLabel"
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      stroke="#0369a1"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, (dataMax: number) => Math.max(5, Math.ceil(dataMax * 1.2))]}
                      tickFormatter={(val) => `${val} kg`}
                      label={{
                        value: "Kovan Başı (kg)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#0369a1", fontSize: 11 },
                      }}
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgPerHiveKg"
                      name="Kovan Başına Ortalama Bal Verimi (kg/kovan)"
                      fill="url(#perHiveTrendGrad)"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: "#0369a1", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* 12-Month Quick Capsule Timeline */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Son 12 Ayın Aylık Dağılım Özeti (Tüm Kovanlar)</span>
                </span>
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  Parti ve kovan detaylarını görmek için aya tıklayın
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {last12MonthsTrendData.map((m) => {
                  const isSelected = selectedTrendMonth === m.key;
                  const hasYield = m.totalHoneyKg > 0;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setSelectedTrendMonth(isSelected ? null : m.key)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400/40 shadow-xs"
                          : hasYield
                          ? "bg-amber-50/70 border-amber-200 hover:bg-amber-100/50"
                          : "bg-white border-stone-200 hover:border-amber-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-800">{m.shortLabel}</div>
                      <div className="text-xs font-black text-stone-900 my-1">
                        {hasYield ? (
                          <span className="text-amber-800 font-extrabold">{m.totalHoneyKg} kg</span>
                        ) : (
                          <span className="text-stone-300 font-normal">-</span>
                        )}
                      </div>
                      <div className="text-[9px] text-stone-500 truncate">
                        {hasYield ? `${m.activeHivesCount} kovan` : "Hasat yok"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Month Detail Card */}
              {selectedTrendMonthData && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍯</span>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {selectedTrendMonthData.fullLabel} — Tüm Kovanlar Bal Hasat Özeti
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {selectedTrendMonthData.activeHivesCount} koloni katkısıyla toplam {selectedTrendMonthData.totalHoneyKg} kg hasat
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                        Toplam: {selectedTrendMonthData.totalHoneyKg} kg
                      </span>
                      <button
                        onClick={() => setSelectedTrendMonth(null)}
                        className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg hover:bg-amber-200/50"
                      >
                        Kapat ✕
                      </button>
                    </div>
                  </div>

                  {selectedTrendMonthData.batches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {selectedTrendMonthData.batches.map((batch: HarvestRecord) => (
                        <div
                          key={batch.id}
                          className="bg-white p-3 rounded-lg border border-amber-200 text-xs shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{batch.productType}</span>
                            <span className="font-black text-amber-800">{batch.quantityKg} kg</span>
                          </div>
                          <div className="flex items-center justify-between text-stone-500 text-[11px]">
                            <span>Kovan: <strong>{batch.hiveNumber}</strong></span>
                            <span>Tarih: {batch.date}</span>
                          </div>
                          {batch.moisturePercent && (
                            <div className="text-[11px] text-emerald-700 font-semibold">
                              Nem: %{batch.moisturePercent} • {batch.qualityGrade || "Standart"}
                            </div>
                          )}
                          {batch.notes && (
                            <p className="text-[11px] text-stone-600 italic bg-amber-50/50 p-1.5 rounded">
                              "{batch.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic py-2">
                      Bu ayda kayıtlı bal sağımı bulunmamaktadır.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SEASONAL HONEY PRODUCTION & ANNUAL TRENDS LINE CHART */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs ring-2 ring-emerald-400/20">
                  <TrendingUp className="w-5 h-5 text-emerald-50" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      Mevsimsel Bal Üretimi & Yıllık Verimlilik Çizgi Grafiği
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 flex items-center gap-1">
                      <span>📈</span> Recharts Çizgi Grafik (LineChart)
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Yıllık bal sağım verilerini 12 aylık mevsimsel nektar döngüsünde (İlkbahar, Yaz, Sonbahar) çizgi grafik olarak takip edin, rekolte trendlerini analiz edin
                  </p>
                </div>
              </div>

              {/* View Options & Metric Switches */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                {/* Metric Mode Switcher */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setSeasonalTrendMetric("monthly")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      seasonalTrendMetric === "monthly"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Aylık Hasat (kg)
                  </button>
                  <button
                    onClick={() => setSeasonalTrendMetric("cumulative")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      seasonalTrendMetric === "cumulative"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Kümülatif Artış
                  </button>
                  <button
                    onClick={() => setSeasonalTrendMetric("normalized")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      seasonalTrendMetric === "normalized"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Mevsimsel Pay (% Yıllık)
                  </button>
                </div>

                {/* Benchmark Toggle Button */}
                <button
                  onClick={() => setShowSeasonalBenchmark(!showSeasonalBenchmark)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 ${
                    showSeasonalBenchmark
                      ? "bg-stone-800 text-white border-stone-800 shadow-2xs"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                  title="Doğal bölgesel nektar akım potansiyel eğrisini göster/gizle"
                >
                  <span>🌿</span>
                  <span>Referans Eğrisi</span>
                </button>
              </div>
            </div>

            {/* 4 Seasonal Performance Cards (İlkbahar, Yaz, Sonbahar, Kış) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {seasonalBreakdown.seasonsList.map((season) => {
                const isSelected = selectedSeasonFilter === season.id;
                return (
                  <button
                    key={season.id}
                    onClick={() =>
                      setSelectedSeasonFilter(selectedSeasonFilter === season.id ? "all" : (season.id as any))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all space-y-1 relative ${
                      isSelected
                        ? "ring-2 ring-emerald-500 shadow-xs bg-white border-emerald-400"
                        : "bg-stone-50/70 border-stone-200 hover:bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                      <span className="flex items-center gap-1.5 font-bold text-stone-800">
                        <span>{season.icon}</span>
                        <span>{season.name}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-stone-200/70 text-stone-700">
                        {season.period}
                      </span>
                    </div>

                    <div className="text-xl font-black text-stone-900 mt-1 flex items-baseline gap-1.5">
                      <span>{season.kg}</span>
                      <span className="text-xs font-normal text-stone-500">kg</span>
                      {seasonalBreakdown.totalActiveYr > 0 && (
                        <span className="text-xs font-bold text-emerald-700 ml-auto">
                          %{season.share}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-stone-500 truncate" title={season.flora}>
                      {season.flora}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recharts LineChart Canvas */}
            <div className="h-80 sm:h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredSeasonalMonthlyData}
                  margin={{ top: 20, right: 25, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    interval={0}
                    label={{
                      value: "12 Aylık Mevsim Takvimi (İlkbahar • Yaz • Sonbahar • Kış)",
                      position: "insideBottom",
                      offset: -18,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    domain={[0, (dataMax: number) => Math.max(15, Math.ceil(dataMax * 1.15))]}
                    tickFormatter={(val) =>
                      seasonalTrendMetric === "normalized" ? `%${val}` : `${val} kg`
                    }
                    label={{
                      value:
                        seasonalTrendMetric === "monthly"
                          ? "Aylık Hasat (kg)"
                          : seasonalTrendMetric === "cumulative"
                          ? "Kümülatif Bal (kg)"
                          : "Mevsimsel Pay (% Yıllık)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 18,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />

                  <Tooltip content={<CustomSeasonalLineTooltip />} />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: 12, fontWeight: 600 }}
                  />

                  {/* Seasonal Division Reference Lines */}
                  <ReferenceLine
                    x="Mar"
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: "🌸 İlkbahar",
                      position: "insideTopLeft",
                      fill: "#047857",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <ReferenceLine
                    x="Haz"
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: "☀️ Yaz (Ana Hasat)",
                      position: "insideTopLeft",
                      fill: "#b45309",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <ReferenceLine
                    x="Eyl"
                    stroke="#ea580c"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: "🌲 Sonbahar (Çam)",
                      position: "insideTopLeft",
                      fill: "#c2410c",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  {/* Benchmark flora potential line if enabled */}
                  {showSeasonalBenchmark && seasonalTrendMetric === "monthly" && (
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Doğal Nektar Akım Potansiyeli"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}

                  {/* Seasonal Lines for Each Available Year */}
                  {availableYears.map((yr) => {
                    const palette = getYearPalette(yr);
                    const dataKey =
                      seasonalTrendMetric === "monthly"
                        ? `val_${yr}`
                        : seasonalTrendMetric === "cumulative"
                        ? `cum_${yr}`
                        : `share_${yr}`;

                    const strokeColor =
                      yr === "2026"
                        ? "#059669"
                        : yr === "2025"
                        ? "#d97706"
                        : yr === "2024"
                        ? "#0284c7"
                        : palette.stroke;

                    const fillColor =
                      yr === "2026"
                        ? "#10b981"
                        : yr === "2025"
                        ? "#f59e0b"
                        : yr === "2024"
                        ? "#0ea5e9"
                        : palette.fill;

                    return (
                      <Line
                        key={yr}
                        type="monotone"
                        dataKey={dataKey}
                        name={`${yr} Sezonu`}
                        stroke={strokeColor}
                        strokeWidth={yr === "2026" ? 3.5 : 2.5}
                        dot={{ r: 4.5, fill: fillColor, stroke: "#ffffff", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: strokeColor, stroke: "#ffffff", strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Seasonal Productivity Insights & Phenology Footnote */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
                  💡 Mevsimsel Analiz:
                </span>
                <span>
                  En yüksek bal sağım zirvesi <strong>{seasonalBreakdown.peak.name}</strong> (%{seasonalBreakdown.peak.share}) dönemindedir.
                </span>
              </div>

              {selectedSeasonFilter !== "all" && (
                <button
                  onClick={() => setSelectedSeasonFilter("all")}
                  className="text-xs text-amber-800 font-bold hover:underline self-start sm:self-auto"
                >
                  Tüm Ayları Göster (Filtreyi Kaldır)
                </button>
              )}
            </div>
          </div>

          {/* ANNUAL HONEY PRODUCTION BY MONTH RECHARTS BAR CHART */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                  <BarChart3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      Yıllık Bal Üretimi Aylık Karşılaştırma Grafiği
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                      Recharts Çubuk Grafik
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Farklı sezonlardaki aylık süzme, karakovan ve salgı balı sağım verimlerini yan yana karşılaştırın
                  </p>
                </div>
              </div>

              {/* View Options & Filters */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                {/* Product Type Filter */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setHarvestProductFilter("honey_only")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      harvestProductFilter === "honey_only"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    🍯 Sadece Bal
                  </button>
                  <button
                    onClick={() => setHarvestProductFilter("all")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      harvestProductFilter === "all"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Tüm Ürünler
                  </button>
                </div>

                {/* Compare Mode Toggle */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setHarvestCompareMode("compare")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      harvestCompareMode === "compare"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Yılları Karşılaştır
                  </button>
                  <button
                    onClick={() => setHarvestCompareMode("single")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      harvestCompareMode === "single"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Tek Yıl
                  </button>
                </div>

                {/* Year Select (if in single year mode) */}
                {harvestCompareMode === "single" && (
                  <select
                    value={selectedPrimaryYear}
                    onChange={(e) => setSelectedPrimaryYear(e.target.value)}
                    className="text-xs py-1.5 px-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-stone-800 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} Sezonu
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Quick KPI Stats for Annual Honey Production */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>{latestYear} Toplam Hasat</span>
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {latestYearTotal.toFixed(1)} <span className="text-xs font-normal text-stone-600">kg</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {availableYears.length > 1 ? `${previousYear}: ${previousYearTotal.toFixed(1)} kg` : "Kayıtlı toplam"}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Yıllık Değişim</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 mt-1 flex items-center gap-1">
                  {yearGrowthPercent !== null ? (
                    <>
                      {yearGrowthPercent >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-600" />
                      )}
                      <span>%{Math.abs(yearGrowthPercent)}</span>
                    </>
                  ) : (
                    <span>Sezon Başı</span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {previousYear ? `${previousYear} yılına kıyasla` : "Referans sezon"}
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>En Verimli Hasat Ayı</span>
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {peakMonthPerYear[latestYear]?.month || "-"}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Pik hasat: {peakMonthPerYear[latestYear]?.kg || 0} kg
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Kovan Başı Verim</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-900 mt-1">
                  {hives.length > 0 ? (latestYearTotal / hives.length).toFixed(1) : "0.0"}{" "}
                  <span className="text-xs font-normal text-stone-600">kg/kovan</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {hives.length} aktif koloni üzerinden
                </div>
              </div>
            </div>

            {/* Recharts BarChart Canvas */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
                >
                  <defs>
                    <linearGradient id="barGrad2026" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
                    </linearGradient>
                    <linearGradient id="barGrad2025" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.75} />
                    </linearGradient>
                    <linearGradient id="barGrad2024" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={0.75} />
                    </linearGradient>
                    <linearGradient id="barGradOther" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.75} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />

                  <YAxis
                    stroke="#92400e"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    domain={[0, (dataMax: number) => Math.max(15, Math.ceil(dataMax * 1.15))]}
                    tickFormatter={(val) => `${val} kg`}
                    label={{
                      value: "Üretim Miktarı (kg)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#92400e", fontSize: 11 },
                    }}
                  />

                  <Tooltip content={<CustomHarvestTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                  />

                  {/* Reference line for regional target yield */}
                  <ReferenceLine
                    y={20}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: "Hedef Hasat Eşiği (20 kg)",
                      position: "insideTopLeft",
                      fill: "#b45309",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  {/* Render Bars based on compare mode */}
                  {harvestCompareMode === "compare" ? (
                    availableYears.map((yr) => {
                      const palette = getYearPalette(yr);
                      const gradId =
                        yr === "2026"
                          ? "url(#barGrad2026)"
                          : yr === "2025"
                          ? "url(#barGrad2025)"
                          : yr === "2024"
                          ? "url(#barGrad2024)"
                          : "url(#barGradOther)";
                      return (
                        <Bar
                          key={yr}
                          dataKey={`year_${yr}`}
                          name={`${yr} Hasadı (kg)`}
                          fill={gradId}
                          stroke={palette.stroke}
                          strokeWidth={1}
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                      );
                    })
                  ) : (
                    <Bar
                      dataKey={`year_${selectedPrimaryYear}`}
                      name={`${selectedPrimaryYear} Sezonu Hasadı (kg)`}
                      fill={
                        selectedPrimaryYear === "2026"
                          ? "url(#barGrad2026)"
                          : selectedPrimaryYear === "2025"
                          ? "url(#barGrad2025)"
                          : "url(#barGrad2024)"
                      }
                      stroke={getYearPalette(selectedPrimaryYear).stroke}
                      strokeWidth={1}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 12-Month Quick Inspection Capsules */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aylık Bal Sağım Takvimi & Doğa Fenolojisi</span>
                </span>
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  Detayları ve kayıtlı partileri incelemek için aya tıklayın
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {monthlyChartData.map((m) => {
                  const isSelected = selectedChartMonth === m.monthKey;
                  const hasHarvest = m.totalAllYears > 0;
                  return (
                    <button
                      key={m.monthKey}
                      onClick={() =>
                        setSelectedChartMonth(isSelected ? null : m.monthKey)
                      }
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400/40 shadow-xs"
                          : hasHarvest
                          ? "bg-amber-50/60 border-amber-200 hover:bg-amber-100/50"
                          : "bg-white border-stone-200 hover:border-amber-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-800">{m.name}</div>
                      <div className="text-xs font-black text-stone-900 my-1">
                        {hasHarvest ? (
                          <span className="text-amber-800 font-extrabold">
                            {m.totalAllYears} kg
                          </span>
                        ) : (
                          <span className="text-stone-300 font-normal">-</span>
                        )}
                      </div>
                      <div className="text-[9px] text-stone-500 truncate" title={m.nectarPhase}>
                        {m.fullName}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Month Detail Card */}
              {selectedMonthData && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍯</span>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {selectedMonthData.fullName} Ayı Bal Hasat Detayları & Nektar Analizi
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {selectedMonthData.nectarPhase}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                        Toplam Hasat: {selectedMonthData.totalAllYears} kg
                      </span>
                      <button
                        onClick={() => setSelectedChartMonth(null)}
                        className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg hover:bg-amber-200/50"
                      >
                        Kapat ✕
                      </button>
                    </div>
                  </div>

                  {selectedMonthData.batches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {selectedMonthData.batches.map((batch: HarvestRecord) => (
                        <div
                          key={batch.id}
                          className="bg-white p-3 rounded-lg border border-amber-200 text-xs shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{batch.productType}</span>
                            <span className="font-black text-amber-800">{batch.quantityKg} kg</span>
                          </div>
                          <div className="flex items-center justify-between text-stone-500 text-[11px]">
                            <span>Kovan: <strong>{batch.hiveNumber}</strong></span>
                            <span>Tarih: {batch.date}</span>
                          </div>
                          {batch.moisturePercent && (
                            <div className="text-[11px] text-emerald-700 font-semibold">
                              Nem: %{batch.moisturePercent} • {batch.qualityGrade || "Standart"}
                            </div>
                          )}
                          {batch.notes && (
                            <p className="text-[11px] text-stone-600 italic bg-amber-50/50 p-1.5 rounded">
                              "{batch.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic py-2">
                      Bu ayda henüz kayıtlı hasat bulunmuyor. Nektar akım takvimine göre dinlenme veya kovan gelişim dönemidir.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* HIVE PRODUCTIVITY ANALYSIS: BROOD FRAMES VS. HONEY FRAMES BAR CHART */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs ring-2 ring-amber-400/20">
                  <Award className="w-5 h-5 text-amber-50" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      Koloni Verimlilik Analizi: Yavru vs. Bal Çerçevesi Karşılaştırması
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
                      <span>🍯</span> Recharts Kovan Karşılaştırma Grafiği
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Her kovanın 'Yavrulu Çerçeve' (Kuluçka gücü) ve 'Ballı Çerçeve' (Bal stoku) kapasitesini kıyaslayarak en verimli üretici kolonileri tespit edin
                  </p>
                </div>
              </div>

              {/* View Controls & Filter Bar */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                {/* Chart Mode Toggle */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setProductivityChartMode("grouped")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      productivityChartMode === "grouped"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Yan Yana Çubuklar
                  </button>
                  <button
                    onClick={() => setProductivityChartMode("stacked")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      productivityChartMode === "stacked"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Yığılmış (Toplam Doluluk)
                  </button>
                </div>

                {/* Colony Filter */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setProductivityFilter("all")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      productivityFilter === "all"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Tüm Kovanlar ({hiveProductivityList.length})
                  </button>
                  <button
                    onClick={() => setProductivityFilter("supers_only")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      productivityFilter === "supers_only"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                    title="Sadece ballık / kat atılmış kovanlar"
                  >
                    Katlı / Ballıklı
                  </button>
                  <button
                    onClick={() => setProductivityFilter("strong_only")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      productivityFilter === "strong_only"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                    title="8 ve üzeri çerçeveye sahip güçlü koloniler"
                  >
                    8+ Çerçeve
                  </button>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Sırala:</span>
                  <select
                    value={productivitySortBy}
                    onChange={(e: any) => setProductivitySortBy(e.target.value)}
                    className="text-xs py-1.5 px-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-stone-800 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="honey_desc">🍯 En Çok Bal (Verim)</option>
                    <option value="brood_desc">🐝 En Çok Yavru (Kuluçka)</option>
                    <option value="ratio_desc">⚖️ Bal/Yavru Oranı</option>
                    <option value="total_frames">📦 Toplam Çerçeve</option>
                    <option value="hive_number">🔢 Kovan No Sırası</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4 KPI Highlight Cards for Colony Productivity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Top Honey Producer */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1 text-amber-900 font-bold">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>En Yüksek Verimli Koloni</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                    Lider
                  </span>
                </div>
                <div className="text-xl font-black text-stone-900">
                  {mostProductiveHive?.hiveNumber || "-"}
                </div>
                <div className="text-[11px] text-stone-600 flex items-center justify-between">
                  <span>{mostProductiveHive?.honeyFrames || 0} Ballı • {mostProductiveHive?.broodFrames || 0} Yavrulu</span>
                  {mostProductiveHive?.totalHarvestKg > 0 && (
                    <span className="font-bold text-amber-800">{mostProductiveHive.totalHarvestKg} kg</span>
                  )}
                </div>
              </div>

              {/* 2. Apiary Honey Frames Average */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Ortalama Ballı Çerçeve</span>
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-800">
                  {avgApiaryHoneyFrames}{" "}
                  <span className="text-xs font-normal text-stone-600">çerçeve/kovan</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Arılık geneli toplam {totalApiaryHoneyFrames} ballı çerçeve
                </div>
              </div>

              {/* 3. Apiary Brood Frames Average */}
              <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Ortalama Yavrulu Çerçeve</span>
                  <Layers className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <div className="text-xl font-black text-orange-700">
                  {avgApiaryBroodFrames}{" "}
                  <span className="text-xs font-normal text-stone-600">çerçeve/kovan</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Arılık geneli toplam {totalApiaryBroodFrames} yavru kuluçkası
                </div>
              </div>

              {/* 4. Ready for Harvest Colonies */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Hasada Hazır Koloniler</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700">
                  {readyForHarvestCount}{" "}
                  <span className="text-xs font-normal text-stone-600">kovan</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  6 ve üzeri ballı çerçeveye sahip koloniler
                </div>
              </div>
            </div>

            {/* Recharts BarChart Canvas */}
            <div className="h-80 sm:h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredAndSortedProductivity}
                  margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
                  onClick={(state: any) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      const hiveId = state.activePayload[0].payload.id;
                      setSelectedProductiveHiveId(selectedProductiveHiveId === hiveId ? null : hiveId);
                    }
                  }}
                >
                  <defs>
                    {/* Honey Frames Gradient: Rich golden amber */}
                    <linearGradient id="prodHoneyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                    </linearGradient>
                    {/* Brood Frames Gradient: Warm terracotta orange */}
                    <linearGradient id="prodBroodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity={0.8} />
                    </linearGradient>
                    {/* Empty/Remaining frames Gradient for stacked mode */}
                    <linearGradient id="prodEmptyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                  <XAxis
                    dataKey="shortNumber"
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    interval={0}
                    label={{
                      value: "Kovan Numarası (Detay için çubuğa tıklayın)",
                      position: "insideBottom",
                      offset: -18,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    domain={[0, (dataMax: number) => Math.max(12, dataMax + 2)]}
                    label={{
                      value: "Çerçeve Adedi",
                      angle: -90,
                      position: "insideLeft",
                      offset: 18,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />

                  <Tooltip content={<CustomProductivityTooltip />} cursor={{ fill: "rgba(245, 158, 11, 0.08)" }} />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 12, fontWeight: 600 }}
                  />

                  {/* Reference line for Apiary Average Honey Frames */}
                  {avgApiaryHoneyFrames > 0 && (
                    <ReferenceLine
                      y={avgApiaryHoneyFrames}
                      stroke="#d97706"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Ort. Bal: ${avgApiaryHoneyFrames} Çerçeve`,
                        position: "insideTopRight",
                        fill: "#92400e",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                  )}

                  {/* Reference line for Harvest threshold */}
                  <ReferenceLine
                    y={6}
                    stroke="#059669"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{
                      value: "Hasat Eşiği (6+)",
                      position: "insideTopLeft",
                      fill: "#065f46",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  />

                  {productivityChartMode === "grouped" ? (
                    <>
                      {/* Honey Frames Bar */}
                      <Bar
                        dataKey="honeyFrames"
                        name="🍯 Ballı Çerçeve (Bal Rezervi)"
                        fill="url(#prodHoneyGrad)"
                        stroke="#b45309"
                        strokeWidth={1}
                        radius={[5, 5, 0, 0]}
                        maxBarSize={28}
                      >
                        {filteredAndSortedProductivity.map((entry) => (
                          <Cell
                            key={`cell-honey-${entry.id}`}
                            stroke={selectedProductiveHiveId === entry.id ? "#78350f" : "#b45309"}
                            strokeWidth={selectedProductiveHiveId === entry.id ? 2.5 : 1}
                            className="cursor-pointer transition-all hover:opacity-85"
                          />
                        ))}
                      </Bar>

                      {/* Brood Frames Bar */}
                      <Bar
                        dataKey="broodFrames"
                        name="🐝 Yavrulu Çerçeve (Kuluçka)"
                        fill="url(#prodBroodGrad)"
                        stroke="#c2410c"
                        strokeWidth={1}
                        radius={[5, 5, 0, 0]}
                        maxBarSize={28}
                      >
                        {filteredAndSortedProductivity.map((entry) => (
                          <Cell
                            key={`cell-brood-${entry.id}`}
                            stroke={selectedProductiveHiveId === entry.id ? "#7c2d12" : "#c2410c"}
                            strokeWidth={selectedProductiveHiveId === entry.id ? 2.5 : 1}
                            className="cursor-pointer transition-all hover:opacity-85"
                          />
                        ))}
                      </Bar>
                    </>
                  ) : (
                    <>
                      {/* Stacked Bars: Brood, then Honey */}
                      <Bar
                        dataKey="broodFrames"
                        name="🐝 Yavrulu Çerçeve (Kuluçka)"
                        stackId="framesStack"
                        fill="url(#prodBroodGrad)"
                        stroke="#c2410c"
                        strokeWidth={1}
                        maxBarSize={36}
                      />
                      <Bar
                        dataKey="honeyFrames"
                        name="🍯 Ballı Çerçeve (Bal Rezervi)"
                        stackId="framesStack"
                        fill="url(#prodHoneyGrad)"
                        stroke="#b45309"
                        strokeWidth={1}
                        maxBarSize={36}
                      />
                      <Bar
                        dataKey="otherFrames"
                        name="📦 Boş / Kabarmış Çerçeve"
                        stackId="framesStack"
                        fill="url(#prodEmptyGrad)"
                        stroke="#94a3b8"
                        strokeWidth={1}
                        radius={[5, 5, 0, 0]}
                        maxBarSize={36}
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hive Quick Selection & Detail Cards Row */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kovan Verimlilik Sıralaması ({filteredAndSortedProductivity.length} Kovan)</span>
                </span>
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  Detaylı analiz kartını açmak için kovana tıklayın
                </span>
              </div>

              {/* Hive Badges / Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {filteredAndSortedProductivity.map((item, idx) => {
                  const isSelected = selectedProductiveHiveId === item.id;
                  const isLeader = idx === 0 && productivitySortBy === "honey_desc";

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setSelectedProductiveHiveId(isSelected ? null : item.id)
                      }
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400/50 shadow-xs"
                          : "bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50/40"
                      }`}
                    >
                      {isLeader && (
                        <span className="absolute -top-1.5 -right-1 text-xs">👑</span>
                      )}
                      <div className="text-xs font-bold text-stone-800 flex items-center justify-center gap-1">
                        <span>{item.shortNumber}</span>
                      </div>
                      <div className="my-1 space-y-0.5">
                        <div className="text-[11px] font-black text-amber-800 flex items-center justify-center gap-1">
                          <span>🍯 {item.honeyFrames}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-orange-700 flex items-center justify-center gap-1">
                          <span>🐝 {item.broodFrames}</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-stone-500 truncate" title={item.category}>
                        {item.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Hive Detailed Colony Inspection Card */}
              {selectedProductiveHiveData && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/70 border border-amber-300 shadow-xs space-y-3 animate-in fade-in">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shadow-xs">
                        🐝
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                            {selectedProductiveHiveData.hiveNumber} Verimlilik & Koloni Karnesi
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedProductiveHiveData.categoryColor}`}
                          >
                            {selectedProductiveHiveData.category}
                          </span>
                          {selectedProductiveHiveData.honeySuperCount > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                              {selectedProductiveHiveData.honeySuperCount} Katlı Ballık
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {selectedProductiveHiveData.type} Kovan • {selectedProductiveHiveData.queenRace} Irkı ({selectedProductiveHiveData.queenYear}) • Sağlık: {selectedProductiveHiveData.healthStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedProductiveHiveData.totalHarvestKg > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-stone-500 block">Kayıtlı Toplam Sağım:</span>
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                            {selectedProductiveHiveData.totalHarvestKg} kg bal
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedProductiveHiveId(null)}
                        className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg hover:bg-amber-100"
                      >
                        Kapat ✕
                      </button>
                    </div>
                  </div>

                  {/* Frame Distribution Progress Visualizer */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                      <span>Çerçeve Dağılımı ({selectedProductiveHiveData.totalFrames} Kapasite)</span>
                      <span className="text-stone-500 text-[11px]">
                        Bal/Yavru Oranı: <strong className="text-amber-900 font-bold">{selectedProductiveHiveData.productivityRatio}x</strong>
                      </span>
                    </div>

                    <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner border border-stone-200">
                      <div
                        style={{
                          width: `${(selectedProductiveHiveData.honeyFrames / selectedProductiveHiveData.totalFrames) * 100}%`,
                        }}
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-amber-950"
                        title={`Ballı Çerçeve: ${selectedProductiveHiveData.honeyFrames} adet`}
                      >
                        {selectedProductiveHiveData.honeyFrames > 0 ? `${selectedProductiveHiveData.honeyFrames} Bal` : ""}
                      </div>
                      <div
                        style={{
                          width: `${(selectedProductiveHiveData.broodFrames / selectedProductiveHiveData.totalFrames) * 100}%`,
                        }}
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                        title={`Yavrulu Çerçeve: ${selectedProductiveHiveData.broodFrames} adet`}
                      >
                        {selectedProductiveHiveData.broodFrames > 0 ? `${selectedProductiveHiveData.broodFrames} Yavru` : ""}
                      </div>
                      {selectedProductiveHiveData.otherFrames > 0 && (
                        <div
                          style={{
                            width: `${(selectedProductiveHiveData.otherFrames / selectedProductiveHiveData.totalFrames) * 100}%`,
                          }}
                          className="bg-stone-200 h-full flex items-center justify-center text-[9px] font-semibold text-stone-600"
                          title={`Boş / Ham Çerçeve: ${selectedProductiveHiveData.otherFrames} adet`}
                        >
                          {selectedProductiveHiveData.otherFrames} Boş
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 pt-0.5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                          <span>Ballı: <strong>{selectedProductiveHiveData.honeyFrames}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                          <span>Yavrulu: <strong>{selectedProductiveHiveData.broodFrames}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                          <span>Boş/Kabarmış: <strong>{selectedProductiveHiveData.otherFrames}</strong></span>
                        </span>
                      </div>
                      <span className="italic text-stone-500">
                        Oğul Eğilimi: {selectedProductiveHiveData.swarmTendency}
                      </span>
                    </div>
                  </div>

                  {/* Beekeeper Action Recommendation Box */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs flex items-start gap-2.5">
                    <span className="text-base shrink-0">💡</span>
                    <div>
                      <span className="font-bold text-amber-950 block">Usta Arıcı Koloni Değerlendirmesi:</span>
                      <p className="text-stone-700 mt-0.5 leading-relaxed">
                        {selectedProductiveHiveData.assessment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Existing Table */}
          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Kovan Bazlı Hasat Listesi</h3>
              <span className="text-xs text-stone-500 font-medium">
                Süzme bal, karakovan petek, polen, propolis
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50/20 text-stone-600 font-semibold">
                    <th className="p-3">Tarih</th>
                    <th className="p-3">Kovan</th>
                    <th className="p-3">Ürün Türü</th>
                    <th className="p-3">Miktar (kg)</th>
                    <th className="p-3">Nem (%)</th>
                    <th className="p-3">Kalite</th>
                    <th className="p-3">Notlar</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {harvests.map((h) => (
                    <tr key={h.id} className="hover:bg-amber-50/30">
                      <td className="p-3 font-medium text-stone-800">{h.date}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {h.hiveNumber}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-stone-900">{h.productType}</td>
                      <td className="p-3 font-bold text-stone-900">{h.quantityKg} kg</td>
                      <td className="p-3">
                        {h.moisturePercent ? (
                          <span
                            className={`font-semibold ${
                              h.moisturePercent <= 18 ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            %{h.moisturePercent}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-100 text-stone-700">
                          {h.qualityGrade || "Standart"}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500 max-w-xs truncate">{h.notes || "-"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteHarvest(h.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-amber-300 bg-amber-50/80 font-semibold text-stone-800 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-amber-950" colSpan={3}>
                      GENEL HASAT HESAP TOPLAMI ({harvests.length} Kayıt, {hives.length} Kovan)
                    </td>
                    <td className="p-3 font-black text-amber-950 text-sm">
                      {totalHarvestKg.toFixed(1)} kg
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      %{avgMoisture || "-"} ort.
                    </td>
                    <td className="p-3 text-stone-700 font-semibold" colSpan={3}>
                      Kovan Başı Ortalama Hasat: <strong className="text-amber-900 font-black">{perHiveYield} kg / kovan</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. EQUIPMENT & MATERIAL PRICE CATALOG TAB */}
      {subTab === "equipment" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-stone-800">Yıl:</span>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Yıllar</option>
                    <option value="2026">2026 Yılı</option>
                    <option value="2025">2025 Yılı</option>
                    <option value="2024">2024 Yılı</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-800">Ay:</span>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Aylar</option>
                    <option value="01">Ocak (01)</option>
                    <option value="02">Şubat (02)</option>
                    <option value="03">Mart (03)</option>
                    <option value="04">Nisan (04)</option>
                    <option value="05">Mayıs (05)</option>
                    <option value="06">Haziran (06)</option>
                    <option value="07">Temmuz (07)</option>
                    <option value="08">Ağustos (08)</option>
                    <option value="09">Eylül (09)</option>
                    <option value="10">Ekim (10)</option>
                    <option value="11">Kasım (11)</option>
                    <option value="12">Aralık (12)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-800">Kategori:</span>
                  <select
                    value={eqCategoryFilter}
                    onChange={(e) => setEqCategoryFilter(e.target.value)}
                    className="text-xs py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="Besleme & Şerbetlik">Besleme & Şerbetlik</option>
                    <option value="Kovan Parçaları">Kovan Parçaları</option>
                    <option value="Hasat & Süzme">Hasat & Süzme</option>
                    <option value="Koruyucu Kıyafet">Koruyucu Kıyafet</option>
                    <option value="Hastalık Mücadelesi">Hastalık Mücadelesi</option>
                    <option value="Diğer Aletler">Diğer Aletler</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <span className="font-medium text-stone-600">
                  Dönem Toplamı: <strong className="text-amber-950 font-black">{filteredEquipmentTotal.toLocaleString("tr-TR")} TL</strong>
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 font-medium">
                  {filteredEquipment.length} Kalem Malzeme
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50/20 text-stone-600 font-semibold">
                    <th className="p-3">Alım Tarihi</th>
                    <th className="p-3">Malzeme Adı</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Birim Fiyat</th>
                    <th className="p-3">Adet/Miktar</th>
                    <th className="p-3">Toplam Tutar</th>
                    <th className="p-3">Tedarikçi / Mağaza</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-amber-50/30">
                      <td className="p-3 font-medium text-stone-700">{eq.purchaseDate}</td>
                      <td className="p-3 font-bold text-stone-900">{eq.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-100/70 text-amber-900">
                          {eq.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-stone-800">
                        {eq.unitPrice.toLocaleString("tr-TR")} TL
                      </td>
                      <td className="p-3 font-semibold text-stone-800">{eq.quantity}</td>
                      <td className="p-3 font-bold text-amber-900">
                        {eq.totalPrice.toLocaleString("tr-TR")} TL
                      </td>
                      <td className="p-3 text-stone-600">{eq.supplier || "-"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteEquipment(eq.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-amber-300 bg-amber-50/80 font-semibold text-stone-800 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-amber-950" colSpan={3}>
                      DÖNEM EKİPMAN & MALZEME TOPLAMI ({filteredEquipment.length} Kalem)
                    </td>
                    <td className="p-3 font-medium text-stone-600">-</td>
                    <td className="p-3 font-bold text-stone-800">
                      {filteredEquipment.reduce((acc, eq) => acc + eq.quantity, 0)} Adet
                    </td>
                    <td className="p-3 font-black text-amber-950 text-sm">
                      {filteredEquipmentTotal.toLocaleString("tr-TR")} TL
                    </td>
                    <td className="p-3 text-stone-600 text-[11px]" colSpan={2}>
                      Genel Envanter Toplamı: <strong className="text-amber-900">{totalEquipmentCost.toLocaleString("tr-TR")} TL</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINANCE LEDGER TAB */}
      {subTab === "finance" && (
        <div className="space-y-5">
          {/* Integrated Calculation & Profitability Summary Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-100/30 rounded-2xl p-5 border border-amber-300/90 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Hasat & Finans Hesap Tablosu</span>
                <h4 className="text-base font-black text-stone-900 mt-0.5">Kovan, Hasat ve Kârlılık Entegre Hesabı</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-xl border border-amber-200">
                  {hives.length} Aktif Kovan
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-950 font-bold px-3 py-1 rounded-xl border border-emerald-200">
                  {harvests.length} Hasat Kaydı
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <span className="text-[11px] font-semibold text-stone-500 block">Toplam Hasat Miktarı</span>
                <div className="text-lg font-black text-stone-900 mt-0.5">
                  {totalHarvestKg.toFixed(1)} <span className="text-xs font-semibold text-stone-600">kg</span>
                </div>
                <span className="text-[11px] text-amber-800 font-medium mt-1 block">
                  Kovan başı: <strong>{perHiveYield} kg / kovan</strong>
                </span>
              </div>

              <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <span className="text-[11px] font-semibold text-stone-500 block">Bal Satış Geliri</span>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {totalHoneyIncome.toLocaleString("tr-TR")} <span className="text-xs font-semibold text-emerald-800">TL</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
                  Kg başı gelir: <strong>{unitRevenuePerKg.toLocaleString("tr-TR")} TL / kg</strong>
                </span>
              </div>

              <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <span className="text-[11px] font-semibold text-stone-500 block">Toplam Giderler</span>
                <div className="text-lg font-black text-rose-700 mt-0.5">
                  {totalExpense.toLocaleString("tr-TR")} <span className="text-xs font-semibold text-rose-800">TL</span>
                </div>
                <span className="text-[11px] text-stone-600 font-medium mt-1 block">
                  Ekipman yatırımı: {totalEquipmentCost.toLocaleString("tr-TR")} TL
                </span>
              </div>

              <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <span className="text-[11px] font-semibold text-stone-500 block">Net Bakiye (Kâr/Zarar)</span>
                <div className={`text-lg font-black mt-0.5 ${netBalance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {netBalance >= 0 ? `+${netBalance.toLocaleString("tr-TR")}` : netBalance.toLocaleString("tr-TR")}{" "}
                  <span className="text-xs font-semibold text-stone-600">TL</span>
                </div>
                <span className="text-[11px] text-stone-700 font-medium mt-1 block">
                  Kovan başı net: <strong className={netBalance >= 0 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{perHiveNetProfit.toLocaleString("tr-TR")} TL / kovan</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-stone-800">Yıl:</span>
                  <select
                    value={finYearFilter}
                    onChange={(e) => setFinYearFilter(e.target.value)}
                    className="text-xs py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Yıllar</option>
                    <option value="2026">2026 Yılı</option>
                    <option value="2025">2025 Yılı</option>
                    <option value="2024">2024 Yılı</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-800">Ay:</span>
                  <select
                    value={finMonthFilter}
                    onChange={(e) => setFinMonthFilter(e.target.value)}
                    className="text-xs py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Aylar</option>
                    <option value="01">Ocak (01)</option>
                    <option value="02">Şubat (02)</option>
                    <option value="03">Mart (03)</option>
                    <option value="04">Nisan (04)</option>
                    <option value="05">Mayıs (05)</option>
                    <option value="06">Haziran (06)</option>
                    <option value="07">Temmuz (07)</option>
                    <option value="08">Ağustos (08)</option>
                    <option value="09">Eylül (09)</option>
                    <option value="10">Ekim (10)</option>
                    <option value="11">Kasım (11)</option>
                    <option value="12">Aralık (12)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-800">Tür:</span>
                  <select
                    value={finTypeFilter}
                    onChange={(e) => setFinTypeFilter(e.target.value as any)}
                    className="text-xs py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm İşlemler</option>
                    <option value="income">Yalnızca Gelirler (+)</option>
                    <option value="expense">Yalnızca Giderler (-)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-800">Kategori:</span>
                  <select
                    value={finCategoryFilter}
                    onChange={(e) => setFinCategoryFilter(e.target.value)}
                    className="text-xs py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="Bal Satışı">Bal Satışı</option>
                    <option value="Polen / Propolis Satışı">Polen / Propolis Satışı</option>
                    <option value="Şeker & Besin Alımı">Şeker & Besin Alımı</option>
                    <option value="Kovan & Çerçeve">Kovan & Çerçeve</option>
                    <option value="Varroa & İlaç Mücadelesi">Varroa & İlaç Mücadelesi</option>
                    <option value="Kıyafet & Ekipman">Kıyafet & Ekipman</option>
                    <option value="Yakıt & Nakliye">Yakıt & Nakliye</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <span className="text-emerald-700 font-bold">
                  Gelir: +{filteredIncome.toLocaleString("tr-TR")} TL
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-rose-700 font-bold">
                  Gider: -{filteredExpense.toLocaleString("tr-TR")} TL
                </span>
                <span className="text-stone-400">|</span>
                <span className={`font-black ${filteredNet >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  Fark: {filteredNet >= 0 ? `+${filteredNet.toLocaleString("tr-TR")}` : filteredNet.toLocaleString("tr-TR")} TL
                </span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Gelir ve Gider Kayıt Defteri</h3>
                <span className="text-xs text-stone-500 font-medium">Bal satışları, malzeme alımları ve işletme giderleri dökümü</span>
              </div>
              <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                {filteredFinances.length} Kayıt Gösteriliyor
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50/20 text-stone-600 font-semibold">
                    <th className="p-3">Tarih</th>
                    <th className="p-3">Tür</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Açıklama</th>
                    <th className="p-3 text-right">Tutar (TL)</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {filteredFinances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-400 text-xs font-medium">
                        Seçilen filtrelere uygun finansal kayıt bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredFinances.map((f) => (
                      <tr key={f.id} className="hover:bg-amber-50/30">
                        <td className="p-3 font-medium text-stone-700">{f.date}</td>
                        <td className="p-3">
                          {f.type === "income" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <ArrowDownRight className="w-3.5 h-3.5" /> Gelir
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <ArrowUpRight className="w-3.5 h-3.5" /> Gider
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-stone-800">{f.category}</td>
                        <td className="p-3 text-stone-600">{f.description}</td>
                        <td
                          className={`p-3 text-right font-bold ${
                            f.type === "income" ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {f.type === "income" ? "+" : "-"}
                          {f.amount.toLocaleString("tr-TR")} TL
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteFinance(f.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                            title="Kaydı Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* Table Footer with Detailed Calculations (Yukarıda Belirtilen Hesapların Tablo İçi Satırları) */}
                <tfoot className="border-t-2 border-amber-300 bg-amber-50/70 font-semibold text-stone-800 divide-y divide-amber-200/60">
                  {/* Row 1: Period Totals */}
                  <tr className="bg-amber-100/40">
                    <td className="p-3 font-bold text-stone-800" colSpan={4}>
                      Dönem Gelirleri Toplamı (+)
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700 text-sm">
                      +{filteredIncome.toLocaleString("tr-TR")} TL
                    </td>
                    <td></td>
                  </tr>

                  {/* Row 2: Expense Totals */}
                  <tr className="bg-amber-100/40">
                    <td className="p-3 font-bold text-stone-800" colSpan={4}>
                      Dönem Giderleri Toplamı (-)
                    </td>
                    <td className="p-3 text-right font-black text-rose-700 text-sm">
                      -{filteredExpense.toLocaleString("tr-TR")} TL
                    </td>
                    <td></td>
                  </tr>

                  {/* Row 3: Net Balance Calculation */}
                  <tr className="bg-amber-200/40 font-bold">
                    <td className="p-3 font-black text-amber-950 text-sm" colSpan={4}>
                      DÖNEM NET FİNANSAL BAKİYESİ (KÂR / ZARAR)
                    </td>
                    <td
                      className={`p-3 text-right font-black text-base ${
                        filteredNet >= 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {filteredNet >= 0 ? `+${filteredNet.toLocaleString("tr-TR")}` : filteredNet.toLocaleString("tr-TR")} TL
                    </td>
                    <td></td>
                  </tr>

                  {/* Row 4: Per Hive and Yield Breakdown Calculation */}
                  <tr className="bg-stone-50 text-[11px] text-stone-600">
                    <td className="p-3" colSpan={6}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span>
                          🎯 <strong>{hives.length} Kovan Başına Net Kâr:</strong>{" "}
                          <strong className={filteredNet >= 0 ? "text-emerald-700" : "text-rose-700"}>
                            {hives.length > 0 ? Math.round(filteredNet / hives.length).toLocaleString("tr-TR") : 0} TL / kovan
                          </strong>
                        </span>
                        <span>
                          🍯 <strong>{totalHarvestKg.toFixed(1)} kg Hasata Oranı:</strong>{" "}
                          <strong className="text-amber-900">
                            {totalHarvestKg > 0 ? (filteredIncome / totalHarvestKg).toFixed(1) : 0} TL / kg hasat geliri
                          </strong>
                        </span>
                        <span>
                          📊 <strong>Genel Kümülatif Net Bakiye:</strong>{" "}
                          <strong className={netBalance >= 0 ? "text-emerald-700" : "text-rose-700"}>
                            {netBalance >= 0 ? `+${netBalance.toLocaleString("tr-TR")}` : netBalance.toLocaleString("tr-TR")} TL
                          </strong>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBSIDIES & TAX CALCULATOR TAB CONTENT */}
      {subTab === "subsidies" && (
        <SubsidiesTaxCalculator
          hives={hives}
          totalHoneyIncome={totalHoneyIncome}
          onAddFinanceRecord={onAddFinance}
        />
      )}

      {/* MODAL: ADD HARVEST */}
      {showAddHarvest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-300 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">Yeni Hasat Kaydı</h3>

            <form onSubmit={handleCreateHarvest} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hasat Edilen Kovan</label>
                <select
                  value={hHiveId}
                  onChange={(e) => setHHiveId(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hiveNumber} ({h.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tarih</label>
                  <input
                    type="date"
                    value={hDate}
                    onChange={(e) => setHDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Miktar (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={hQty}
                    onChange={(e) => setHQty(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Ürün Türü</label>
                <select
                  value={hProduct}
                  onChange={(e) => setHProduct(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="Suzme Cicek Bali">Süzme Çiçek Balı</option>
                  <option value="Cam Bali">Çam Balı (Basra)</option>
                  <option value="Kestane Bali">Kestane Balı</option>
                  <option value="Petek Bal">Petek Bal (Kasnak/Çerçeve)</option>
                  <option value="Karakovan Bali">Doğal Karakovan Balı</option>
                  <option value="Yas Polen">Taze Yaş Polen</option>
                  <option value="Kuru Polen">Kuru Polen</option>
                  <option value="Propolis">Ham Propolis</option>
                  <option value="Ari变Sutu">Arı Sütü</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nem Oranı (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hMoisture}
                    onChange={(e) => setHMoisture(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kalite Standardı</label>
                  <select
                    value={hGrade}
                    onChange={(e) => setHGrade(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Yuksek Kalite">Yüksek Kalite</option>
                    <option value="Premium Organik">Premium Organik</option>
                    <option value="Standart">Standart</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Notlar / Parti Kodu</label>
                <input
                  type="text"
                  placeholder="Örn: 2026 Yayla hasadı, aroması çok zengin"
                  value={hNotes}
                  onChange={(e) => setHNotes(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddHarvest(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Hasadı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EQUIPMENT / MATERIAL */}
      {showAddEquipment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-300 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">Arıcılık Malzemesi & Fiyat Kaydı</h3>

            <form onSubmit={handleCreateEquipment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Malzeme Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Kristal Şeker 50kg, Paslanmaz Körük, Formik Asit"
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Kategori</label>
                <select
                  value={eqCategory}
                  onChange={(e) => setEqCategory(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="Besleme & Şerbetlik">Besleme & Şerbetlik (Şeker vb.)</option>
                  <option value="Temel Ekipman">Temel Ekipman (Körük, Maske)</option>
                  <option value="Kovan Parçaları">Kovan Parçaları (Kovan, Çerçeve, Mum)</option>
                  <option value="Hastalık Mücadelesi">Hastalık & Varroa İlaçları</option>
                  <option value="Hasat Ekipmanı">Hasat Ekipmanı (Süzme Kazanı, Sır Tarağı)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Alım Tarihi</label>
                  <input
                    type="date"
                    value={eqDate}
                    onChange={(e) => setEqDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Adet / Miktar</label>
                  <input
                    type="number"
                    min="1"
                    value={eqQuantity}
                    onChange={(e) => setEqQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Birim Liste Fiyatı (TL)</label>
                <input
                  type="number"
                  min="1"
                  value={eqUnitPrice}
                  onChange={(e) => setEqUnitPrice(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
                <span className="text-[11px] text-amber-800 font-bold block mt-1">
                  Toplam Tutar: {(eqUnitPrice * eqQuantity).toLocaleString("tr-TR")} TL
                </span>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Tedarikçi / Mağaza</label>
                <input
                  type="text"
                  placeholder="Örn: Bölge Arıcılar Birliği, Şeker Fabrikası"
                  value={eqSupplier}
                  onChange={(e) => setEqSupplier(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddEquipment(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Malzemeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FINANCE */}
      {showAddFinance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-300 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">Gelir / Gider Kaydı</h3>

            <form onSubmit={handleCreateFinance} className="mt-4 space-y-3 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFType("income");
                    setFCategory("Bal Satışı");
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                    fType === "income"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  + Gelir (Tahsilat)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFType("expense");
                    setFCategory("Şeker & Besin Alımı");
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                    fType === "expense"
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  - Gider (Ödeme)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tarih</label>
                  <input
                    type="date"
                    value={fDate}
                    onChange={(e) => setFDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tutar (TL)</label>
                  <input
                    type="number"
                    min="1"
                    value={fAmount}
                    onChange={(e) => setFAmount(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Kategori</label>
                <select
                  value={fCategory}
                  onChange={(e) => setFCategory(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {fType === "income" ? (
                    <>
                      <option value="Bal Satışı">Bal Satışı</option>
                      <option value="Polen / Propolis Satışı">Polen / Propolis Satışı</option>
                      <option value="Ana Arı / Koloni Satışı">Ana Arı / Koloni Satışı</option>
                      <option value="Diğer">Diğer Gelir</option>
                    </>
                  ) : (
                    <>
                      <option value="Şeker & Besin Alımı">Şeker & Besin Alımı</option>
                      <option value="Kovan & Çerçeve">Kovan & Çerçeve</option>
                      <option value="Varroa & İlaç Mücadelesi">Varroa & İlaç Mücadelesi</option>
                      <option value="Kıyafet & Ekipman">Kıyafet & Ekipman</option>
                      <option value="Yakıt & Nakliye">Yakıt & Göçer Nakliye</option>
                      <option value="Diğer">Diğer Gider</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="İşlem detayı veya müşteri bilgisi"
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddFinance(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
