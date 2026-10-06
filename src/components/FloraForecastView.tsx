import React, { useState, useMemo } from "react";
import {
  Flower2,
  Calendar,
  Sparkles,
  TrendingUp,
  MapPin,
  Trees,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { TURKEY_REGIONS_FLORA, ALL_81_PROVINCES } from "../data/turkeyFloraData";
import { RegionFlora } from "../types";
import ReactMarkdown from "react-markdown";

interface FloraForecastViewProps {
  currentCity?: string;
}

export const FloraForecastView: React.FC<FloraForecastViewProps> = ({ currentCity }) => {
  // Find initial region based on current city if possible
  const initialRegion =
    TURKEY_REGIONS_FLORA.find((r) => r.provinces.includes(currentCity || "Muğla")) ||
    TURKEY_REGIONS_FLORA[0];

  const [selectedRegion, setSelectedRegion] = useState<RegionFlora>(initialRegion);
  const [selectedProvince, setSelectedProvince] = useState<string>(
    selectedRegion.provinces[0] || "Muğla"
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("Mayıs");
  const [hiveCount, setHiveCount] = useState<number>(10);

  // Province search states
  const [provinceSearchQuery, setProvinceSearchQuery] = useState<string>("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

  // Filtered provinces for live search across all 81 provinces
  const filteredProvinces = useMemo(() => {
    if (!provinceSearchQuery.trim()) return [];
    const query = provinceSearchQuery.toLocaleLowerCase("tr");
    return ALL_81_PROVINCES.filter(
      (p) =>
        p.name.toLocaleLowerCase("tr").includes(query) ||
        p.region.toLocaleLowerCase("tr").includes(query)
    );
  }, [provinceSearchQuery]);

  // AI Forecast state
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSelectProvince = (provName: string) => {
    setSelectedProvince(provName);
    const foundRegion = TURKEY_REGIONS_FLORA.find((r) => r.provinces.includes(provName));
    if (foundRegion) {
      setSelectedRegion(foundRegion);
    }
    setProvinceSearchQuery("");
    setIsSearchDropdownOpen(false);
    setAiResult(null);
  };

  const handleRegionSelect = (region: RegionFlora) => {
    setSelectedRegion(region);
    setSelectedProvince(region.provinces[0]);
    setAiResult(null);
  };

  const handleRequestAiForecast = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/flora-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion.region,
          province: selectedProvince,
          month: selectedMonth,
          hiveCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Flora tahmini oluşturulamadı.");
      }
      setAiResult(data.result);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Yapay zeka servisine erişilemedi.");
    } finally {
      setAiLoading(false);
    }
  };

  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  return (
    <div className="space-y-6">
      {/* Top Title & Overview */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Flower2 className="w-6 h-6 text-amber-600" />
              <span>Bölgesel Bitki Örtüsü & Nektar/Polen Akımı</span>
            </h2>
            <p className="text-sm text-stone-700 mt-1">
              Türkiye arıcılık bölgelerine göre baskın bal bitkileri, çiçeklenme takvimi ve tahmini kovan verimi
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TURKEY_REGIONS_FLORA.map((reg) => (
              <button
                key={reg.region}
                onClick={() => handleRegionSelect(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion.region === reg.region
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                {reg.region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Region Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-gradient-to-br from-amber-500/10 via-white to-amber-100/20 rounded-2xl p-6 border border-amber-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <MapPin className="w-4 h-4" />
              <span>Kapsanan İller ({selectedRegion.provinces.length} İl)</span>
            </div>
            <span className="text-xs text-stone-600">
              Seçili: <strong className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">{selectedProvince}</strong>
            </span>
          </div>
          <h3 className="text-2xl font-black text-stone-900 mt-1">{selectedRegion.region}</h3>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {selectedRegion.provinces.map((prov) => (
              <span
                key={prov}
                onClick={() => handleSelectProvince(prov)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedProvince === prov
                    ? "bg-amber-600 text-white font-bold shadow-2xs"
                    : "bg-white text-stone-700 border border-amber-200 hover:border-amber-400"
                }`}
              >
                {prov}
              </span>
            ))}
          </div>

          <p className="text-sm text-stone-700 mt-4 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-amber-100">
            {selectedRegion.overview}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Nektar Akımı Zirve Dönemi</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">
                {selectedRegion.nectarFlowPeak}
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Tahmini Bal Verim Potansiyeli</span>
              </div>
              <div className="text-sm font-bold text-emerald-700 mt-1">
                {selectedRegion.estimatedYieldPerHive}
              </div>
            </div>
          </div>
        </div>

        {/* AI Regional Forecast Request Card */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Yapay Zeka Flora Tahmini</h4>
                <p className="text-xs text-stone-500">Gemini ile bölgeye özel nektar analizi</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Province Search & Selection (All 81 Provinces) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                    <span>İl Ara (Türkiye)</span>
                  </label>
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    {selectedProvince}
                  </span>
                </div>

                {/* Live Search Input with Instant Results Dropdown */}
                <div className="relative">
                  {isSearchDropdownOpen && (
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsSearchDropdownOpen(false)}
                    />
                  )}
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-30" />
                  <input
                    type="text"
                    value={provinceSearchQuery}
                    onChange={(e) => {
                      setProvinceSearchQuery(e.target.value);
                      setIsSearchDropdownOpen(true);
                    }}
                    onFocus={() => setIsSearchDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsSearchDropdownOpen(false);
                    }}
                    placeholder="İl adı yazarak arayın (Örn: Sivas, Rize, Antalya...)"
                    className="w-full text-xs pl-8 pr-7 py-2 bg-stone-50 border border-amber-300/80 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all relative z-25"
                  />
                  {provinceSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setProvinceSearchQuery("");
                        setIsSearchDropdownOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 z-30"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Filtered Provinces Popup */}
                  {isSearchDropdownOpen && filteredProvinces.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-amber-300 rounded-xl shadow-xl divide-y divide-stone-100">
                      {filteredProvinces.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectProvince(p.name)}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                            selectedProvince === p.name
                              ? "bg-amber-100/70 font-bold text-amber-950"
                              : "text-stone-800"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            {p.region}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearchDropdownOpen && provinceSearchQuery.trim().length > 0 && filteredProvinces.length === 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 p-3 bg-white border border-amber-200 rounded-xl shadow-lg text-center text-xs text-stone-500">
                      "{provinceSearchQuery}" ile eşleşen il bulunamadı.
                    </div>
                  )}
                </div>

                {/* 81 Province Select Dropdown */}
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Veya 81 İl Listesinden Seçin:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleSelectProvince(e.target.value)}
                      className="w-full text-xs py-2 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 font-medium focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 focus:bg-white appearance-none pr-8 cursor-pointer"
                    >
                      {TURKEY_REGIONS_FLORA.map((reg) => (
                        <optgroup key={reg.region} label={`${reg.region} (${reg.provinces.length} İl)`}>
                          {reg.provinces.map((p) => (
                            <option key={p} value={p}>
                              {p} ({reg.region})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Popular Beekeeping Centers */}
                <div className="pt-1">
                  <span className="text-[10px] font-medium text-stone-600 block mb-1">
                    Sık Tercih Edilen Arıcılık Merkezleri:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {["Muğla", "Ordu", "Rize", "Sivas", "Erzurum", "Antalya", "Adana", "Balıkesir"].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectProvince(city)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                          selectedProvince === city
                            ? "bg-amber-600 text-white font-bold shadow-2xs"
                            : "bg-stone-100 hover:bg-amber-100 text-stone-700 border border-stone-200"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Dönem</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full text-xs py-2 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Kovan Sayısı
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={hiveCount}
                    onChange={(e) => setHiveCount(Number(e.target.value))}
                    className="w-full text-xs py-2 px-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleRequestAiForecast}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiLoading ? "Analiz Ediliyor..." : "Flora & Verim Raporu Al"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Result Box if loaded */}
      {aiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {aiResult && (
        <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-300/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>
                {selectedProvince} İli ({selectedMonth}) AI Flora & Bal Verimi Tahmini
              </span>
            </h3>
            <button
              onClick={() => setAiResult(null)}
              className="text-xs text-amber-800 hover:text-amber-950 font-medium"
            >
              Kapat
            </button>
          </div>
          <div className="prose prose-sm prose-stone max-w-none mt-4 text-stone-800 leading-relaxed">
            <ReactMarkdown>{aiResult}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Plants & Trees in Selected Region */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Trees className="w-5 h-5 text-amber-600" />
          <span>{selectedRegion.region} Başlıca Bal ve Polen Bitkileri</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedRegion.plants.map((plant) => (
            <div
              key={plant.name}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 hover:border-amber-400 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-stone-900">{plant.name}</h4>
                    <p className="text-xs italic text-stone-500">{plant.scientificName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      plant.type.includes("Salgı")
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : plant.type.includes("Polen")
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                    }`}
                  >
                    {plant.type}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-xs font-semibold text-stone-600">Çiçeklenme:</span>
                  {plant.floweringMonths.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/80"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700">Bal Rengi: </span>
                    <span className="text-stone-600">{plant.honeyColor}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Bal Karakteri: </span>
                    <span className="text-stone-600">{plant.honeyQuality}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900">Arıcı Notu: </span>
                {plant.notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
