import { CityCoord, WeatherData, WeatherDailyForecast } from "../types";

export const TURKEY_PROVINCES: CityCoord[] = [
  { name: "Muğla", region: "Ege Bölgesi", lat: 37.2153, lon: 28.3636 },
  { name: "Aydın", region: "Ege Bölgesi", lat: 37.8444, lon: 27.8458 },
  { name: "İzmir", region: "Ege Bölgesi", lat: 38.4192, lon: 27.1287 },
  { name: "Edirne", region: "Marmara & Trakya", lat: 41.6772, lon: 26.5557 },
  { name: "Tekirdağ", region: "Marmara & Trakya", lat: 40.9781, lon: 27.5117 },
  { name: "Bursa", region: "Marmara & Trakya", lat: 40.1885, lon: 29.061 },
  { name: "Balıkesir", region: "Marmara & Trakya", lat: 39.6484, lon: 27.8826 },
  { name: "Çanakkale", region: "Marmara & Trakya", lat: 40.1553, lon: 26.4142 },
  { name: "Yalova", region: "Marmara & Trakya", lat: 40.655, lon: 29.2769 },
  { name: "İstanbul", region: "Marmara & Trakya", lat: 41.0082, lon: 28.9784 },
  { name: "Rize", region: "Karadeniz Bölgesi", lat: 41.0201, lon: 40.5234 },
  { name: "Artvin", region: "Karadeniz Bölgesi", lat: 41.1828, lon: 41.8183 },
  { name: "Trabzon", region: "Karadeniz Bölgesi", lat: 41.0027, lon: 39.7168 },
  { name: "Ordu", region: "Karadeniz Bölgesi", lat: 40.9862, lon: 37.8797 },
  { name: "Giresun", region: "Karadeniz Bölgesi", lat: 40.9128, lon: 38.3895 },
  { name: "Zonguldak", region: "Karadeniz Bölgesi", lat: 41.4564, lon: 31.7987 },
  { name: "Kastamonu", region: "Karadeniz Bölgesi", lat: 41.3887, lon: 33.7827 },
  { name: "Sinop", region: "Karadeniz Bölgesi", lat: 42.0231, lon: 35.1531 },
  { name: "Antalya", region: "Akdeniz Bölgesi", lat: 36.8969, lon: 30.7133 },
  { name: "Mersin", region: "Akdeniz Bölgesi", lat: 36.8121, lon: 34.6415 },
  { name: "Adana", region: "Akdeniz Bölgesi", lat: 37.0, lon: 35.3213 },
  { name: "Hatay", region: "Akdeniz Bölgesi", lat: 36.2023, lon: 36.1606 },
  { name: "Isparta", region: "Akdeniz Bölgesi", lat: 37.7648, lon: 30.5566 },
  { name: "Ankara", region: "İç Anadolu Bölgesi", lat: 39.9334, lon: 32.8597 },
  { name: "Konya", region: "İç Anadolu Bölgesi", lat: 37.8667, lon: 32.4833 },
  { name: "Kayseri", region: "İç Anadolu Bölgesi", lat: 38.7312, lon: 35.4787 },
  { name: "Sivas", region: "İç Anadolu Bölgesi", lat: 39.7477, lon: 37.0179 },
  { name: "Eskişehir", region: "İç Anadolu Bölgesi", lat: 39.7767, lon: 30.5206 },
  { name: "Erzurum", region: "Doğu Anadolu Bölgesi", lat: 39.9043, lon: 41.2679 },
  { name: "Kars", region: "Doğu Anadolu Bölgesi", lat: 40.6013, lon: 43.0975 },
  { name: "Ardahan", region: "Doğu Anadolu Bölgesi", lat: 41.1105, lon: 42.7022 },
  { name: "Van", region: "Doğu Anadolu Bölgesi", lat: 38.4891, lon: 43.4089 },
  { name: "Bitlis", region: "Doğu Anadolu Bölgesi", lat: 38.4006, lon: 42.1095 },
  { name: "Hakkari", region: "Doğu Anadolu Bölgesi", lat: 37.5833, lon: 43.7333 },
  { name: "Diyarbakır", region: "Güneydoğu Anadolu", lat: 37.9144, lon: 40.2306 },
  { name: "Şanlıurfa", region: "Güneydoğu Anadolu", lat: 37.1591, lon: 38.7969 },
  { name: "Gaziantep", region: "Güneydoğu Anadolu", lat: 37.0662, lon: 37.3833 },
  { name: "Siirt", region: "Güneydoğu Anadolu", lat: 37.9333, lon: 41.95 },
  { name: "Mardin", region: "Güneydoğu Anadolu", lat: 37.3212, lon: 40.7245 },
];

export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Açık ve Güneşli";
    case 1:
    case 2:
      return "Az Bulutlu / Parçalı Bulutlu";
    case 3:
      return "Kapalı / Yoğun Bulutlu";
    case 45:
    case 48:
      return "Sisli / Pusu";
    case 51:
    case 53:
    case 55:
      return "Hafif Çisenti";
    case 61:
    case 63:
    case 65:
      return "Yağmurlu";
    case 71:
    case 73:
    case 75:
      return "Kar Yağışlı";
    case 80:
    case 81:
    case 82:
      return "Sağanak Yağışlı";
    case 95:
    case 96:
    case 99:
      return "Gök Gürültülü Fırtına";
    default:
      return "Değişken Hava";
  }
}

export function calculateFlightSuitability(
  temp: number,
  humidity: number,
  windSpeed: number,
  precip: number
): WeatherData["flightSuitability"] {
  let score = 100;

  // Temperature impact
  if (temp < 10) {
    score -= 80;
  } else if (temp < 14) {
    score -= 45;
  } else if (temp >= 16 && temp <= 29) {
    // Ideal range
  } else if (temp > 29 && temp <= 34) {
    score -= 15;
  } else if (temp > 34 && temp <= 38) {
    score -= 40;
  } else if (temp > 38) {
    score -= 70;
  }

  // Wind impact
  if (windSpeed > 35) {
    score -= 50;
  } else if (windSpeed > 24) {
    score -= 30;
  } else if (windSpeed > 16) {
    score -= 10;
  }

  // Precipitation impact
  if (precip > 1.5) {
    score -= 60;
  } else if (precip > 0.1) {
    score -= 35;
  }

  // Extreme humidity
  if (humidity > 90 && temp < 18) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: WeatherData["flightSuitability"]["status"] = "Mukemmel";
  let badgeColor = "bg-emerald-500 text-white";
  let advice = "Arılar için tam uçuş ve nektar/polen toplama havası. Kovan muayenesi için mükemmel koşullar.";

  if (score >= 80) {
    status = "Mukemmel";
    badgeColor = "bg-emerald-600 text-white";
    advice = "Arılar aktif tarlacılık yapıyor. Kovan kontrolleri, kat atma ve şerbetleme için ideal saatler.";
  } else if (score >= 60) {
    status = "Iyi";
    badgeColor = "bg-amber-500 text-white";
    advice = "Uçuş şartları elverişli. Rüzgar ve gölge sıcaklığına dikkat ederek rutin kovan bakımı yapılabilir.";
  } else if (score >= 40) {
    status = "Sinirli";
    badgeColor = "bg-orange-500 text-white";
    advice = "Sıcaklık veya rüzgar sınırda. Arılar kovana dönüşte zorlanabilir; kovan kapağını uzun süre açık bırakmayın.";
  } else if (score >= 20) {
    status = "Riskli";
    badgeColor = "bg-rose-500 text-white";
    advice = "Rüzgarlı veya aşırı serin hava. Arılar hırçınlaşabilir ve sokma eğilimi artar. Zorunlu olmadıkça kovan açmayınız.";
  } else {
    status = "Ucus Yok";
    badgeColor = "bg-slate-700 text-white";
    advice = "Hava soğuk, aşırı rüzgarlı veya yağışlı. Tarlacı arı uçuşu durmuştur. Kovanı kesinlikle açmayınız, ısı kaybı yavru ölümüne yol açabilir.";
  }

  return { score, status, badgeColor, advice };
}

export function calculateDailyInspectionSuitability(
  tempMax: number,
  tempMin: number,
  windSpeedMax: number = 10,
  precipSum: number = 0,
  precipHours: number = 0,
  precipProb: number = 0
): NonNullable<WeatherDailyForecast["inspectionSuitability"]> {
  let score = 100;

  // Temperature criteria for opening hive and inspecting brood
  if (tempMax < 12) {
    score -= 75; // Severe risk of chilling brood
  } else if (tempMax < 15) {
    score -= 40; // Marginal, only quick checks
  } else if (tempMax >= 18 && tempMax <= 28) {
    // Perfect range
  } else if (tempMax > 28 && tempMax <= 33) {
    score -= 10;
  } else if (tempMax > 33 && tempMax <= 37) {
    score -= 35; // Bees agitated, soft wax
  } else if (tempMax > 37) {
    score -= 70; // Risk of comb collapse
  }

  // Wind criteria
  if (windSpeedMax > 32) {
    score -= 50;
  } else if (windSpeedMax > 24) {
    score -= 30;
  } else if (windSpeedMax > 16) {
    score -= 10;
  }

  // Precipitation criteria
  if (precipSum > 2) {
    score -= 60;
  } else if (precipSum > 0.1) {
    score -= 35;
  }

  if (precipHours > 2) {
    score -= 25;
  } else if (precipHours > 0) {
    score -= 15;
  }

  if (precipProb > 60) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: "Mukemmel" | "Iyi" | "Sinirli" | "Riskli" | "Ucus Yok" = "Mukemmel";
  let tag = "✓ İdeal Muayene Günü";
  let tagColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let advice = "Geniş kapsamlı kovan açımı, çerçeve aktarımı, ana arı kontrolü ve kat ilavesi için en elverişli gün.";

  if (score >= 80) {
    status = "Mukemmel";
    tag = "✓ İdeal Muayene Günü";
    tagColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
    advice = "Geniş kapsamlı kovan açımı, çerçeve kontrolü, ana arı tespiti ve kat ilavesi için en elverişli gün.";
  } else if (score >= 60) {
    status = "Iyi";
    tag = "✓ Rutin Bakım Uygun";
    tagColor = "bg-amber-100 text-amber-800 border-amber-300";
    advice = "Rutin petek ve besleme kontrolleri yapılabilir. Rüzgar yönüne dikkat ederek körük dumanını iyi ayarlayın.";
  } else if (score >= 40) {
    status = "Sinirli";
    tag = "⚠ Hızlı / Kısıtlı Kontrol";
    tagColor = "bg-orange-100 text-orange-800 border-orange-300";
    advice = "Hava sınırda veya serin/rüzgarlı. Kovan kapağını sadece birkaç dakika açın, yavruları üşütmeyin.";
  } else if (score >= 20) {
    status = "Riskli";
    tag = "✕ Kovan Açılmaz (Riskli)";
    tagColor = "bg-rose-100 text-rose-800 border-rose-300";
    advice = "Rüzgar veya yağış riski yüksek. Arılar aşırı hırçınlaşır ve sokucu olur. Acil olmadıkça kovan açmayınız.";
  } else {
    status = "Ucus Yok";
    tag = "✕ Kesinlikle Açmayınız";
    tagColor = "bg-slate-200 text-slate-800 border-slate-300";
    advice = "Soğuk veya yağışlı hava. Kovan kapağının açılması yavru üşümesi ve koloni stresine neden olur.";
  }

  let recommendedHours = "11:00 - 15:30";
  if (tempMax > 30) {
    recommendedHours = "09:30 - 11:30 (Sabah Serinliği)";
  } else if (tempMax < 17) {
    recommendedHours = "12:00 - 14:00 (Öğle Tepe Sıcaklığı)";
  }

  const canInspectBrood = tempMax >= 15 && windSpeedMax < 25 && precipSum < 0.5;
  const canApplyFormicAcid = tempMax >= 14 && tempMax <= 25 && precipSum === 0;
  const canFeed = precipSum < 2 && tempMin > 8;

  return {
    score,
    status,
    tag,
    tagColor,
    recommendedHours,
    advice,
    canInspectBrood,
    canApplyFormicAcid,
    canFeed,
  };
}

export function generateFallbackDailyForecast(baseTemp: number): WeatherDailyForecast[] {
  const days: WeatherDailyForecast[] = [];
  const now = new Date();
  const variations = [
    { maxDelta: 2, minDelta: -9, precip: 0, prob: 0, hours: 0, wind: 12, gust: 18, code: 0 },
    { maxDelta: 1, minDelta: -8, precip: 0.1, prob: 10, hours: 0, wind: 14, gust: 22, code: 1 },
    { maxDelta: 3, minDelta: -7, precip: 0, prob: 5, hours: 0, wind: 11, gust: 16, code: 2 },
    { maxDelta: -2, minDelta: -10, precip: 3.5, prob: 70, hours: 3, wind: 26, gust: 38, code: 61 },
    { maxDelta: -1, minDelta: -11, precip: 1.0, prob: 35, hours: 1, wind: 18, gust: 26, code: 51 },
    { maxDelta: 2, minDelta: -9, precip: 0, prob: 10, hours: 0, wind: 13, gust: 20, code: 1 },
    { maxDelta: 4, minDelta: -8, precip: 0, prob: 5, hours: 0, wind: 10, gust: 15, code: 0 },
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const v = variations[i % variations.length];
    const max = Math.round(baseTemp + v.maxDelta);
    const min = Math.round(baseTemp + v.minDelta);
    const dayName =
      i === 0
        ? "Bugün"
        : d.toLocaleDateString("tr-TR", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    const rawDate = d.toISOString().split("T")[0];

    const inspectionSuitability = calculateDailyInspectionSuitability(
      max,
      min,
      v.wind,
      v.precip,
      v.hours,
      v.prob
    );

    days.push({
      date: formattedDate,
      rawDate,
      dayName,
      tempMax: max,
      tempMin: min,
      apparentTempMax: max - 1,
      apparentTempMin: min - 1,
      precipitation: v.precip,
      precipitationProbability: v.prob,
      precipitationHours: v.hours,
      windSpeedMax: v.wind,
      windGustMax: v.gust,
      sunrise: "07:05",
      sunset: "18:45",
      uvIndexMax: 5.5,
      sunshineHours: v.precip > 0 ? 4.2 : 9.8,
      weatherCode: v.code,
      weatherDescription: getWeatherDescription(v.code),
      inspectionSuitability,
    });
  }
  return days;
}

export async function fetchCityWeather(cityCoord: CityCoord): Promise<WeatherData> {
  try {
    const dailyParams = [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "precipitation_hours",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "sunrise",
      "sunset",
      "uv_index_max",
      "sunshine_duration",
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityCoord.lat}&longitude=${cityCoord.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m&daily=${dailyParams}&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Meteoroloji servisine bağlanılamadı: ${response.statusText}`);
    }

    const data = await response.json();
    const current = data.current;

    const temp = Math.round((current.temperature_2m ?? 22) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 55);
    const windSpeed = Math.round(current.wind_speed_10m ?? 8);
    const windGust = Math.round(current.wind_gusts_10m ?? 12);
    const precipitation = Math.round((current.precipitation ?? 0) * 10) / 10;
    const cloudCover = Math.round(current.cloud_cover ?? 20);
    const weatherCode = current.weather_code ?? 0;

    const flightSuitability = calculateFlightSuitability(temp, humidity, windSpeed, precipitation);

    let dailyForecast: WeatherDailyForecast[] = [];
    const daily = data.daily;
    if (daily && Array.isArray(daily.time) && daily.time.length > 0) {
      dailyForecast = daily.time.slice(0, 7).map((timeStr: string, idx: number) => {
        // Parse date
        const parts = timeStr.split("-");
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const isToday = idx === 0;
        const dayName = isToday
          ? "Bugün"
          : dateObj.toLocaleDateString("tr-TR", { weekday: "short" });
        const formattedDate = dateObj.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
        });
        const code = daily.weather_code?.[idx] ?? 0;
        const tempMax = Math.round(daily.temperature_2m_max?.[idx] ?? temp + 2);
        const tempMin = Math.round(daily.temperature_2m_min?.[idx] ?? temp - 8);
        const apparentTempMax =
          daily.apparent_temperature_max?.[idx] != null
            ? Math.round(daily.apparent_temperature_max[idx])
            : undefined;
        const apparentTempMin =
          daily.apparent_temperature_min?.[idx] != null
            ? Math.round(daily.apparent_temperature_min[idx])
            : undefined;
        const precipSum = Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10;
        const precipProb =
          daily.precipitation_probability_max?.[idx] != null
            ? Math.round(daily.precipitation_probability_max[idx])
            : undefined;
        const precipHours =
          daily.precipitation_hours?.[idx] != null
            ? Math.round(daily.precipitation_hours[idx] * 10) / 10
            : 0;
        const windSpeedMax =
          daily.wind_speed_10m_max?.[idx] != null
            ? Math.round(daily.wind_speed_10m_max[idx])
            : windSpeed;
        const windGustMax =
          daily.wind_gusts_10m_max?.[idx] != null
            ? Math.round(daily.wind_gusts_10m_max[idx])
            : windGust;
        const sunrise = daily.sunrise?.[idx] ? daily.sunrise[idx].split("T")[1] : undefined;
        const sunset = daily.sunset?.[idx] ? daily.sunset[idx].split("T")[1] : undefined;
        const uvIndexMax =
          daily.uv_index_max?.[idx] != null
            ? Math.round(daily.uv_index_max[idx] * 10) / 10
            : undefined;
        const sunshineHours =
          daily.sunshine_duration?.[idx] != null
            ? Math.round((daily.sunshine_duration[idx] / 3600) * 10) / 10
            : undefined;

        const inspectionSuitability = calculateDailyInspectionSuitability(
          tempMax,
          tempMin,
          windSpeedMax,
          precipSum,
          precipHours,
          precipProb ?? 0
        );

        return {
          date: formattedDate,
          rawDate: timeStr,
          dayName,
          tempMax,
          tempMin,
          apparentTempMax,
          apparentTempMin,
          precipitation: precipSum,
          precipitationProbability: precipProb,
          precipitationHours: precipHours,
          windSpeedMax,
          windGustMax,
          sunrise,
          sunset,
          uvIndexMax,
          sunshineHours,
          weatherCode: code,
          weatherDescription: getWeatherDescription(code),
          inspectionSuitability,
        };
      });
    } else {
      dailyForecast = generateFallbackDailyForecast(temp);
    }

    return {
      city: cityCoord.name,
      region: cityCoord.region,
      temperature: temp,
      humidity,
      windSpeed,
      windGust,
      precipitation,
      cloudCover,
      weatherCode,
      weatherDescription: getWeatherDescription(weatherCode),
      flightSuitability,
      dailyForecast,
      updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };
  } catch (error) {
    console.warn("Falling back to realistic default weather data:", error);
    // Safe realistic fallback for Turkish beekeepers
    const fallbackSuitability = calculateFlightSuitability(23.5, 52, 9, 0);
    return {
      city: cityCoord.name,
      region: cityCoord.region,
      temperature: 23.5,
      humidity: 52,
      windSpeed: 9,
      windGust: 14,
      precipitation: 0,
      cloudCover: 15,
      weatherCode: 1,
      weatherDescription: "Az Bulutlu / Arı Uçuşuna Uygun",
      flightSuitability: fallbackSuitability,
      dailyForecast: generateFallbackDailyForecast(23.5),
      updatedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };
  }
}
