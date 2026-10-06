import React, { useState } from "react";
import {
  Plus,
  Compass,
  Calendar,
  Layers,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Trash2,
  Edit,
  Search,
  SlidersHorizontal,
  Sparkles,
  Crown,
  Camera,
  QrCode,
  Mic,
} from "lucide-react";
import { Hive, HiveType, QueenRace, QueenColor, HealthStatus, InspectionLog } from "../types";
import { HiveQrModal } from "./HiveQrModal";
import { VoiceInspectionAssistant } from "./VoiceInspectionAssistant";

interface HiveManagerViewProps {
  hives: Hive[];
  onAddHive: () => void;
  onUpdateHive: (hive: Hive) => void;
  onDeleteHive: (hiveId: string) => void;
  onOpenQueenFinder?: () => void;
  onOpenVisionScanner?: (hiveId?: string) => void;
  onOpenRegionalCare?: () => void;
  onOpenHealthTab?: () => void;
}

export const HiveManagerView: React.FC<HiveManagerViewProps> = ({
  hives,
  onAddHive,
  onUpdateHive,
  onDeleteHive,
  onOpenQueenFinder,
  onOpenVisionScanner,
  onOpenRegionalCare,
  onOpenHealthTab,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterHealth, setFilterHealth] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // QR Modal states
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [qrTargetHiveId, setQrTargetHiveId] = useState<string | null>(null);

  // Inspection modal state
  const [selectedHiveForInspection, setSelectedHiveForInspection] = useState<Hive | null>(null);
  const [viewHistoryHive, setViewHistoryHive] = useState<Hive | null>(null);
  const [editingHive, setEditingHive] = useState<Hive | null>(null);

  // New inspection form
  const [inspDate, setInspDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [inspFrames, setInspFrames] = useState<number>(8);
  const [inspBrood, setInspBrood] = useState<number>(5);
  const [inspHoney, setInspHoney] = useState<number>(3);
  const [inspQueenSeen, setInspQueenSeen] = useState<boolean>(true);
  const [inspFreshEggs, setInspFreshEggs] = useState<boolean>(true);
  const [inspCells, setInspCells] = useState<boolean>(false);
  const [inspTemperament, setInspTemperament] = useState<"Uysal" | "Sakin" | "Hırçın" | "Sokucu">("Uysal");
  const [inspAction, setInspAction] = useState<string>("");
  const [inspNotes, setInspNotes] = useState<string>("");
  const [inspNextDate, setInspNextDate] = useState<string>("");
  const [inspNextAction, setInspNextAction] = useState<string>("");

  const handleOpenInspection = (hive: Hive) => {
    setSelectedHiveForInspection(hive);
    setInspFrames(hive.totalFrames);
    setInspBrood(hive.broodFrames);
    setInspHoney(hive.honeyFrames);
    setInspAction("");
    setInspNotes("");

    // Set intelligent default next inspection (+7 days or +5 days if queen cells)
    const nextD = new Date();
    nextD.setDate(nextD.getDate() + (hive.swarmTendency === "Yuksek" ? 4 : 7));
    setInspNextDate(nextD.toISOString().split("T")[0]);
    setInspNextAction(
      hive.swarmTendency === "Yuksek"
        ? "Oğul memesi kontrolü ve alan ferahlatma"
        : "Şerbet çekimi ve genel kuluçka düzeni kontrolü"
    );
  };

  const handleVoiceParsedResult = (parsed: {
    transcript: string;
    queenSeen?: boolean;
    freshEggs?: boolean;
    queenCells?: boolean;
    frames?: number;
    action?: string;
  }) => {
    if (parsed.queenSeen !== undefined) setInspQueenSeen(parsed.queenSeen);
    if (parsed.freshEggs !== undefined) setInspFreshEggs(parsed.freshEggs);
    if (parsed.queenCells !== undefined) setInspCells(parsed.queenCells);
    if (parsed.frames !== undefined) setInspFrames(parsed.frames);
    if (parsed.action) {
      setInspAction((prev) => (prev ? `${prev}, ${parsed.action}` : parsed.action!));
    }
    if (parsed.transcript) {
      setInspNotes((prev) => (prev ? `${prev} | ${parsed.transcript}` : parsed.transcript));
    }
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHiveForInspection) return;

    const newInspection: InspectionLog = {
      id: "insp-" + Date.now(),
      date: inspDate,
      framesCovered: inspFrames,
      broodFrames: inspBrood,
      honeyFrames: inspHoney,
      queenSeen: inspQueenSeen,
      freshEggsSeen: inspFreshEggs,
      queenCellsPresent: inspCells,
      temperament: inspTemperament,
      actionTaken: inspAction || "Rutin muayene yapıldı.",
      nextInspectionDate: inspNextDate || undefined,
      nextInspectionAction: inspNextAction || undefined,
      notes: inspNotes,
    };

    const updatedHive: Hive = {
      ...selectedHiveForInspection,
      totalFrames: inspFrames,
      broodFrames: inspBrood,
      honeyFrames: inspHoney,
      lastInspectionDate: inspDate,
      nextInspectionDate: inspNextDate || selectedHiveForInspection.nextInspectionDate,
      nextInspectionAction: inspNextAction || selectedHiveForInspection.nextInspectionAction,
      swarmTendency: inspCells ? "Yuksek" : "Yok",
      inspections: [newInspection, ...selectedHiveForInspection.inspections],
    };

    onUpdateHive(updatedHive);
    setSelectedHiveForInspection(null);
  };

  const handleSaveEditedHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHive) return;
    onUpdateHive(editingHive);
    setEditingHive(null);
  };

  const getQueenColorBadge = (color: QueenColor) => {
    switch (color) {
      case "Beyaz":
        return "bg-stone-100 text-stone-800 border-stone-300 ring-1 ring-stone-400/40";
      case "Mavi":
        return "bg-blue-600 text-white";
      case "Sari":
        return "bg-amber-300 text-amber-950";
      case "Kirmizi":
        return "bg-rose-600 text-white";
      case "Yesil":
        return "bg-emerald-600 text-white";
      default:
        return "bg-stone-200 text-stone-800";
    }
  };

  const getHealthStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case "Saglikli":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Varroa Riski":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Yavru Curuklugu Suphesi":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "Besleme Gerekli":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Anasiz Koloni":
        return "bg-purple-100 text-purple-800 border-purple-300 font-bold";
      default:
        return "bg-stone-100 text-stone-800 border-stone-300";
    }
  };

  const filteredHives = hives.filter((h) => {
    if (filterType !== "all" && h.type !== filterType) return false;
    if (filterHealth !== "all" && h.healthStatus !== filterHealth) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        h.hiveNumber.toLowerCase().includes(q) ||
        h.queenRace.toLowerCase().includes(q) ||
        (h.locationTag && h.locationTag.toLowerCase().includes(q)) ||
        (h.notes && h.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-600" />
            <span>Koloni & Kovan Yönetimi ({hives.length} Kovan)</span>
          </h2>
          <p className="text-sm text-stone-700 mt-0.5">
            Fenni kovanlar, karakovanlar, ana arı ırkı & yılı, çerçeve durumu ve muayene kayıtları
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setQrTargetHiveId(null);
              setQrModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-amber-300 text-stone-800 text-xs font-bold shadow-2xs transition-all transform active:scale-95"
            title="Kovan QR Kodu Tara veya Yazdır"
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>Kovan QR (Tara / Yazdır)</span>
          </button>

          {onOpenVisionScanner && (
            <button
              onClick={() => onOpenVisionScanner()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition-all transform active:scale-95 ring-2 ring-rose-300/40"
              title="Kamera ile kovan arı sayma, varroalı arı sayma ve görüntüden gösterme, hastalık muayenesi"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Arı & Varroa Sayımı (Kamera)</span>
            </button>
          )}

          {onOpenQueenFinder && (
            <button
              onClick={onOpenQueenFinder}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-bold shadow-sm transition-all transform active:scale-95 border border-amber-300"
              title="Kamera ile petek üzerinde ana arıyı bul"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>Ana Arı Bulucu (Kamera)</span>
            </button>
          )}

          <button
            onClick={onAddHive}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kovan Ekle</span>
          </button>
        </div>
      </div>

      {/* REGIONAL CARE & NEXT MAINTENANCE BANNER */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-stone-50 p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-stone-900 text-sm">
                Bölgesel Kovan Bakım & Takip Asistanı
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full">
                Eylül Ayı & Sonbahar Takvimi
              </span>
            </div>
            <p className="text-stone-800">
              <span className="font-bold text-rose-700">🔴 ŞU AN:</span> Hasat sonu esaslı Varroa mücadelesi (Formik/Timol/Oksalik) ve 2:1 kış şerbeti ile genç arı yetiştirme dönemi!
            </p>
            <p className="text-stone-700">
              <span className="font-bold text-sky-700">⏳ BİR SONRAKİ BAKIMDA:</span> 4-6 gün sonra verilen 2:1 şerbetin çekimini, strafor daraltmayı ve dip tahtasındaki varroa dökümünü kontrol edin.
            </p>
          </div>
        </div>

        {onOpenRegionalCare && (
          <button
            onClick={onOpenRegionalCare}
            className="shrink-0 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>7 Bölge Bakım Rehberini Aç</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kovan No, ırk, konum veya notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-amber-200 rounded-xl text-sm text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-amber-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          >
            <option value="all">Tüm Kovan Tipleri</option>
            <option value="Langstroth">Langstroth</option>
            <option value="Dadant">Dadant</option>
            <option value="Karakovan">Karakovan (Kütük)</option>
            <option value="Sepet">Sepet Kovan</option>
            <option value="Ruset">Ruşet Kovan</option>
          </select>

          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-amber-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          >
            <option value="all">Tüm Sağlık Durumları</option>
            <option value="Saglikli">Sağlıklı</option>
            <option value="Varroa Riski">Varroa Riski</option>
            <option value="Besleme Gerekli">Besleme Gerekli</option>
            <option value="Yavru Curuklugu Suphesi">Yavru Çürüklüğü Şüphesi</option>
            <option value="Anasiz Koloni">Anasız Koloni</option>
          </select>
        </div>
      </div>

      {/* Hive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHives.map((hive) => (
          <div
            key={hive.id}
            className="bg-white rounded-2xl p-5 border border-amber-200/90 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Header: Hive Number + Type + Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-stone-900">{hive.hiveNumber}</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                      {hive.type}
                    </span>
                  </div>
                  {hive.locationTag && (
                    <span className="text-xs text-stone-500 block mt-0.5">{hive.locationTag}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingHive(hive)}
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg"
                    title="Kovanı Düzenle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteHive(hive.id)}
                    className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Kovanı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Queen Strip */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getHealthStatusBadge(
                    hive.healthStatus
                  )}`}
                >
                  {hive.healthStatus}
                </span>

                {hive.healthStatus !== "Saglikli" && onOpenHealthTab && (
                  <button
                    onClick={onOpenHealthTab}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1 hover:underline transition-colors"
                    title="Bu durum için Petek Sağlığı ve Tedavi paneline git"
                  >
                    <span>Reçete & Tedavi</span>
                    <HeartPulse className="w-3 h-3 text-rose-600" />
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
                  <span>Ana: {hive.queenRace}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full inline-block border border-black/20 ${getQueenColorBadge(
                      hive.queenMarkColor
                    )}`}
                    title={`${hive.queenYear} (${hive.queenMarkColor})`}
                  />
                  <span>{hive.queenYear}</span>
                </div>
              </div>

              {/* Frame Counts Visualizer */}
              <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1">
                  <span>Çerçeve Gücü</span>
                  <span>
                    {hive.totalFrames} Çerçeve {hive.honeySuperCount > 0 && `(+${hive.honeySuperCount} Kat)`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                  <div className="p-1.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-stone-500 text-[10px] block">Toplam</span>
                    <span className="font-bold text-stone-900">{hive.totalFrames}</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-rose-200 text-rose-800">
                    <span className="text-[10px] block">Yavrulu</span>
                    <span className="font-bold">{hive.broodFrames}</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-amber-200 text-amber-900">
                    <span className="text-[10px] block">Ballı</span>
                    <span className="font-bold">{hive.honeyFrames}</span>
                  </div>
                </div>
              </div>

              {/* Inspection Status & Next Scheduled Maintenance */}
              <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-600">
                  <div className="flex items-center gap-1">
                    <span className="text-stone-500">Oğul:</span>
                    <span
                      className={`font-semibold ${
                        hive.swarmTendency === "Yuksek" ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {hive.swarmTendency}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Son: <span className="font-semibold text-stone-800">{hive.lastInspectionDate || "Kayıt yok"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gelecek Bakım:</span>
                  </span>
                  {(() => {
                    if (!hive.nextInspectionDate) {
                      return <span className="text-stone-400 italic text-[11px]">Belirlenmedi</span>;
                    }
                    const todayStr = new Date().toISOString().split("T")[0];
                    const isOverdue = hive.nextInspectionDate < todayStr;
                    const isToday = hive.nextInspectionDate === todayStr;
                    return (
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          isOverdue
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : isToday
                            ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {isOverdue ? "⚠️ Gecikti: " : isToday ? "🔔 Bugün: " : "📅 "}
                        {hive.nextInspectionDate}
                      </span>
                    );
                  })()}
                </div>

                {hive.nextInspectionAction && (
                  <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 font-medium">
                    🎯 <span className="font-semibold">İşlem:</span> {hive.nextInspectionAction}
                  </div>
                )}
              </div>

              {hive.notes && (
                <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-2 rounded-lg line-clamp-2 italic">
                  "{hive.notes}"
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => handleOpenInspection(hive)}
                className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                + Muayene Kaydet
              </button>
              <button
                onClick={() => {
                  setQrTargetHiveId(hive.id);
                  setQrModalOpen(true);
                }}
                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium transition-colors"
                title="Kovan QR Kodunu Görüntüle ve Yazdır"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewHistoryHive(hive)}
                className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
              >
                Geçmiş ({hive.inspections.length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHives.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-amber-200 p-6">
          <Compass className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Kayıtlı Kovan Bulunamadı</h3>
          <p className="text-xs text-stone-500 mt-1">
            Filtreleme kriterlerinizi değiştirin veya yeni bir kovan ekleyin.
          </p>
        </div>
      )}

      {/* INSPECTION LOG MODAL */}
      {selectedHiveForInspection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-300 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>{selectedHiveForInspection.hiveNumber} Nolu Kovan Muayenesi</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kovan içi durumu, kraliçe gözlemi, çerçeve sayısı ve yapılan işlemleri kaydedin
            </p>

            {/* Voice Dictation Strip for Gloved Field Inspections */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 mt-3 mb-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Eldivenli Arıcı Modu (Sesli Dikte)</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Kovandayken konuşun</span>
              </div>
              <VoiceInspectionAssistant onParsedResult={handleVoiceParsedResult} />
            </div>

            {onOpenVisionScanner && (
              <button
                type="button"
                onClick={() => {
                  const hiveId = selectedHiveForInspection.id;
                  setSelectedHiveForInspection(null);
                  onOpenVisionScanner(hiveId);
                }}
                className="w-full mt-2 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-amber-500/20 to-stone-50 border border-amber-300 text-stone-900 font-bold text-xs flex items-center justify-between hover:bg-amber-100 transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span>Kamera ile Petek Tara (Arı & Varroa Sayımı, Muayene)</span>
                </div>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                  AI Vision
                </span>
              </button>
            )}

            <form onSubmit={handleSaveInspection} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Muayene Tarihi</label>
                <input
                  type="date"
                  value={inspDate}
                  onChange={(e) => setInspDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Toplam Çerçeve</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={inspFrames}
                    onChange={(e) => setInspFrames(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Yavrulu Çerçeve</label>
                  <input
                    type="number"
                    min={0}
                    max={inspFrames}
                    value={inspBrood}
                    onChange={(e) => setInspBrood(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Ballı Çerçeve</label>
                  <input
                    type="number"
                    min={0}
                    max={inspFrames}
                    value={inspHoney}
                    onChange={(e) => setInspHoney(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                    <input
                      type="checkbox"
                      checked={inspQueenSeen}
                      onChange={(e) => setInspQueenSeen(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Ana Arı (Kraliçe) Görüldü</span>
                  </label>

                  {onOpenQueenFinder && (
                    <button
                      type="button"
                      onClick={() => onOpenQueenFinder()}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-700" />
                      <span>Kamera ile Tara & Bul</span>
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspFreshEggs}
                    onChange={(e) => setInspFreshEggs(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Günlük Taze Dik Yumurtalar Görüldü</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-rose-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={inspCells}
                    onChange={(e) => setInspCells(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Oğul Yüksükleri (Ana Memesi) Var</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Arı Huysuzluğu / Uysallık</label>
                <select
                  value={inspTemperament}
                  onChange={(e) => setInspTemperament(e.target.value as any)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="Uysal">Uysal (Duman istemiyor)</option>
                  <option value="Sakin">Sakin (Normal)</option>
                  <option value="Hırçın">Hırçın (Hafif sokucu)</option>
                  <option value="Sokucu">Sokucu / Agresif</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Yapılan İşlem / Müdahale</label>
                <input
                  type="text"
                  placeholder="Örn: 1:1 teşvik şerbeti verildi, 2 ham petek eklendi, memeler bozuldu"
                  value={inspAction}
                  onChange={(e) => setInspAction(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Gözlem Notları</label>
                <textarea
                  rows={2}
                  placeholder="Polen girişi rengi, varroa dökümü veya genel durum"
                  value={inspNotes}
                  onChange={(e) => setInspNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              {/* NEXT INSPECTION PLANNING */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Bir Sonraki Bakım Zamanı & Hedefi</span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-medium">Bölgesel Hatırlatıcı</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Bakım Tarihi</label>
                    <input
                      type="date"
                      value={inspNextDate}
                      onChange={(e) => setInspNextDate(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Hızlı Tarih Seç</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: "+3 Gün", days: 3 },
                        { label: "+5 Gün", days: 5 },
                        { label: "+7 Gün", days: 7 },
                        { label: "+14 Gün", days: 14 },
                      ].map((item) => (
                        <button
                          key={item.days}
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + item.days);
                            setInspNextDate(d.toISOString().split("T")[0]);
                          }}
                          className="py-1 px-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[10px] font-bold text-amber-900 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-stone-600 block mb-1">
                    Bir Sonraki Bakımda Yapılacak İşlem / Hedef
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 2:1 kış şerbeti çekimini ve dip tahtası varroa dökümünü kontrol et"
                    value={inspNextAction}
                    onChange={(e) => setInspNextAction(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      "Şerbet çekimi & besleme",
                      "Varroa dökümü kontrolü",
                      "Oğul yüksükleri kontrolü",
                      "Strafor daraltma kontrolü",
                    ].map((sugg) => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => setInspNextAction(sugg)}
                        className="text-[10px] px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-200 text-stone-700 rounded-full transition-colors"
                      >
                        + {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedHiveForInspection(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Muayeneyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION HISTORY MODAL */}
      {viewHistoryHive && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-amber-300 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">
                {viewHistoryHive.hiveNumber} Muayene Geçmişi ({viewHistoryHive.inspections.length} Kayıt)
              </h3>
              <button
                onClick={() => setViewHistoryHive(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {viewHistoryHive.inspections.map((insp) => (
                <div
                  key={insp.id}
                  className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>📅 {insp.date}</span>
                    <span className="text-amber-800">
                      {insp.framesCovered} Çerçeve (Yavru: {inspBrood}, Bal: {inspHoney})
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">İşlem: </span>
                    <span className="text-stone-800">{insp.actionTaken}</span>
                  </div>
                  <div className="flex gap-3 text-stone-600 text-[11px]">
                    <span>Ana: {insp.queenSeen ? "✅ Görüldü" : "❌ Görülmedi"}</span>
                    <span>Yumurta: {insp.freshEggsSeen ? "✅ Var" : "❌ Yok"}</span>
                    <span>Mizaç: {insp.temperament}</span>
                    {insp.queenCellsPresent && (
                      <span className="text-rose-600 font-bold">⚠️ Yüksük Var</span>
                    )}
                  </div>
                  {insp.notes && (
                    <div className="text-stone-500 italic mt-1 bg-white p-2 rounded-lg border border-amber-100">
                      {insp.notes}
                    </div>
                  )}
                </div>
              ))}

              {viewHistoryHive.inspections.length === 0 && (
                <div className="text-center py-6 text-stone-500 text-xs">
                  Henüz kaydedilmiş muayene bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT HIVE MODAL */}
      {editingHive && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-300 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900">Kovan Bilgilerini Düzenle</h3>

            <form onSubmit={handleSaveEditedHive} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Kovan Numarası / Adı</label>
                <input
                  type="text"
                  value={editingHive.hiveNumber}
                  onChange={(e) => setEditingHive({ ...editingHive, hiveNumber: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kovan Tipi</label>
                  <select
                    value={editingHive.type}
                    onChange={(e) =>
                      setEditingHive({ ...editingHive, type: e.target.value as HiveType })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Langstroth">Langstroth</option>
                    <option value="Dadant">Dadant</option>
                    <option value="Karakovan">Karakovan</option>
                    <option value="Sepet">Sepet Kovan</option>
                    <option value="Ruset">Ruşet Kovan</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Ana Arı Irkı</label>
                  <select
                    value={editingHive.queenRace}
                    onChange={(e) =>
                      setEditingHive({ ...editingHive, queenRace: e.target.value as QueenRace })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Kafkas">Kafkas</option>
                    <option value="Karniyol">Karniyol</option>
                    <option value="İtalyan">İtalyan</option>
                    <option value="Anadolu">Anadolu</option>
                    <option value="Mugla">Muğla Ege</option>
                    <option value="Belfast">Belfast</option>
                    <option value="Yerli Karadeniz">Yerli Karadeniz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Ana Arı Yılı</label>
                  <input
                    type="number"
                    value={editingHive.queenYear}
                    onChange={(e) =>
                      setEditingHive({ ...editingHive, queenYear: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Boya Rengi</label>
                  <select
                    value={editingHive.queenMarkColor}
                    onChange={(e) =>
                      setEditingHive({
                        ...editingHive,
                        queenMarkColor: e.target.value as QueenColor,
                      })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Beyaz">Beyaz (2026/2021)</option>
                    <option value="Mavi">Mavi (2025/2020)</option>
                    <option value="Yesil">Yeşil (2024/2019)</option>
                    <option value="Kirmizi">Kırmızı (2023/2018)</option>
                    <option value="Sari">Sarı (2022/2017)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Sağlık Durumu</label>
                <select
                  value={editingHive.healthStatus}
                  onChange={(e) =>
                    setEditingHive({
                      ...editingHive,
                      healthStatus: e.target.value as HealthStatus,
                    })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="Saglikli">Sağlıklı</option>
                  <option value="Varroa Riski">Varroa Riski</option>
                  <option value="Besleme Gerekli">Besleme Gerekli</option>
                  <option value="Yavru Curuklugu Suphesi">Yavru Çürüklüğü Şüphesi</option>
                  <option value="Kirec Hastaligi">Kireç Hastalığı</option>
                  <option value="Nosema Belirtisi">Nosema Belirtisi</option>
                  <option value="Anasiz Koloni">Anasız Koloni</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Arılık İçi Konum</label>
                <input
                  type="text"
                  placeholder="Örn: 1. Sıra 3. Kovan (Ceviz ağacı yanı)"
                  value={editingHive.locationTag || ""}
                  onChange={(e) => setEditingHive({ ...editingHive, locationTag: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Kovan Notları</label>
                <textarea
                  rows={2}
                  value={editingHive.notes || ""}
                  onChange={(e) => setEditingHive({ ...editingHive, notes: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingHive(null)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Güncellemeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HIVE QR CODE MODAL & SCANNER */}
      <HiveQrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        hives={hives}
        initialHiveId={qrTargetHiveId}
        onSelectScannedHive={(scannedHive) => {
          setQrModalOpen(false);
          handleOpenInspection(scannedHive);
        }}
      />
    </div>
  );
};
