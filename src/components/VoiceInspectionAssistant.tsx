import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Check, AlertCircle } from "lucide-react";

interface VoiceInspectionAssistantProps {
  onParsedResult: (parsed: {
    transcript: string;
    queenSeen?: boolean;
    freshEggs?: boolean;
    queenCells?: boolean;
    frames?: number;
    action?: string;
  }) => void;
  className?: string;
}

export const VoiceInspectionAssistant: React.FC<VoiceInspectionAssistantProps> = ({
  onParsedResult,
  className = "",
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(true);
  const [interimText, setInterimText] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "tr-TR";

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          processFinalTranscript(transcriptPart);
        } else {
          currentTranscript += transcriptPart;
        }
      }
      setInterimText(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setFeedbackMsg("Mikrofon erişim izni verilmedi.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const playBeep = (freq = 600, duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const toggleListening = () => {
    if (!supported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText("");
    } else {
      try {
        setFeedbackMsg(null);
        recognitionRef.current.start();
        setIsListening(true);
        playBeep(880, 0.12);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const processFinalTranscript = (text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return;

    playBeep(1200, 0.08);

    const parsed: {
      transcript: string;
      queenSeen?: boolean;
      freshEggs?: boolean;
      queenCells?: boolean;
      frames?: number;
      action?: string;
    } = { transcript: text };

    const detectedActions: string[] = [];

    // 1. Ana arı kontrolü
    if (
      lower.includes("ana arı görüldü") ||
      lower.includes("kraliçe görüldü") ||
      lower.includes("ana görüldü") ||
      lower.includes("anayı gördüm")
    ) {
      parsed.queenSeen = true;
      detectedActions.push("Ana Arı Görüldü ✅");
    }

    // 2. Taze yumurta kontrolü
    if (
      lower.includes("taze yumurta") ||
      lower.includes("günlük yumurta") ||
      lower.includes("dik yumurta") ||
      lower.includes("yumurta var")
    ) {
      parsed.freshEggs = true;
      detectedActions.push("Günlük Yumurta ✅");
    }

    // 3. Yüksük / Oğul memesi kontrolü
    if (
      lower.includes("yüksük var") ||
      lower.includes("ana memesi") ||
      lower.includes("oğul memesi") ||
      lower.includes("meme yapmış")
    ) {
      parsed.queenCells = true;
      detectedActions.push("Oğul Yüksüğü Tespit Edildi ⚠️");
    }

    // 4. Çerçeve sayısı
    const frameMatch = lower.match(/(\d+)\s*(çerçeve|çıta)/);
    if (frameMatch) {
      const num = parseInt(frameMatch[1], 10);
      if (num > 0 && num <= 30) {
        parsed.frames = num;
        detectedActions.push(`${num} Çerçeve`);
      }
    }

    // 5. İşlemler
    if (lower.includes("şerbet") || lower.includes("besleme")) {
      parsed.action = "Şerbet beslemesi yapıldı";
      detectedActions.push("Şerbet verildi");
    } else if (lower.includes("kat atıldı") || lower.includes("ballık konuldu")) {
      parsed.action = "Ballık (kat) atıldı";
      detectedActions.push("Kat atıldı");
    } else if (lower.includes("ham petek") || lower.includes("petek verildi")) {
      parsed.action = "Ham petek ilave edildi";
      detectedActions.push("Petek verildi");
    } else if (lower.includes("varroa") || lower.includes("ilaç")) {
      parsed.action = "Varroa mücadelesi uygulandı";
      detectedActions.push("Varroa ilacı");
    }

    onParsedResult(parsed);

    if (detectedActions.length > 0) {
      setFeedbackMsg(`Algılandı: ${detectedActions.join(", ")}`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  if (!supported) {
    return (
      <div className={`text-[11px] text-stone-500 italic ${className}`}>
        (Tarayıcınız sesli dikte özelliğini desteklemiyor, Chrome veya Safari önerilir.)
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
            isListening
              ? "bg-rose-600 text-white animate-pulse ring-2 ring-rose-300"
              : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
          }`}
          title="Eldivenliyken konuşarak muayene notu ve kovan durumunu kaydet"
        >
          {isListening ? (
            <>
              <Mic className="w-3.5 h-3.5 animate-bounce" />
              <span>Dinliyor... (Durdurmak için tıkla)</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              <span>Sesli Not / Dikte Başlat (Eldivenli Mod)</span>
            </>
          )}
        </button>

        {isListening && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        )}
      </div>

      {/* Interim live speech preview */}
      {isListening && (
        <div className="text-[11px] bg-amber-50/80 border border-amber-200 p-2 rounded-lg text-stone-700 italic">
          🗣️ Konuşun: "Ana arı görüldü, 8 çerçeve, 1:1 şerbet verildi..."
          {interimText && (
            <span className="block font-semibold text-stone-900 mt-1 not-italic">
              "{interimText}"
            </span>
          )}
        </div>
      )}

      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}
    </div>
  );
};
