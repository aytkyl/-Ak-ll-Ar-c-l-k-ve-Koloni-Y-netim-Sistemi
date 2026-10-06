import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  BellRing,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Calendar,
  CheckCircle2,
  Sparkles,
  Flame,
  Wind,
  Snowflake,
  CloudRain,
  ExternalLink,
} from "lucide-react";
import { MeteorologicalAlert, WeatherData, PlannerTask } from "../types";
import {
  requestPushPermission,
  isPushPermissionGranted,
  sendMeteorologicalPushNotification,
  playMeteorologicalChime,
  getSimulatedAlert,
} from "../services/weatherAlertService";

interface MeteorologicalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MeteorologicalAlert[];
  weather: WeatherData | null;
  onAddTaskToPlanner?: (task: PlannerTask) => void;
  onNavigateToPlanner?: () => void;
}

export const MeteorologicalAlertModal: React.FC<MeteorologicalAlertModalProps> = ({
  isOpen,
  onClose,
  alerts,
  weather,
  onAddTaskToPlanner,
  onNavigateToPlanner,
}) => {
  const [pushGranted, setPushGranted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem("kovanim_alert_sound") !== "false";
  });
  const [localSimulatedAlerts, setLocalSimulatedAlerts] = useState<MeteorologicalAlert[]>([]);
  const [addedTaskToast, setAddedTaskToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushGranted(Notification.permission === "granted");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const result = await requestPushPermission();
    setPushGranted(result === "granted");
    if (result === "granted") {
      const testAlert = alerts[0] || getSimulatedAlert("extreme_heat");
      sendMeteorologicalPushNotification(testAlert);
      if (soundEnabled) playMeteorologicalChime(testAlert.severity);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("kovanim_alert_sound", String(next));
    if (next) playMeteorologicalChime("orta");
  };

  const handleTriggerSimulation = (type: "extreme_heat" | "storm_wind" | "cold_frost") => {
    const simAlert = getSimulatedAlert(type);
    setLocalSimulatedAlerts((prev) => [simAlert, ...prev.filter((a) => a.id !== simAlert.id)]);
    if (soundEnabled) playMeteorologicalChime(simAlert.severity);
    if (pushGranted) sendMeteorologicalPushNotification(simAlert);
  };

  const handleAddActionToPlanner = (alert: MeteorologicalAlert, actionText: string) => {
    if (!onAddTaskToPlanner) return;

    const newTask: PlannerTask = {
      id: `task-alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      period: "daily",
      category:
        alert.type === "cold_frost"
          ? "Kışlatma"
          : alert.type === "storm_wind"
          ? "Kovan Kontrolü"
          : "Kovan Kontrolü",
      title: `${alert.title}: ${actionText.slice(0, 40)}...`,
      description: `Meteorolojik Uyarı Önlemi (${weather?.city || "Arılık"}):\n• Tetikleyici: ${alert.triggerValue} (${alert.dateOrTime})\n• Önlem: ${actionText}\n• Risk Nedeni: ${alert.beekeeperImpact}`,
      seasonOrMonth: alert.dateOrTime,
      frequencyText: "Acil Hava Önlemi",
      isCompleted: false,
      priority: alert.severity === "kritik" ? "Kritik" : "Yuksek",
    };

    onAddTaskToPlanner(newTask);
    setAddedTaskToast(`"${actionText.slice(0, 35)}..." görevi Planlayıcıya eklendi!`);
    setTimeout(() => setAddedTaskToast(null), 3500);
  };

  // Combine real weather alerts and any simulated alerts
  const combinedAlerts = [...localSimulatedAlerts, ...alerts];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs text-xl shadow-xs">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Meteorolojik Uyarı & Güvenlik Sistemi</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/30 border border-white/20 uppercase tracking-wide">
                  Canlı Radar
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                {weather?.city ? `${weather.city} (${weather.region})` : "Canlı Hava"} — Aşırı sıcaklık, fırtına ve don koruma kalkanı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toast */}
        {addedTaskToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{addedTaskToast}</span>
          </div>
        )}

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Settings & Push Notification Permissions Card */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <BellRing className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs">
                    Otomatik Tarayıcı / Cihaz Push Bildirimleri
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    Aşırı sıcaklık, sert fırtına veya gece donu durumlarında kovanınızı korumanız için anlık bildirim gönderir
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pushGranted ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bildirimler Açık</span>
                  </span>
                ) : (
                  <button
                    onClick={handleRequestPush}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Bildirim İzni Ver</span>
                  </button>
                )}

                <button
                  onClick={handleToggleSound}
                  className={`p-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
                    soundEnabled
                      ? "bg-white text-stone-800 border-amber-300 shadow-2xs"
                      : "bg-stone-100 text-stone-400 border-stone-200"
                  }`}
                  title={soundEnabled ? "Sesli uyarı açık" : "Sesli uyarı kapalı"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Testing & Simulation bar */}
            <div className="pt-3 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Uyarı ve Bildirim Sistemini Test Edin:</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleTriggerSimulation("extreme_heat")}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>Aşırı Sıcaklık (38°C)</span>
                </button>
                <button
                  onClick={() => handleTriggerSimulation("storm_wind")}
                  className="px-2.5 py-1 bg-white hover:bg-cyan-100/60 text-cyan-900 border border-cyan-300 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                >
                  <Wind className="w-3 h-3 text-cyan-600" />
                  <span>Fırtına (52 km/h)</span>
                </button>
                <button
                  onClick={() => handleTriggerSimulation("cold_frost")}
                  className="px-2.5 py-1 bg-white hover:bg-sky-100/60 text-sky-900 border border-sky-300 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                >
                  <Snowflake className="w-3 h-3 text-sky-600" />
                  <span>Gece Donu (1°C)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>Aktif Meteorolojik Tehditler & Önlem Rehberi</span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-extrabold border">
                  {combinedAlerts.length} Aktif
                </span>
              </h4>

              {localSimulatedAlerts.length > 0 && (
                <button
                  onClick={() => setLocalSimulatedAlerts([])}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                >
                  Test Uyarılarını Temizle
                </button>
              )}
            </div>

            {combinedAlerts.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="text-3xl">🌿</div>
                <div className="font-bold text-emerald-900 text-sm">
                  Hava Koşulları Güvenli — Kritik Tehdit Yok
                </div>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  {weather?.city || "Arılığınızda"} önümüzdeki 7 gün boyunca aşırı sıcaklık (&gt;35°C), yıkıcı fırtına (&gt;25 km/h) veya gece ayazı (&lt;8°C) riski tespit edilmedi. Koloniler rutin döngüsündedir.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {combinedAlerts.map((alert) => {
                  const isCritical = alert.severity === "kritik";
                  const isHigh = alert.severity === "yuksek";

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                        isCritical
                          ? "bg-rose-50/80 border-rose-300 shadow-xs"
                          : isHigh
                          ? "bg-amber-50/80 border-amber-300 shadow-xs"
                          : "bg-stone-50 border-stone-200"
                      }`}
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-2.5 border-stone-200/70">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs border shrink-0">
                            {alert.icon}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isCritical
                                    ? "bg-rose-600 text-white"
                                    : isHigh
                                    ? "bg-amber-600 text-white"
                                    : "bg-stone-700 text-white"
                                }`}
                              >
                                {isCritical
                                  ? "🚨 Kritik Acil Alarm"
                                  : isHigh
                                  ? "⚠️ Yüksek Risk"
                                  : "ℹ️ Dikkat"}
                              </span>
                              <span className="text-stone-500 font-semibold text-[11px]">
                                {alert.dateOrTime}
                              </span>
                            </div>
                            <h5 className="font-bold text-stone-900 text-sm mt-0.5">
                              {alert.title}
                            </h5>
                          </div>
                        </div>

                        <span className="text-xs font-black text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs">
                          {alert.triggerValue}
                        </span>
                      </div>

                      {/* Description & Impact */}
                      <p className="text-stone-700 leading-relaxed">{alert.description}</p>

                      <div className="p-2.5 rounded-xl bg-white/90 border border-stone-200/80 space-y-1">
                        <span className="font-bold text-stone-900 block text-[11px]">
                          🐝 Koloni ve Arı Sağlığına Etkisi:
                        </span>
                        <p className="text-stone-600 italic">{alert.beekeeperImpact}</p>
                      </div>

                      {/* Action Steps Checklist */}
                      <div className="space-y-2 pt-1">
                        <span className="font-bold text-stone-900 block text-xs flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Usta Arıcı Acil Koruma Adımları:</span>
                        </span>

                        <div className="space-y-1.5">
                          {alert.actionSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/70 hover:bg-white border border-stone-200/60 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-black text-amber-700 shrink-0 mt-0.5">
                                  {idx + 1}.
                                </span>
                                <span className="text-stone-800">{step}</span>
                              </div>

                              {onAddTaskToPlanner && (
                                <button
                                  onClick={() => handleAddActionToPlanner(alert, step)}
                                  className="shrink-0 px-2 py-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors flex items-center gap-1"
                                  title="Bu eylemi Bakım Planlayıcısına ekle"
                                >
                                  <Calendar className="w-3 h-3" />
                                  <span className="hidden sm:inline">Planla</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Veriler canlı Open-Meteo modelleri üzerinden her saat taranmaktadır.</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToPlanner && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPlanner();
                }}
                className="px-3.5 py-2 text-stone-700 hover:text-stone-900 font-bold rounded-xl transition-colors"
              >
                Planlayıcıya Git
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
