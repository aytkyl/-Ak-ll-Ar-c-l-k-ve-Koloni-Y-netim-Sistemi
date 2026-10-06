import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import {
  QrCode,
  Camera,
  Download,
  Printer,
  X,
  CheckCircle,
  AlertCircle,
  Compass,
  Crown,
  Layers,
  Sparkles,
  RefreshCw,
  SwitchCamera,
  Upload,
  Zap,
  ZapOff,
  ShieldAlert,
} from "lucide-react";
import { Hive } from "../types";
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

interface HiveQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  hives: Hive[];
  initialHiveId?: string | null;
  onSelectScannedHive: (hive: Hive) => void;
}

export const HiveQrModal: React.FC<HiveQrModalProps> = ({
  isOpen,
  onClose,
  hives,
  initialHiveId,
  onSelectScannedHive,
}) => {
  const [activeTab, setActiveTab] = useState<"show" | "scan">("show");
  const [selectedHiveId, setSelectedHiveId] = useState<string>(
    initialHiveId || hives[0]?.id || ""
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Scanner states
  const [scanning, setScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [isBlackScreenDetected, setIsBlackScreenDetected] = useState<boolean>(false);
  const [cameraDevices, setCameraDevices] = useState<CameraDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const watchdogCancelRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedHive = hives.find((h) => h.id === selectedHiveId) || hives[0];

  // Refresh camera devices list
  const refreshDevices = async () => {
    try {
      const devices = await enumerateCameraDevices();
      setCameraDevices(devices);
      return devices;
    } catch {
      return [];
    }
  };

  // Update selected hive when initialHiveId changes
  useEffect(() => {
    if (initialHiveId) {
      setSelectedHiveId(initialHiveId);
      setActiveTab("show");
    }
  }, [initialHiveId]);

  // Generate QR Code data URL whenever selected hive changes
  useEffect(() => {
    if (!selectedHive) return;

    const payload = JSON.stringify({
      app: "kovanim",
      v: 1,
      id: selectedHive.id,
      no: selectedHive.hiveNumber,
      type: selectedHive.type,
      queen: selectedHive.queenRace,
      year: selectedHive.queenYear,
    });

    QRCode.toDataURL(
      payload,
      {
        width: 320,
        margin: 2,
        color: {
          dark: "#1c1917", // Stone-900
          light: "#ffffff",
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [selectedHive]);

  // Handle Camera scanning logic with universal resilience for Android 10+ and Windows 10+
  const startScanner = async (
    targetDeviceId?: string,
    targetFacing: "environment" | "user" = cameraFacing,
    forceUniversalFallback: boolean = false
  ) => {
    stopScanner();
    setScanning(true);
    setCameraError(null);
    setScanSuccessMessage(null);
    setIsBlackScreenDetected(false);

    try {
      const stream = await getOptimalCameraStream({
        targetDeviceId: targetDeviceId || selectedDeviceId || undefined,
        preferredFacing: targetFacing,
        forceUniversalFallback,
        idealWidth: 1280,
        idealHeight: 720,
      });

      streamRef.current = stream;

      // Check torch
      const torchAvail = checkTorchCapability(stream);
      setHasTorch(torchAvail);
      setIsTorchOn(false);

      if (videoRef.current) {
        const video = videoRef.current;
        bindStreamToVideoElement(video, stream, () => {
          requestScanFrame();
        });

        // Set up watchdog for black screen detection (especially on Casper VIA X45 & MediaTek)
        if (watchdogCancelRef.current) watchdogCancelRef.current();
        watchdogCancelRef.current = startBlackScreenWatchdog(
          video,
          stream,
          () => {
            setIsBlackScreenDetected(true);
          },
          1300
        );
      }

      // Discover camera device names once permission is active
      const devices = await refreshDevices();
      if (!selectedDeviceId && devices.length > 0) {
        const backCam = devices.find((d) => d.isBack);
        if (backCam) setSelectedDeviceId(backCam.deviceId);
      }
    } catch (err: any) {
      console.error("Camera scanner error:", err);
      setCameraError(
        err.message || "Kameraya erişilemedi. Lütfen tarayıcı kamera izinlerini kontrol ediniz."
      );
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (watchdogCancelRef.current) {
      watchdogCancelRef.current();
      watchdogCancelRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const newState = !isTorchOn;
    const success = await toggleCameraTorch(streamRef.current, newState);
    if (success) setIsTorchOn(newState);
  };

  // Switch to next camera or alternative lens
  const switchCamera = async () => {
    setIsBlackScreenDetected(false);
    if (cameraDevices.length > 1) {
      const currentIndex = cameraDevices.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % cameraDevices.length;
      const nextDev = cameraDevices[nextIndex];
      setSelectedDeviceId(nextDev.deviceId);
      setCameraFacing(nextDev.facing === "user" ? "user" : "environment");
      await startScanner(nextDev.deviceId, nextDev.facing === "user" ? "user" : "environment");
    } else {
      const nextFacing = cameraFacing === "environment" ? "user" : "environment";
      setCameraFacing(nextFacing);
      await startScanner(undefined, nextFacing);
    }
  };

  // Handle Black Screen recovery (switch to other rear lens or basic mode)
  const recoverBlackScreen = async () => {
    setIsBlackScreenDetected(false);
    const rearLenses = cameraDevices.filter((d) => d.isBack);
    if (rearLenses.length > 1) {
      const currentIndex = rearLenses.findIndex((d) => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % rearLenses.length;
      const nextLens = rearLenses[nextIndex];
      setSelectedDeviceId(nextLens.deviceId);
      await startScanner(nextLens.deviceId, "environment");
    } else {
      await startScanner(undefined, cameraFacing, true);
    }
  };

  const handleProcessQrData = (rawData: string) => {
    try {
      let parsedHiveId = "";
      if (rawData.startsWith("{") && rawData.includes("kovanim")) {
        const parsed = JSON.parse(rawData);
        parsedHiveId = parsed.id;
      } else {
        parsedHiveId = rawData.replace("kovanim://hive/", "").trim();
      }

      const matchedHive = hives.find(
        (h) => h.id === parsedHiveId || h.hiveNumber.toLowerCase() === parsedHiveId.toLowerCase()
      );

      if (matchedHive) {
        setScanSuccessMessage(`${matchedHive.hiveNumber} nolu kovan başarıyla tespit edildi!`);
        stopScanner();
        setTimeout(() => {
          onSelectScannedHive(matchedHive);
          onClose();
        }, 800);
        return true;
      }
    } catch (e) {
      console.log("QR parse issue:", e);
    }
    return false;
  };

  // Parse QR code from gallery image upload fallback
  const handleImageFileScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target?.result as string;
      img.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          const success = handleProcessQrData(code.data);
          if (!success) {
            setCameraError("Görselde QR kod tespit edildi fakat bu arılığa ait bir kovan bulunamadı.");
          }
        } else {
          setCameraError("Seçilen fotoğrafta okunabilir bir QR kod bulunamadı. Lütfen daha net bir fotoğraf deneyin.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const requestScanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.paused || video.ended) return;

    if (video.readyState >= 2 && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          const handled = handleProcessQrData(code.data);
          if (handled) return;
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(requestScanFrame);
  };

  useEffect(() => {
    if (isOpen && activeTab === "scan") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const downloadQrCode = () => {
    if (!qrDataUrl || !selectedHive) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `kovan-${selectedHive.hiveNumber}-qr-kod.png`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Kovan QR Kod Etiket & Tarama
              </h3>
              <p className="text-[11px] text-stone-600">
                Android 10+, Windows 10+ ve tüm cihazlarla tam uyumlu
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-100 bg-amber-50/30 p-2 gap-2">
          <button
            onClick={() => setActiveTab("show")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "show"
                ? "bg-white text-stone-900 shadow-xs border border-amber-200"
                : "text-stone-600 hover:text-stone-900 hover:bg-amber-100/50"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Kovan QR Etiketi (Görüntüle & Yazdır)</span>
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "scan"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-amber-100/50"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera ile QR Tara</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === "show" && selectedHive && (
            <div className="space-y-4 text-center">
              {/* Hive Selector */}
              <div className="text-left">
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kovan Seçiniz:
                </label>
                <select
                  value={selectedHiveId}
                  onChange={(e) => setSelectedHiveId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hiveNumber} - {h.queenRace} ({h.locationTag || "Arılık"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Printable QR Badge Card */}
              <div
                id="printable-hive-badge"
                className="bg-amber-50/60 p-5 rounded-2xl border-2 border-dashed border-amber-300 inline-block max-w-sm w-full shadow-xs mx-auto"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-xs text-stone-800">KOVANIM AKILLI ETİKET</span>
                  </div>
                  <span className="text-[10px] text-stone-500">#{selectedHive.hiveNumber}</span>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-xs border border-amber-100 flex justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`Kovan ${selectedHive.hiveNumber} QR Kodu`}
                      className="w-48 h-48 rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400">
                      QR Kod oluşturuluyor...
                    </div>
                  )}
                </div>

                <div className="mt-3 text-left bg-white p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-stone-900 text-sm">
                    <span>{selectedHive.hiveNumber}</span>
                    <span className="text-amber-800 text-xs font-semibold">{selectedHive.type}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 text-[11px]">
                    <span>Ana Arı Irkı: <strong>{selectedHive.queenRace}</strong></span>
                    <span>Yıl: <strong>{selectedHive.queenYear}</strong></span>
                  </div>
                  <div className="text-stone-500 text-[10px] truncate">
                    Konum: {selectedHive.locationTag || "Merkez Arılık"}
                  </div>
                </div>

                <p className="text-[10px] text-stone-500 mt-2 italic">
                  * Bu etiketi yazdırıp kovanın yan/ön tahtasına yapıştırabilirsiniz.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={downloadQrCode}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>QR Resmi İndir</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Etiketi Yazdır</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "scan" && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                <span>Kovan etiketindeki QR koda kameranızı doğrultun:</span>
                {cameraDevices.length > 1 && (
                  <button
                    onClick={switchCamera}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px] transition-colors"
                    title="Kamera Lensini Değiştir"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 text-amber-700" />
                    <span>Lensi Değiştir ({cameraDevices.length})</span>
                  </button>
                )}
              </div>

              {/* Video Scanner Container */}
              <div className="relative bg-stone-950 rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto shadow-inner flex items-center justify-center border-2 border-amber-400">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-amber-400 border-dashed rounded-2xl relative shadow-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1"></div>
                  </div>
                </div>

                {/* Torch / Flash button overlay */}
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                      isTorchOn ? "bg-amber-500 text-white shadow-lg" : "bg-black/50 text-white/80"
                    }`}
                    title="Flaş / Fener"
                  >
                    {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                {/* Scan success message banner */}
                {scanSuccessMessage && (
                  <div className="absolute inset-x-4 bottom-4 bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>{scanSuccessMessage}</span>
                  </div>
                )}

                {/* Black Screen Warning / Recovery for Casper VIA X45 & Android 10+ */}
                {isBlackScreenDetected && (
                  <div className="absolute inset-x-3 bottom-3 bg-stone-900/95 border border-amber-500/80 rounded-xl p-3 text-white text-xs shadow-2xl flex flex-col items-center gap-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Siyah Ekran / Uyuyan Sensör Algılandı</span>
                    </div>
                    <p className="text-[11px] text-stone-300 text-center leading-tight">
                      Casper VIA X45 ve çoklu kameralı telefonlarda diğer arka lense geçilmelidir.
                    </p>
                    <div className="flex gap-2 w-full pt-1">
                      <button
                        type="button"
                        onClick={recoverBlackScreen}
                        className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-[11px] transition-colors"
                      >
                        Diğer Lense Geç
                      </button>
                      <button
                        type="button"
                        onClick={() => startScanner(undefined, cameraFacing, true)}
                        className="py-1.5 px-2 bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Temel Mod
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs border border-rose-200 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <div className="flex-1">
                    <p className="font-semibold">{cameraError}</p>
                  </div>
                </div>
              )}

              {/* Controls & Gallery Upload Fallback */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => startScanner()}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${scanning ? "text-amber-600" : ""}`} />
                  <span>Kamerayı Yenile</span>
                </button>

                {cameraDevices.length > 1 && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 text-stone-600" />
                    <span>Lensi Değiştir</span>
                  </button>
                )}

                <label
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl cursor-pointer transition-colors shadow-2xs"
                  title="Galeriden Fotoğraf Seçip Tara"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>Galeriden / Fotoğraftan Tara</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileScan}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
