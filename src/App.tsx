/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HiveManagerView } from "./components/HiveManagerView";
import { WeatherWidget } from "./components/WeatherWidget";
import { FloraForecastView } from "./components/FloraForecastView";
import { PlannerView } from "./components/PlannerView";
import { HarvestFinanceView } from "./components/HarvestFinanceView";
import { LibraryView } from "./components/LibraryView";
import { RegionalCareView } from "./components/RegionalCareView";
import { PetekHealthTreatmentView } from "./components/PetekHealthTreatmentView";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { AddHiveModal } from "./components/AddHiveModal";
import { HiveQrModal } from "./components/HiveQrModal";
import { MeteorologicalAlertBanner } from "./components/MeteorologicalAlertBanner";
import { MeteorologicalAlertModal } from "./components/MeteorologicalAlertModal";

import {
  Hive,
  InspectionLog,
  HarvestRecord,
  FinancialRecord,
  EquipmentItem,
  PlannerTask,
  WeatherData,
  TreatmentRecord,
} from "./types";
import {
  INITIAL_HIVES,
  INITIAL_HARVESTS,
  INITIAL_FINANCES,
  INITIAL_EQUIPMENT,
  INITIAL_TREATMENTS,
} from "./data/initialHiveData";
import { INITIAL_PLANNER_TASKS } from "./data/initialPlannerData";
import { TURKEY_PROVINCES, fetchCityWeather } from "./services/weatherService";
import {
  detectMeteorologicalAlerts,
  sendMeteorologicalPushNotification,
  playMeteorologicalChime,
  isPushPermissionGranted,
} from "./services/weatherAlertService";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>("hives");
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>("");

  // Persistent States
  const [hives, setHives] = useState<Hive[]>(() => {
    const saved = localStorage.getItem("kovanim_hives");
    return saved ? JSON.parse(saved) : INITIAL_HIVES;
  });

  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => {
    const saved = localStorage.getItem("kovanim_harvests");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_HARVESTS;
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem("kovanim_finances");
    return saved ? JSON.parse(saved) : INITIAL_FINANCES;
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem("kovanim_equipment");
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    const saved = localStorage.getItem("kovanim_tasks");
    return saved ? JSON.parse(saved) : INITIAL_PLANNER_TASKS;
  });

  const [treatments, setTreatments] = useState<TreatmentRecord[]>(() => {
    const saved = localStorage.getItem("kovanim_treatments");
    return saved ? JSON.parse(saved) : INITIAL_TREATMENTS;
  });

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  // Modals
  const [isAddHiveOpen, setIsAddHiveOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [aiAssistantMode, setAiAssistantMode] = useState<"frame-vision" | "queen-finder" | "diagnose">("frame-vision");
  const [isGlobalQrOpen, setIsGlobalQrOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // Active Meteorological Alerts detection
  const alerts = React.useMemo(() => detectMeteorologicalAlerts(weather), [weather]);
  const notifiedAlertsRef = React.useRef<Set<string>>(new Set());

  // Automatic push notification delivery on weather update
  useEffect(() => {
    if (alerts.length > 0 && isPushPermissionGranted()) {
      alerts.forEach((alert) => {
        if (
          (alert.severity === "kritik" || alert.severity === "yuksek") &&
          !notifiedAlertsRef.current.has(alert.id)
        ) {
          notifiedAlertsRef.current.add(alert.id);
          sendMeteorologicalPushNotification(alert);
          const soundPref = localStorage.getItem("kovanim_alert_sound");
          if (soundPref !== "false") {
            playMeteorologicalChime(alert.severity);
          }
        }
      });
    }
  }, [alerts]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("kovanim_hives", JSON.stringify(hives));
  }, [hives]);

  useEffect(() => {
    localStorage.setItem("kovanim_harvests", JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem("kovanim_finances", JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem("kovanim_equipment", JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem("kovanim_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("kovanim_treatments", JSON.stringify(treatments));
  }, [treatments]);

  // Treatment Handlers
  const handleAddTreatment = (record: TreatmentRecord) => {
    setTreatments((prev) => [record, ...prev]);
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial weather load (Default to Muğla - Turkey's beekeeping capital)
  useEffect(() => {
    const loadDefaultWeather = async () => {
      setWeatherLoading(true);
      try {
        const mugla = TURKEY_PROVINCES.find((p) => p.name === "Muğla") || TURKEY_PROVINCES[0];
        const data = await fetchCityWeather(mugla);
        setWeather(data);
      } catch (err) {
        console.error("Failed to load weather", err);
      } finally {
        setWeatherLoading(false);
      }
    };
    loadDefaultWeather();
  }, []);

  // Hive Handlers
  const handleAddHive = (hive: Hive) => {
    setHives((prev) => [hive, ...prev]);
  };

  const handleUpdateHive = (updatedHive: Hive) => {
    setHives((prev) => prev.map((h) => (h.id === updatedHive.id ? updatedHive : h)));
  };

  const handleDeleteHive = (hiveId: string) => {
    if (confirm("Bu kovanı ve ilgili tüm kayıtları silmek istediğinizden emin misiniz?")) {
      setHives((prev) => prev.filter((h) => h.id !== hiveId));
    }
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddTask = (newTask: PlannerTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Harvest Handlers
  const handleAddHarvest = (record: HarvestRecord) => {
    setHarvests((prev) => [record, ...prev]);
  };

  const handleDeleteHarvest = (id: string) => {
    setHarvests((prev) => prev.filter((h) => h.id !== id));
  };

  // Finance Handlers
  const handleAddFinance = (record: FinancialRecord) => {
    setFinances((prev) => [record, ...prev]);
  };

  const handleDeleteFinance = (id: string) => {
    setFinances((prev) => prev.filter((f) => f.id !== id));
  };

  // Equipment Handlers
  const handleAddEquipment = (item: EquipmentItem) => {
    setEquipment((prev) => [item, ...prev]);
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSetNextInspectionForHive = (hiveId: string, date: string, action: string) => {
    setHives((prev) =>
      prev.map((h) => {
        if (h.id === hiveId) {
          return {
            ...h,
            nextInspectionDate: date,
            nextInspectionAction: action,
          };
        }
        return h;
      })
    );
  };

  const handleAddTaskFromRegional = (taskName: string, notes: string, category: string) => {
    let cat: PlannerTask["category"] = "Kovan Kontrolü";
    if (category.toLowerCase().includes("besle") || category.toLowerCase().includes("şerbet")) cat = "Besleme";
    else if (category.toLowerCase().includes("varroa") || category.toLowerCase().includes("asit") || category.toLowerCase().includes("ilaç")) cat = "Hastalık & Varroa";
    else if (category.toLowerCase().includes("oğul")) cat = "Oğul Önleme";
    else if (category.toLowerCase().includes("hasat") || category.toLowerCase().includes("sağım")) cat = "Hasat";
    else if (category.toLowerCase().includes("kış") || category.toLowerCase().includes("daralt")) cat = "Kışlatma";

    const newTask: PlannerTask = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: taskName,
      category: cat,
      period: "monthly",
      description: notes || "Bölgesel bakım takviminden eklendi.",
      frequencyText: "Aylık bölgesel döngü",
      isCompleted: false,
      priority: "Yuksek",
      seasonOrMonth: "Eylül",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Save inspection result from AI Vision scanner directly into selected hive log
  const handleSaveInspectionFromVision = (
    hiveId: string,
    data: {
      broodPercent: number;
      honeyPercent: number;
      varroaInfestation: number;
      notes: string;
      actionTaken: string;
      nextInspectionDays: number;
    }
  ) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (data.nextInspectionDays || 5));
    const nextDateStr = nextDate.toISOString().split("T")[0];

    setHives((prev) =>
      prev.map((h) => {
        if (h.id !== hiveId) return h;
        const total = h.totalFrames || 10;
        const newInsp: InspectionLog = {
          id: `insp-ai-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          framesCovered: total,
          broodFrames: Math.max(1, Math.round((total * data.broodPercent) / 100)),
          honeyFrames: Math.max(1, Math.round((total * data.honeyPercent) / 100)),
          queenSeen: true,
          freshEggsSeen: true,
          queenCellsPresent: false,
          temperament: "Sakin",
          actionTaken: data.actionTaken,
          nextInspectionDate: nextDateStr,
          nextInspectionAction: "AI Vision takibi ve Varroa kontrolü",
          notes: data.notes,
        };

        return {
          ...h,
          healthStatus: data.varroaInfestation >= 3.0 ? "Varroa Riski" : h.healthStatus,
          lastInspectionDate: new Date().toISOString().split("T")[0],
          nextInspectionDate: nextDateStr,
          nextInspectionAction: "AI Vision takibi ve Varroa kontrolü",
          inspections: [newInsp, ...h.inspections],
        };
      })
    );
  };

  // Backup / Restore Data
  const handleExportData = () => {
    const backupData = {
      hives,
      harvests,
      finances,
      equipment,
      tasks,
      treatments,
      exportDate: new Date().toISOString(),
      appName: "Kovanım Arıcılık Asistanı",
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kovanim-aricilik-yedek-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.hives) setHives(data.hives);
        if (data.harvests) setHarvests(data.harvests);
        if (data.finances) setFinances(data.finances);
        if (data.equipment) setEquipment(data.equipment);
        if (data.tasks) setTasks(data.tasks);
        if (data.treatments) setTreatments(data.treatments);
        alert("Arıcılık verileriniz başarıyla geri yüklendi!");
      } catch (err) {
        alert("Geçersiz yedek dosyası!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        onOpenAiAssistant={() => {
          setAiAssistantMode("diagnose");
          setIsAiAssistantOpen(true);
        }}
        onOpenQueenFinder={() => {
          setAiAssistantMode("queen-finder");
          setIsAiAssistantOpen(true);
        }}
        onOpenVisionScanner={() => {
          setAiAssistantMode("frame-vision");
          setIsAiAssistantOpen(true);
        }}
        onOpenQrScanner={() => setIsGlobalQrOpen(true)}
        onAddHive={() => setIsAddHiveOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        hiveCount={hives.length}
        alertCount={alerts.length}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* Screen-wide Meteorological Threat Banner */}
      <MeteorologicalAlertBanner
        alerts={alerts}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "hives" && (
          <HiveManagerView
            hives={hives}
            onAddHive={() => setIsAddHiveOpen(true)}
            onUpdateHive={handleUpdateHive}
            onDeleteHive={handleDeleteHive}
            onOpenQueenFinder={() => {
              setAiAssistantMode("queen-finder");
              setIsAiAssistantOpen(true);
            }}
            onOpenVisionScanner={() => {
              setAiAssistantMode("frame-vision");
              setIsAiAssistantOpen(true);
            }}
            onOpenRegionalCare={() => setActiveTab("regional-care")}
            onOpenHealthTab={() => setActiveTab("petek-health")}
          />
        )}

        {activeTab === "regional-care" && (
          <RegionalCareView
            initialProvince={weather?.city || "Muğla"}
            hives={hives}
            onOpenAiConsultant={(prompt) => {
              setAiInitialPrompt(prompt);
              setAiAssistantMode("diagnose");
              setIsAiAssistantOpen(true);
            }}
            onAddTaskToPlanner={handleAddTaskFromRegional}
            onSetNextInspectionForHive={handleSetNextInspectionForHive}
          />
        )}

        {activeTab === "planner" && (
          <PlannerView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenRegionalCare={() => setActiveTab("regional-care")}
          />
        )}

        {activeTab === "weather" && (
          <WeatherWidget
            weather={weather}
            onUpdateWeather={setWeather}
            loading={weatherLoading}
            setLoading={setWeatherLoading}
            onScheduleInspection={handleAddTask}
            onNavigateToPlanner={() => setActiveTab("planner")}
            onOpenAlertModal={() => setIsAlertModalOpen(true)}
            activeAlertsCount={alerts.length}
          />
        )}

        {activeTab === "flora" && (
          <FloraForecastView currentCity={weather?.city} />
        )}

        {activeTab === "harvest-finance" && (
          <HarvestFinanceView
            hives={hives}
            harvests={harvests}
            finances={finances}
            equipment={equipment}
            onAddHarvest={handleAddHarvest}
            onDeleteHarvest={handleDeleteHarvest}
            onAddFinance={handleAddFinance}
            onDeleteFinance={handleDeleteFinance}
            onAddEquipment={handleAddEquipment}
            onDeleteEquipment={handleDeleteEquipment}
          />
        )}

        {activeTab === "petek-health" && (
          <PetekHealthTreatmentView
            hives={hives}
            treatments={treatments}
            onAddTreatment={handleAddTreatment}
            onDeleteTreatment={handleDeleteTreatment}
            onOpenAiAssistantWithPrompt={(prompt) => {
              setAiInitialPrompt(prompt);
              setAiAssistantMode("diagnose");
              setIsAiAssistantOpen(true);
            }}
          />
        )}

        {activeTab === "library" && (
          <LibraryView onNavigateToHealthTab={() => setActiveTab("petek-health")} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/80 bg-white/80 py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-bold text-stone-800">Kovanım</span> — Profesyonel ve Geleneksel
            Arıcılık Yönetim Sistemi
          </div>
          <div>
            Meteoroloji: Open-Meteo | Flora & Teşhis: Google Gemini AI | Kapsamlı Arı Kütüphanesi & Ansiklopedi
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AddHiveModal
        isOpen={isAddHiveOpen}
        onClose={() => setIsAddHiveOpen(false)}
        onAddHive={handleAddHive}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => {
          setIsAiAssistantOpen(false);
          setAiInitialPrompt("");
        }}
        initialMode={aiAssistantMode}
        initialPrompt={aiInitialPrompt}
        hives={hives}
        onSaveToInspection={handleSaveInspectionFromVision}
      />

      <HiveQrModal
        isOpen={isGlobalQrOpen}
        onClose={() => setIsGlobalQrOpen(false)}
        hives={hives}
        onSelectScannedHive={(hive) => {
          setIsGlobalQrOpen(false);
          setActiveTab("hives");
        }}
      />

      <MeteorologicalAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alerts={alerts}
        weather={weather}
        onAddTaskToPlanner={handleAddTask}
        onNavigateToPlanner={() => setActiveTab("planner")}
      />
    </div>
  );
}
