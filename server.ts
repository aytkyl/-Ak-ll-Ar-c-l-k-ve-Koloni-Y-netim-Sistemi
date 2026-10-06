import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Diagnostic & Consultation endpoint
app.post("/api/gemini/diagnose", async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = "image/jpeg", location, hiveType } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Soru veya fotoğraf açıklaması gereklidir." });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY tanımlı değil. Lütfen Settings menüsünden ekleyin veya yerel kütüphaneyi kullanın.",
      });
    }

    const systemInstruction = `Sen Türkiye'nin en deneyimli usta arıcısı ve arı sağlığı uzmanısın (Master Beekeeper & Apicultural Specialist).
Kullanıcının kovan durumu, arı hastalıkları (Varroa, Yavru Çürüklüğü, Nosema, Kireç vb.), ana arı kabulü, oğul engelleme, besleme (şerbet/kek), karakovan bakımı veya hasat ile ilgili sorularını ve yüklenen fotoğrafları analiz edersin.

Yanıtlarında:
1. Durum Teşhisi ve Risk Derecesi (Acil / Dikkat / Normal).
2. Olası Nedenler.
3. Modern / Bilimsel Çözüm Adımları (Dozaj, sıcaklık koşulları, uygulama şekli).
4. Geleneksel & Doğal Çözümler (Defne dumanı, kekik yağı, pudra şekeri, elma sirkesi vb.).
5. Sırasıyla Adım Adım Yapılması Gerekenler (Bugün, 3 gün sonra, 1 hafta sonra).
6. Usta Arıcı Tavsiyesi & Uyarılar (Bal hasat döneminde kimyasal kullanılmaması vb.).

Yanıtı anlaşılır, samimi ve pratik bir dille, Markdown formatında başlıklar ve maddeler halinde ver.`;

    let response;
    if (imageBase64) {
      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: `Konum: ${location || "Belirtilmedi"}, Kovan Tipi: ${hiveType || "Standart Langstroth"}.
Kullanıcı Sorusu/Açıklaması: ${prompt || "Bu petek/arı fotoğrafındaki durumu, olası hastalıkları veya arı davranışını analiz eder misin?"}`,
            },
          ],
        },
        config: {
          systemInstruction,
        },
      });
    } else {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Konum: ${location || "Belirtilmedi"}, Kovan Tipi: ${hiveType || "Standart Langstroth"}.
Soru/Durum: ${prompt}`,
        config: {
          systemInstruction,
        },
      });
    }

    const text = response.text || "Yanıt oluşturulamadı.";
    res.json({ result: text });
  } catch (error: any) {
    console.error("Gemini diagnose error:", error);
    res.status(500).json({
      error: error.message || "Yapay zeka asistanı yanıt verirken bir hata oluştu.",
    });
  }
});

// AI Queen Bee Finder (Ana Arı Bulucu & Koordinat Tespiti)
app.post("/api/gemini/find-queen", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "İncelenecek petek/çerçeve görüntüsü gereklidir." });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY tanımlı değil. Lütfen ayarlar üzerinden API anahtarınızı girin.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `Sen dünyanın en yetkin arıcılık uzmanı ve petek üzerindeki ana arıyı (kraliçe arı / queen bee) tespit etme uzmanısın.
Bu petek/çerçeve görüntüsünü dikkatle incele:
1. Görüntüde bir ana arı (Apis mellifera kraliçesi) var mı?
   - Ana arının morfolojik özellikleri:
     * Uzun, sivri ve konik abdomen (karın). İşçi arılardan belirgin şekilde uzundur.
     * Sırt kısmı (toraks) daha geniş, parlak, koyu ve az tüylüdür.
     * Bacakları daha uzun ve genellikle kehribar/açık renklidir.
     * Etrafında başları ana arıya dönük 'maiyet çemberi' (retinue of worker bees) olabilir.
     * Sırtında uluslararası işaret boyası (beyaz, sarı, kırmızı, yeşil, mavi) olabilir.

2. Eğer ana arı tespit edilirse:
   - Görüntü genişliği ve yüksekliği yüzdesi (0-100 arasında) olarak konumunu ver:
     * x: Ana arının merkezinin yatay konumu (0 = en sol, 100 = en sağ)
     * y: Ana arının merkezinin dikey konumu (0 = en üst, 100 = en alt)
     * width: Ana arıyı çevreleyen alan genişliği (yüzde cinsinden, örn: 8.0)
     * height: Ana arıyı çevreleyen alan yüksekliği (yüzde cinsinden, örn: 10.0)
   - Güven skoru (confidence: 0-100)
   - Morfolojik detaylar ve gözlemler.

3. Eğer ana arı açıkça görünmüyorsa:
   - found: false
   - Bulunamama nedeni (arılardan görünmüyor, peteğin diğer yüzünde olabilir, netlik vb.)
   - Petekteki diğer göstergeler (günlük yumurta, kapalı yavru, yüksük vb.)
   - Arıcıya ana arıyı bulmak için pratik saha ipuçları.

Aşağıdaki JSON şemasına birebir uygun yanıt ver:
{
  "found": boolean,
  "confidence": number,
  "location": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "queenDetails": {
    "raceEstimate": string,
    "abdomenDescription": string,
    "markColor": string,
    "hasRetinue": boolean,
    "activity": string
  },
  "explanation": string,
  "combObservations": string,
  "beekeeperTips": [string]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || "image/jpeg",
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Sen arı çerçevesi üzerinde ana arıyı nokta atışı tespit eden yapay zeka arıcılık asistanısın. Yanıtları daima geçerli JSON formatında ve Türkçe olarak döndür.",
      },
    });

    const responseText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Fallback in case of code block wrapping
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini find-queen error:", error);
    res.status(500).json({
      error: error.message || "Ana arı tespit edilirken bir hata oluştu.",
    });
  }
});

// AI Advanced Frame Vision Analysis: Bee Counting, Varroa Detection, Disease Diagnosis, Frame Inspection
app.post("/api/gemini/analyze-frame", async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = "image/jpeg",
      analysisType = "all", // "all" | "varroa" | "counter" | "diseases" | "inspection"
      hiveContext,
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "İncelenecek petek/arı görüntüsü gereklidir." });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY tanımlı değil. Lütfen Settings menüsünden ekleyin.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const systemInstruction = `Sen bilgisayarlı görü ve arı biyolojisi konusunda uzman, Türkiye ve dünya standartlarında yapay zeka arıcılık denetçisisin (AI Apiary Vision Inspector).
Görüntüdeki arı çerçevesini, arı popülasyonunu, arı sağlığını ve petek morfolojisini mikroskobik düzeyde incelersin.
Tüm koordinatları görüntünün genişliği ve yüksekliğinin yüzdesi olarak (0-100 aralığında) hesaplarsın:
x: merkez yatay % (0=sol, 100=sağ)
y: merkez dikey % (0=üst, 100=alt)
width: % genişlik
height: % yükseklik
Daima Türkçe ve katı bir JSON yapısıyla yanıt verirsin.`;

    const prompt = `Bu arı çerçevesi / petek fotoğrafını derinlemesine analiz et:
1. ARİ SAYIMI & POPÜLASYON TAHMİNİ (Bee Counting):
   - Görseldeki net görünen işçi arı, erkek arı (drone) ve varsa ana arı sayısı.
   - Petek yüzeyinin arılarla kaplanma yoğunluğu (densityPercentage: 0-100%).
   - Bu çerçeve ve kovan için tahmini arı nüfusu.
   - Belirgin arıların örnek koordinatları (x, y) listesi (maksimum 40-50 nokta, görsel üzerinde ısı haritası ve nokta sayımı için).

2. VARROA TESPİTİ VE KOORDİNATLARI (Varroa Destructor Detection):
   - İşçi ve erkek arıların sırtında (toraks), karın segmentleri arasında (abdomen altı) veya açık/kapalı petek gözlerindeki kahverengi/kızıl disk şeklindeki Varroa akarlarını ara.
   - Tespit edilen her bir Varroa akarının kesin konumu: [x, y, width, height] yüzdesi.
   - Varroalı arı sayısı ve enfestasyon oranı: (Varroalı Arı / Toplam İncelenen Arı) * 100.
   - Risk derecesi: Düşük (<%1), Orta (%1-%3), Kritik (>%3).
   - Acil organik/kimyasal mücadele tavsiyesi (Formik asit, Oksalik asit buharlaştırma, Timol vb.).

3. HASTALIKLI ARI VE LARVA TEŞHİSİ (Disease & Pest Detection):
   - Deforme Kanat Virüsü (DWV - büzüşmüş/kıvrık kanatlı arılar).
   - Nosema belirtileri (şişkin karın, petek üzerinde ishal lekeleri).
   - Amerikan / Avrupa Yavru Çürüklüğü belirtileri (delinmiş, batık, koyulaşmış kuluçka gözleri).
   - Kireç Hastalığı (Chalkbrood - beyaz/siyah mumya larvalar).
   - Mum güvesi ağları veya kovan böceği.
   - Her tespit için koordinat kutusu [x, y, width, height], şiddet derecesi ve tedavi önerisi.

4. KOVAN MUAYENESİ VE PETEK DÜZENİ (Frame Inspection & Brood Pattern):
   - Kapalı yavru alanı (yüzde %), açık kurtçuk/larva (yüzde %), bal kemeri (yüzde %), polen alanı (yüzde %).
   - Yavru düzeni kalitesi (Kusursuz Kompakt / İyi / Düzensiz-Alacalı / Yavru Yok).
   - Ana arı memesi (Oğul memesi mi, yüksük/süpersedür mü? Sayısı ve koordinatı).
   - Varsa ana arı tespiti ve koordinatı.
   - Genel koloni sağlık puanı (0-100).
   - Arıcı için kritik 3 eylem maddesi ve bir sonraki muayene için önerilen gün aralığı.

Kovan Bilgisi: ${hiveContext || "Genel Arılık Kontrolü"}
Analiz Türü Talebi: ${analysisType}

JSON Çıktı Şeması:
{
  "beeCount": {
    "totalVisibleBees": number,
    "workerBees": number,
    "droneBees": number,
    "queenPresent": boolean,
    "densityPercentage": number,
    "estimatedFramePopulation": number,
    "beeCoordinates": [
      { "x": number, "y": number, "type": "worker" | "drone" | "queen" }
    ]
  },
  "varroaAnalysis": {
    "varroaCount": number,
    "infectedBeeCount": number,
    "infestationRate": number,
    "severityLevel": "Düşük" | "Orta" | "Kritik",
    "treatmentRequired": boolean,
    "recommendedTreatment": string,
    "detectedMites": [
      {
        "id": string,
        "x": number,
        "y": number,
        "width": number,
        "height": number,
        "locationOnBee": string,
        "confidence": number,
        "description": string
      }
    ]
  },
  "diseaseAndPestAnalysis": {
    "healthScore": number,
    "hasDiseases": boolean,
    "findings": [
      {
        "id": string,
        "diseaseName": string,
        "severity": "Hafif" | "Orta" | "Şiddetli",
        "confidence": number,
        "location": { "x": number, "y": number, "width": number, "height": number },
        "symptoms": string,
        "treatment": string
      }
    ]
  },
  "frameInspection": {
    "broodPattern": {
      "cappedBroodPercentage": number,
      "larvaeAndEggsPercentage": number,
      "patternQuality": "Kusursuz Kompakt" | "İyi" | "Düzensiz / Alacalı" | "Yavru Yok",
      "droneBroodPercentage": number
    },
    "foodStores": {
      "honeyPercentage": number,
      "pollenPercentage": number,
      "emptyCellsPercentage": number
    },
    "queenCells": {
      "detected": boolean,
      "count": number,
      "types": string,
      "locations": [
        { "x": number, "y": number, "width": number, "height": number, "type": string }
      ]
    },
    "queenBee": {
      "detected": boolean,
      "location": { "x": number, "y": number, "width": number, "height": number },
      "confidence": number,
      "details": string
    },
    "overallHealthRating": "Mükemmel" | "İyi" | "Dikkat Edilmeli" | "Kritik Durum",
    "summary": string,
    "urgentActions": [string],
    "suggestedNextInspectionDays": number
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || "image/jpeg",
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction,
      },
    });

    const responseText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini analyze-frame error:", error);
    res.status(500).json({
      error: error.message || "Görsel analizi yapılırken bir hata oluştu.",
    });
  }
});

// AI Regional Flora & Honey Yield Forecast endpoint
app.post("/api/gemini/flora-forecast", async (req, res) => {
  try {
    const { region, province, month, hiveCount } = req.body;

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY tanımlı değil.",
      });
    }

    const prompt = `Türkiye'nin ${province || "Genel"} ilinde (${region || "Marmara/Ege"}) ${month || "Mevcut Ay"} döneminde arıcılık için:
1. Bölgedeki baskın bal ve polen veren nektar bitkileri (çiçeklenme dönemleri).
2. Bu döneme ait arı nektar akımı yoğunluğu ve polen girişi tahmini.
3. ${hiveCount || 10} kovanlık bir arılık için bu bölgede tahmini bal verimi beklentisi (kg/kovan aralığı).
4. Arıcının bu dönemde bölge florasına uygun alması gereken aksiyonlar (kovan katı, göçer arıcılık rotası, körük yakıtı önerileri).

Yanıtı Türkçe, yapılandırılmış, net ve pratik maddeler halinde sun.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "Sen Türkiye bitki örtüsü, nektar akımı, bal ormanları ve arı meraları konusunda uzman bir ziraat ve arıcılık danışmanısın.",
      },
    });

    res.json({ result: response.text || "Flora analizi oluşturulamadı." });
  } catch (error: any) {
    console.error("Gemini flora forecast error:", error);
    res.status(500).json({ error: error.message || "Flora analizi alınamadı." });
  }
});

// Start server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kovanım arıcılık sunucusu port ${PORT} üzerinde hazır.`);
  });
}

startServer();
