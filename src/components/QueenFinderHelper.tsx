import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  RotateCcw,
  Sparkles,
  Zap,
  ZapOff,
  Crosshair,
  Sliders,
  ZoomIn,
  ZoomOut,
  Crown,
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Upload,
  Eye,
  Info,
  Maximize2,
  SwitchCamera,
  ShieldAlert,
} from "lucide-react";
import {
  getOptimalCameraStream,
  bindStreamToVideoElement,
  startBlackScreenWatchdog,
  enumerateCameraDevices,
  stopCameraStream,
  toggleCameraTorch,
  checkTorchCapability,
  CameraDeviceInfo,
} from "../services/cameraManager";

interface QueenLocation {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number;
  height: number;
}

interface QueenFinderResult {
  found: boolean;
  confidence: number;
  location?: QueenLocation;
  queenDetails?: {
    raceEstimate?: string;
    abdomenDescription?: string;
    markColor?: string;
    hasRetinue?: boolean;
    activity?: string;
  };
  explanation?: string;
  combObservations?: string;
  beekeeperTips?: string[];
}

interface CameraDeviceOption {
  deviceId: string;
  label: string;
  facing: "environment" | "user";
  isPrimary?: boolean;
}

export const QueenFinderHelper: React.FC = () => {
  // Video and Camera State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Android 10+ Multi-Camera & Resilience State
  const [cameraDevices, setCameraDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>("Arka Ana Kamera (1x)");
  const [showCameraPicker, setShowCameraPicker] = useState<boolean>(false);
  const [isBlackScreenDetected, setIsBlackScreenDetected] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const blackScreenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Captured Image & AI State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<QueenFinderResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Marker Customizable Settings
  const [markerColor, setMarkerColor] = useState<string>("#22c55e"); // Default: Neon Green
  const [markerThickness, setMarkerThickness] = useState<number>(4); // 2, 4, 6, 8 px
  const [markerStyle, setMarkerStyle] = useState<"crosshair" | "box" | "circle" | "crown">("crosshair");
  const [markerSize, setMarkerSize] = useState<number>(10); // Percentage diameter (6%, 10%, 15%)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1.0, 1.5, 2.0, 2.5
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);

  // Manual pinpoint coordinate override
  const [manualMarker, setManualMarker] = useState<{ x: number; y: number } | null>(null);

  // Enumerate all cameras on the device (especially multi-camera on Android 10+)
  const refreshCameraDevices = async (): Promise<CameraDeviceOption[]> => {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === "videoinput");

      let rearCount = 0;
      let frontCount = 0;

      const parsed: CameraDeviceOption[] = videoInputs.map((d) => {
        const lower = (d.label || "").toLowerCase();
        const isFront =
          lower.includes("front") ||
          lower.includes("ön") ||
          lower.includes("user") ||
          lower.includes("selfie");

        const facing: "environment" | "user" = isFront ? "user" : "environment";
        let cleanLabel = d.label;

        if (facing === "environment") {
          rearCount++;
          if (!d.label) {
            cleanLabel = rearCount === 1 ? "Arka Ana Kamera (Lens 1 - 1x)" : `Arka Ek Kamera (Lens ${rearCount})`;
          } else if (lower.includes("0") || rearCount === 1 || lower.includes("main") || lower.includes("wide") || lower.includes("ana")) {
            cleanLabel = `📸 ${d.label} (Ana Lens)`;
          } else {
            cleanLabel = `📸 ${d.label}`;
          }
        } else {
          frontCount++;
          cleanLabel = d.label ? `🤳 ${d.label}` : (frontCount === 1 ? "🤳 Ön Kamera (Selfie)" : `🤳 Ön Kamera ${frontCount}`);
        }

        return {
          deviceId: d.deviceId,
          label: cleanLabel,
          facing,
          isPrimary: facing === "environment" && rearCount === 1,
        };
      });

      setCameraDevices(parsed);
      return parsed;
    } catch (err) {
      console.warn("Device enumeration error:", err);
      return [];
    }
  };

  // Black screen detection watchdog using cameraManager
  const scheduleBlackScreenCheck = () => {
    if (blackScreenTimerRef.current) {
      clearTimeout(blackScreenTimerRef.current);
    }
    setIsBlackScreenDetected(false);

    if (videoRef.current && streamRef.current) {
      const cancelWatchdog = startBlackScreenWatchdog(
        videoRef.current,
        streamRef.current,
        () => {
          setIsBlackScreenDetected(true);
        },
        1300
      );
      return cancelWatchdog;
    }
    return () => {};
  };

  // Start / Stop Camera with Multi-Tier Fallback for Android 10+ and Windows 10+ PCs
  const startCamera = async (
    facing: "environment" | "user" = cameraFacing,
    targetDeviceId?: string,
    forceBasicFallback: boolean = false
  ) => {
    stopCamera();
    setCameraError(null);
    setIsCameraLoading(true);
    setIsBlackScreenDetected(false);

    try {
      const stream = await getOptimalCameraStream({
        targetDeviceId: targetDeviceId || selectedDeviceId || undefined,
        preferredFacing: facing,
        forceUniversalFallback: forceBasicFallback,
        idealWidth: 1280,
        idealHeight: 720,
      });

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings ? videoTrack.getSettings() : ({} as any);
      const actualFacing = (settings.facingMode as any) || facing;
      setCameraFacing(actualFacing);

      const actualDeviceId = settings.deviceId || targetDeviceId || null;
      setSelectedDeviceId(actualDeviceId);

      // Bind to video element using cameraManager (NEVER calls pause(), ensures autoPlay/muted/playsinline)
      if (videoRef.current) {
        bindStreamToVideoElement(videoRef.current, stream, () => {
          setIsCameraActive(true);
        });
      }

      setIsCameraActive(true);

      // Check torch capability safely
      const torchAvail = checkTorchCapability(stream);
      setHasTorch(torchAvail);

      // Discover devices once permission is granted
      const devices = await refreshCameraDevices();
      if (actualDeviceId && devices.length > 0) {
        const found = devices.find((d) => d.deviceId === actualDeviceId);
        if (found) {
          setActiveCameraLabel(found.label);
        } else {
          setActiveCameraLabel(actualFacing === "environment" ? "Arka Ana Kamera (1x)" : "Ön Kamera (Selfie)");
        }
      } else {
        setActiveCameraLabel(actualFacing === "environment" ? "Arka Ana Kamera (1x)" : "Ön Kamera (Selfie)");
      }

      // Start black screen watchdog for Android 10+
      scheduleBlackScreenCheck();
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      setIsCameraActive(false);
      setCameraError(
        err.message ||
          "Kameraya erişilemedi. Lütfen tarayıcı kamera izinlerini kontrol edin veya doğrudan galeriden petek fotoğrafı yükleyin."
      );
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (blackScreenTimerRef.current) {
      clearTimeout(blackScreenTimerRef.current);
      blackScreenTimerRef.current = null;
    }
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
    setIsBlackScreenDetected(false);
    setShowCameraPicker(false);
  };

  // Toggle Torch safely
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const newStatus = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: newStatus }],
      });
      setIsTorchOn(newStatus);
    } catch (e) {
      console.error("Torch error:", e);
    }
  };

  // Cycle through all available camera lenses (Rear 1 -> Rear 2 -> Front)
  const switchCameraFacing = async () => {
    setShowCameraPicker(false);
    setIsBlackScreenDetected(false);

    if (cameraDevices.length > 1) {
      const currentIndex = cameraDevices.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % cameraDevices.length;
      const nextDevice = cameraDevices[nextIndex];
      setSelectedDeviceId(nextDevice.deviceId);
      setCameraFacing(nextDevice.facing);
      setActiveCameraLabel(nextDevice.label);
      await startCamera(nextDevice.facing, nextDevice.deviceId);
    } else {
      const nextFacing = cameraFacing === "environment" ? "user" : "environment";
      setCameraFacing(nextFacing);
      await startCamera(nextFacing);
    }
  };

  // Select a specific camera lens directly
  const selectSpecificCamera = async (device: CameraDeviceOption) => {
    setShowCameraPicker(false);
    setIsBlackScreenDetected(false);
    setSelectedDeviceId(device.deviceId);
    setCameraFacing(device.facing);
    setActiveCameraLabel(device.label);
    await startCamera(device.facing, device.deviceId);
  };

  // Switch to an alternative rear lens (fixes Android 10+ black auxiliary lens)
  const tryAlternativeRearCamera = async () => {
    setIsBlackScreenDetected(false);
    const rearDevices = cameraDevices.filter((d) => d.facing === "environment");
    if (rearDevices.length > 1) {
      const currentIndex = rearDevices.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % rearDevices.length;
      const nextDevice = rearDevices[nextIndex];
      await selectSpecificCamera(nextDevice);
    } else {
      // Restart in basic fallback mode
      await startCamera("environment", undefined, true);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture Snapshot from video
  const captureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    setCapturedImage(dataUrl);
    stopCamera();
    setManualMarker(null);
    setAnalysisResult(null);

    // Automatically trigger AI analysis
    analyzeCombImage(dataUrl);
  };

  // Handle manual file upload from disk/gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      stopCamera();
      setManualMarker(null);
      setAnalysisResult(null);
      analyzeCombImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Call Gemini Backend endpoint
  const analyzeCombImage = async (base64Img: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/gemini/find-queen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: "image/jpeg",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ana arı tespit servisine bağlanılamadı.");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Görüntü analiz edilirken bir hata oluştu.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle clicking on the comb image to set or adjust manual marker
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!capturedImage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setManualMarker({
      x: Math.round(clickX * 10) / 10,
      y: Math.round(clickY * 10) / 10,
    });
  };

  // Active Queen Target Coordinates (manual or AI)
  const activeTarget = manualMarker
    ? {
        x: manualMarker.x,
        y: manualMarker.y,
        width: analysisResult?.location?.width || markerSize,
        height: analysisResult?.location?.height || markerSize,
      }
    : analysisResult?.found && analysisResult.location
    ? analysisResult.location
    : null;

  // Available Marker Colors
  const COLOR_OPTIONS = [
    { label: "Neon Yeşil", value: "#22c55e", bg: "bg-emerald-500" },
    { label: "Floresan Sarı", value: "#eab308", bg: "bg-yellow-400" },
    { label: "Canlı Kırmızı", value: "#ef4444", bg: "bg-red-500" },
    { label: "Buz Mavisi", value: "#06b6d4", bg: "bg-cyan-500" },
    { label: "Magenta / Pembe", value: "#ec4899", bg: "bg-pink-500" },
    { label: "Kar Beyazı", value: "#ffffff", bg: "bg-white" },
    { label: "Kehribar Turuncu", value: "#f97316", bg: "bg-orange-500" },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
            <Crown className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center gap-1.5">
              <span>Ana Arı Bulma & Hedefleme Asistanı</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-semibold tracking-wide">
                Yapay Zeka + Optik İşaretçi
              </span>
            </h3>
            <p className="text-xs text-amber-100 opacity-90">
              Kovan muayenesinde kamerayı çerçeveye tutun; ana arıyı tespit edip özelleştirilebilir hedef çizgileriyle işaretlesin.
            </p>
          </div>
        </div>

        {/* Customization Settings Toggle */}
        <button
          onClick={() => setShowSettingsPanel(!showSettingsPanel)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            showSettingsPanel
              ? "bg-white text-stone-900 shadow-md"
              : "bg-black/20 hover:bg-black/30 text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>İşaretçi Ayarları ({COLOR_OPTIONS.find((c) => c.value === markerColor)?.label})</span>
        </button>
      </div>

      {/* MARKER CUSTOMIZATION DRAWER */}
      {showSettingsPanel && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Görsel Ana Arı İşaretleyici Ayarları (Renk, Kalınlık, Şekil)</span>
            </span>
            <span className="text-[11px] text-stone-500">
              Güneş ışığına ve petek zeminine göre zıt renk seçin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* 1. Color Selector */}
            <div>
              <label className="font-bold text-stone-700 block mb-1.5">İşaretçi Rengi</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setMarkerColor(c.value)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${c.bg} ${
                      markerColor === c.value
                        ? "scale-115 border-stone-900 ring-2 ring-amber-400"
                        : "border-stone-300 hover:scale-105"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* 2. Stroke Thickness Selector */}
            <div>
              <label className="font-bold text-stone-700 block mb-1.5">
                Çizgi Kalınlığı: <span className="text-amber-800">{markerThickness}px</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[2, 4, 6, 8].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMarkerThickness(t)}
                    className={`py-1.5 text-center font-bold rounded-lg border transition-all ${
                      markerThickness === t
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {t}px
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Reticle Style */}
            <div>
              <label className="font-bold text-stone-700 block mb-1.5">İşaretçi Deseni</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "crosshair", label: "🎯 Nişangah" },
                  { id: "box", label: "🔲 Odak Kutusu" },
                  { id: "circle", label: "⭕ Parlayan Halka" },
                  { id: "crown", label: "👑 Kraliçe Tacı" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setMarkerStyle(s.id as any)}
                    className={`py-1.5 px-2 text-left font-semibold rounded-lg border text-[11px] transition-all ${
                      markerStyle === s.id
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT CANVAS / CAMERA AREA */}
      <div className="relative bg-stone-950 rounded-2xl overflow-hidden border border-amber-300/60 shadow-md min-h-[340px] max-h-[580px] flex items-center justify-center">
        {/* State A: Live Camera Active */}
        {isCameraActive && !capturedImage && (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full max-h-[540px] object-contain bg-black"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.2s ease-out",
              }}
            />

            {/* Loading Indicator */}
            {isCameraLoading && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 gap-2">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-stone-300">Kamera Lensine Bağlanılıyor...</span>
              </div>
            )}

            {/* Viewfinder Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-amber-400/70 rounded-2xl relative flex items-center justify-center">
                <span className="text-[11px] font-bold text-amber-200/90 bg-black/60 px-2.5 py-1 rounded-md">
                  Peteği Merkeze Hizalayın
                </span>
                {/* Corner reticles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              </div>
            </div>

            {/* Live Camera Controls Bar (Top Overlay) */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-20">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-600/90 text-white font-bold text-[11px] rounded-full flex items-center gap-1.5 animate-pulse shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="hidden sm:inline">CANLI ÇERÇEVE</span>
                  <span className="sm:hidden">CANLI</span>
                </span>

                {/* Multi-Lens Selector Dropdown / Button (For Android 10+ multi-camera phones) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCameraPicker(!showCameraPicker)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 hover:bg-black/80 text-amber-300 rounded-full text-[11px] font-semibold backdrop-blur-md border border-amber-400/40 transition-colors max-w-[170px] truncate"
                    title="Kamera Lensini Değiştir"
                  >
                    <span className="truncate">{activeCameraLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </button>

                  {/* Lens Selection Popup Menu */}
                  {showCameraPicker && (
                    <div className="absolute left-0 mt-1.5 w-60 bg-stone-900/95 border border-amber-400/50 rounded-xl shadow-2xl p-1.5 z-40 backdrop-blur-md space-y-1 animate-in fade-in zoom-in-95 text-left">
                      <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                        Mevcut Kamera Lensleri ({cameraDevices.length || 1})
                      </div>
                      {cameraDevices.length > 0 ? (
                        cameraDevices.map((cam, idx) => (
                          <button
                            key={cam.deviceId || idx}
                            type="button"
                            onClick={() => selectSpecificCamera(cam)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                              selectedDeviceId === cam.deviceId
                                ? "bg-amber-500 text-stone-950 font-bold"
                                : "text-stone-200 hover:bg-stone-800"
                            }`}
                          >
                            <span className="truncate">{cam.label}</span>
                            {selectedDeviceId === cam.deviceId && (
                              <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-2.5 py-2 text-xs text-stone-400">
                          Standart kamera aktif
                        </div>
                      )}
                      <div className="pt-1 border-t border-stone-800">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCameraPicker(false);
                            startCamera(cameraFacing, undefined, true);
                          }}
                          className="w-full px-2.5 py-1 text-[11px] text-amber-300 hover:bg-stone-800 rounded text-left font-medium"
                        >
                          ⚡ Standart Uyumluluk Modu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                      isTorchOn
                        ? "bg-amber-400 text-stone-900"
                        : "bg-black/50 text-white hover:bg-black/70"
                    }`}
                    title="Flaş / Işıldak Aç/Kapat"
                  >
                    {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={switchCameraFacing}
                  className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md transition-all border border-white/20 active:scale-95"
                  title="Sonraki Kameraya / Lense Geç"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

            {/* Android 10+ Black Screen Detection Alert Banner */}
            {isBlackScreenDetected && cameraFacing === "environment" && (
              <div className="absolute top-14 inset-x-3 sm:inset-x-6 z-30 p-3.5 bg-stone-900/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 text-white shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left space-y-2">
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                        <span>Arka Kamera Siyah mı Görünüyor?</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-200">
                          Android 10+ Çoklu Lens
                        </span>
                      </h5>
                      <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
                        Android 10 ve üzeri cihazlarda tarayıcı bazen ana renkli lens yerine derinlik/makro sensörüne bağlanabilir. Aşağıdaki butona basarak doğrudan diğer arka lense geçiş yapabilirsiniz:
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => tryAlternativeRearCamera()}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all transform active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Alternatif Arka Lense Geç</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startCamera("environment", undefined, true)}
                        className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl text-xs border border-stone-600 transition-colors"
                      >
                        ⚡ Standart Mod
                      </button>

                      <button
                        type="button"
                        onClick={() => switchCameraFacing()}
                        className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium rounded-xl text-xs transition-colors"
                      >
                        🤳 Ön Kamerayı Aç
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Camera Capture Button (Bottom Overlay) */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 pointer-events-auto z-20">
              <button
                onClick={captureFrame}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 transform active:scale-95 transition-all border border-amber-300"
              >
                <Camera className="w-5 h-5" />
                <span>Çerçeveyi Yakala & Ana Arıyı Ara</span>
              </button>
            </div>
          </div>
        )}

        {/* State B: Captured Image Active & Inspected */}
        {capturedImage && (
          <div
            onClick={handleImageClick}
            className="relative w-full h-full max-h-[540px] flex items-center justify-center cursor-crosshair overflow-hidden group select-none"
          >
            <img
              src={capturedImage}
              alt="İncelenen Petek Çerçevesi"
              className="max-h-[540px] w-auto object-contain"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: activeTarget
                  ? `${activeTarget.x}% ${activeTarget.y}%`
                  : "center center",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            {/* Scanning Radar Sweep Animation while analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-scan" />
                <div className="absolute inset-0 bg-amber-900/10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-black/80 text-white px-5 py-3 rounded-2xl border border-amber-400 flex items-center gap-3 shadow-2xl">
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                    <div>
                      <p className="text-xs font-bold">Ana Arı Aranıyor...</p>
                      <p className="text-[10px] text-amber-200">Abdomen, toraks ve maiyet çemberi taranıyor</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TARGET RETICLE MARKER OVERLAY */}
            {activeTarget && !isAnalyzing && (
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${activeTarget.x}%`,
                  top: `${activeTarget.y}%`,
                }}
              >
                {/* 1. Pulsing Halo Ring */}
                <div
                  className="rounded-full animate-ping absolute -inset-2 opacity-60"
                  style={{
                    borderWidth: `${markerThickness}px`,
                    borderColor: markerColor,
                  }}
                />

                {/* 2. Main Selected Marker Shape */}
                {markerStyle === "crosshair" && (
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderWidth: `${markerThickness}px`,
                      borderColor: markerColor,
                      boxShadow: `0 0 12px ${markerColor}`,
                    }}
                  >
                    {/* Crosshairs */}
                    <div
                      className="absolute w-full"
                      style={{ height: `${markerThickness}px`, backgroundColor: markerColor }}
                    />
                    <div
                      className="absolute h-full"
                      style={{ width: `${markerThickness}px`, backgroundColor: markerColor }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: markerColor }}
                    />
                  </div>
                )}

                {markerStyle === "box" && (
                  <div
                    className="relative"
                    style={{
                      width: "65px",
                      height: "65px",
                      boxShadow: `0 0 14px ${markerColor}`,
                    }}
                  >
                    {/* Corner Brackets */}
                    <div
                      className="absolute top-0 left-0 w-3 h-3"
                      style={{
                        borderTop: `${markerThickness}px solid ${markerColor}`,
                        borderLeft: `${markerThickness}px solid ${markerColor}`,
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 w-3 h-3"
                      style={{
                        borderTop: `${markerThickness}px solid ${markerColor}`,
                        borderRight: `${markerThickness}px solid ${markerColor}`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-3 h-3"
                      style={{
                        borderBottom: `${markerThickness}px solid ${markerColor}`,
                        borderLeft: `${markerThickness}px solid ${markerColor}`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3"
                      style={{
                        borderBottom: `${markerThickness}px solid ${markerColor}`,
                        borderRight: `${markerThickness}px solid ${markerColor}`,
                      }}
                    />
                  </div>
                )}

                {markerStyle === "circle" && (
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: "58px",
                      height: "58px",
                      borderWidth: `${markerThickness}px`,
                      borderColor: markerColor,
                      boxShadow: `0 0 18px ${markerColor}`,
                      backgroundColor: `${markerColor}20`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: markerColor }}
                    />
                  </div>
                )}

                {markerStyle === "crown" && (
                  <div className="relative flex flex-col items-center">
                    <Crown
                      className="w-8 h-8 drop-shadow-lg animate-bounce"
                      style={{ color: markerColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2"
                      style={{
                        borderColor: markerColor,
                        boxShadow: `0 0 10px ${markerColor}`,
                      }}
                    />
                  </div>
                )}

                {/* Floating Crown Badge */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap z-20">
                  <div
                    className="px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide flex items-center gap-1 shadow-xl text-stone-950"
                    style={{
                      backgroundColor: markerColor,
                    }}
                  >
                    <Crown className="w-3 h-3 text-stone-950 fill-current" />
                    <span>
                      {manualMarker
                        ? "İŞARETLENEN ANA ARI"
                        : `ANA ARI BURADA (%${analysisResult?.confidence || 95})`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Retake / Re-scan Toolbar (Overlay) */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((z) => Math.min(2.5, Number((z + 0.5).toFixed(1))));
                  }}
                  className="p-1.5 text-white hover:bg-white/20 rounded-lg text-xs flex items-center gap-1 font-bold"
                  title="Yakınlaştır"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{zoomLevel}x</span>
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(1.0);
                    }}
                    className="p-1.5 text-amber-300 hover:bg-white/20 rounded-lg text-[10px] font-bold"
                  >
                    Sıfırla
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCapturedImage(null);
                    setAnalysisResult(null);
                    startCamera();
                  }}
                  className="px-3.5 py-2 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kameraya Dön</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (capturedImage) analyzeCombImage(capturedImage);
                  }}
                  disabled={isAnalyzing}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span>Yeniden Tara</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State C: Initial Idle Screen (Camera not started yet) */}
        {!isCameraActive && !capturedImage && (
          <div className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Çerçeveyi Canlı Tara veya Fotoğraf Yükle</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Kovan muayenesi esnasında cep telefonu kamerasını peteğe tutun. Sistem arıların arasından ana arıyı ayırt edip ekranda parlayan hedef işaretiyle gösterir.
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  Android 10+ Çoklu Lens & Siyah Ekran Korumalı
                </span>
              </div>
            </div>

            {cameraError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex flex-col gap-2 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 border-t border-rose-800/60">
                  <button
                    type="button"
                    onClick={() => startCamera("environment", undefined, true)}
                    className="px-2.5 py-1 bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px]"
                  >
                    ⚡ Standart Uyumluluk Modunda Dene
                  </button>
                  <button
                    type="button"
                    onClick={() => startCamera("user")}
                    className="px-2.5 py-1 bg-white/20 text-white font-medium rounded-lg text-[11px]"
                  >
                    🤳 Ön Kamerayı Aç
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startCamera()}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Kamerayı Aç & Başlat</span>
              </button>

              <label className="w-full sm:w-auto px-5 py-3 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl cursor-pointer border border-stone-700 flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Galeriden Petek Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI DETECTION REPORT PANEL */}
      {analysisResult && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {analysisResult.found ? (
            /* CASE 1: QUEEN FOUND */
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-5 shadow-xs">
              <div className="flex items-start justify-between gap-2 border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Crown className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                      <span>Ana Arı Başarıyla Tespit Edildi!</span>
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-bold">
                        Güven: %{analysisResult.confidence}
                      </span>
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Peteğin üzerinde işaretlenen koordinatta ({activeTarget?.x.toFixed(1)}%, {activeTarget?.y.toFixed(1)}%) konumlanmıştır.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                  🎯 Hedef İşareti Ekranda Aktif
                </span>
              </div>

              {/* Queen Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs">
                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">
                    Abdomen & Vücut
                  </span>
                  <span className="font-semibold text-stone-800">
                    {analysisResult.queenDetails?.abdomenDescription || "Uzun ve sivri konik karın yapısı"}
                  </span>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">
                    İşaret Boyası Durumu
                  </span>
                  <span className="font-semibold text-stone-800">
                    {analysisResult.queenDetails?.markColor || "Boyasız / Doğal Renk"}
                  </span>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">
                    İşçi Arı Maiyeti (Halka)
                  </span>
                  <span className="font-semibold text-stone-800">
                    {analysisResult.queenDetails?.hasRetinue
                      ? "Evet, işçiler çember oluşturmuş"
                      : "Tek başına yumurtlama alanında"}
                  </span>
                </div>
              </div>

              {/* Explanation & Beekeeper Advice */}
              <div className="mt-3 p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-stone-800 space-y-2">
                <p className="leading-relaxed">
                  <strong>Gözlem:</strong> {analysisResult.explanation}
                </p>
                {analysisResult.combObservations && (
                  <p className="text-stone-600">
                    <strong>Petek Durumu:</strong> {analysisResult.combObservations}
                  </p>
                )}
              </div>

              {/* Action Tips */}
              {analysisResult.beekeeperTips && analysisResult.beekeeperTips.length > 0 && (
                <div className="mt-3 space-y-1 text-xs text-emerald-950 font-medium">
                  <span className="font-bold block text-emerald-900">Usta Arıcı Saha Yönergeleri:</span>
                  <ul className="space-y-1 pl-4 list-disc text-emerald-900">
                    {analysisResult.beekeeperTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* CASE 2: QUEEN NOT DETECTED ON THIS FACE */
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-amber-200 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    Bu Petek Yüzünde Ana Arı Açıkça Görünmüyor
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {analysisResult.explanation ||
                      "Ana arı peteğin diğer yüzünde olabilir veya işçi arıların altına gizlenmiş olabilir."}
                  </p>
                </div>
              </div>

              {/* Observations */}
              {analysisResult.combObservations && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 text-xs text-stone-800">
                  <span className="font-bold block text-amber-900 mb-1">Peteğin Genel Durumu:</span>
                  <p>{analysisResult.combObservations}</p>
                </div>
              )}

              {/* Tips for Finding Her */}
              <div className="mt-3 p-3.5 bg-amber-100/70 rounded-xl border border-amber-300 text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1.5 mb-2 text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  <span>Ana Arıyı Bulmak İçin Usta Taktikleri:</span>
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-800">
                  <li>
                    <strong>Peteğin Diğer Yüzünü Çevirin:</strong> Ana arı ışıktan kaçma eğilimindedir. Kovan kapağı açıldığında hemen peteğin gölgede kalan ters yüzüne geçebilir.
                  </li>
                  <li>
                    <strong>Günlük Dik Yumurtaları Arayın:</strong> Hücre dibinde pirinç tanesi gibi dik duran 1 günlük yumurtaların bulunduğu alanlarda ana arı %90 ihtimalle o çerçevededir.
                  </li>
                  <li>
                    <strong>İşçi Arıların Baş Yönüne Bakın:</strong> İşçi arıların kafalarını merkeze doğru çevirip çiçek deseni gibi çember oluşturduğu noktayı tarayın.
                  </li>
                  <li>
                    <strong>Manuel İşaretleme:</strong> Eğer gözünüzle tespit ederseniz petek görseline dokunarak hedef işaretçisini manuel yerleştirebilirsiniz.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
