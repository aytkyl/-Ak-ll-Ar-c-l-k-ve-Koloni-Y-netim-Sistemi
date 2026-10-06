export type HiveType = "Langstroth" | "Dadant" | "Karakovan" | "Sepet" | "Ruset";

export type QueenRace =
  | "Kafkas"
  | "Karniyol"
  | "İtalyan"
  | "Anadolu"
  | "Mugla"
  | "Belfast"
  | "Yerli Karadeniz";

export type QueenColor = "Mavi" | "Beyaz" | "Sari" | "Kirmizi" | "Yesil";

export type HealthStatus =
  | "Saglikli"
  | "Varroa Riski"
  | "Yavru Curuklugu Suphesi"
  | "Amerikan Yavru Curuklugu"
  | "Avrupa Yavru Curuklugu"
  | "Kirec Hastaligi"
  | "Tas Hastaligi"
  | "Nosema Belirtisi"
  | "Balmumu Guvesi"
  | "Tulumsu Yavru"
  | "Yalanci Ana"
  | "Kambur Yavru"
  | "Zayif Koloni"
  | "Besleme Gerekli"
  | "Anasiz Koloni"
  | "Yagmacilik Riski";

export interface BeeDiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  category: "brood" | "pest" | "adult" | "comb_disorder";
  categoryName: string;
  severity: "Kritik (Acil İhbar)" | "Yüksek Tehlike" | "Orta Risk" | "Hafif / İzlem";
  dangerColor: string;
  icon: string;
  overview: string;
  combSymptoms: string[];
  beeSymptoms: string[];
  rapidFieldTest?: string;
  causesAndTransmission?: string[];
  treatmentProtocol: {
    urgentActionSteps: string[];
    organicTreatment: string[];
    culturalAndBiological: string[];
    prohibitedActions: string[];
  };
  legalStatus?: string;
  preventionTips: string[];
}

export interface TreatmentRecord {
  id: string;
  hiveId: string;
  hiveNumber: string;
  diseaseId: string;
  diseaseName: string;
  treatmentName: string;
  treatmentType: "organic_acid" | "essential_oil" | "biological_cultural" | "herbal" | "quarantine_action";
  dosageDetails: string;
  startDate: string;
  endDate?: string;
  withdrawalDays: number;
  safeHarvestDate: string;
  status: "active" | "completed" | "quarantine";
  notes?: string;
  effectivenessRating?: number;
}

export interface InspectionLog {
  id: string;
  date: string;
  framesCovered: number;
  broodFrames: number;
  honeyFrames: number;
  queenSeen: boolean;
  freshEggsSeen: boolean;
  queenCellsPresent: boolean;
  temperament: "Uysal" | "Sakin" | "Hırçın" | "Sokucu";
  actionTaken: string;
  nextInspectionDate?: string;
  nextInspectionAction?: string;
  notes?: string;
}

export interface Hive {
  id: string;
  hiveNumber: string;
  type: HiveType;
  queenRace: QueenRace;
  queenYear: number;
  queenMarkColor: QueenColor;
  queenLaying: boolean;
  totalFrames: number;
  broodFrames: number;
  honeyFrames: number;
  healthStatus: HealthStatus;
  honeySuperCount: number;
  swarmTendency: "Yok" | "Kontrol Edildi" | "Yuksek";
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  nextInspectionAction?: string;
  region?: string;
  locationTag?: string;
  notes?: string;
  inspections: InspectionLog[];
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  date: string;
  hiveId: string;
  hiveNumber: string;
  productType:
    | "Suzme Cicek Bali"
    | "Cam Bali"
    | "Kestane Bali"
    | "Petek Bal"
    | "Karakovan Bali"
    | "Yas Polen"
    | "Kuru Polen"
    | "Propolis"
    | "Ari变Sutu"
    | "Ari Zehri";
  quantityKg: number;
  moisturePercent?: number;
  qualityGrade?: "Standart" | "Yuksek Kalite" | "Premium Organik";
  batchCode?: string;
  notes?: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: "income" | "expense";
  category:
    | "Bal Satışı"
    | "Polen / Propolis Satışı"
    | "Ana Arı / Koloni Satışı"
    | "Bakanlık Kovan & Proje Desteği"
    | "Şeker & Besin Alımı"
    | "Kovan & Çerçeve"
    | "Varroa & İlaç Mücadelesi"
    | "Kıyafet & Ekipman"
    | "Yakıt & Nakliye"
    | "Birlik Aidat & AKS Ücretleri"
    | "TARSİM Sigorta Gideri"
    | "Vergi & Stopaj Kesintisi"
    | "Diğer"
    | string;
  amount: number;
  description: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: "Temel Ekipman" | "Kovan Parçaları" | "Besleme & Şerbetlik" | "Hastalık Mücadelesi" | "Hasat Ekipmanı";
  purchaseDate: string;
  monthYear: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  supplier?: string;
  notes?: string;
}

export type PlannerPeriod = "daily" | "threeday" | "weekly" | "monthly";

export interface PlannerTask {
  id: string;
  period: PlannerPeriod;
  title: string;
  category: "Besleme" | "Hastalık & Varroa" | "Kovan Kontrolü" | "Oğul Önleme" | "Hasat" | "Kışlatma";
  description: string;
  seasonOrMonth?: string;
  frequencyText: string;
  isCompleted: boolean;
  priority: "Dusuk" | "Orta" | "Yuksek" | "Kritik";
  dueDays?: number;
}

export interface CityCoord {
  name: string;
  region: string;
  lat: number;
  lon: number;
}

export interface WeatherDailyForecast {
  date: string;
  rawDate?: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax?: number;
  apparentTempMin?: number;
  precipitation: number;
  precipitationProbability?: number;
  precipitationHours?: number;
  windSpeedMax?: number;
  windGustMax?: number;
  sunrise?: string;
  sunset?: string;
  uvIndexMax?: number;
  sunshineHours?: number;
  weatherCode: number;
  weatherDescription: string;
  inspectionSuitability?: {
    score: number; // 0-100
    status: "Mukemmel" | "Iyi" | "Sinirli" | "Riskli" | "Ucus Yok";
    tag: string;
    tagColor: string;
    recommendedHours: string;
    advice: string;
    canInspectBrood: boolean;
    canApplyFormicAcid: boolean;
    canFeed: boolean;
  };
}

export interface WeatherData {
  city: string;
  region: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
  weatherDescription: string;
  flightSuitability: {
    score: number; // 0-100
    status: "Mukemmel" | "Iyi" | "Sinirli" | "Riskli" | "Ucus Yok";
    badgeColor: string;
    advice: string;
  };
  dailyForecast?: WeatherDailyForecast[];
  updatedAt: string;
}

export type WeatherAlertSeverity = "kritik" | "yuksek" | "orta" | "bilgi";

export type WeatherAlertType =
  | "extreme_heat"
  | "storm_wind"
  | "cold_frost"
  | "heavy_rain"
  | "thermal_shock";

export interface MeteorologicalAlert {
  id: string;
  type: WeatherAlertType;
  severity: WeatherAlertSeverity;
  title: string;
  description: string;
  triggerValue: string;
  dateOrTime: string;
  beekeeperImpact: string;
  actionSteps: string[];
  icon: string;
  isRead?: boolean;
}

export interface FloraPlant {
  name: string;
  scientificName: string;
  type:
    | "Nektar"
    | "Polen"
    | "Hem Nektar Hem Polen"
    | "Salgı (Basra)"
    | "Nektar (Çiçek ve Yaprak Dışı Nektarlık)"
    | "Salgı ve Çiçek";
  floweringMonths: string[];
  honeyQuality: string;
  honeyColor: string;
  importance: "Cok Yuksek" | "Yuksek" | "Orta";
  notes: string;
}

export interface RegionFlora {
  region: string;
  provinces: string[];
  dominantHoneyTypes: string[];
  nectarFlowPeak: string;
  estimatedYieldPerHive: string;
  overview: string;
  plants: FloraPlant[];
}

export interface BookChapterSubSection {
  id: string;
  title: string;
  summary: string;
  content: string[];
  stepByStep?: string[];
  traditionalSolutions?: string[];
  modernSolutions?: string[];
  warnings?: string[];
  calculatorType?: "syrup" | "fondant" | "formic" | "oxalic";
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  description: string;
  subsections: BookChapterSubSection[];
}

export interface NextInspectionGuide {
  intervalDays: number;
  intervalText: string;
  primaryGoal: string;
  checkpoints: string[];
  equipmentToBring: string[];
  criticalAlert?: string;
}

export interface CurrentInspectionGuide {
  headline: string;
  inspectionCheckpoints: string[];
  feedingAdvice: {
    type: "Teşvik Şerbeti (1:1)" | "Kış Şerbeti (2:1)" | "Arı Keki / Fondan" | "Besleme Yapılmaz (Nektar Akımı)" | "Polen İkamesi";
    details: string;
  };
  varroaAndHealth: string;
  frameAndSuperAction: string;
  hiveEntranceAndVentilation: string;
  urgentAlerts: string[];
}

export interface RegionalMonthCare {
  monthIndex: number; // 0 to 11
  monthName: string; // "Ocak", "Şubat", ...
  season: "İlkbahar" | "Yaz" | "Sonbahar" | "Kış";
  phenologySummary: string; // Bölgedeki nektar/polen ve doğa durumu
  currentCare: CurrentInspectionGuide;
  nextCare: NextInspectionGuide;
}

export interface RegionalCareRegionData {
  regionId: string;
  regionName: string;
  provinces: string[];
  climateFeature: string;
  annualSchedule: RegionalMonthCare[];
}

export interface BeeCoordinate {
  x: number;
  y: number;
  type?: "worker" | "drone" | "queen";
}

export interface BeeCountResult {
  totalVisibleBees: number;
  workerBees: number;
  droneBees: number;
  queenPresent: boolean;
  densityPercentage: number;
  estimatedFramePopulation: number;
  beeCoordinates?: BeeCoordinate[];
}

export interface VarroaMiteDetection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locationOnBee?: string;
  confidence: number;
  description?: string;
}

export interface VarroaAnalysisResult {
  varroaCount: number;
  infectedBeeCount: number;
  infestationRate: number;
  severityLevel: "Düşük" | "Orta" | "Kritik";
  treatmentRequired: boolean;
  recommendedTreatment: string;
  detectedMites: VarroaMiteDetection[];
}

export interface DiseaseFinding {
  id: string;
  diseaseName: string;
  severity: "Hafif" | "Orta" | "Şiddetli";
  confidence: number;
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  symptoms: string;
  treatment: string;
}

export interface DiseaseAndPestAnalysis {
  healthScore: number;
  hasDiseases: boolean;
  findings: DiseaseFinding[];
}

export interface FrameInspectionResult {
  broodPattern: {
    cappedBroodPercentage: number;
    larvaeAndEggsPercentage: number;
    patternQuality: "Kusursuz Kompakt" | "İyi" | "Düzensiz / Alacalı" | "Yavru Yok" | string;
    droneBroodPercentage: number;
  };
  foodStores: {
    honeyPercentage: number;
    pollenPercentage: number;
    emptyCellsPercentage: number;
  };
  queenCells: {
    detected: boolean;
    count: number;
    types: string;
    locations?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      type?: string;
    }>;
  };
  queenBee?: {
    detected: boolean;
    location?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
    details?: string;
  };
  overallHealthRating: "Mükemmel" | "İyi" | "Dikkat Edilmeli" | "Kritik Durum" | string;
  summary: string;
  urgentActions: string[];
  suggestedNextInspectionDays: number;
}

export interface CompleteFrameVisionAnalysis {
  beeCount: BeeCountResult;
  varroaAnalysis: VarroaAnalysisResult;
  diseaseAndPestAnalysis: DiseaseAndPestAnalysis;
  frameInspection: FrameInspectionResult;
}

