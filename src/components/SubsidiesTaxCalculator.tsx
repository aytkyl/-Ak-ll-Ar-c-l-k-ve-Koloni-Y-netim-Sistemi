import React, { useState, useMemo } from "react";
import {
  Landmark,
  ShieldCheck,
  FileText,
  Calculator,
  Percent,
  HelpCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Truck,
  UserCheck,
  Building2,
  Check,
  Zap,
} from "lucide-react";
import { FinancialRecord, Hive } from "../types";

interface SubsidiesTaxCalculatorProps {
  hives: Hive[];
  totalHoneyIncome: number;
  onAddFinanceRecord: (record: FinancialRecord) => void;
}

export const SubsidiesTaxCalculator: React.FC<SubsidiesTaxCalculatorProps> = ({
  hives,
  totalHoneyIncome,
  onAddFinanceRecord,
}) => {
  // 1. Hive Count Configuration (default to actual hives or 35 if <30 for demonstration)
  const [calcHiveCount, setCalcHiveCount] = useState<number>(() => {
    return hives.length > 0 ? hives.length : 35;
  });

  // 2. Ministry Beekeeping Support Parameters (Tarım ve Orman Bakanlığı Katsayı Modeli)
  const [isUnionMember, setIsUnionMember] = useState<boolean>(true); // Birliğe üye: 140 TL, değilse: 100 TL
  const [isYoungOrFemale, setIsYoungOrFemale] = useState<boolean>(true); // 40 yaş altı veya kadın arıcı: +56 TL
  const [isMigratoryBeekeeper, setIsMigratoryBeekeeper] = useState<boolean>(false); // Gezginci arıcı: +42 TL
  const [isFirstDegreeOrgMember, setIsFirstDegreeOrgMember] = useState<boolean>(false); // 1. Derece Tarımsal Örgüt: +28 TL
  const [queenBeeSupportCount, setQueenBeeSupportCount] = useState<number>(5); // Damızlık ana arı adedi (adet başı 100 TL)

  // 3. Local Project & Equipment Subsidies (Örn. Isparta İl Özel İdare %75 hibe / %25 çiftçi payı)
  const [includeProjectSupport, setIncludeProjectSupport] = useState<boolean>(false);
  const [projectHiveCount, setProjectHiveCount] = useState<number>(20);
  const [projectHiveUnitCost, setProjectHiveUnitCost] = useState<number>(3500); // 1 arılı kovan rayiç bedeli
  const [projectGrantRatePercent, setProjectGrantRatePercent] = useState<number>(75); // %75 Hibe

  // 4. Union Fees, AKS & Service Charges
  const [unionAnnualFee, setUnionAnnualFee] = useState<number>(1000); // Yıllık üye yardımı / aidat
  const [unionPerHiveServiceFee, setUnionPerHiveServiceFee] = useState<number>(8); // Kovan başı birlik hizmeti
  const [aksPlateFeePerHive, setAksPlateFeePerHive] = useState<number>(12); // AKS plaka basım / yenileme ücreti
  const [aksAnnualInspectionFee, setAksAnnualInspectionFee] = useState<number>(250); // AKS vize / işletme güncelleme
  const [veterinaryDispatchFee, setVeterinaryDispatchFee] = useState<number>(250); // Yurtiçi veteriner sevk raporu harcı

  // 5. TARSİM Agriculture Insurance (Devlet %50 Prim Hibeli)
  const [enableTarsim, setEnableTarsim] = useState<boolean>(true);
  const [tarsimHiveValue, setTarsimHiveValue] = useState<number>(3500); // Kovan sigorta teminat değeri
  const [tarsimGrossRatePercent] = useState<number>(2.8); // Toplam prim oranı ~%2.8 (yaklaşık 100 TL/kovan)

  // 6. Tax & Withholding (193 Sayılı Gelir Vergisi Kanunu & Müstahsil Stopajı)
  const [estimatedGrossHoneySales, setEstimatedGrossHoneySales] = useState<number>(() => {
    return totalHoneyIncome > 0 ? totalHoneyIncome : 85000;
  });
  const [isExchangeRegistered, setIsExchangeRegistered] = useState<boolean>(true); // Ticaret Borsası Tescilli: %1, Tescilsiz: %2
  const [hasSgkExemption, setHasSgkExemption] = useState<boolean>(true); // SGK Tevkifat Muafiyet Belgesi

  // Success notifications for adding records
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  // Status checks
  const isEligibleForSupport = calcHiveCount >= 30; // 30 kovan şartı
  const isExemptFromIncomeTax = calcHiveCount <= 500; // 193 GVK Md. 53: 500 kovana kadar gelir vergisinden muaf!

  // --- Calculations ---

  // Ministry Per-Hive Unit Subsidy
  const baseSupportPerHive = isUnionMember ? 140 : 100;
  const youngFemaleBonus = isYoungOrFemale ? 56 : 0;
  const migratoryBonus = isMigratoryBeekeeper ? 42 : 0;
  const firstDegreeOrgBonus = isFirstDegreeOrgMember ? 28 : 0;
  const totalPerHiveSupport = baseSupportPerHive + youngFemaleBonus + migratoryBonus + firstDegreeOrgBonus;

  // Ministry Total Payment
  const ministryHiveSupportTotal = isEligibleForSupport ? calcHiveCount * totalPerHiveSupport : 0;
  const queenBeeSupportTotal = isEligibleForSupport ? queenBeeSupportCount * 100 : 0;
  const totalMinistrySupport = ministryHiveSupportTotal + queenBeeSupportTotal;

  // Project Subsidy Calculation (%75 Hibe / %25 Çiftçi)
  const totalProjectValue = includeProjectSupport ? projectHiveCount * projectHiveUnitCost : 0;
  const projectGrantAmount = Math.round(totalProjectValue * (projectGrantRatePercent / 100));
  const projectFarmerContribution = totalProjectValue - projectGrantAmount;

  // Total Grants & Subsidies
  const grandTotalGrants = totalMinistrySupport + projectGrantAmount;

  // Union & AKS Costs
  const totalUnionFee = isUnionMember ? unionAnnualFee + calcHiveCount * unionPerHiveServiceFee : 0;
  const totalAksFee = aksAnnualInspectionFee + calcHiveCount * aksPlateFeePerHive;
  const totalDispatchFee = isMigratoryBeekeeper ? veterinaryDispatchFee * 2 : 0; // Gezginci gidiş-dönüş sevk
  const totalUnionAndAksCost = totalUnionFee + totalAksFee + totalDispatchFee;

  // TARSİM Calculation
  const totalInsuredValue = calcHiveCount * tarsimHiveValue;
  const tarsimGrossPremium = Math.round(totalInsuredValue * (tarsimGrossRatePercent / 100));
  const tarsimStateSupport = Math.round(tarsimGrossPremium * 0.5); // %50 Devlet Hibesi
  const tarsimNetCost = enableTarsim ? tarsimGrossPremium - tarsimStateSupport : 0; // Çiftçinin ödediği net

  // Tax Calculation (Müstahsil Stopajı)
  const stopajRate = isExchangeRegistered ? 1 : 2; // Borsa tescilli: %1, Tescilsiz: %2
  const stopajTaxAmount = Math.round(estimatedGrossHoneySales * (stopajRate / 100));
  const sgkCutAmount = hasSgkExemption ? 0 : Math.round(estimatedGrossHoneySales * 0.02);
  const totalWithholdingTax = stopajTaxAmount + sgkCutAmount;
  const netHoneySalesReceived = estimatedGrossHoneySales - totalWithholdingTax;

  // Combined Net Financial Benefit from Incentives
  const totalMandatoryExpenses = totalUnionAndAksCost + tarsimNetCost + totalWithholdingTax;
  const netIncentiveBenefit = grandTotalGrants - totalMandatoryExpenses;

  const showNotification = (msg: string) => {
    setAddedMessage(msg);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  const handleAddMinistrySupportToFinance = () => {
    if (totalMinistrySupport <= 0) return;
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    onAddFinanceRecord({
      id: "fin-gov-" + Date.now(),
      date: formattedDate,
      type: "income",
      category: "Bakanlık Kovan & Proje Desteği",
      amount: totalMinistrySupport,
      description: `${now.getFullYear()} Yılı Bakanlık Arılı Kovan Desteklemesi (${calcHiveCount} Kovan x ${totalPerHiveSupport} ₺ + ${queenBeeSupportCount} Damızlık Ana)`,
    });
    showNotification(`Bakanlık desteği (+${totalMinistrySupport.toLocaleString("tr-TR")} ₺) Gelir Defterine kaydedildi.`);
  };

  const handleAddUnionAksToFinance = () => {
    if (totalUnionAndAksCost <= 0) return;
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    onAddFinanceRecord({
      id: "fin-union-" + Date.now(),
      date: formattedDate,
      type: "expense",
      category: "Birlik Aidat & AKS Ücretleri",
      amount: totalUnionAndAksCost,
      description: `${now.getFullYear()} Yılı Birlik Aidatı (${totalUnionFee.toLocaleString("tr-TR")} ₺) + AKS Plaka/Vize (${totalAksFee.toLocaleString("tr-TR")} ₺)`,
    });
    showNotification(`Birlik ve AKS gideri (-${totalUnionAndAksCost.toLocaleString("tr-TR")} ₺) Gider Defterine kaydedildi.`);
  };

  const handleAddTarsimToFinance = () => {
    if (tarsimNetCost <= 0) return;
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    onAddFinanceRecord({
      id: "fin-tarsim-" + Date.now(),
      date: formattedDate,
      type: "expense",
      category: "TARSİM Sigorta Gideri",
      amount: tarsimNetCost,
      description: `${now.getFullYear()} Yılı TARSİM Arıcılık Sigortası (%50 Devlet Destekli, ${calcHiveCount} Kovan Net Prim)`,
    });
    showNotification(`TARSİM sigorta primi (-${tarsimNetCost.toLocaleString("tr-TR")} ₺) Gider Defterine kaydedildi.`);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {addedMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{addedMessage}</span>
          </div>
          <button
            onClick={() => setAddedMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-0.5"
          >
            Tamam
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500/15 via-white to-amber-100/30 rounded-2xl p-6 border border-amber-300/90 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-amber-700" />
              <span>Resmi Mevzuat & Destekleme Modülü</span>
            </div>
            <h3 className="text-xl font-black text-stone-900 mt-1">
              Devlet Teşvikleri, Birlik Aidatları, TARSİM Sigortası & Vergi Hesabı
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Tarım ve Orman Bakanlığı yeni hayvancılık katsayı modeli, 30 kovan destekleme eşiği, yerel %75 hibe projeleri, Arı Yetiştiricileri Birliği üye yardımları, TARSİM %50 hibe sigortası ve 193 sayılı GVK 53. madde küçük çiftçi muafiyet hesaplamaları.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] font-semibold text-stone-500">Net Teşvik Avantajı</span>
            <div
              className={`text-2xl font-black mt-0.5 ${
                netIncentiveBenefit >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {netIncentiveBenefit >= 0 ? `+${netIncentiveBenefit.toLocaleString("tr-TR")}` : netIncentiveBenefit.toLocaleString("tr-TR")}{" "}
              <span className="text-sm font-bold text-stone-600">TL</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium">Hibe ve Destekler - Giderler</span>
          </div>
        </div>

        {/* Quick Parameters Strip: Hive Count Controller */}
        <div className="mt-5 pt-4 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>Hesaplanan Arılı Kovan Sayısı:</span>
              <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-xs font-black">
                {calcHiveCount} Kovan
              </span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="range"
                min="1"
                max="300"
                value={calcHiveCount}
                onChange={(e) => setCalcHiveCount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <input
                type="number"
                min="1"
                max="5000"
                value={calcHiveCount}
                onChange={(e) => setCalcHiveCount(Math.max(1, Number(e.target.value)))}
                className="w-16 text-xs p-1 text-center font-bold border border-amber-300 rounded-lg bg-amber-50/50"
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500">
              <button
                type="button"
                onClick={() => setCalcHiveCount(hives.length > 0 ? hives.length : 30)}
                className="text-amber-700 hover:underline font-semibold"
              >
                Kovanlarımdan Al ({hives.length})
              </button>
              <button
                type="button"
                onClick={() => setCalcHiveCount(30)}
                className="text-amber-700 hover:underline font-semibold"
              >
                Tam 30 Kovan
              </button>
              <button
                type="button"
                onClick={() => setCalcHiveCount(100)}
                className="text-amber-700 hover:underline font-semibold"
              >
                100 Kovan
              </button>
            </div>
          </div>

          {/* 30 Hive Status Badge */}
          <div className={`p-3.5 rounded-xl border ${
            isEligibleForSupport
              ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
              : "bg-amber-50/80 border-amber-300 text-amber-950"
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {isEligibleForSupport ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>
                {isEligibleForSupport
                  ? "AKS Ticari İşletme (Desteklemeye Uygun)"
                  : "Hobi Arıcılığı (Destekleme Dışı)"}
              </span>
            </div>
            <p className="text-[11px] mt-1 leading-snug">
              {isEligibleForSupport
                ? `30 kovan şartını sağlıyorsunuz (${calcHiveCount} >= 30). Bakanlık temel ve katsayı desteklemelerine tam hak kazandınız.`
                : `Destekleme için en az 30 kovan gerekir. Hedefe ulaşmak için ${30 - calcHiveCount} kovan daha ilave edilmelidir.`}
            </p>
          </div>

          {/* Tax Exemption Status (GVK 53) */}
          <div className="p-3.5 rounded-xl border bg-blue-50/80 border-blue-300 text-blue-950">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Award className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                {isExemptFromIncomeTax
                  ? "Gelir Vergisinden Muaf (GVK Md. 53)"
                  : "Gerçek Usul Mükellefiyeti (500+ Kovan)"}
              </span>
            </div>
            <p className="text-[11px] mt-1 leading-snug">
              {isExemptFromIncomeTax
                ? `193 sayılı GVK 53. madde gereğince 500 kovana kadar gelir vergisi beyannamesi verilmez, defter tutulmaz.`
                : `500 kovan eşiği aşıldığı için ticari işletme defteri ve yıllık gelir vergisi beyannamesi zorunludur.`}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid of Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CARD 1: BAKANLIK ARILI KOVAN DESTEKLEMELERİ (KATSAYI MODELİ) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🏛️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Bakanlık Arılı Kovan Desteklemesi</h4>
                  <span className="text-[11px] text-stone-500">Tarım ve Orman Bakanlığı Yeni Katsayı Modeli</span>
                </div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg">
                {totalPerHiveSupport} TL / Kovan
              </span>
            </div>

            {/* Checkbox Options for Coefficients */}
            <div className="mt-4 space-y-2.5">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isUnionMember}
                    onChange={(e) => setIsUnionMember(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">Arı Yetiştiricileri Birliği Üyeliği</span>
                    <span className="text-[11px] text-stone-500">Üyelere 140 TL/kovan, üye olmayanlara 100 TL/kovan</span>
                  </div>
                </div>
                <span className="font-bold text-amber-900">{isUnionMember ? "140 TL" : "100 TL"}</span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isYoungOrFemale}
                    onChange={(e) => setIsYoungOrFemale(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">Genç veya Kadın Girişimci Desteği</span>
                    <span className="text-[11px] text-stone-500">40 yaş altı veya kadın arıcı katsayı ilavesi (%40)</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">+56 TL / kvn</span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isMigratoryBeekeeper}
                    onChange={(e) => setIsMigratoryBeekeeper(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">Gezginci Arıcı Desteği</span>
                    <span className="text-[11px] text-stone-500">Sabit arılık dışına göç eden üreticilere (%30 ilave)</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">+42 TL / kvn</span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFirstDegreeOrgMember}
                    onChange={(e) => setIsFirstDegreeOrgMember(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">1. Derece Tarımsal Örgüt Üyeliği</span>
                    <span className="text-[11px] text-stone-500">Bakanlık yetkili kooperatif/birlik ortaklığı (%20 ilave)</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">+28 TL / kvn</span>
              </label>

              {/* Damızlık Ana Arı */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">Damızlık / Belgeli Ana Arı Desteği</span>
                  <span className="text-[11px] text-stone-500">Onaylı ana arı üreticilerinden temin (100 TL / adet)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={queenBeeSupportCount}
                    onChange={(e) => setQueenBeeSupportCount(Math.max(0, Number(e.target.value)))}
                    className="w-14 text-center font-bold p-1 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                  <span className="text-stone-500 font-semibold">Adet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Summary & Action */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 font-semibold block">Toplam Bakanlık Hakedişi:</span>
                <div className="text-xl font-black text-emerald-700">
                  {totalMinistrySupport.toLocaleString("tr-TR")} TL
                </div>
                {!isEligibleForSupport && (
                  <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                    * 30 kovan altı olduğu için tebliğe göre ödeme yapılmaz.
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={totalMinistrySupport <= 0}
                onClick={handleAddMinistrySupportToFinance}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Gelir Olarak Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: KOVAN VE EKİPMAN PROJE DESTEKLERİ (%75 HİBE / %25 ÇİFTÇİ) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Kovan ve Ekipman Proje Destekleri</h4>
                  <span className="text-[11px] text-stone-500">Isparta & İl Özel İdare / DOKAP / KOP Projeleri</span>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-lg">
                %75 Hibe Desteği
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeProjectSupport}
                    onChange={(e) => setIncludeProjectSupport(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">İl Özel İdaresi Arılı Kovan Projesine Başvur</span>
                    <span className="text-[11px] text-stone-600">
                      Örn: Isparta'da 1.900 adet kovan desteği gibi yerel projeler
                    </span>
                  </div>
                </div>
                <span className="font-bold text-blue-900">%75 Hibe</span>
              </label>

              {includeProjectSupport && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Destek Kapsamı Kovan Sayısı:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={projectHiveCount}
                        onChange={(e) => setProjectHiveCount(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2 border border-stone-300 rounded-lg font-bold bg-white text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Kovan Rayiç Fiyatı (TL):
                      </label>
                      <input
                        type="number"
                        min="1000"
                        max="10000"
                        step="100"
                        value={projectHiveUnitCost}
                        onChange={(e) => setProjectHiveUnitCost(Number(e.target.value))}
                        className="w-full p-2 border border-stone-300 rounded-lg font-bold bg-white text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                    <div className="flex justify-between text-stone-600">
                      <span>Toplam Proje Bedeli:</span>
                      <span className="font-bold text-stone-800">{totalProjectValue.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-bold">
                      <span>%75 İl Özel İdare / Bakanlık Hibesi:</span>
                      <span>+{projectGrantAmount.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-stone-600 font-semibold border-t border-stone-100 pt-1">
                      <span>%25 Çiftçi Özkaynak Katkısı:</span>
                      <span>{projectFarmerContribution.toLocaleString("tr-TR")} TL</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 text-xs space-y-1.5">
                <div className="font-bold text-stone-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Proje Başvuru İpuçları</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  İl Özel İdareleri ve GAP/DOKAP/KOP idareleri her yıl ilkbahar aylarında arılı kovan, polen kurutma ve bal süzme makinesi dağıtım ilanına çıkar. AKS belgesi ve birlik üyelik belgesi ile İl/İlçe Tarım Müdürlüklerine başvurulur.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-semibold block">Toplam Hibe Kazanımı:</span>
              <div className="text-xl font-black text-blue-700">
                {projectGrantAmount.toLocaleString("tr-TR")} TL
              </div>
            </div>
            {includeProjectSupport && projectGrantAmount > 0 && (
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  onAddFinanceRecord({
                    id: "fin-proj-" + Date.now(),
                    date: now.toISOString().split("T")[0],
                    type: "income",
                    category: "Bakanlık Kovan & Proje Desteği",
                    amount: projectGrantAmount,
                    description: `İl Özel İdaresi %75 Arılı Kovan Proje Hibesi (${projectHiveCount} Kovan Katkısı)`,
                  });
                  showNotification(`Proje hibe tutarı (+${projectGrantAmount.toLocaleString("tr-TR")} ₺) Gelir Defterine eklendi.`);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hibe Gelirini Kaydet</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 3: BİRLİK AİDATLARI, AKS & HİZMET BEDELLERİ (YILLIK GİDER) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
                  📋
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Birlik Aidatı, AKS ve Belge Bedelleri</h4>
                  <span className="text-[11px] text-stone-500">Arı Yetiştiricileri Birliği & Tarım İl Müdürlüğü</span>
                </div>
              </div>
              <span className="text-xs bg-rose-50 text-rose-800 font-bold px-2.5 py-1 rounded-lg border border-rose-200">
                Yıllık Gider
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Yıllık Birlik Üye Yardımı / Aidatı:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={unionAnnualFee}
                      onChange={(e) => setUnionAnnualFee(Number(e.target.value))}
                      className="w-20 p-1 text-right border border-stone-300 rounded font-bold"
                    />
                    <span className="text-stone-500 font-bold">TL/yıl</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Kovan Başı Birlik Hizmet Payı (8 TL/kvn):</span>
                  <span className="font-bold text-stone-900">
                    {(calcHiveCount * unionPerHiveServiceFee).toLocaleString("tr-TR")} TL
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">AKS Kovan Plakalandırma (12 TL/plaka):</span>
                  <span className="font-bold text-stone-900">
                    {(calcHiveCount * aksPlateFeePerHive).toLocaleString("tr-TR")} TL
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">AKS İşletme Güncelleme & Vize Harcı:</span>
                  <span className="font-bold text-stone-900">{aksAnnualInspectionFee} TL</span>
                </div>

                {isMigratoryBeekeeper && (
                  <div className="flex items-center justify-between text-amber-900">
                    <span className="font-semibold">Veteriner Sevk & Nakil Sağlık Raporu:</span>
                    <span className="font-bold">{totalDispatchFee} TL</span>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs">
                <p className="text-[11px] text-stone-600">
                  💡 <strong>Birlik Avantajı:</strong> Yıllık üye yardımı ödeyen birlik üyeleri, kovan başına <strong>140 TL</strong> destekleme alırken, birlik üyesi olmayanlar yalnızca <strong>100 TL</strong> alabilmektedir (Kovan başı 40 TL net fark).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-semibold block">Toplam Birlik & Belge Gideri:</span>
              <div className="text-xl font-black text-rose-700">
                -{totalUnionAndAksCost.toLocaleString("tr-TR")} TL
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddUnionAksToFinance}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Gider Olarak Ekle</span>
            </button>
          </div>
        </div>

        {/* CARD 4: TARSİM SİGORTASI & YILLIK VERGİ / MÜSTAHSİL STOPAJ HESABI */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">TARSİM Sigortası & Vergi Hesabı</h4>
                  <span className="text-[11px] text-stone-500">%50 Devlet Prim Destekli Sigorta ve Stopaj</span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg">
                %50 Devlet Hibeli
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* TARSİM Section */}
              <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableTarsim}
                      onChange={(e) => setEnableTarsim(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <span className="font-bold text-stone-900">TARSİM Arıcılık Hayat Sigortası</span>
                  </div>
                  <span className="text-emerald-800 font-bold text-[11px]">Fırtına, Sel, Yangın, Ayı Saldırısı</span>
                </div>

                {enableTarsim && (
                  <div className="space-y-1 text-[11px] pt-1">
                    <div className="flex justify-between text-stone-600">
                      <span>Kovan Başı Teminat Değeri:</span>
                      <span className="font-bold text-stone-800">{tarsimHiveValue.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Toplam Sigorta Teminatı ({calcHiveCount} Kovan):</span>
                      <span className="font-bold text-stone-800">{totalInsuredValue.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Devlet Prim Hibesi (%50):</span>
                      <span>-{tarsimStateSupport.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-bold border-t border-emerald-200 pt-1">
                      <span>Çiftçinin Ödeyeceği Net Prim:</span>
                      <span className="text-rose-700 font-black">{tarsimNetCost.toLocaleString("tr-TR")} TL</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tax & Withholding (193 GVK Md. 94) */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-900 block">
                  Bal Satışı Müstahsil Makbuzu Stopajı (GVK Md. 94)
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-stone-600 block mb-0.5">Yıllık Brüt Bal Satışı:</label>
                    <input
                      type="number"
                      value={estimatedGrossHoneySales}
                      onChange={(e) => setEstimatedGrossHoneySales(Number(e.target.value))}
                      className="w-full p-1.5 border border-stone-300 rounded font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-stone-600 block mb-0.5">Satış Kanalı:</label>
                    <select
                      value={isExchangeRegistered ? "registered" : "unregistered"}
                      onChange={(e) => setIsExchangeRegistered(e.target.value === "registered")}
                      className="w-full p-1.5 border border-stone-300 rounded font-bold bg-white"
                    >
                      <option value="registered">Borsa Tescilli (%1 Stopaj)</option>
                      <option value="unregistered">Borsa Tescilsiz (%2 Stopaj)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-stone-600">Kesilecek Stopaj Gelir Vergisi (%{stopajRate}):</span>
                  <span className="font-bold text-rose-700">{stopajTaxAmount.toLocaleString("tr-TR")} TL</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-t border-stone-200 pt-1">
                  <span className="text-stone-700 font-bold">Arıcının Eline Net Geçen:</span>
                  <span className="font-black text-emerald-800">{netHoneySalesReceived.toLocaleString("tr-TR")} TL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-semibold block">TARSİM Net Prim & Stopaj:</span>
              <div className="text-xl font-black text-rose-700">
                -{(tarsimNetCost + stopajTaxAmount).toLocaleString("tr-TR")} TL
              </div>
            </div>
            {enableTarsim && tarsimNetCost > 0 && (
              <button
                type="button"
                onClick={handleAddTarsimToFinance}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sigortayı Gider Ekle</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Comprehensive Summary Table (Devlet Destekleri, Kesintiler ve Bilanço Tablosu) */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Yıllık Resmi Hibe, Birlik, Sigorta ve Vergi Bilanço Tablosu
            </h4>
            <p className="text-xs text-stone-500">
              {calcHiveCount} kovan için hesaplanan tüm devlet destekleri ve yasal giderlerin net bilançosu
            </p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-xl border border-amber-200">
            Resmi Katsayı Modeli (2024-2026)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50/20 text-stone-600 font-semibold">
                <th className="p-3">Kalem Adı</th>
                <th className="p-3">Mevzuat / Kurum</th>
                <th className="p-3">Birim Hakediş / Oran</th>
                <th className="p-3">Kapsam / Adet</th>
                <th className="p-3 text-right">Tutar (TL)</th>
                <th className="p-3 text-center">İşlem Türü</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {/* Row 1: Ministry Base */}
              <tr className="hover:bg-amber-50/30">
                <td className="p-3 font-bold text-stone-800">Arılı Kovan Temel Desteği</td>
                <td className="p-3 text-stone-600">Tarım ve Orman Bakanlığı (HAYBİS/AKS)</td>
                <td className="p-3 text-stone-700 font-semibold">{baseSupportPerHive} TL / kovan</td>
                <td className="p-3 text-stone-700">{isEligibleForSupport ? calcHiveCount : 0} Kovan</td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  +{(isEligibleForSupport ? calcHiveCount * baseSupportPerHive : 0).toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Devlet Hibesi
                  </span>
                </td>
              </tr>

              {/* Row 2: Young / Female */}
              {isYoungOrFemale && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">Genç / Kadın Çiftçi İlave Katsayısı</td>
                  <td className="p-3 text-stone-600">Bakanlık Teşvik Katsayısı (%40)</td>
                  <td className="p-3 text-stone-700 font-semibold">+56 TL / kovan</td>
                  <td className="p-3 text-stone-700">{isEligibleForSupport ? calcHiveCount : 0} Kovan</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +{(isEligibleForSupport ? calcHiveCount * 56 : 0).toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      İlave Destek
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 3: Migratory */}
              {isMigratoryBeekeeper && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">Gezginci Arıcı İlave Katsayısı</td>
                  <td className="p-3 text-stone-600">Bakanlık Konaklama İzinli Katsayı (%30)</td>
                  <td className="p-3 text-stone-700 font-semibold">+42 TL / kovan</td>
                  <td className="p-3 text-stone-700">{isEligibleForSupport ? calcHiveCount : 0} Kovan</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +{(isEligibleForSupport ? calcHiveCount * 42 : 0).toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      İlave Destek
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 4: 1st degree */}
              {isFirstDegreeOrgMember && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">1. Derece Tarımsal Örgüt Ortaklığı</td>
                  <td className="p-3 text-stone-600">Yetkili Kooperatif / Birlik (%20)</td>
                  <td className="p-3 text-stone-700 font-semibold">+28 TL / kovan</td>
                  <td className="p-3 text-stone-700">{isEligibleForSupport ? calcHiveCount : 0} Kovan</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +{(isEligibleForSupport ? calcHiveCount * 28 : 0).toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      İlave Destek
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 5: Queen bee */}
              {queenBeeSupportCount > 0 && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">Damızlık / Belgeli Ana Arı Desteği</td>
                  <td className="p-3 text-stone-600">Bakanlık Sertifikalı Ana Arı Tebliği</td>
                  <td className="p-3 text-stone-700 font-semibold">100 TL / adet</td>
                  <td className="p-3 text-stone-700">{queenBeeSupportCount} Adet Ana Arı</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +{(isEligibleForSupport ? queenBeeSupportCount * 100 : 0).toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Damızlık Hibesi
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 6: Project Subsidy */}
              {includeProjectSupport && projectGrantAmount > 0 && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">Yerel Kovan & Ekipman Proje Desteği</td>
                  <td className="p-3 text-stone-600">İl Özel İdaresi / Yerel Hibe</td>
                  <td className="p-3 text-stone-700 font-semibold">%75 Hibe Desteği</td>
                  <td className="p-3 text-stone-700">{projectHiveCount} Adet Kovan</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +{projectGrantAmount.toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Ekipman Hibesi
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 7: Union Fee */}
              {isUnionMember && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">Yıllık Üye Yardımı & Hizmet Payı</td>
                  <td className="p-3 text-stone-600">Arı Yetiştiricileri Birliği Tüzüğü</td>
                  <td className="p-3 text-stone-700 font-semibold">Maktu + 8 TL/kovan</td>
                  <td className="p-3 text-stone-700">{calcHiveCount} Kovan</td>
                  <td className="p-3 text-right font-bold text-rose-700">
                    -{totalUnionFee.toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                      Birlik Aidatı
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 8: AKS Plaka and Vize */}
              <tr className="hover:bg-amber-50/30">
                <td className="p-3 font-bold text-stone-800">AKS Plaka Basımı ve İşletme Güncelleme</td>
                <td className="p-3 text-stone-600">İl/İlçe Tarım AKS Döner Sermaye</td>
                <td className="p-3 text-stone-700 font-semibold">12 TL/plaka + 250 TL vize</td>
                <td className="p-3 text-stone-700">{calcHiveCount} Kovan</td>
                <td className="p-3 text-right font-bold text-rose-700">
                  -{totalAksFee.toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center">
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                    Resmi Harç
                  </span>
                </td>
              </tr>

              {/* Row 9: TARSİM */}
              {enableTarsim && (
                <tr className="hover:bg-amber-50/30">
                  <td className="p-3 font-bold text-stone-800">TARSİM Hayat Sigortası (Net Çiftçi Primi)</td>
                  <td className="p-3 text-stone-600">TARSİM (%50 Devlet Destekli)</td>
                  <td className="p-3 text-stone-700 font-semibold">~50 TL / kovan (Net)</td>
                  <td className="p-3 text-stone-700">{calcHiveCount} Kovan</td>
                  <td className="p-3 text-right font-bold text-rose-700">
                    -{tarsimNetCost.toLocaleString("tr-TR")} TL
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Risk Güvencesi
                    </span>
                  </td>
                </tr>
              )}

              {/* Row 10: Withholding Tax */}
              <tr className="hover:bg-amber-50/30">
                <td className="p-3 font-bold text-stone-800">Müstahsil Makbuzu Stopaj Kesintisi</td>
                <td className="p-3 text-stone-600">193 Sayılı GVK Madde 94</td>
                <td className="p-3 text-stone-700 font-semibold">
                  %{stopajRate} {isExchangeRegistered ? "(Borsa Tescilli)" : "(Tescilsiz)"}
                </td>
                <td className="p-3 text-stone-700">{estimatedGrossHoneySales.toLocaleString("tr-TR")} TL Satış</td>
                <td className="p-3 text-right font-bold text-rose-700">
                  -{stopajTaxAmount.toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    Stopaj Vergisi
                  </span>
                </td>
              </tr>
            </tbody>

            {/* Comprehensive Table Footer */}
            <tfoot className="border-t-2 border-amber-300 bg-amber-50/90 font-bold text-stone-800 divide-y divide-amber-200">
              <tr>
                <td colSpan={4} className="p-3 font-black text-stone-900">
                  TOPLAM DEVLET HİBE VE DESTEK TUTARI (+)
                </td>
                <td className="p-3 text-right font-black text-emerald-700 text-sm">
                  +{grandTotalGrants.toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center text-xs text-emerald-800 font-bold">Hakediş</td>
              </tr>

              <tr>
                <td colSpan={4} className="p-3 font-black text-stone-900">
                  TOPLAM BİRLİK, AKS, TARSİM VE VERGİ GİDERLERİ (-)
                </td>
                <td className="p-3 text-right font-black text-rose-700 text-sm">
                  -{totalMandatoryExpenses.toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center text-xs text-rose-800 font-bold">Gider</td>
              </tr>

              <tr className="bg-amber-200/50">
                <td colSpan={4} className="p-3 font-black text-amber-950 text-sm">
                  NET TEŞVİK VE FAALİYET KAZANIMI (HİBELER - YASAL GİDERLER)
                </td>
                <td
                  className={`p-3 text-right font-black text-base ${
                    netIncentiveBenefit >= 0 ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {netIncentiveBenefit >= 0 ? `+${netIncentiveBenefit.toLocaleString("tr-TR")}` : netIncentiveBenefit.toLocaleString("tr-TR")} TL
                </td>
                <td className="p-3 text-center text-xs font-bold text-amber-950">
                  {netIncentiveBenefit >= 0 ? "Net Kâr" : "Net Maliyet"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
