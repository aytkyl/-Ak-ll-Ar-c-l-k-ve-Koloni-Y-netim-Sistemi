import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, ArrowRight, X, Bell, BellRing, Volume2 } from "lucide-react";
import { MeteorologicalAlert } from "../types";
import {
  isPushPermissionGranted,
  requestPushPermission,
  sendMeteorologicalPushNotification,
  playMeteorologicalChime,
} from "../services/weatherAlertService";

interface MeteorologicalAlertBannerProps {
  alerts: MeteorologicalAlert[];
  onOpenAlertModal: () => void;
}

export const MeteorologicalAlertBanner: React.FC<MeteorologicalAlertBannerProps> = ({
  alerts,
  onOpenAlertModal,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission);
    } else {
      setPushStatus("unsupported");
    }
  }, []);

  if (isDismissed || alerts.length === 0) return null;

  const topAlert = alerts[0];
  const isCritical = topAlert.severity === "kritik";

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    setPushStatus(res);
    if (res === "granted" && topAlert) {
      sendMeteorologicalPushNotification(topAlert);
      playMeteorologicalChime(topAlert.severity);
    }
  };

  return (
    <div
      role="alert"
      className={`border-b transition-all ${
        isCritical
          ? "bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white border-rose-800 shadow-sm"
          : "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white border-amber-700 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-1 rounded-lg bg-white/20 backdrop-blur-xs shrink-0 text-base">
            {topAlert.icon}
          </div>
          <div className="truncate">
            <span className="font-extrabold uppercase tracking-wide mr-2 bg-black/25 px-2 py-0.5 rounded-full text-[10px]">
              {isCritical ? "🚨 KRİTİK METEOROLOJİK ALARM" : "⚠️ METEOROLOJİK UYARI"}
            </span>
            <span className="font-bold mr-1">{topAlert.title}:</span>
            <span className="opacity-95 hidden sm:inline">{topAlert.description}</span>
            <span className="font-semibold underline ml-1.5 opacity-90">({topAlert.triggerValue})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {pushStatus === "default" && (
            <button
              onClick={handleEnablePush}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-black/30 hover:bg-black/40 text-white font-semibold rounded-lg text-xs border border-white/20 transition-all active:scale-95"
              title="Aşırı hava durumlarında anlık masaüstü / mobil push bildirimi al"
            >
              <Bell className="w-3 h-3 text-amber-300" />
              <span>Push Bildirimi Aç</span>
            </button>
          )}

          <button
            onClick={onOpenAlertModal}
            className="flex items-center gap-1 px-3 py-1 bg-white text-stone-900 hover:bg-amber-100 font-bold rounded-lg text-xs shadow-xs transition-all active:scale-95"
          >
            <span>Önlemleri Gör ({alerts.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Uyarı Bandını Gizle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

