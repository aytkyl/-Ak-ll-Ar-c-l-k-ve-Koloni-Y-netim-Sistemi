import React, { useState } from "react";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  AlertTriangle,
  Flame,
  Info,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";
import { PlannerTask } from "../types";

interface PlannerViewProps {
  tasks: PlannerTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: PlannerTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenRegionalCare?: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenRegionalCare,
}) => {
  const [activePeriod, setActivePeriod] = useState<"daily" | "threeday" | "weekly" | "monthly">(
    "daily"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<PlannerTask["category"]>("Kovan Kontrolü");
  const [newFreq, setNewFreq] = useState("");
  const [newPriority, setNewPriority] = useState<PlannerTask["priority"]>("Yuksek");
  const [newSeason, setNewSeason] = useState("");

  const currentTasks = tasks.filter((t) => {
    if (t.period !== activePeriod) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const completedCount = currentTasks.filter((t) => t.isCompleted).length;
  const totalCount = currentTasks.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: PlannerTask = {
      id: "task-" + Date.now(),
      period: activePeriod,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      frequencyText: newFreq.trim() || (activePeriod === "daily" ? "Günlük" : activePeriod === "threeday" ? "3 Günde Bir" : activePeriod === "weekly" ? "Haftalık" : "Aylık"),
      isCompleted: false,
      priority: newPriority,
      seasonOrMonth: newSeason.trim() || undefined,
    };

    onAddTask(newTask);
    setShowAddTaskModal(false);
    setNewTitle("");
    setNewDesc("");
  };

  const getPriorityBadge = (priority: PlannerTask["priority"]) => {
    switch (priority) {
      case "Kritik":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Yuksek":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Orta":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Dusuk":
        return "bg-stone-100 text-stone-700 border-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-amber-600" />
            <span>Arıcılık Periyodik Bakım ve Eylem Planlayıcısı</span>
          </h2>
          <p className="text-sm text-stone-700 mt-0.5">
            Arı biyolojisine ve mevsim döngüsüne göre günlük, 3 günlük, haftalık ve aylık kritik görevler
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenRegionalCare && (
            <button
              onClick={onOpenRegionalCare}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span>📅 Bölgesel Bakım & Uyarılar</span>
            </button>
          )}

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-sm transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Görev Ekle</span>
          </button>
        </div>
      </div>

      {/* Period Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActivePeriod("daily")}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activePeriod === "daily"
              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
              : "bg-white text-stone-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          <span className="text-xs font-semibold opacity-90 block">Rutin Gözlem</span>
          <span className="text-base font-black">☀️ Günlük Plan</span>
          <span className="text-xs mt-1 block opacity-80">Uçuş, suluk, yağmacılık</span>
        </button>

        <button
          onClick={() => setActivePeriod("threeday")}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activePeriod === "threeday"
              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
              : "bg-white text-stone-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          <span className="text-xs font-semibold opacity-90 block">Kritik Döngü</span>
          <span className="text-base font-black">🔄 3 Günlük Döngü</span>
          <span className="text-xs mt-1 block opacity-80">Şerbet, meme, ham petek</span>
        </button>

        <button
          onClick={() => setActivePeriod("weekly")}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activePeriod === "weekly"
              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
              : "bg-white text-stone-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          <span className="text-xs font-semibold opacity-90 block">Ana Muayene</span>
          <span className="text-base font-black">📅 Haftalık Rutin</span>
          <span className="text-xs mt-1 block opacity-80">Kovan içi, yavru, kat</span>
        </button>

        <button
          onClick={() => setActivePeriod("monthly")}
          className={`p-4 rounded-2xl text-left border transition-all ${
            activePeriod === "monthly"
              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
              : "bg-white text-stone-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          <span className="text-xs font-semibold opacity-90 block">Mevsim Takvimi</span>
          <span className="text-base font-black">🗓️ Aylık & Mevsimlik</span>
          <span className="text-xs mt-1 block opacity-80">Mart'tan Kışa 12 ay</span>
        </button>
      </div>

      {/* 3-Day Cycle Special Beekeeper Note if active */}
      {activePeriod === "threeday" && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-stone-800 text-xs flex items-start gap-3 shadow-2xs">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-900 block mb-0.5">
              Neden 3 Günlük Aralık Arıcılıkta Hayatidir?
            </span>
            Arı biyolojisinde yumurta 3 günde çatlar ve larvaya dönüşür. Oğula niyetlenen koloni,
            açık kraliçe memelerini 3-4 gün içinde sütleyip kapatır. Kraliçe memesi kapandığı an
            eski ana koloniyi terk edip oğula çıkar. Bu nedenle kritik mevsimde 3 günde bir
            yapılan kontroller oğul kaçışını %100 engeller ve verilen şerbetin ekşimesini önler.
          </div>
        </div>
      )}

      {/* Progress & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1.5">
            <span>
              Tamamlanan Görevler: {completedCount} / {totalCount}
            </span>
            <span className="text-amber-700 font-bold">%{percentCompleted}</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-amber-50/50 border border-amber-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="Kovan Kontrolü">Kovan Kontrolü</option>
            <option value="Besleme">Besleme</option>
            <option value="Oğul Önleme">Oğul Önleme</option>
            <option value="Hastalık & Varroa">Hastalık & Varroa</option>
            <option value="Hasat">Hasat</option>
            <option value="Kışlatma">Kışlatma</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {currentTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs flex items-start justify-between gap-4 ${
              task.isCompleted
                ? "border-emerald-200 bg-emerald-50/30 opacity-75"
                : "border-amber-200/90 hover:border-amber-400"
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1">
              <button
                onClick={() => onToggleTask(task.id)}
                className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6 text-stone-300 hover:text-amber-500" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    className={`text-base font-bold ${
                      task.isCompleted
                        ? "line-through text-stone-400"
                        : "text-stone-900"
                    }`}
                  >
                    {task.title}
                  </h4>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                    {task.category}
                  </span>

                  {task.seasonOrMonth && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {task.seasonOrMonth}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-0.5">
                  {task.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{task.frequencyText}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-stone-300 hover:text-rose-500 p-1 rounded-lg transition-colors shrink-0"
              title="Görevi Sil"
            >
              ✕
            </button>
          </div>
        ))}

        {currentTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-amber-200 p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800">Bu periyotta bekleyen görev yok</h4>
            <p className="text-xs text-stone-500 mt-1">
              Yukarıdaki butondan kendi arılığınız için özel hatırlatıcı ekleyebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-300 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">Yeni Arıcılık Görevi Ekle</h3>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Döngü / Periyot</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["daily", "threeday", "weekly", "monthly"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActivePeriod(p)}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                        activePeriod === p
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {p === "daily"
                        ? "Günlük"
                        : p === "threeday"
                        ? "3 Günlük"
                        : p === "weekly"
                        ? "Haftalık"
                        : "Aylık"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Görev Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: 2:1 kış şerbeti verilecek, varroa şeridi çıkarılacak"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Açıklama ve Yönerge</label>
                <textarea
                  rows={2}
                  placeholder="Nasıl yapılacağı ve dikkat edilecek püf noktalar"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as PlannerTask["category"])
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Kovan Kontrolü">Kovan Kontrolü</option>
                    <option value="Besleme">Besleme</option>
                    <option value="Oğul Önleme">Oğul Önleme</option>
                    <option value="Hastalık & Varroa">Hastalık & Varroa</option>
                    <option value="Hasat">Hasat</option>
                    <option value="Kışlatma">Kışlatma</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Önem / Aciliyet</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Yuksek">Yüksek</option>
                    <option value="Kritik">Kritik Acil</option>
                    <option value="Orta">Orta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Sıklık Metni</label>
                  <input
                    type="text"
                    placeholder="Örn: 3 günde bir akşam üzeri"
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Mevsim / Ay (Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: Nisan, Eylül"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Görevi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
