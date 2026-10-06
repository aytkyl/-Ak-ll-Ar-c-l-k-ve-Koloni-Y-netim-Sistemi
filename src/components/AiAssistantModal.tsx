import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Camera,
  Upload,
  Send,
  AlertCircle,
  CheckCircle2,
  X,
  HelpCircle,
  RefreshCw,
  Crown,
  MessageSquareText,
  Scan,
  Bug,
  Layers,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { QueenFinderHelper } from "./QueenFinderHelper";
import { FrameVisionScanner } from "./FrameVisionScanner";
import { Hive } from "../types";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "frame-vision" | "queen-finder" | "diagnose";
  initialPrompt?: string;
  hives?: Hive[];
  onSaveToInspection?: (
    hiveId: string,
    inspectionData: {
      broodPercent: number;
      honeyPercent: number;
      varroaInfestation: number;
      notes: string;
      actionTaken: string;
      nextInspectionDays: number;
    }
  ) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialMode = "frame-vision",
  initialPrompt = "",
  hives = [],
  onSaveToInspection,
}) => {
  const [activeMode, setActiveMode] = useState<"frame-vision" | "queen-finder" | "diagnose">(initialMode);
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialMode) setActiveMode(initialMode);
      if (initialPrompt) setPrompt(initialPrompt);
    }
  }, [isOpen, initialMode, initialPrompt]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      // Strip base64 data prefix for backend
      const rawBase64 = base64String.split(",")[1];
      setImageBase64(rawBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() && !imageBase64) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          imageBase64: imageBase64 || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Arıcılık yapay zeka danışmanından yanıt alınamadı.");
      }
      setResult(data.result || data.diagnosis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Petekte delikli, koyu ve batık gözler var; Amerikan yavru çürüklüğü mü?",
    "Petek gözlerinde tebeşir gibi beyaz taşlaşmış kireç mumyaları var, tedavisi nedir?",
    "Peteklerde örümcek ağı tünelleri ve güve pisliği var; petek nasıl kurtarılır?",
    "İşçi gözlerinde 3-4 adet düzensiz yumurta ve kubbeli erkekler var; yalancı ana nasıl çözülür?",
    "Hasat sonrası formik asit (10 cc) ve oksalik asit varroa mücadelesi nasıl uygulanır?",
    "Çıtalarda sarı-kahverengi ishal lekesi var; Nosema için kekik katkılı şurup reçetesi nedir?",
    "Arılar kovan önünde salkım yaptı, oğula mı gidiyorlar?",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 border border-amber-300 shadow-2xl max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Usta Arıcı Yapay Zeka & Petek Vision Sistemi</span>
                <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-full">
                  Gemini 3.8 Multimodal
                </span>
              </h3>
              <p className="text-xs text-stone-500 hidden sm:block">
                Arı ve Varroa sayımı, işaretleme, hastalık teşhisi, ana arı radarı ve kovan muayenesi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 pt-3 pb-2">
          <button
            onClick={() => setActiveMode("frame-vision")}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === "frame-vision"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            <Bug className="w-4 h-4 text-amber-300" />
            <span className="truncate">🔬 Arı & Varroa Sayma, Muayene</span>
          </button>

          <button
            onClick={() => setActiveMode("queen-finder")}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === "queen-finder"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300 fill-current" />
            <span className="truncate">👑 Ana Arı Bulucu</span>
          </button>

          <button
            onClick={() => setActiveMode("diagnose")}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === "diagnose"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-stone-700 hover:bg-amber-100"
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="truncate">💬 Teşhis & Danışman</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4 pr-1">
          {/* TAB 1: FRAME VISION SCANNER (Arı Sayma, Varroalı Arı Sayma ve Gösterme, Muayene) */}
          {activeMode === "frame-vision" && (
            <FrameVisionScanner
              hives={hives}
              onSaveToInspection={onSaveToInspection}
              onOpenConsultantWithPrompt={(p) => {
                setPrompt(p);
                setActiveMode("diagnose");
                handleSend(p);
              }}
            />
          )}

          {/* TAB 2: QUEEN FINDER HELPER */}
          {activeMode === "queen-finder" && <QueenFinderHelper />}

          {/* TAB 3: GENERAL DIAGNOSIS & CHAT */}
          {activeMode === "diagnose" && (
            <div className="space-y-4">
              {/* Quick Questions Pills */}
              <div>
                <span className="text-xs font-bold text-stone-600 block mb-1.5">
                  Sıkça Karşılaşılan Durumlar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(q);
                        handleSend(q);
                      }}
                      className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-stone-700 rounded-lg border border-amber-200 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview if uploaded */}
              {imagePreview && (
                <div className="relative inline-block border-2 border-amber-300 rounded-xl overflow-hidden shadow-xs">
                  <img
                    src={imagePreview}
                    alt="Yüklenen petek fotoğrafı"
                    className="max-h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center gap-3 text-amber-900 text-sm font-semibold animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                  <span>Usta arıcı yapay zeka verileri inceliyor, tavsiyeler hazırlanıyor...</span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Result Output */}
              {result && (
                <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 pb-2 border-b border-amber-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Teşhis ve Çözüm Raporu:</span>
                  </div>
                  <div className="prose prose-sm prose-stone max-w-none mt-3 text-stone-800 leading-relaxed">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Input Bar for Diagnose */}
              <div className="pt-3 border-t border-amber-100 flex items-center gap-2">
                <label
                  className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-600 rounded-xl cursor-pointer border border-stone-200 transition-colors shrink-0"
                  title="Kamerayla Petek Fotoğrafı Çek"
                >
                  <Camera className="w-5 h-5 text-amber-700" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <label
                  className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-600 rounded-xl cursor-pointer border border-stone-200 transition-colors shrink-0"
                  title="Galeriden Fotoğraf Seç"
                >
                  <Upload className="w-5 h-5 text-stone-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder="Arılığınızdaki sorunu veya gözlemi yazın..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={loading || (!prompt.trim() && !imageBase64)}
                  className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
