/**
 * Kovanım - Universal Camera Manager
 * 
 * Optimized for:
 * - Android 10+ Tablets & Phones (including Casper VIA X45, Xiaomi, Samsung, MediaTek multi-lens HAL)
 * - Windows 10+ PCs & Laptops (integrated front webcams, USB webcams)
 * - iOS Safari & iPadOS
 * 
 * Features:
 * - Multi-tier camera constraint fallback (prevents OverconstrainedError / NotFoundError)
 * - Automatic black-screen detection watchdog (fixes auxiliary/depth sensor black screen bug on Casper VIA X45)
 * - Multi-lens enumeration & seamless switching (Rear Main, Rear Wide/Macro, Front Selfie)
 * - Hardware torch / flash control with safety checks
 * - Safe HTML5 video binding (no freezing, autoplay + playsInline + muted enforcement)
 * - Photo snapshot capture with aspect ratio preservation
 */

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  facing: "environment" | "user" | "unknown";
  isBack: boolean;
  isFront: boolean;
  lensIndex: number;
}

export interface CameraStartOptions {
  preferredFacing?: "environment" | "user";
  targetDeviceId?: string;
  forceUniversalFallback?: boolean;
  idealWidth?: number;
  idealHeight?: number;
}

export interface CameraSession {
  stream: MediaStream;
  videoTrack: MediaStreamTrack;
  activeDeviceId: string | null;
  activeFacing: "environment" | "user";
  hasTorch: boolean;
  isTorchOn: boolean;
}

export interface DeviceEnvironment {
  isAndroid: boolean;
  isAndroid10Plus: boolean;
  isWindows: boolean;
  isIOS: boolean;
  isMobileOrTablet: boolean;
  browserName: string;
}

/**
 * Detect client operating system and hardware profile
 */
export function detectDeviceEnvironment(): DeviceEnvironment {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isAndroid = /Android/i.test(ua);
  const isWindows = /Windows NT/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  let isAndroid10Plus = false;
  if (isAndroid) {
    const match = ua.match(/Android\s([0-9.]+)/i);
    if (match && match[1]) {
      const version = parseFloat(match[1]);
      isAndroid10Plus = version >= 10;
    } else {
      isAndroid10Plus = true; // Modern default
    }
  }

  let browserName = "Tarayıcı";
  if (/Chrome|CriOS/i.test(ua)) browserName = "Chrome";
  else if (/Firefox|FxiOS/i.test(ua)) browserName = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browserName = "Safari";
  else if (/Edg/i.test(ua)) browserName = "Edge";

  return {
    isAndroid,
    isAndroid10Plus,
    isWindows,
    isIOS,
    isMobileOrTablet,
    browserName,
  };
}

/**
 * Check if the browser supports mediaDevices and getUserMedia
 */
export function isCameraSupported(): boolean {
  return typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Enumerate all available camera video input devices and label them cleanly
 */
export async function enumerateCameraDevices(): Promise<CameraDeviceInfo[]> {
  if (!isCameraSupported() || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === "videoinput");

    let backCount = 0;
    let frontCount = 0;

    return videoInputs.map((device, idx) => {
      const rawLabel = device.label.toLowerCase();
      let facing: "environment" | "user" | "unknown" = "unknown";

      if (
        rawLabel.includes("back") ||
        rawLabel.includes("arka") ||
        rawLabel.includes("rear") ||
        rawLabel.includes("environment") ||
        rawLabel.includes("camera2 0") || // Android Camera2 main rear ID
        rawLabel.includes("0, facing back")
      ) {
        facing = "environment";
        backCount++;
      } else if (
        rawLabel.includes("front") ||
        rawLabel.includes("ön") ||
        rawLabel.includes("user") ||
        rawLabel.includes("selfie") ||
        rawLabel.includes("1, facing front")
      ) {
        facing = "user";
        frontCount++;
      } else {
        // Fallback guess: first videoinput on mobile is usually back, on Windows/Mac usually front
        if (idx === 0) {
          const env = detectDeviceEnvironment();
          facing = env.isMobileOrTablet ? "environment" : "user";
        } else {
          facing = "environment";
        }
      }

      // Friendly label for user UI
      let friendlyLabel = device.label;
      if (!friendlyLabel || friendlyLabel.trim() === "") {
        if (facing === "environment") {
          friendlyLabel = `Arka Kamera ${backCount || idx + 1}`;
        } else if (facing === "user") {
          friendlyLabel = `Ön Kamera ${frontCount || idx + 1} (Selfie)`;
        } else {
          friendlyLabel = `Kamera ${idx + 1}`;
        }
      } else {
        // Clarify common technical names (e.g. Casper VIA X45, MediaTek, Samsung)
        if (facing === "environment") {
          if (rawLabel.includes("wide") || rawLabel.includes("main") || rawLabel.includes("0")) {
            friendlyLabel = `Arka Ana Kamera (1x)`;
          } else if (rawLabel.includes("macro") || rawLabel.includes("ultra") || rawLabel.includes("aux")) {
            friendlyLabel = `Arka İkincil Kamera / Geniş Açı`;
          } else {
            friendlyLabel = `Arka Kamera (${idx + 1})`;
          }
        } else if (facing === "user") {
          friendlyLabel = `Ön Kamera (Selfie)`;
        }
      }

      return {
        deviceId: device.deviceId,
        label: friendlyLabel,
        facing,
        isBack: facing === "environment",
        isFront: facing === "user",
        lensIndex: idx,
      };
    });
  } catch (err) {
    console.warn("Failed to enumerate camera devices:", err);
    return [];
  }
}

/**
 * Multi-tier stream acquisition designed to never fail on Casper VIA X45, Android 10+, and Windows 10+ PCs
 */
export async function getOptimalCameraStream(options: CameraStartOptions = {}): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new Error("Tarayıcınız veya cihazınız kamera donanımına erişimi desteklemiyor.");
  }

  const env = detectDeviceEnvironment();
  const preferredFacing = options.preferredFacing || (env.isWindows ? "user" : "environment");
  const targetDeviceId = options.targetDeviceId;

  // Adaptive resolutions: 1280x720 is ideal for WebRTC performance without overconstraining
  const idealW = options.idealWidth || 1280;
  const idealH = options.idealHeight || 720;

  // If force universal fallback was requested (e.g. user clicked "Temel Mod")
  if (options.forceUniversalFallback) {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  }

  // Tier 1: Target specific device ID (if user picked a specific lens or from previous session)
  if (targetDeviceId) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: targetDeviceId },
          width: { ideal: idealW, max: 1920 },
          height: { ideal: idealH, max: 1080 },
        },
        audio: false,
      });
    } catch (e1) {
      console.warn("Tier 1 (exact deviceId) failed, trying deviceId without resolution limits:", e1);
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: targetDeviceId } },
          audio: false,
        });
      } catch (e1b) {
        console.warn("Exact deviceId failed completely, falling back to facingMode:", e1b);
      }
    }
  }

  // Tier 2: Ideal facingMode with 720p/1080p adaptive constraints (Best for Android 10+ & Casper VIA X45)
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: preferredFacing },
        width: { ideal: idealW, max: 1920 },
        height: { ideal: idealH, max: 1080 },
      },
      audio: false,
    });
  } catch (e2) {
    console.warn("Tier 2 (facingMode ideal + resolution) failed:", e2);
  }

  // Tier 3: Direct facingMode string without resolution constraints
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: preferredFacing },
      audio: false,
    });
  } catch (e3) {
    console.warn("Tier 3 (facingMode direct) failed:", e3);
  }

  // Tier 4: Opposite facingMode (Essential for Windows 10 PCs where back camera doesn't exist!)
  if (preferredFacing === "environment") {
    try {
      console.info("Trying user facingMode fallback for Windows/PC webcam...");
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
    } catch (e4) {
      console.warn("Tier 4 (user facingMode) failed:", e4);
    }
  }

  // Tier 5: Absolute Universal Fallback: { video: true } (Never crashes if any camera is connected)
  try {
    console.info("Applying absolute universal fallback ({ video: true })...");
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch (e5: any) {
    console.error("All camera tiers failed:", e5);
    if (e5.name === "NotAllowedError" || e5.name === "PermissionDeniedError") {
      throw new Error(
        "Kamera izni reddedildi. Lütfen tarayıcı adres çubuğundaki kilit simgesine tıklayarak kamera iznini verin."
      );
    } else if (e5.name === "NotFoundError" || e5.name === "DevicesNotFoundError") {
      throw new Error(
        "Cihazınızda aktif bir kamera donanımı bulunamadı. Lütfen web kameranızı kontrol edin veya fotoğraf yükleme seçeneğini kullanın."
      );
    } else if (e5.name === "NotReadableError" || e5.name === "TrackStartError") {
      throw new Error(
        "Kamera başka bir uygulama (Zoom, WhatsApp veya başka sekme) tarafından kullanılıyor olabilir. Lütfen diğer uygulamaları kapatıp tekrar deneyin."
      );
    } else {
      throw new Error(
        `Kamera başlatılamadı (${e5.name || "Bilinmeyen Hata"}). Lütfen tarayıcı ayarlarınızı kontrol edin veya fotoğraf yüklemeyi kullanın.`
      );
    }
  }
}

/**
 * Safe binding to HTML5 video element for Android 10+ and Windows 10+
 * Prevents black screen caused by pause() and ensures video playback loop starts immediately
 */
export function bindStreamToVideoElement(
  video: HTMLVideoElement,
  stream: MediaStream,
  onCanPlay?: () => void
): () => void {
  // 1. Mandatory attributes for Android mobile browsers (Chrome, Samsung Internet, Webview)
  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("autoplay", "true");
  video.muted = true;
  video.autoplay = true;

  // 2. Clear previous handlers
  video.onloadedmetadata = null;
  video.oncanplay = null;

  // 3. Attach stream
  video.srcObject = stream;

  // 4. Safe play invocation
  const triggerPlay = () => {
    video
      .play()
      .then(() => {
        if (onCanPlay) onCanPlay();
      })
      .catch((err) => {
        console.warn("Video play promise catch (safe ignored on autoplay policy):", err);
      });
  };

  if (video.readyState >= 2) {
    triggerPlay();
  } else {
    video.onloadedmetadata = () => triggerPlay();
    video.oncanplay = () => triggerPlay();
  }

  // Cleanup function
  return () => {
    video.onloadedmetadata = null;
    video.oncanplay = null;
  };
}

/**
 * Watchdog to detect black screen / dead auxiliary sensor on Android 10+ devices (e.g. Casper VIA X45)
 * Returns a cancel function.
 */
export function startBlackScreenWatchdog(
  video: HTMLVideoElement,
  stream: MediaStream,
  onBlackScreenDetected: (reason: string) => void,
  delayMs: number = 1200
): () => void {
  let isCancelled = false;

  const timer = setTimeout(() => {
    if (isCancelled || !video || video.paused) return;

    try {
      // Test 1: Video dimensions must be greater than zero
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("BlackScreenWatchdog: Video dimensions are 0x0");
        onBlackScreenDetected("0x0 Boyut");
        return;
      }

      // Test 2: Check pixel luminance using an off-screen canvas
      const testCanvas = document.createElement("canvas");
      testCanvas.width = 16;
      testCanvas.height = 16;
      const ctx = testCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 16, 16);
      const imgData = ctx.getImageData(0, 0, 16, 16).data;

      let totalLum = 0;
      let nonZeroCount = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLum += lum;
        if (r > 3 || g > 3 || b > 3) nonZeroCount++;
      }

      const avgLum = totalLum / (16 * 16);

      // On Casper VIA X45 auxiliary depth lens, avgLum is 0.000 or < 0.6
      if (avgLum < 0.6 && nonZeroCount < 3) {
        console.warn(`BlackScreenWatchdog: Pure black screen detected (avgLum: ${avgLum.toFixed(2)})`);
        onBlackScreenDetected("Siyah Ekran Sensörü");
      }
    } catch (err) {
      console.warn("BlackScreenWatchdog sampling error:", err);
    }
  }, delayMs);

  return () => {
    isCancelled = true;
    clearTimeout(timer);
  };
}

/**
 * Safely toggle hardware camera torch / flashlight
 */
export async function toggleCameraTorch(stream: MediaStream, turnOn: boolean): Promise<boolean> {
  try {
    const track = stream.getVideoTracks()[0];
    if (!track) return false;

    const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
    if (!capabilities.torch) return false;

    await (track as any).applyConstraints({
      advanced: [{ torch: turnOn }],
    });
    return true;
  } catch (err) {
    console.warn("Torch toggle not supported or failed:", err);
    return false;
  }
}

/**
 * Check if the active video track supports flashlight / torch
 */
export function checkTorchCapability(stream: MediaStream | null): boolean {
  if (!stream) return false;
  try {
    const track = stream.getVideoTracks()[0];
    if (!track) return false;
    const caps = (track.getCapabilities ? track.getCapabilities() : {}) as any;
    return Boolean(caps && caps.torch);
  } catch {
    return false;
  }
}

/**
 * Capture a pristine high-resolution snapshot from a playing video element
 */
export function captureFrameToDataUrl(
  video: HTMLVideoElement,
  options: {
    format?: "image/jpeg" | "image/png" | "image/webp";
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): string | null {
  if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

  const format = options.format || "image/jpeg";
  const quality = options.quality ?? 0.92;

  let width = video.videoWidth;
  let height = video.videoHeight;

  if (options.maxWidth && width > options.maxWidth) {
    height = Math.round((height * options.maxWidth) / width);
    width = options.maxWidth;
  }
  if (options.maxHeight && height > options.maxHeight) {
    width = Math.round((width * options.maxHeight) / height);
    height = options.maxHeight;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL(format, quality);
}

/**
 * Stop all tracks of a stream
 */
export function stopCameraStream(stream: MediaStream | null) {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.warn("Track stop error:", e);
      }
    });
  } catch (e) {
    console.warn("Stream stop error:", e);
  }
}
