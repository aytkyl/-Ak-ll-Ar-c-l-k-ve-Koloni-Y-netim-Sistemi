import { WeatherData, MeteorologicalAlert, WeatherAlertSeverity, WeatherAlertType } from "../types";

/**
 * Detects active meteorological threats based on current weather and 7-day forecast.
 */
export function detectMeteorologicalAlerts(weather: WeatherData | null): MeteorologicalAlert[] {
  if (!weather) return [];

  const alerts: MeteorologicalAlert[] = [];

  // --- 1. EXTREME HEAT DETECTION (Aşırı Sıcaklık & Petek Erime Riski) ---
  const isCurrentExtremeHeat = weather.temperature >= 35;
  const isCurrentCriticalHeat = weather.temperature >= 38;

  const hotForecastDays = (weather.dailyForecast || []).filter((d) => d.tempMax >= 35);
  const criticalForecastDays = hotForecastDays.filter((d) => d.tempMax >= 38);

  if (isCurrentCriticalHeat || criticalForecastDays.length > 0) {
    const triggerVal = isCurrentCriticalHeat
      ? `${weather.temperature}°C (Şu Anda)`
      : `${criticalForecastDays[0].tempMax}°C (${criticalForecastDays[0].dayName})`;

    alerts.push({
      id: "alert-extreme-heat-critical",
      type: "extreme_heat",
      severity: "kritik",
      title: "Kritik Aşırı Sıcaklık & Petek Çökme Alarmı",
      description: `Bölgenizde sıcaklık ${triggerVal} seviyesine ulaşıyor. 38°C üzerindeki sıcaklıklarda peteklerdeki saf balmumu eriyerek kovan tabanına çöker ve ana arı ile kuluçkayı boğabilir.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentCriticalHeat ? "Bugün / Acil" : criticalForecastDays[0].date,
      beekeeperImpact:
        "Petek erimesi, kovan içi havalandırma çöküşü ve yoğun arı sakallanması (bearding).",
      actionSteps: [
        "Kovanların üzerine acilen gölgelik branda, saz örtü veya açık renkli yalıtım malzemesi serin.",
        "Uçuş tahtası ve deliklerini sonuna kadar açarak kovan alt havalandırma ızgaralarını serbest bırakın.",
        "Arılığın yakınına gölgede kalacak şekilde temiz su kapları (içine çakıl taşı veya tahta parçaları koyarak) yerleştirin.",
        "Gündüz saatlerinde asla kovan kapağını açmayın, kovanın kendi doğal serinletme dengesini bozmayın.",
      ],
      icon: "🔥",
    });
  } else if (isCurrentExtremeHeat || hotForecastDays.length > 0) {
    const triggerVal = isCurrentExtremeHeat
      ? `${weather.temperature}°C (Şu Anda)`
      : `${hotForecastDays[0].tempMax}°C (${hotForecastDays[0].dayName})`;

    alerts.push({
      id: "alert-extreme-heat-warning",
      type: "extreme_heat",
      severity: "yuksek",
      title: "Yüksek Sıcaklık Uyarısı (35°C+)",
      description: `Sıcaklık ${triggerVal} sınırında. Arılar tüm enerjisini kovanı serinletmek ve su taşımak için harcayacaktır.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentExtremeHeat ? "Bugün" : hotForecastDays[0].date,
      beekeeperImpact:
        "Tarlacılık veriminde düşüş, aşırı su taşıma mesaisi ve yavru alanında ısı stresi.",
      actionSteps: [
        "Arılık çevresinde temiz su kaynağının kesintisiz açık olduğundan emin olun.",
        "Gölgeleme önlemlerini gözden geçirin.",
        "Formik asit veya timol gibi sıcaklığa duyarlı varroa ilaçlarını kesinlikle uygulamayın.",
      ],
      icon: "☀️",
    });
  }

  // --- 2. STORM & SEVERE WIND DETECTION (Fırtına & Şiddetli Rüzgar / Hamle) ---
  const isCurrentStorm = weather.windSpeed >= 25 || weather.windGust >= 40;
  const isCurrentCriticalStorm = weather.windSpeed >= 35 || weather.windGust >= 55;

  const stormForecastDays = (weather.dailyForecast || []).filter(
    (d) => (d.windSpeedMax || 0) >= 25 || (d.windGustMax || 0) >= 40
  );
  const criticalStormDays = stormForecastDays.filter(
    (d) => (d.windSpeedMax || 0) >= 35 || (d.windGustMax || 0) >= 55
  );

  if (isCurrentCriticalStorm || criticalStormDays.length > 0) {
    const triggerVal = isCurrentCriticalStorm
      ? `${weather.windSpeed} km/h (Hamle: ${weather.windGust} km/h)`
      : `${criticalStormDays[0].windSpeedMax} km/h (Hamle: ${criticalStormDays[0].windGustMax} km/h)`;

    alerts.push({
      id: "alert-storm-critical",
      type: "storm_wind",
      severity: "kritik",
      title: "Kuvvetli Fırtına & Kovan Devrilme Tehlikesi",
      description: `Rüzgar hamleleri ${triggerVal} hızına ulaşıyor. Kovan kapaklarının uçması, rüzgara açık kovanların devrilmesi ve kolonilerin dağılması riski çok yüksektir.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentCriticalStorm ? "Bugün / Acil" : criticalStormDays[0].date,
      beekeeperImpact:
        "Kovan çatılarının uçması, çerçevelerin saçılması ve arıların yön bulamayarak rüzgarda telef olması.",
      actionSteps: [
        "Her kovan kapağının üzerine derhal en az 10-15 kg ağırlığında taş, briket veya emniyet gergi kayışı bağlayın.",
        "Kovanların sehpa ayaklarının zemine sağlam bastığını kontrol edin; gevşek kovanları birbirine bağlayın.",
        "Uçuş deliklerini fırtına yönünden rüzgar almayacak şekilde daraltın.",
        "Rüzgar esintisi dinerene kadar arılıkta körük yakmayın ve kovan kapağı açmayın.",
      ],
      icon: "🌪️",
    });
  } else if (isCurrentStorm || stormForecastDays.length > 0) {
    const triggerVal = isCurrentStorm
      ? `${weather.windSpeed} km/h (Hamle: ${weather.windGust} km/h)`
      : `${stormForecastDays[0].windSpeedMax} km/h (${stormForecastDays[0].dayName})`;

    alerts.push({
      id: "alert-storm-high",
      type: "storm_wind",
      severity: "yuksek",
      title: "Sert Rüzgar & Kovan Güvenliği Uyarısı",
      description: `Rüzgar ${triggerVal} şiddetinde esiyor. Arılar uçuşta hedeften sapar, sokma eğilimleri belirgin biçimde artar.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentStorm ? "Bugün" : stormForecastDays[0].date,
      beekeeperImpact:
        "Tarlacı arıların iniş yapamaması, körük dumanının dağılması ve arı hırçınlığı.",
      actionSteps: [
        "Kovan kapaklarındaki ağırlıkları kontrol edin.",
        "Rüzgarlı günlerde kovan muayenesi yapmaktan kaçının.",
        "Uçuş deliklerini rüzgar girdabına karşı korumalı pozisyona getirin.",
      ],
      icon: "💨",
    });
  }

  // --- 3. FROST & COLD WEATHER DETECTION (Don, Gece Ayazı & Yavru Üşümesi) ---
  const isCurrentCold = weather.temperature < 10;
  const isCurrentFrost = weather.temperature <= 4;

  const coldForecastDays = (weather.dailyForecast || []).filter((d) => d.tempMin <= 8);
  const frostForecastDays = (weather.dailyForecast || []).filter((d) => d.tempMin <= 3);

  if (isCurrentFrost || frostForecastDays.length > 0) {
    const triggerVal = isCurrentFrost
      ? `${weather.temperature}°C (Şu Anda)`
      : `${frostForecastDays[0].tempMin}°C (${frostForecastDays[0].dayName} Gece)`;

    alerts.push({
      id: "alert-frost-critical",
      type: "cold_frost",
      severity: "kritik",
      title: "Gece Donu & Yavru Üşümesi (Chilled Brood) Tehlikesi",
      description: `Hava sıcaklığı gece ${triggerVal} seviyesine iniyor. Kuluçka alanındaki açık ve kapalı yavrular 34.5°C sabit ısı ister; ayazda salkım küçüldüğünde açıkta kalan yavrular donarak ölür.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentFrost ? "Bugün Gece" : frostForecastDays[0].date,
      beekeeperImpact:
        "Yavru çürüklüğü ve kireç hastalığına zemin hazırlayan yavru donması, koloni nüfus kırılması.",
      actionSteps: [
        "Kovan kapağını kesinlikle açmayınız! İçerideki ısı dengesini dağıtmayınız.",
        "Kovan örtü bezinin ve üst yalıtım strafor/minderinin kuru ve sıkı oturduğundan emin olun.",
        "Fazla ve arısız boş çerçeveleri çıkarıp bölme tahtası ile koloniyi sıkıştırın.",
        "Sıvı şerbet yerine sert arı keki (fondan şeker) kullanarak kovan içi rutubeti önleyin.",
      ],
      icon: "❄️",
    });
  } else if (isCurrentCold || coldForecastDays.length > 0) {
    const triggerVal = isCurrentCold
      ? `${weather.temperature}°C (Şu Anda)`
      : `${coldForecastDays[0].tempMin}°C (${coldForecastDays[0].dayName} Gece)`;

    alerts.push({
      id: "alert-cold-high",
      type: "cold_frost",
      severity: "yuksek",
      title: "Serin Hava & Kovan Yalıtım Uyarısı",
      description: `Gece sıcaklığı ${triggerVal} civarına düşüyor. Zayıf kolonilerin kışlatma veya ilkbahar düzenini koruması gerekir.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentCold ? "Bugün" : coldForecastDays[0].date,
      beekeeperImpact:
        "Salkım sıkılaşması ve kuluçka alanının daralması riski.",
      actionSteps: [
        "Kovan daraltma durumunu gözden geçirin.",
        "Rüzgar alan alt havalandırma sürgülerini kışlık pozisyona getirin.",
      ],
      icon: "🥶",
    });
  }

  // --- 4. HEAVY PRECIPITATION DETECTION (Şiddetli Yağış & Rutubet) ---
  const isCurrentHeavyRain = weather.precipitation >= 4;
  const rainForecastDays = (weather.dailyForecast || []).filter(
    (d) => d.precipitation >= 10 || (d.precipitationHours || 0) >= 4
  );

  if (isCurrentHeavyRain || rainForecastDays.length > 0) {
    const triggerVal = isCurrentHeavyRain
      ? `${weather.precipitation} mm Yağış (Şu Anda)`
      : `${rainForecastDays[0].precipitation} mm (${rainForecastDays[0].dayName})`;

    alerts.push({
      id: "alert-heavy-rain",
      type: "heavy_rain",
      severity: "yuksek",
      title: "Kuvvetli Yağış & Kovan İçi Nem Uyarısı",
      description: `Bölgenizde ${triggerVal} yoğun yağış bekleniyor. Kovan tabanına su sızması küf, maya ve Nosema sporlarının patlamasına sebep olur.`,
      triggerValue: triggerVal,
      dateOrTime: isCurrentHeavyRain ? "Bugün" : rainForecastDays[0].date,
      beekeeperImpact:
        "Kovan tabanında su birikmesi, peteklerde küflenme, polenlerin bozulması ve Nosema riski.",
      actionSteps: [
        "Kovanları öne doğru 2-3 derece hafif meyilli ayarlayarak içeri giren suyun dışarı akmasını sağlayın.",
        "Kovan sehpalarının çamur veya su birikintisi içinde kalmadığından emin olun.",
        "Yağış sonrası ilk güneşli günde nemlenen kovan örtü bezlerini kuru olanlarla değiştirin.",
      ],
      icon: "🌧️",
    });
  }

  // --- 5. THERMAL SHOCK DETECTION (Gece / Gündüz Ani Sıcaklık Farkı) ---
  const thermalShockDays = (weather.dailyForecast || []).filter(
    (d) => d.tempMax - d.tempMin >= 16
  );

  if (thermalShockDays.length > 0 && alerts.length < 4) {
    const day = thermalShockDays[0];
    const diff = Math.round(day.tempMax - day.tempMin);
    alerts.push({
      id: "alert-thermal-shock",
      type: "thermal_shock",
      severity: "orta",
      title: `Yüksek Günlük Sıcaklık Farkı (${diff}°C Fark)`,
      description: `${day.dayName} günü gündüz ${day.tempMax}°C iken gece ${day.tempMin}°C'ye düşüyor. Ani sıcaklık dalgalanmaları arılarda stres ve kuluçka dengesizliği yaratır.`,
      triggerValue: `${diff}°C Sıcaklık Farkı`,
      dateOrTime: day.date,
      beekeeperImpact:
        "Gündüz genişleyen kuluçkanın gece salkıma çekilen arılar sebebiyle kenarlardan üşümesi.",
      actionSteps: [
        "Üst kuluçkalık katını erken atmaktan kaçının.",
        "Kovan üst minder yalıtımını koruyun.",
      ],
      icon: "⚡",
    });
  }

  // Sort: kritik > yuksek > orta > bilgi
  const severityOrder: Record<WeatherAlertSeverity, number> = {
    kritik: 1,
    yuksek: 2,
    orta: 3,
    bilgi: 4,
  };

  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Browser Notification Support
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return "denied";
  }
}

export function isPushPermissionGranted(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
}

export function sendMeteorologicalPushNotification(alert: MeteorologicalAlert): boolean {
  if (!isPushPermissionGranted()) return false;

  try {
    const icon = "/favicon.ico";
    const notification = new Notification(`🚨 Meteorolojik Arı Uyarısı: ${alert.title}`, {
      body: `${alert.description}\n\nUsta Arıcı Tavsiyesi: ${alert.actionSteps[0]}`,
      icon,
      badge: icon,
      tag: alert.id,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn("Push notification failed:", err);
    return false;
  }
}

/**
 * Synthetic Web Audio Chime (Offline, 0 external dependencies)
 */
export function playMeteorologicalChime(severity: WeatherAlertSeverity = "yuksek"): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    if (severity === "kritik") {
      // Urgent double high beep
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.setValueAtTime(659, now + 0.12); // E5
      osc2.frequency.setValueAtTime(1174, now); // D6
      osc2.frequency.setValueAtTime(880, now + 0.12);
    } else {
      // Pleasant alert chime
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc2.frequency.setValueAtTime(783.99, now); // G5
      osc2.frequency.setValueAtTime(1046.5, now + 0.15); // C6
    }

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch (e) {
    // Audio context not allowed without interaction or disabled
  }
}

/**
 * Pre-configured simulated alerts for testing and demonstration
 */
export function getSimulatedAlert(type: WeatherAlertType): MeteorologicalAlert {
  switch (type) {
    case "extreme_heat":
      return {
        id: "sim-heat-" + Date.now(),
        type: "extreme_heat",
        severity: "kritik",
        title: "Test: Aşırı Sıcaklık Uyarısı (38.5°C)",
        description: "Bölgenizde ölçülen aşırı sıcak hava nedeniyle petek erimesi ve kovan içi havalandırma çöküşü riski tespit edildi.",
        triggerValue: "38.5°C",
        dateOrTime: "Şu Anda / Acil",
        beekeeperImpact: "Petek çökmesi ve ana arı boğulması tehlikesi.",
        actionSteps: [
          "Kovan üzerine gölgelik örtün.",
          "Uçuş deliklerini sonuna kadar açın ve su kabı bırakın.",
          "Gündüz kovan kapağını asla açmayın.",
        ],
        icon: "🔥",
      };
    case "storm_wind":
      return {
        id: "sim-storm-" + Date.now(),
        type: "storm_wind",
        severity: "kritik",
        title: "Test: Şiddetli Fırtına Uyarısı (52 km/h Hamle)",
        description: "Kuvvetli fırtına hamleleri nedeniyle kovan çatılarının uçması ve kovan devrilme riski mevcuttur.",
        triggerValue: "52 km/h Hamle",
        dateOrTime: "Bugün Akşam",
        beekeeperImpact: "Kovan kapaklarının uçması ve arıların dağılması.",
        actionSteps: [
          "Kovan kapaklarına en az 10-15 kg taş koyun veya kayışla sabitleyin.",
          "Uçuş deliklerini rüzgara karşı daraltın.",
          "Körük yakmayın ve kovan kapağı açmayın.",
        ],
        icon: "🌪️",
      };
    case "cold_frost":
      return {
        id: "sim-frost-" + Date.now(),
        type: "cold_frost",
        severity: "kritik",
        title: "Test: Gece Donu & Ayaz Uyarısı (1.5°C)",
        description: "Gece sıcaklığı don sınırına iniyor. Salkım küçülecek ve kuluçka alanındaki yavruların üşüme tehlikesi bulunmaktadır.",
        triggerValue: "1.5°C Gece",
        dateOrTime: "Bu Gece",
        beekeeperImpact: "Yavru donması ve kireç hastalığı tetiklenmesi.",
        actionSteps: [
          "Kovan kapağını kesinlikle açmayınız.",
          "Kovan üst örtü ve bölme tahtası yalıtımını sıkılaştırın.",
          "Sıvı şerbet yerine katı arı keki verin.",
        ],
        icon: "❄️",
      };
    default:
      return {
        id: "sim-rain-" + Date.now(),
        type: "heavy_rain",
        severity: "yuksek",
        title: "Test: Şiddetli Yağış Uyarısı (18 mm)",
        description: "Beklenen yoğun sağanak yağış nedeniyle kovan tabanında su birikmesi ve rutubet riski oluşabilir.",
        triggerValue: "18 mm Yağış",
        dateOrTime: "Yarın",
        beekeeperImpact: "Kovan içi küflenme ve Nosema riski.",
        actionSteps: [
          "Kovanları öne doğru hafif meyilli ayarlayın.",
          "Kovan sehpalarını yükseltin.",
        ],
        icon: "🌧️",
      };
  }
}
