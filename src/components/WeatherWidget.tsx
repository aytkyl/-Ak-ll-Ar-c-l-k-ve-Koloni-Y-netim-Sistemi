import React, { useState } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  CloudRain,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Eye,
  Calendar,
  BarChart3,
  Sun,
  Umbrella,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sunrise,
  Sunset,
  Sparkles,
  Check,
  Plus,
  Shield,
  ArrowRight,
  Gauge,
  Flame,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { WeatherData, CityCoord, WeatherDailyForecast, PlannerTask } from "../types";
import {
  TURKEY_PROVINCES,
  fetchCityWeather,
  generateFallbackDailyForecast,
} from "../services/weatherService";

interface WeatherWidgetProps {
  weather: WeatherData | null;
  onUpdateWeather: (data: WeatherData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onScheduleInspection?: (task: PlannerTask) => void;
  onNavigateToPlanner?: () => void;
  onOpenAlertModal?: () => void;
  activeAlertsCount?: number;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onUpdateWeather,
  loading,
  setLoading,
  onScheduleInspection,
  onNavigateToPlanner,
  onOpenAlertModal,
  activeAlertsCount = 0,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>(weather?.city || "Muğla");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [chartViewMode, setChartViewMode] = useState<"combined" | "temp" | "wind" | "score">("combined");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0);
  const [filterOnlySafeDays, setFilterOnlySafeDays] = useState<boolean>(false);
  const [inspectionScheduledToast, setInspectionScheduledToast] = useState<string | null>(null);

  const handleCityChange = async (cityName: string) => {
    setSelectedCity(cityName);
    const found = TURKEY_PROVINCES.find((c) => c.name === cityName);
    if (!found) return;

    setLoading(true);
    setGeoError(null);
    try {
      const data = await fetchCityWeather(found);
      onUpdateWeather(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Tarayıcınız konum servisini desteklemiyor.");
      return;
    }

    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let closest: CityCoord = TURKEY_PROVINCES[0];
        let minDistance = Infinity;

        for (const city of TURKEY_PROVINCES) {
          const dist = Math.hypot(city.lat - lat, city.lon - lon);
          if (dist < minDistance) {
            minDistance = dist;
            closest = city;
          }
        }

        const customCoord: CityCoord = {
          name: `${closest.name} (GPS Konumunuz)`,
          region: closest.region,
          lat,
          lon,
        };

        try {
          const data = await fetchCityWeather(customCoord);
          setSelectedCity(closest.name);
          onUpdateWeather(data);
        } catch (e: any) {
          setGeoError("Hava durumu verisi alınamadı.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setGeoError("Konum izni alınamadı veya zaman aşımına uğradı. Listeden il seçebilirsiniz.");
      },
      { timeout: 10000 }
    );
  };

  // Ensure daily forecast data exists
  const dailyForecastData: WeatherDailyForecast[] =
    weather?.dailyForecast && weather.dailyForecast.length > 0
      ? weather.dailyForecast
      : weather
      ? generateFallbackDailyForecast(weather.temperature)
      : [];

  // Transform data for Recharts & UI
  const chartData = dailyForecastData.map((d, idx) => {
    const isFlightOptimal = d.tempMax >= 16 && d.tempMin >= 10 && d.precipitation < 1.0;
    const isFlightAcceptable = d.tempMax >= 13 && d.precipitation < 2.5;

    let flightTag = "İdeal Uçuş";
    let flightTagColor = "text-emerald-700 bg-emerald-100 border border-emerald-200";
    if (!isFlightAcceptable) {
      flightTag = "Uçuşa Uygun Değil";
      flightTagColor = "text-rose-700 bg-rose-100 border border-rose-200";
    } else if (!isFlightOptimal) {
      flightTag = "Sınırlı Uçuş";
      flightTagColor = "text-amber-700 bg-amber-100 border border-amber-200";
    }

    const inspectionScore = d.inspectionSuitability?.score ?? (isFlightOptimal ? 85 : isFlightAcceptable ? 65 : 30);
    const inspectionTag = d.inspectionSuitability?.tag ?? (isFlightOptimal ? "✓ İdeal Muayene" : "⚠ Sınırda");
    const inspectionTagColor = d.inspectionSuitability?.tagColor ?? (isFlightOptimal ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800");

    return {
      index: idx,
      name: d.dayName,
      date: d.date,
      rawDate: d.rawDate,
      tempMax: d.tempMax,
      tempMin: d.tempMin,
      apparentTempMax: d.apparentTempMax ?? d.tempMax - 1,
      apparentTempMin: d.apparentTempMin ?? d.tempMin - 1,
      precipitation: d.precipitation,
      precipProbability: d.precipitationProbability ?? (d.precipitation > 0 ? 65 : 10),
      precipitationHours: d.precipitationHours ?? (d.precipitation > 0 ? 2 : 0),
      windSpeedMax: d.windSpeedMax ?? weather?.windSpeed ?? 12,
      windGustMax: d.windGustMax ?? weather?.windGust ?? 18,
      sunrise: d.sunrise ?? "07:05",
      sunset: d.sunset ?? "18:45",
      uvIndexMax: d.uvIndexMax ?? 5.2,
      sunshineHours: d.sunshineHours ?? (d.precipitation > 0 ? 4.5 : 9.5),
      description: d.weatherDescription,
      code: d.weatherCode,
      flightTag,
      flightTagColor,
      isFlightOptimal,
      inspectionScore,
      inspectionTag,
      inspectionTagColor,
      inspectionSuitability: d.inspectionSuitability,
    };
  });

  // Calculate weekly summary stats
  const maxWeeklyTemp = chartData.length > 0 ? Math.max(...chartData.map((d) => d.tempMax)) : 0;
  const minWeeklyTemp = chartData.length > 0 ? Math.min(...chartData.map((d) => d.tempMin)) : 0;
  const totalWeeklyPrecip =
    chartData.length > 0
      ? Math.round(chartData.reduce((acc, d) => acc + d.precipitation, 0) * 10) / 10
      : 0;
  const maxWeeklyWind =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.windSpeedMax)) : 0;
  const optimalDaysCount = chartData.filter((d) => d.inspectionScore >= 60).length;

  const bestInspectionDay = chartData.length > 0
    ? [...chartData].sort((a, b) => b.inspectionScore - a.inspectionScore)[0]
    : null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 55) return "🌦️";
    if (code <= 65) return "🌧️";
    if (code <= 75) return "❄️";
    if (code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "⛅";
  };

  // Schedule task into planner
  const handleScheduleInspectionForDay = (day: (typeof chartData)[0]) => {
    const taskId = `task-insp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const hours = day.inspectionSuitability?.recommendedHours || "11:00 - 15:30";
    const title = `Kovan Muayenesi (${day.name} - ${selectedCity})`;
    const desc = `${day.date} (${day.name}) günü ${selectedCity} için planlanan kovan kontrolü.\n• Önerilen Muayene Saatleri: ${hours}\n• Hava Sıcaklığı: ${day.tempMin}°C - ${day.tempMax}°C (Hissedilen: ${day.apparentTempMax}°C)\n• Rüzgar Durumu: ${day.windSpeedMax} km/h (Maks Hamle: ${day.windGustMax} km/h)\n• Yağış Beklentisi: ${day.precipitation} mm (%${day.precipProbability} ihtimal)\n• Muayene Uygunluk Skoru: %${day.inspectionScore}/100\n• Arıcı Yönergesi: ${day.inspectionSuitability?.advice || "Genel kovan kontrolleri yapılabilir."}`;

    const newTask: PlannerTask = {
      id: taskId,
      period: "weekly",
      category: "Kovan Kontrolü",
      title,
      description: desc,
      seasonOrMonth: day.date,
      frequencyText: `${day.name} (${day.date})`,
      isCompleted: false,
      priority: day.inspectionScore >= 80 ? "Yuksek" : day.inspectionScore >= 60 ? "Orta" : "Dusuk",
    };

    if (onScheduleInspection) {
      onScheduleInspection(newTask);
    }
    setInspectionScheduledToast(
      `${day.name} (${day.date}) için kovan muayene görevi Bakım Planlayıcısına başarıyla kaydedildi!`
    );
    setTimeout(() => {
      setInspectionScheduledToast(null);
    }, 4500);
  };

  // Filtered days list
  const displayedDays = filterOnlySafeDays
    ? chartData.filter((d) => d.inspectionScore >= 60)
    : chartData;

  const activeSelectedDay =
    selectedDayIndex !== null && chartData[selectedDayIndex]
      ? chartData[selectedDayIndex]
      : chartData[0] || null;

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/80 text-xs min-w-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700">
            <div>
              <span className="font-bold text-sm text-amber-300">{data.name}</span>
              <span className="text-stone-400 text-[11px] ml-1.5">({data.date})</span>
            </div>
            <span className="text-base">{getWeatherIcon(data.code)}</span>
          </div>

          <p className="text-stone-300 font-medium mb-2.5">{data.description}</p>

          <div className="space-y-1.5 font-medium">
            <div className="flex justify-between items-center text-rose-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Maksimum Sıcaklık:
              </span>
              <span className="font-bold text-white text-sm">{data.tempMax}°C</span>
            </div>
            <div className="flex justify-between items-center text-sky-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span> Minimum Sıcaklık:
              </span>
              <span className="font-bold text-white text-sm">{data.tempMin}°C</span>
            </div>
            <div className="flex justify-between items-center text-cyan-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Rüzgar / Hamle:
              </span>
              <span className="font-bold text-white text-sm">
                {data.windSpeedMax} / {data.windGustMax} km/h
              </span>
            </div>
            <div className="flex justify-between items-center text-blue-300 pt-1 border-t border-stone-800">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Beklenen Yağış:
              </span>
              <span className="font-bold text-white text-sm">
                {data.precipitation} mm (%{data.precipProbability})
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Muayene Skoru:
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                data.inspectionScore >= 80
                  ? "bg-emerald-800 text-emerald-200"
                  : data.inspectionScore >= 60
                  ? "bg-amber-800 text-amber-200"
                  : "bg-rose-800 text-rose-200"
              }`}
            >
              %{data.inspectionScore} ({data.inspectionTag})
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {inspectionScheduledToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div className="text-xs">
            <div className="font-bold text-amber-300">Muayene Planlandı!</div>
            <div className="text-stone-300 mt-0.5">{inspectionScheduledToast}</div>
          </div>
          {onNavigateToPlanner && (
            <button
              onClick={onNavigateToPlanner}
              className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs transition-colors shrink-0"
            >
              Planlayıcıyı Aç
            </button>
          )}
        </div>
      )}

      {/* Top Controller Banner */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-500" />
            <span>Meteoroloji & Arı Uçuş İndeksi</span>
          </h2>
          <p className="text-sm text-stone-700 mt-0.5">
            Canlı sıcaklık, rüzgar hamleleri, nektar uçuş indeksi ve 7 günlük genişletilmiş kovan muayene planlayıcısı
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm bg-amber-50/70 border border-amber-300 rounded-xl text-stone-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {TURKEY_PROVINCES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.region})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUseGeolocation}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl border border-stone-300 font-medium transition-colors"
            title="GPS Konumunuzu Kullanın"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Konumumu Bul</span>
          </button>

          <button
            onClick={() => handleCityChange(selectedCity)}
            disabled={loading}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
            title="Hava Durumunu Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-600" : ""}`} />
          </button>

          {onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border font-bold transition-all shadow-xs active:scale-95 ${
                activeAlertsCount > 0
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-300/40"
                  : "bg-white hover:bg-amber-50 text-stone-800 border-amber-300"
              }`}
              title="Meteorolojik Uyarı & Güvenlik Sistemi"
            >
              <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? "text-rose-600 animate-bounce" : "text-amber-600"}`} />
              <span>Meteorolojik Uyarılar</span>
              {activeAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-black animate-pulse">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {geoError && (
        <div className="p-3.5 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {weather && (
        <>
          {/* Current Weather Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Flight Suitability Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-amber-500/10 via-white to-amber-100/30 rounded-2xl p-6 border border-amber-200/90 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    {weather.region}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-0.5 flex items-center gap-2">
                    <span>{weather.city}</span>
                    <span className="text-base font-normal text-stone-500">
                      ({weather.updatedAt} itibarıyla)
                    </span>
                  </h3>
                  <p className="text-sm font-medium text-stone-600 mt-1">
                    {weather.weatherDescription}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className="text-xs text-stone-500 font-medium block">Uçuş Uygunluğu</span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm shadow-xs mt-1 ${weather.flightSuitability.badgeColor}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{weather.flightSuitability.status}</span>
                    <span className="text-xs opacity-90">({weather.flightSuitability.score}/100)</span>
                  </div>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>Arı Aktivite Skoru</span>
                  <span>%{weather.flightSuitability.score} Verim Potansiyeli</span>
                </div>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 to-emerald-500"
                    style={{ width: `${weather.flightSuitability.score}%` }}
                  />
                </div>
              </div>

              {/* Expert Beekeeper Advice Box */}
              <div className="mt-5 p-4 bg-white/80 rounded-xl border border-amber-200/80 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5 font-bold text-xs">
                    🐝
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Usta Arıcı Tavsiyesi & Saha Yönergesi
                    </h4>
                    <p className="text-sm text-stone-700 mt-1 leading-relaxed">
                      {weather.flightSuitability.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="p-3.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <span>Hava Sıcaklığı</span>
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 mt-1">
                    {weather.temperature}°C
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {weather.temperature >= 16 && weather.temperature <= 32
                      ? "İdeal tarlacı aralığı"
                      : "Sınır koşul"}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Bağıl Nem</span>
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 mt-1">
                    %{weather.humidity}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {weather.humidity >= 40 && weather.humidity <= 70
                      ? "Nektar akımı için dengeli"
                      : "Aşırı nem / kuruluk"}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <Wind className="w-4 h-4 text-cyan-600" />
                    <span>Rüzgar Hızı</span>
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 mt-1">
                    {weather.windSpeed} <span className="text-xs font-normal">km/h</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Hamle: {weather.windGust} km/h
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <CloudRain className="w-4 h-4 text-indigo-500" />
                    <span>Yağış Miktarı</span>
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 mt-1">
                    {weather.precipitation} <span className="text-xs font-normal">mm</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Bulutluluk: %{weather.cloudCover}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Rules & Inspection Checklist Side Card */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span>Kovan Açma & Muayene Kriterleri</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Bugün kovan kapağını açmak koloniniz için güvenli mi?
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        weather.temperature >= 15 && weather.temperature <= 32
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        Sıcaklık Kuralı (15°C - 32°C)
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {weather.temperature < 15
                          ? "Hava soğuk! Kovan açılırsa yavru üşür ve kireç/hastalık riski doğar."
                          : weather.temperature > 35
                          ? "Aşırı sıcak! Peteklerde çökme ve arı agresyonu yaşanabilir."
                          : "Sıcaklık kuluçka muayenesi ve kat atımı için güvenli."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        weather.windSpeed < 20 ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        Rüzgar Kuralı (&lt; 20 km/h)
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {weather.windSpeed >= 20
                          ? "Rüzgar yüksek! Arılar hırçınlaşır, çerçeveyi ters rüzgara tutmayın."
                          : "Rüzgar sakin. Körük dumanı dağılmadan rahat çalışabilirsiniz."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        weather.precipitation === 0 ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        Yağış Durumu (0 mm)
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {weather.precipitation > 0
                          ? "Yağmur var! Kovanın içine su damlamaması için kapak açmayınız."
                          : "Yağış yok. Kovan içi rutubetsiz kuru kalacaktır."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="text-xs text-stone-500 flex items-center justify-between">
                  <span>Meteoroloji Kaynağı:</span>
                  <span className="font-semibold text-stone-700">Open-Meteo Canlı Model & Uydu</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-DAY EXTENDED FORECAST & RECHARTS CHART SECTION */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                  <BarChart3 className="w-5 h-5 text-amber-50" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      7 Günlük Genişletilmiş Meteoroloji & Muayene Tahmini
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      Open-Meteo API Entegrasyonu
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Gelecek 7 günün rüzgar hamleleri, yağış saatleri, hissedilen sıcaklık ve en güvenli kovan açma zaman pencereleri
                  </p>
                </div>
              </div>

              {/* View Toggle Tabs & Filter */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                {/* Safe Days Filter */}
                <button
                  onClick={() => setFilterOnlySafeDays(!filterOnlySafeDays)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                    filterOnlySafeDays
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  }`}
                  title="Sadece muayeneye uygun elverişli günleri filtrele"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sadece Muayeneye Uygun ({optimalDaysCount})</span>
                </button>

                {/* Chart View Modes */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setChartViewMode("combined")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      chartViewMode === "combined"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Birleşik Görünüm
                  </button>
                  <button
                    onClick={() => setChartViewMode("temp")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      chartViewMode === "temp"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Sıcaklık & Termal
                  </button>
                  <button
                    onClick={() => setChartViewMode("wind")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      chartViewMode === "wind"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Rüzgar & Hamle (km/h)
                  </button>
                  <button
                    onClick={() => setChartViewMode("score")}
                    className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all ${
                      chartViewMode === "score"
                        ? "bg-white text-stone-900 shadow-xs font-bold"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Muayene Skoru
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards for Weekly Outlook */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Haftalık Tepe Sıcaklık</span>
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {maxWeeklyTemp}°C
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">En sıcak gündüz vakti</div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Gece Dip Sıcaklığı</span>
                  <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {minWeeklyTemp}°C
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">Kovan içi salkım soğuması</div>
              </div>

              <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Maksimum Rüzgar</span>
                  <Wind className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div className="text-xl font-black text-stone-900 mt-1">
                  {maxWeeklyWind} <span className="text-xs font-normal">km/h</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {maxWeeklyWind > 25 ? "⚠ Sert rüzgar uyarısı" : "✓ Rüzgar elverişli"}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>En İyi Muayene Günü</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 mt-1 truncate">
                  {bestInspectionDay ? `${bestInspectionDay.name} (%${bestInspectionDay.inspectionScore})` : "-"}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                  Önerilen: {bestInspectionDay?.inspectionSuitability?.recommendedHours || "11:00-15:30"}
                </div>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
                >
                  <defs>
                    <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
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

                  {/* Left YAxis: Temperature or Wind or Score */}
                  {chartViewMode === "combined" && (
                    <YAxis
                      yAxisId="tempAxis"
                      stroke="#f59e0b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={['dataMin - 3', 'dataMax + 4']}
                      tickFormatter={(val) => `${val}°C`}
                      label={{
                        value: "Sıcaklık (°C)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#92400e", fontSize: 11 },
                      }}
                    />
                  )}

                  {chartViewMode === "temp" && (
                    <YAxis
                      yAxisId="tempAxis"
                      stroke="#f59e0b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={['dataMin - 3', 'dataMax + 4']}
                      tickFormatter={(val) => `${val}°C`}
                      label={{
                        value: "Sıcaklık (°C)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#92400e", fontSize: 11 },
                      }}
                    />
                  )}

                  {chartViewMode === "wind" && (
                    <YAxis
                      yAxisId="windAxis"
                      stroke="#0891b2"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, (dataMax: number) => Math.max(35, Math.ceil(dataMax * 1.2))]}
                      tickFormatter={(val) => `${val} km/h`}
                      label={{
                        value: "Rüzgar Hızı (km/h)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#0891b2", fontSize: 11 },
                      }}
                    />
                  )}

                  {chartViewMode === "score" && (
                    <YAxis
                      yAxisId="scoreAxis"
                      stroke="#059669"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, 100]}
                      tickFormatter={(val) => `%${val}`}
                      label={{
                        value: "Muayene Skoru (%)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#059669", fontSize: 11 },
                      }}
                    />
                  )}

                  {/* Right YAxis: Precipitation */}
                  {(chartViewMode === "combined" || chartViewMode === "temp") && (
                    <YAxis
                      yAxisId="precipAxis"
                      orientation="right"
                      stroke="#3b82f6"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 1.5))]}
                      tickFormatter={(val) => `${val} mm`}
                      label={{
                        value: "Yağış (mm)",
                        angle: 90,
                        position: "insideRight",
                        style: { textAnchor: "middle", fill: "#1d4ed8", fontSize: 11 },
                      }}
                    />
                  )}

                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                  />

                  {/* Reference line for 15°C critical beekeeping flight threshold */}
                  {(chartViewMode === "combined" || chartViewMode === "temp") && (
                    <ReferenceLine
                      yAxisId="tempAxis"
                      y={15}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: "Uçuş Eşiği (15°C)",
                        position: "insideTopLeft",
                        fill: "#059669",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Reference lines for wind mode */}
                  {chartViewMode === "wind" && (
                    <ReferenceLine
                      yAxisId="windAxis"
                      y={20}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: "Rüzgar Uyarı Sınırı (20 km/h)",
                        position: "insideTopLeft",
                        fill: "#d97706",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {chartViewMode === "score" && (
                    <ReferenceLine
                      yAxisId="scoreAxis"
                      y={80}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: "İdeal Muayene Eşiği (%80)",
                        position: "insideTopLeft",
                        fill: "#059669",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Combined Mode Bars & Lines */}
                  {chartViewMode === "combined" && (
                    <>
                      <Bar
                        yAxisId="precipAxis"
                        dataKey="precipitation"
                        name="Beklenen Yağış (mm)"
                        fill="url(#precipGrad)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                      />
                      <Area
                        yAxisId="tempAxis"
                        type="monotone"
                        dataKey="tempMax"
                        name="Maks. Sıcaklık (°C)"
                        stroke="#ea580c"
                        strokeWidth={2.5}
                        fill="url(#tempMaxGrad)"
                        dot={{ r: 4, fill: "#ea580c", strokeWidth: 1.5, stroke: "#ffffff" }}
                        activeDot={{ r: 6, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="tempAxis"
                        type="monotone"
                        dataKey="tempMin"
                        name="Min. Sıcaklık (°C)"
                        stroke="#0284c7"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={{ r: 3.5, fill: "#0284c7", strokeWidth: 1.5, stroke: "#ffffff" }}
                        activeDot={{ r: 5, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                      />
                    </>
                  )}

                  {/* Temp Mode */}
                  {chartViewMode === "temp" && (
                    <>
                      <Area
                        yAxisId="tempAxis"
                        type="monotone"
                        dataKey="tempMax"
                        name="Maks. Sıcaklık (°C)"
                        stroke="#ea580c"
                        strokeWidth={2.5}
                        fill="url(#tempMaxGrad)"
                        dot={{ r: 4, fill: "#ea580c", strokeWidth: 1.5, stroke: "#ffffff" }}
                      />
                      <Line
                        yAxisId="tempAxis"
                        type="monotone"
                        dataKey="apparentTempMax"
                        name="Hissedilen Sıcaklık (°C)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: "#f59e0b", strokeWidth: 1.5, stroke: "#ffffff" }}
                      />
                      <Line
                        yAxisId="tempAxis"
                        type="monotone"
                        dataKey="tempMin"
                        name="Min. Sıcaklık (°C)"
                        stroke="#0284c7"
                        strokeWidth={2}
                        dot={{ r: 3.5, fill: "#0284c7", strokeWidth: 1.5, stroke: "#ffffff" }}
                      />
                    </>
                  )}

                  {/* Wind Mode */}
                  {chartViewMode === "wind" && (
                    <>
                      <Area
                        yAxisId="windAxis"
                        type="monotone"
                        dataKey="windSpeedMax"
                        name="Rüzgar Hızı (km/h)"
                        stroke="#0891b2"
                        strokeWidth={2.5}
                        fill="url(#windGrad)"
                        dot={{ r: 4, fill: "#0891b2", strokeWidth: 1.5, stroke: "#ffffff" }}
                      />
                      <Line
                        yAxisId="windAxis"
                        type="monotone"
                        dataKey="windGustMax"
                        name="Maksimum Hamle (km/h)"
                        stroke="#e11d48"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3.5, fill: "#e11d48", strokeWidth: 1.5, stroke: "#ffffff" }}
                      />
                    </>
                  )}

                  {/* Inspection Score Mode */}
                  {chartViewMode === "score" && (
                    <Bar
                      yAxisId="scoreAxis"
                      dataKey="inspectionScore"
                      name="Kovan Muayene Uygunluk Skoru (%)"
                      fill="url(#scoreGrad)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 7-Day Day-by-Day Forecast Cards */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>7 Günlük Detaylı Takvim & Kovan Muayene Planı</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  Aşağıdaki günlere tıklayarak saat penceresi ve arıcılık kontrollerini detaylandırın
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {displayedDays.map((d) => {
                  const isSelected = selectedDayIndex === d.index;
                  return (
                    <button
                      key={d.index}
                      onClick={() => setSelectedDayIndex(isSelected ? null : d.index)}
                      className={`rounded-xl p-3 border text-center transition-all flex flex-col justify-between text-left ${
                        isSelected
                          ? "bg-amber-100/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs"
                          : d.index === 0
                          ? "bg-amber-50/50 border-amber-200 hover:bg-amber-100/40"
                          : "bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              d.index === 0 ? "text-amber-800" : "text-stone-800"
                            }`}
                          >
                            {d.name}
                          </span>
                          {d.index === 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Bugün" />
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{d.date}</div>

                        <div className="text-2xl my-1.5 text-center select-none" title={d.description}>
                          {getWeatherIcon(d.code)}
                        </div>

                        <div className="text-xs font-bold text-stone-900 text-center">
                          <span>{d.tempMax}°</span>
                          <span className="text-stone-400 font-normal mx-0.5">/</span>
                          <span className="text-stone-500 font-semibold">{d.tempMin}°</span>
                        </div>

                        <div className="text-[10px] text-stone-500 text-center mt-0.5">
                          Hissedilen: {d.apparentTempMax}°C
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-600">
                          <span className="flex items-center gap-0.5">
                            <Wind className="w-2.5 h-2.5 text-cyan-600" />
                            <span>{d.windSpeedMax}</span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Droplets className="w-2.5 h-2.5 text-blue-500" />
                            <span>{d.precipitation > 0 ? `${d.precipitation}m` : "0"}</span>
                          </span>
                        </div>

                        <div className="pt-0.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md block truncate text-center ${
                              d.inspectionScore >= 80
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : d.inspectionScore >= 60
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {d.inspectionTag}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Expanded Detail Card */}
              {activeSelectedDay && (
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/70 border border-amber-300 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-amber-200/80">
                    <div className="flex items-center gap-3.5">
                      <div className="text-4xl p-2.5 bg-white rounded-2xl border border-amber-200 shadow-2xs">
                        {getWeatherIcon(activeSelectedDay.code)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-base">
                            {activeSelectedDay.name} ({activeSelectedDay.date}) — {activeSelectedDay.description}
                          </h4>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              activeSelectedDay.inspectionScore >= 80
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : activeSelectedDay.inspectionScore >= 60
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-rose-100 text-rose-800 border-rose-300"
                            }`}
                          >
                            Muayene Skoru: %{activeSelectedDay.inspectionScore} ({activeSelectedDay.inspectionTag})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <strong>Önerilen Kovan Açma Saatleri:</strong>{" "}
                            {activeSelectedDay.inspectionSuitability?.recommendedHours || "11:00 - 15:30"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sunrise className="w-3.5 h-3.5 text-amber-600" />
                            <span>{activeSelectedDay.sunrise}</span>
                            <Sunset className="w-3.5 h-3.5 text-amber-600 ml-1.5" />
                            <span>{activeSelectedDay.sunset}</span>
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => handleScheduleInspectionForDay(activeSelectedDay)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Bu Güne Muayene Planla</span>
                      </button>
                    </div>
                  </div>

                  {/* Detailed Environmental Factors Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
                      <span className="text-stone-500 block font-medium">Sıcaklık Aralığı</span>
                      <span className="text-base font-bold text-stone-900 mt-0.5 block">
                        {activeSelectedDay.tempMin}°C - {activeSelectedDay.tempMax}°C
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Hissedilen: {activeSelectedDay.apparentTempMax}°C
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
                      <span className="text-stone-500 block font-medium">Rüzgar & Maks. Hamle</span>
                      <span className="text-base font-bold text-cyan-800 mt-0.5 block">
                        {activeSelectedDay.windSpeedMax} km/h
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Hamle: {activeSelectedDay.windGustMax} km/h ({activeSelectedDay.windSpeedMax > 24 ? "Hırçınlaştırır" : "Sakin"})
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
                      <span className="text-stone-500 block font-medium">Yağış & Yağışlı Süre</span>
                      <span className="text-base font-bold text-blue-700 mt-0.5 block">
                        {activeSelectedDay.precipitation} mm
                      </span>
                      <span className="text-[11px] text-stone-500">
                        İhtimal: %{activeSelectedDay.precipProbability} ({activeSelectedDay.precipitationHours || 0} saat)
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
                      <span className="text-stone-500 block font-medium">Güneşlenme & UV</span>
                      <span className="text-base font-bold text-amber-800 mt-0.5 block">
                        {activeSelectedDay.sunshineHours || 8} saat
                      </span>
                      <span className="text-[11px] text-stone-500">
                        UV İndeksi: {activeSelectedDay.uvIndexMax || 5} (Tarlacılık aktif)
                      </span>
                    </div>
                  </div>

                  {/* Inspection Activity Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <Eye className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kuluçka & Ana Arı Muayenesi</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        {activeSelectedDay.inspectionSuitability?.canInspectBrood
                          ? "✓ Güvenli: Çerçeveler çıkarılıp günlük yumurta ve ana arı rahatça aranabilir, yavru üşümez."
                          : "✕ Sakıncalı: Sıcaklık düşüklüğü veya rüzgar nedeniyle yavruların üşüme ve hastalanma riski var."}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <Flame className="w-3.5 h-3.5 text-orange-600" />
                        <span>Formik / Organik Asit Tedavisi</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        {activeSelectedDay.inspectionSuitability?.canApplyFormicAcid
                          ? "✓ Uygun (14°C - 25°C): Formik asit buharlaşması için ideal sıcaklık aralığı."
                          : activeSelectedDay.tempMax > 25
                          ? "✕ Çok Sıcak (>25°C): Aşırı buharlaşma ana arıyı ve genç arıları zehirleyebilir!"
                          : "✕ Çok Soğuk (<14°C): Asit yeterince buharlaşmaz ve akarlara etki etmez."}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>Şerbet & Kek Beslemesi</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        {activeSelectedDay.inspectionSuitability?.canFeed
                          ? "✓ Uygun: Akşam üzeri ılık 1:1 veya 2:1 şerbet ya da arı keki verilebilir."
                          : "✕ Yağış ve nem yüksek: Kovan içi şerbet ekşimesine karşı dikkatli olunmalıdır."}
                      </p>
                    </div>
                  </div>

                  {/* Usta Arıcı Advice */}
                  <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-200/80 text-xs text-stone-800 flex items-start gap-2.5">
                    <span className="text-base shrink-0">🐝</span>
                    <div>
                      <strong className="text-stone-900">Usta Arıcı Saha Yönergesi: </strong>
                      <span>
                        {activeSelectedDay.inspectionSuitability?.advice ||
                          "Hava şartlarını takip ederek körük dumanınızı hazırlayınız."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
