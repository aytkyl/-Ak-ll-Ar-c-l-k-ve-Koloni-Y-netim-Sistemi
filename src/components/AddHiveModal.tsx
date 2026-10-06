import React, { useState } from "react";
import { Plus, X, Compass } from "lucide-react";
import { Hive, HiveType, QueenRace, QueenColor, HealthStatus } from "../types";

interface AddHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHive: (hive: Hive) => void;
}

export const AddHiveModal: React.FC<AddHiveModalProps> = ({ isOpen, onClose, onAddHive }) => {
  const [hiveNumber, setHiveNumber] = useState<string>("");
  const [type, setType] = useState<HiveType>("Langstroth");
  const [queenRace, setQueenRace] = useState<QueenRace>("Kafkas");
  const [queenYear, setQueenYear] = useState<number>(2026);
  const [queenMarkColor, setQueenMarkColor] = useState<QueenColor>("Beyaz");
  const [totalFrames, setTotalFrames] = useState<number>(8);
  const [broodFrames, setBroodFrames] = useState<number>(5);
  const [honeyFrames, setHoneyFrames] = useState<number>(3);
  const [honeySuperCount, setHoneySuperCount] = useState<number>(0);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>("Saglikli");
  const [locationTag, setLocationTag] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiveNumber.trim()) return;

    const newHive: Hive = {
      id: "hive-" + Date.now(),
      hiveNumber: hiveNumber.trim(),
      type,
      queenRace,
      queenYear,
      queenMarkColor,
      queenLaying: true,
      totalFrames,
      broodFrames,
      honeyFrames,
      honeySuperCount,
      healthStatus,
      swarmTendency: "Yok",
      locationTag: locationTag.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      inspections: [],
    };

    onAddHive(newHive);
    onClose();
    // Reset
    setHiveNumber("");
    setNotes("");
    setLocationTag("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-amber-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Yeni Kovan Kaydet</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Kovan Numarası / Tanımlayıcı *
            </label>
            <input
              type="text"
              placeholder="Örn: K-06, KK-02, Kütük-1"
              value={hiveNumber}
              onChange={(e) => setHiveNumber(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Kovan Tipi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HiveType)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Langstroth">Langstroth</option>
                <option value="Dadant">Dadant</option>
                <option value="Karakovan">Karakovan (Kütük/Doğal)</option>
                <option value="Sepet">Sepet Kovan</option>
                <option value="Ruset">Ruşet Kovan (5 Çerçeve)</option>
                <option value="Diger">Diğer</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Ana Arı Irkı</label>
              <select
                value={queenRace}
                onChange={(e) => setQueenRace(e.target.value as QueenRace)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Kafkas">Kafkas (Uzun dil, uysal)</option>
                <option value="Karniyol">Karniyol (Hızlı bahar gelişimi)</option>
                <option value="İtalyan">İtalyan (Sarı, yavrucu)</option>
                <option value="Anadolu">Anadolu (Zorlu kışa dayanıklı)</option>
                <option value="Mugla">Muğla Ege (Çam balına uyumlu)</option>
                <option value="Belfast">Buckfast / Belfast</option>
                <option value="Yerli Karadeniz">Yerli Karadeniz</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Ana Arı Yılı</label>
              <input
                type="number"
                value={queenYear}
                onChange={(e) => setQueenYear(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Boya Rengi</label>
              <select
                value={queenMarkColor}
                onChange={(e) => setQueenMarkColor(e.target.value as QueenColor)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Beyaz">Beyaz (2026 / 2021)</option>
                <option value="Mavi">Mavi (2025 / 2020)</option>
                <option value="Yesil">Yeşil (2024 / 2019)</option>
                <option value="Kirmizi">Kırmızı (2023 / 2018)</option>
                <option value="Sari">Sarı (2022 / 2017)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Toplam Çerçeve</label>
              <input
                type="number"
                min={1}
                max={30}
                value={totalFrames}
                onChange={(e) => setTotalFrames(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Yavrulu</label>
              <input
                type="number"
                min={0}
                max={totalFrames}
                value={broodFrames}
                onChange={(e) => setBroodFrames(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Ballı</label>
              <input
                type="number"
                min={0}
                max={totalFrames}
                value={honeyFrames}
                onChange={(e) => setHoneyFrames(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Ballık Kat Sayısı</label>
              <input
                type="number"
                min={0}
                max={5}
                value={honeySuperCount}
                onChange={(e) => setHoneySuperCount(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Sağlık Durumu</label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as HealthStatus)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Saglikli">Sağlıklı</option>
                <option value="Varroa Riski">Varroa Riski</option>
                <option value="Besleme Gerekli">Besleme Gerekli</option>
                <option value="Kirec Hastaligi">Kireç Hastalığı</option>
                <option value="Anasiz Koloni">Anasız Koloni</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Arılıktaki Konumu</label>
            <input
              type="text"
              placeholder="Örn: 2. Sıra, Ihlamur ağacı altı"
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Özel Notlar</label>
            <textarea
              rows={2}
              placeholder="Damızlık kaynağı, huyu, son işlem vb."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              Kovanı Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
