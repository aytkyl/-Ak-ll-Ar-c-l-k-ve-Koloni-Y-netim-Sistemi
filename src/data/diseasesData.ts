import { BeeDiseaseInfo } from "../types";

export const BEE_DISEASES_DATA: BeeDiseaseInfo[] = [
  // --- KATEGORİ 1: YAVRU & PETEK HASTALIKLARI ---
  {
    id: "ayc",
    name: "Amerikan Yavru Çürüklüğü (AYÇ)",
    scientificName: "Paenibacillus larvae (Spor oluşturan basil)",
    category: "brood",
    categoryName: "Yavru & Petek Hastalığı",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-rose-600 text-white border-rose-700",
    icon: "ShieldAlert",
    overview:
      "Arıcılığın en yıkıcı, sporları toprakta ve kovan ahşabında 40 yıldan uzun süre canlı kalabilen, bal mumu ve petek dokusuna işleyen ölümcül bakteriyel hastalığıdır.",
    combSymptoms: [
      "Mozaik (alacalı) yavru deseni; sağlıklı ve kapalı gözlerin arasında dağınık boşluklar.",
      "Sırlanmış petek göz kapaklarında içeri doğru çökme (içbükeyleşme), delinme ve koyu yağlı görünüm.",
      "Ölü larvaların hücre tabanında koyu kahverengi, sakızımsı yapışkan bir kitleye dönüşmesi.",
      "Kovan kapağı açıldığında hissedilen tipik balık tutkalı veya çürümüş et kokusu.",
      "Hücre tabanına yapışıp kuruyan mumyaların ağız kısımlarında yukarı kalkık 'dil' (proboscis) kalıntısı.",
    ],
    beeSymptoms: [
      "Tarlacı arı nüfusunda ani ve hızlı çöküş.",
      "Bakıcı arıların delinmiş hücreleri açıp temizlemeye çalışması fakat yapışkanlığı çıkaramaması.",
      "Koloni savunmasının düşmesi ve komşu kovanlarca kolayca yağmalanması.",
    ],
    rapidFieldTest:
      "Kibrit Çöpü Testi: Şüpheli çökmüş gözün içine kuru bir kibrit çöpü veya kürdan sokulup yavaşça geri çekilir. Eğer kahverengi kitle iplik gibi 2.5 - 3 cm sünerek uzuyorsa AYÇ teşhisi %99 kesindir!",
    causesAndTransmission: [
      "Dışarıdan kaynağı belirsiz besleme balı veya petek satın alınması.",
      "Hastalık bulaşmış kovanların diğer kovanlar tarafından yağmalanması.",
      "Dezenfekte edilmemiş el demiri, eldiven veya körük kullanımı.",
      "Oğul veya ikinci el kovan satın alımları.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı derhal kapatın, uçuş deliğini süngerle tıkayın ve diğer kovanlardan en az 5 km izole edin.",
        "2. İl/İlçe Tarım ve Orman Müdürlüğü'ne 5996 sayılı kanun gereği derhal resmi ihbarda bulunun.",
        "3. İlerlemiş vakalarda koloni akşam saatinde kükürtle uyutulup derin bir çukurda yakılarak gömülür.",
        "4. Erken teşhis ve hafif vakalarda tecrübeli ellerce 'Çifte Silkme Yöntemi' (Shook Swarm) uygulanabilir.",
      ],
      organicTreatment: [
        "Bu hastalıkta kesinlikle antibiyotik veya bitkisel yağ tek başına tedavi edici DEĞİLDİR; antibiyotik sporları öldürmez, sadece maskeler ve balda zehirli kalıntı bırakır!",
        "Kovan ahşabının pürmüz ile kömürleşene kadar yakılması veya %4'lük kostik soda ile dezenfeksiyonu.",
      ],
      culturalAndBiological: [
        "Tüm çerçeve ve peteklerin yakılarak imha edilmesi (asla eritilip temel petek yapılmaz).",
        "Arılıkta en az 3 yıl boyunca hijyenik davranış gösteren (VSH) damızlık ana arıların tercih edilmesi.",
        "Arılıklar arası aletlerin %70 alkol veya çamaşır suyu ile sterilize edilmesi.",
      ],
      prohibitedActions: [
        "KESİNLİKLE ANTİBİYOTİK KULLANMAYINIZ! Türk Gıda Kodeksi'ne göre balda antibiyotik sıfır toleranstır ve yasaktır.",
        "Hastalık şüphesi olan kovanın balını veya şerbetini başka kovanlara asla paylaştırmayın.",
        "Çökmüş kovanı arılıkta açık bırakıp yağmaya izin vermeyiniz.",
      ],
    },
    legalStatus:
      "Tarım ve Orman Bakanlığı'nca tazminatlı ihbarı zorunlu hastalıklar listesindedir.",
    preventionTips: [
      "Asla yabancı arılıktan petek veya şerbet amaçlı süzme bal almayınız.",
      "Her yıl kovanlardaki eski esmer çerçevelerin en az %30'unu yenileyiniz.",
    ],
  },
  {
    id: "eyc",
    name: "Avrupa Yavru Çürüklüğü (EYÇ)",
    scientificName: "Melissococcus plutonius",
    category: "brood",
    categoryName: "Yavru & Petek Hastalığı",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-amber-600 text-white border-amber-700",
    icon: "AlertTriangle",
    overview:
      "Larvaların henüz sırlanmadan (açık yavru döneminde) 4-5 günlükken sindirim kanalında çoğalarak besinlerini çalan ve ölümüne yol açan bulaşıcı bakteriyel hastalıktır.",
    combSymptoms: [
      "Açık yavru gözlerinde larvaların 'C' şeklini kaybedip kıvrılarak hücre dibinde bükülmesi.",
      "Sağlıklı sedef beyazı larva renginin önce donuk sarıya, ardından açık kahveye dönüşmesi.",
      "Hücre sırlanmadan larva öldüğü için petekte açık düzensiz ölü kurtçuklar görülmesi.",
      "Ekşi maya veya sirke benzeri ekşimsi koku.",
      "Kibrit çöpü testinde uzama YAPMAZ; peltemsi ve sulu kalır.",
    ],
    beeSymptoms: [
      "Koloninin tarlacı gücünün zayıflaması, yavru alanının daralması.",
      "Bakıcı arıların ölü larvaları kovan dışına atmaya çalışması.",
    ],
    rapidFieldTest:
      "Kibrit testi uygulandığında kitle en fazla 0.5 cm esner ve hemen kopar; iplikleşme yapmaz. Koku sirke ve çürümüş peynir kokusu arasındadır.",
    causesAndTransmission: [
      "İlkbahar ani soğukları (kuluçka üşümesi).",
      "Yetersiz polen ve besin kıtlığı nedeniyle arı sütünün kalitesizleşmesi.",
      "Hijyenik temizlik refleksi zayıf yaşlı ana arılar.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı bölme tahtası ile sıkıştırın; arının sarmadığı boş petekleri hemen alın.",
        "2. Yaşlı ana arıyı derhal öldürüp yerine genç, hijyenik ve döllü bir ana arı verin.",
        "3. Kuluçka döngüsünü 10 gün keserek bakıcı arıların tüm petekleri temizlemesini sağlayın.",
      ],
      organicTreatment: [
        "Kekik ve nane uçucu yağ katkılı 1:1 teşvik şerbeti ile koloniyi besleyin.",
        "Kovan içine 1 litre suya 2 çorba kaşığı doğal elma sirkesi katılarak hazırlanan spreyin çıta aralarına sıkılması.",
      ],
      culturalAndBiological: [
        "Ağır bulaşık açık yavrulu petekleri kovandan çıkarıp eritin.",
        "Taze kabarmış temiz petek veya ham petek girin.",
        "Koloniye dışarıdan taze polen keki desteği verin.",
      ],
      prohibitedActions: [
        "Hastalık döneminde kovana kat atıp hacmi genişletmeyiniz; koloni mutlaka sıkışık tutulmalıdır.",
      ],
    },
    legalStatus: "Bulaşıcı arı hastalığıdır; yerel birlik ve tarım ilçe uyarılmalıdır.",
    preventionTips: [
      "İlkbahar erken beslemesinde proteinli polen keki vererek larva beslenmesini güçlendirin.",
      "Genç kraliçe arılarla çalışın.",
    ],
  },
  {
    id: "kirec",
    name: "Kireç Hastalığı (Chalkbrood)",
    scientificName: "Ascosphaera apis (Mantar / Fungus)",
    category: "brood",
    categoryName: "Yavru & Petek Mantarı",
    severity: "Orta Risk",
    dangerColor: "bg-blue-600 text-white border-blue-700",
    icon: "Droplets",
    overview:
      "Larvaların kovan tabanındaki nem, soğuk ve havalandırma yetersizliği nedeniyle mantar sporları tarafından sarılıp tebeşir gibi taşlaşmasıdır.",
    combSymptoms: [
      "Petek gözlerinin içinde sert, tebeşir veya kireç taşı parçasına benzeyen beyaz-gri mumyalar.",
      "Göz kapaklarının aralanması ve peteğin sallandığında çıngırak gibi ses çıkarması.",
      "İlerlemiş evrede yeşilimsi veya siyahımsı spor kümeleri.",
    ],
    beeSymptoms: [
      "Kovan uçuş tahtasında ve kovan önündeki çimlerde çok sayıda beyaz kireç parçacığı döküntüsü.",
      "İşçi arıların sürekli bu kireçlenmiş mumyaları kovan dışına taşımaya çalışması.",
    ],
    rapidFieldTest:
      "Kovan dip tablası çekildiğinde polen çekmecesinde tebeşir kırıkları gibi onlarca beyaz sert mumya görülür.",
    causesAndTransmission: [
      "Kovanın nemli, çukur veya taban suyu yüksek yere konulması.",
      "Alt havalandırmanın kapalı olması ve üst örtü altında su yoğuşması.",
      "Erken ilkbaharda gereksiz kovan açarak yavrunun üşütülmesi.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı yerden en az 30-40 cm yüksekliğe kaldırın, güneş alan kuru bir yere taşıyın.",
        "2. Kovan dip tahtasındaki telli havalandırmayı sonuna kadar açın; taban nemini kurutun.",
        "3. Kireçli petekleri derhal kovandan çıkarıp imha edin; arıyı sıkıştırın.",
      ],
      organicTreatment: [
        "Çay Ağacı Yağı (Tea Tree Oil): 1 litre 1:1 şerbete 2-3 damla çay ağacı yağı veya kekik yağı damlatılarak arılara verilir (güçlü antifungal etki).",
        "Kovan dip tahtasına ve çerçeve üstlerine hafifçe kekik tozu veya elma sirkeli su püskürtülmesi.",
      ],
      culturalAndBiological: [
        "Hijyenik davranış özelliği yüksek (VSH) ana arı ile kraliçeyi değiştirin.",
        "Eski, küflenmiş esmer petekleri kovanda kesinlikle tutmayın.",
      ],
      prohibitedActions: [
        "Nemli kovanı straforla dıştan hava almayacak şekilde boğucu sarmayınız.",
      ],
    },
    preventionTips: [
      "Kovanlarda kesinlikle tabanı ızgaralı (polen tuzaklı) kovan modeli kullanın.",
      "Gölgeli ve çukur vadi tabanlarına arılık kurmayın.",
    ],
  },
  {
    id: "tas",
    name: "Taş Hastalığı (Stonebrood)",
    scientificName: "Aspergillus flavus & Aspergillus fumigatus",
    category: "brood",
    categoryName: "Yavru & Yetişkin Mantarı",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-stone-700 text-white border-stone-800",
    icon: "ShieldAlert",
    overview:
      "Hem larvaları hem de yetişkin işçi arıları tahta/taş sertliğinde katılaştıran, yeşilimsi sarı mantar sporları üreten ve insan akciğeri için de tehlikeli (zoonoz) bir hastalıktır.",
    combSymptoms: [
      "Hücre içindeki larvaların taş gibi sertleşmesi ve dokunulduğunda kırılmaması.",
      "Hücre üzerinde yeşilimsi, sarımtırak tozlu küf katmanı.",
      "Petek gözlerinin dibine adeta çimento gibi yapışmış mumyalar.",
    ],
    beeSymptoms: [
      "Yetişkin arıların karınlarının taş gibi sertleşmesi, uçamaması ve kovan önünde titreyerek ölmesi.",
      "Kovan kokusunun küflü kiler kokusuna benzemesi.",
    ],
    causesAndTransmission: [
      "Aşırı nem, ıslak kovan altlıkları, küflenmiş polen ve bal tüketimi.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. DİKKAT: İnsan sağlığı için tehlikelidir; kovanı incelerken mutlaka N95 veya FFP3 partikül maskesi takın!",
        "2. Aşırı bulaşık kovanların petekleri derhal yakılmalı ve kovan pürmüzle sterilize edilmelidir.",
      ],
      organicTreatment: [
        "Kovanın havalandırılması, kuru ortama alınması ve kükürt dumanı ile boş kovan dezenfeksiyonu.",
      ],
      culturalAndBiological: [
        "Kovan sehpasının yükseltilmesi, kraliçenin gençleştirilmesi.",
      ],
      prohibitedActions: [
        "Küflü petekleri asla süpürgeyle tozutarak solumayınız.",
      ],
    },
    legalStatus: "Zoonoz (insana solunumla bulaşabilir) risk taşır.",
    preventionTips: [
      "Kovan içi nemi %60'ın altında tutacak havalandırmayı sağlayın.",
    ],
  },
  {
    id: "tulumsu",
    name: "Tulumsu Yavru Çürüklüğü (Sacbrood Virus - SBV)",
    scientificName: "Sacbrood RNA Virüsü",
    category: "brood",
    categoryName: "Viral Petek Hastalığı",
    severity: "Orta Risk",
    dangerColor: "bg-indigo-600 text-white border-indigo-700",
    icon: "AlertTriangle",
    overview:
      "Larvanın gömlek değiştiremeyip deri altında sıvı toplanmasıyla içi su dolu bir tulum (torba) gibi şişmesine neden olan viral bir hastalıktır.",
    combSymptoms: [
      "Larva sırlanma aşamasında baş kısmı yukarı doğru kalkık, 'kayık' veya 'terlik' şeklinde hücrede yatar.",
      "Larvanın rengi beyazdan griye, ardından koyu kahverengi ve siyaha döner; baş kısmı en koyu renktir.",
      "Cımbızla tutulduğunda patlamadan, su dolu bir balon veya tulum gibi tek parça halinde dışarı çekilebilir.",
      "Koku genellikle yoktur veya çok hafif ekşidir.",
    ],
    beeSymptoms: [
      "Tarlacı arıların yaşam süresinde kısalma, polen toplama isteğinde azalma.",
    ],
    rapidFieldTest:
      "İnce bir cımbızla larvanın başından tutulup çekilir. Larva içi sıvı dolu bir tulum torbası gibi dağılmadan tek parça geliyorsa kesin SBV'dir.",
    causesAndTransmission: [
      "Varroa akarlarının virüsü kovan içine taşıması ve arıların bağışıklığının düşmesi.",
      "Polen ve protein kıtlığı, stres faktörleri.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Varroa mücadelesini derhal başlatın (virüsün ana taşıyıcısı varroadır).",
        "2. Ana arıyı 10-14 gün kafesleyin veya değiştirin; yavru kesintisi virüsün döngüsünü kırar.",
      ],
      organicTreatment: [
        "C vitamini takviyesi: Şerbete doğal limon suyu veya askorbik asit (C vitamini) ve propolis tentürü ilavesi.",
      ],
      culturalAndBiological: [
        "Ağır bulaşık petekleri çıkarın.",
        "Koloniye taze polen ve kek takviyesi ile bağışıklık kazandırın.",
      ],
      prohibitedActions: [
        "Viral bir hastalık olduğu için antibiyotik kesinlikle işe yaramaz; vermeyiniz.",
      ],
    },
    preventionTips: [
      "Düzenli varroa kontrolü ve yıllık ana arı yenilemesi.",
    ],
  },

  // --- KATEGORİ 2: PETEK ZARARLILARI & PARAZİTLER ---
  {
    id: "guve",
    name: "Balmumu Güvesi (Büyük & Küçük Güve)",
    scientificName: "Galleria mellonella (Büyük) & Achroia grisella (Küçük)",
    category: "pest",
    categoryName: "Petek Yıkıcı Zararlı",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-amber-700 text-white border-amber-800",
    icon: "Layers",
    overview:
      "Zayıf kovanlarda ve depodaki kabarmış peteklerde balmumu, polen ve arı gömleklerini kemirerek tüneller açan ve peteği örümcek ağı yumağına çeviren kelebek kurdudur.",
    combSymptoms: [
      "Petek yüzeyinde ve çıta içlerinde beyaz ipeksi iplikler, örümcek ağı benzeri tüneller.",
      "Petek gözlerinin tabanında siyah toz halinde güve dışkıları.",
      "Peteğin ufalanıp un gibi dökülmesi, çıta ahşabında derin oyuklar ve pupa kozaları.",
      "'Kellik Yavru' görünümü: Arıların güve tüneli üzerindeki yavru sırlarını açması ve larvaların sırsız büyümesi.",
    ],
    beeSymptoms: [
      "Zayıf kovan arılarının peteği savunamayıp kovanın bir köşesine sıkışması.",
      "Geceleri kovan girişinde uçuşan gri-kahverengi güve kelebekleri.",
    ],
    causesAndTransmission: [
      "Kovanın arı sayısına göre çok geniş tutulması; arının sarmadığı boş peteklerin kovanda bırakılması.",
      "Depolanan kabarmış peteklerin ışıksız, havasız ve sıcak odalarda korumasız saklanması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovandaki arısız boş petekleri hemen çıkarın; kovanı bölme tahtasıyla daraltın.",
        "2. Güvenin sardığı petekleri bıçakla kazıyın veya çok ağırsa yakıp eritin.",
        "3. Depodaki petekleri korumak için Biyolojik Bakteriyel Koruyucu (Bacillus thuringiensis - B401) uygulayın.",
      ],
      organicTreatment: [
        "Derin Dondurucu Şoklaması (-18°C): Depoya kaldırılacak tüm petekler 24 saat derin dondurucuda tutulursa tüm güve yumurtaları ve larvaları %100 ölür!",
        "Defne ve Ceviz Yaprağı: Petek sandıklarının arasına bol miktarda kuru defne yaprağı ve ceviz yaprağı serpiştirilir.",
        "Asetik Asit (%80 Konsantre Sirke Asiti) Buharı: Üst üste dizilen ballıkların en üstüne tabak içinde konularak buharlaştırılır.",
      ],
      culturalAndBiological: [
        "Güçlü koloni güve barındırmaz! Kolonileri daima sıkışık ve güçlü tutun.",
        "Depo peteklerini zifiri karanlık yerine hava akımı olan aydınlık petek askılıklarında muhafaza edin.",
      ],
      prohibitedActions: [
        "Kullanılan peteklere KESİNLİKLE NAFTALİN KOYMAYINIZ! Naftalin yağa ve muma geçer, kanserojendir, balı zehirler ve asla arınmaz.",
      ],
    },
    preventionTips: [
      "Hiçbir zaman arının sarmadığı peteği kovan içinde bırakmayınız.",
      "Petekleri depolamadan önce dondurucudan geçirin.",
    ],
  },
  {
    id: "varroa",
    name: "Varroa Akarları (Varroa Destructor)",
    scientificName: "Varroa destructor (Dış Parazit)",
    category: "pest",
    categoryName: "Dış Parazit & Virüs Vektörü",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-rose-600 text-white border-rose-700",
    icon: "ShieldAlert",
    overview:
      "Arının kanını ve yağ dokusunu emerek bağışıklığını çökerten, Kanat Deformasyon Virüsü (DWV) başta olmak üzere virüsleri yayan dünyanın 1 numaralı arı parazitidir.",
    combSymptoms: [
      "Kapalı kuluçka gözlerinde delinmeler ve düzensiz sökülmeler.",
      "Erkek arı gözlerinin içinde kahverengi susam tanesi büyüklüğünde akarlar.",
      "Erken pupa ölümleri.",
    ],
    beeSymptoms: [
      "Kanatları güdük, kıvrık veya hiç çıkmamış genç işçi arılar (DWV virüsü).",
      "Arıların sırtında ve karın plakalarının altında gözle görülebilen kahverengi-kırmızımsı oval akarlar.",
      "Kovan önünde sürünerek can veren arılar.",
      "Sonbaharda kovanın aniden boşalması ve sönmesi (Koloni Çöküş Sendromu).",
    ],
    rapidFieldTest:
      "Pudra Şekeri Sallama Testi: 300 adet canlı arı bir kavanoza alınıp 2 çorba kaşığı pudra şekeri ile 1 dakika nazikçe çalkalanır. Delikli kapaktan beyaz bir kaba elenir; su döküldüğünde şeker erir ve dökülen varroalar sayılır. 300 arıda 9 akardan fazlası (%3) acil müdahaleyi şart koşar.",
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Mevsime göre doğru organik asit takvimini seçin: Erken ilkbahar ve sonbaharda Formik Asit, kışın Oksalik Asit.",
        "2. Erkek arı gözü tuzağı uygulayarak petek altındaki kapalı erkek gözlerini kesin.",
        "3. Telli dip tahtası çekmecesini yağlayıp günlük doğal döküm sayısını takip edin.",
      ],
      organicTreatment: [
        "Formik Asit (15-25°C): Kovan başına günlük 10 cc'yi aşmayacak şekilde üst çıtalardan buharlaştırma (kapalı göze nüfuz eden tek organik asit).",
        "Oksalik Asit (0-5°C Kış Salkımı): Saf gliserinli mendil veya süblimasyon (buharlaştırma) yöntemi (yavrusuz dönemde %98 etki).",
        "Laktik Asit (%15 sulandırma): Yavrulu dönemde çerçeveler kaldırılarak arıların üzerine hafif buğu şeklinde püskürtme.",
        "Timol Kristalleri ve Kekik Yağı: 15-30°C arasında kovan içine yerleştirilen jel/plakalar.",
      ],
      culturalAndBiological: [
        "Erkek arı peteği ile tuzaklama.",
        "Bölme yaparak kuluçkasız dönem yaratma.",
      ],
      prohibitedActions: [
        "Bal akımı varken (ballık katları takılıyken) kovana bala koku veya kalıntı bırakacak hiçbir asit veya kimyasal UYGULANAMAZ.",
        "Aynı etken maddeli sentetik şeritleri art arda kullanarak varroada direnç oluşturmayınız.",
      ],
    },
    preventionTips: [
      "Yılda en az 3 dönem entegre mücadele: İlkbahar başlangıcı, Bal hasadı sonrası (Ağustos-Eylül) ve Kış salkımı (Aralık-Ocak).",
    ],
  },
  {
    id: "kucuk-kovan-bocegi",
    name: "Küçük Kovan Böceği (Aethina tumida)",
    scientificName: "Aethina tumida (İstilacı Böcek)",
    category: "pest",
    categoryName: "İstilacı Kovan Zararlısı",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-red-700 text-white border-red-800",
    icon: "ShieldAlert",
    overview:
      "Afrika kökenli, Avrupa ve Akdeniz havzasında karantinaya tabi, petekleri tüneller açarak mahveden, balı mayalandırıp kovanı terk ettiren istilacı parazittir.",
    combSymptoms: [
      "Peteklerin içinde binlerce beyaz kurtçuğun tüneller açması.",
      "Balın köpürmesi, mayalanması ve çürümüş portakal kokusu yayması.",
      "Peteğin adeta sümüksü bir balçık haline gelmesi.",
    ],
    beeSymptoms: [
      "Arıların böceğe karşı çaresiz kalıp kovanı topluca terk etmesi (kaçış).",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Türkiye'de görüldüğünde Tarım İl Müdürlüğü'ne ANINDA ihbar edilmesi zorunludur.",
        "2. Çerçeve aralarına mineral yağ dolu özel böcek tuzakları (beetle blasters) yerleştirilir.",
        "3. Kovan etrafındaki toprak diyatomeli toprak veya kireçle kaplanır (larvalar toprakta pupa olur).",
      ],
      organicTreatment: [
        "Diyatomlu toprak (Diatomaceous earth) tuzakları.",
        "Doğal nematodlar ile arılık toprağının biyolojik ilaçlanması.",
      ],
      culturalAndBiological: [
        "Kovan içinde çatlak ve yarık bırakılmaması; arının güçlü tutulması.",
      ],
      prohibitedActions: [
        "Kovan içine rastgele tarım ilacı sıkmayınız.",
      ],
    },
    legalStatus: "Uluslararası karantina ve ihbarı zorunlu istilacı tür.",
    preventionTips: [
      "Yurt dışından kaçak ana arı veya kovan getirilmesini engelleyin.",
    ],
  },
  {
    id: "trake-akari",
    name: "Trake Akarları (Acarapis Woodi)",
    scientificName: "Acarapis woodi (Solunum Akarları)",
    category: "pest",
    categoryName: "Solunum Yolu Paraziti",
    severity: "Orta Risk",
    dangerColor: "bg-cyan-700 text-white border-cyan-800",
    icon: "Wind",
    overview:
      "Genç işçi arıların göğüs bölgesindeki solunum borularına (trake) yerleşerek üreyen ve nefes almalarını engelleyen mikroskobik akardır.",
    combSymptoms: [
      "Petek üzerinde doğrudan lezyon yapmaz; kovan içi kış salkımının dağılması ve kışın kovan sönmesiyle anlaşılır.",
    ],
    beeSymptoms: [
      "'K Kanat' Sendromu: Arıların kanatlarının normal duruşunu kaybedip birbirine dik ve asimetrik açılması.",
      "Arıların uçamayıp kovan önündeki otlara tırmanması, yerde sürünmesi.",
      "Göğüs kaslarının felç olması ve titreme.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Mentol Kristalleri: Çıta üstlerine tülbent içinde 50 gr saf mentol kristali koyun (20-25°C buharlaşma).",
        "2. Okaliptüs Yağı (Sineol): Kovan içi buharlaştırma ile solunum yolları temizlenir.",
        "3. Bitkisel Yağlı Şeker Keki: Sıvı yağ + pudra şekeri keki verilerek akarların arı tüylerine tutunması engellenir.",
      ],
      organicTreatment: [
        "Okaliptüs ve nane esansiyel yağları.",
        "Formik asit uygulaması trake akarlarını da öldürür.",
      ],
      culturalAndBiological: [
        "Trake akarına dirençli ırklarla (ör. Karniyol, Kafkas) çalışılması.",
      ],
      prohibitedActions: [],
    },
    preventionTips: [
      "Düzenli formik asit veya okaliptüs aromaterapisi yapılan kovanlarda trake akarı barınamaz.",
    ],
  },

  // --- KATEGORİ 3: YETİŞKİN ARI HASTALIKLARI ---
  {
    id: "nosema",
    name: "Nosema Hastalığı (Nosema Apis & Ceranae)",
    scientificName: "Nosema apis & Nosema ceranae (Mikrosporidya Mantarı)",
    category: "adult",
    categoryName: "Sindirim Sistemi Hastalığı",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-amber-600 text-white border-amber-700",
    icon: "HeartPulse",
    overview:
      "Arıların orta bağırsak epitel hücrelerini tahrip eden, besin emilimini durduran, kışın kovan içi ishal ve ilkbaharda ani nüfus çöküşüne yol açan sinsi hastalıktır.",
    combSymptoms: [
      "Çerçeve çıtalarının üzerinde, petek sırlarında ve kovan iç duvarlarında sarı-kahverengi ishal lekeleri.",
      "Gelişmeyen, petekte yavru alanı genişletilemeyen durgun koloni.",
    ],
    beeSymptoms: [
      "Arıların karınlarının parlak, şişkin ve gergin olması.",
      "Uçamama, kovan önünde kanat çırparak sürünme.",
      "Arının bağırsağı cımbızla çekildiğinde sağlıklı beyaz-pembe halkalı yapı yerine süt beyazı, şiş ve pürüzsüz görünmesi.",
    ],
    rapidFieldTest:
      "Canlı bir arının başı koparılıp iğnesinden cımbızla çekilerek orta bağırsağı incelenir. Sağlıklı bağırsak kahverengimsi kırmızı ve boğumludur; Nosemalı bağırsak ise tebeşir beyazı, mat ve şişmiştir.",
    causesAndTransmission: [
      "Kışlatmada aşırı rutubet, kalitesiz veya ekşimiş bal stoğu.",
      "Arıların uzun kış aylarında dışkılama uçuşuna çıkamaması.",
      "Nosema sporlu eski esmer peteklerin kovanda yıllarca tutulması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovan içi rutubeti derhal giderin; ıslak örtü bezlerini kuru temiz bezlerle değiştirin.",
        "2. İshal lekeli kirli çerçeveleri kovandan derhal çıkarıp dezenfekte edin.",
        "3. İnvert şurup içine doğal kekik yağı ve elma sirkesi katarak besleme yapın.",
      ],
      organicTreatment: [
        "Kekik Yağı & Timol: 1 litre ılık invert şerbete 1 çay kaşığı elma sirkesiyle emülsifiye edilmiş 2 damla saf kekik yağı.",
        "Nozevit / Bitkisel Polifenol Ekstreleri: Meşe kabuğu ve bitkisel tanen içeren doğal şurup katkıları bağırsak epitelini hızla onarır.",
        "Sarımsak Ekstresi: Şerbete az miktarda ezilmiş taze sarımsak suyu katılması antimikrobiyal koruma sağlar.",
      ],
      culturalAndBiological: [
        "Eski esmer peteklerin eritilmesi.",
        "Kışa girmeden önce arıların kaliteli invert şekerle erken sonbaharda beslenmesi.",
      ],
      prohibitedActions: [
        "Fumagillin etken maddeli antibiyotikler Türkiye'de ve AB'de ballarda kalıntı bıraktığı için YASAKTIR; kesinlikle kullanmayınız.",
      ],
    },
    preventionTips: [
      "Kovanlarınızı kışın rutubetsiz ve güneş gören yere koyun.",
      "Kış beslemesini ekim ayına sarkıtmayın.",
    ],
  },
  {
    id: "felc",
    name: "Kronik & Akut Arı Felci Virüsü (CBPV / ABPV)",
    scientificName: "Chronic & Acute Bee Paralysis Virus",
    category: "adult",
    categoryName: "Viral Yetişkin Hastalığı",
    severity: "Orta Risk",
    dangerColor: "bg-purple-700 text-white border-purple-800",
    icon: "AlertTriangle",
    overview:
      "Arıların vücut kıllarını dökerek simsiyah cilalı bir görünüm almasına, titremelerine ve kovan bekçileri tarafından dışarı atılmalarına neden olan viral enfeksiyondur.",
    combSymptoms: [
      "Petek kuluçka alanında ani duraksama, petek üzerinde titreyen siyah arılar.",
    ],
    beeSymptoms: [
      "Tüysüz, simsiyah, yağ sürülmüş gibi parlayan küçük yapılı işçi arılar.",
      "Kovan giriş tahtasında kanatlarını ve gövdelerini kontrolsüzce titreten arılar.",
      "Kovan bekçi arılarının hasta arıları sokup kovandan atmaya çalışması ve uçuş deliğinde arbede.",
    ],
    causesAndTransmission: [
      "Varroa akarlarının virüsü bulaştırması.",
      "Aşırı sıkışık ve havasız kovanlarda arıların birbirine sürtünerek tüylerini dökmesi ve virüsün kütiküladan girmesi.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı havalandırın, kat atarak veya genişleterek arı yoğunluğunun sürtünmesini azaltın.",
        "2. Kovanı besleyin ve ana arıyı gençleştirin.",
        "3. Varroa mücadelesini titizlikle yapın.",
      ],
      organicTreatment: [
        "Hafif şeker şurubuna propolis tentürü damlatılarak arıların bağışıklık sisteminin uyarılması.",
      ],
      culturalAndBiological: [
        "Hijyenik damızlık kraliçe arı değişimi.",
      ],
      prohibitedActions: [],
    },
    preventionTips: [
      "Sıcak yaz günlerinde arıların kovan içinde bunalmasını engelleyecek üst havalandırmayı sağlayın.",
    ],
  },

  // --- KATEGORİ 4: PETEK & FİZYOLOJİK BOZUKLUKLAR ---
  {
    id: "yalanci-ana",
    name: "Yalancı Anaya Kaçma (Laying Workers)",
    scientificName: "İşçi Arıların Yumurtalık Gelişimi",
    category: "comb_disorder",
    categoryName: "Fizyolojik Petek Bozukluğu",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-orange-600 text-white border-orange-700",
    icon: "Users",
    overview:
      "Uzun süre anasız kalan ve yüksük yapacak genç larvası kalmayan kovanda kraliçe feromonunun yokluğu nedeniyle işçi arıların yumurtalıklarının gelişerek dölsüz erkek yumurtaları atmasıdır.",
    combSymptoms: [
      "Gözlerin dibine değil, hücre çeperlerine ve kenarlarına 3-5 adet dağınık, biçimsiz yumurta bırakılması.",
      "'Kambur Yavru' görünümü: İşçi arı petek gözlerine dölsüz erkek arı yumurtası atıldığı için göz kapaklarının dışa doğru kubbe gibi fırlaması.",
      "Petekte düzenli bir kuluçka dairesinin olmaması, dağınık erkek pupaları.",
    ],
    beeSymptoms: [
      "Kovanda normalden çok daha fazla küçük yapılı erkek arının türemesi.",
      "Kovanın tiz ve ağlamaklı bir vızıltı çıkarması, tarlacılığın durması.",
      "Verilen yeni kraliçe memelerini ve ana arıları arıların anında kesip öldürmesi.",
    ],
    rapidFieldTest:
      "Peteğe dikkatlice bakın: Hücre dibinde tek bir dik yumurta yerine kenarlara yapışmış 3-4 adet düzensiz yumurta varsa ve hepsi erkek gözü gibi kubbeliyse koloni yalancı anaya kaçmıştır.",
    treatmentProtocol: {
      urgentActionSteps: [
        "1. UZAKTAN SİLKME YÖNTEMİ: Kovan arılıktan 40-50 metre uzağa taşınır. Tüm çerçeveler yere veya bir örtüye sertçe silkelenir. Uçabilen gerçek tarlacılar eski yerdeki kovanlarına döner; yumurtlayan ağırlaşmış yalancı işçi arılar uçamaz ve yerde kalır.",
        "2. Eski kovana ballı ve bol miktarda AÇIK YAVRULU ve YUMURTALI genç bir çerçeve takviyesi verilir. Genç açık yavrunun salgıladığı kuluçka feromonu işçi arıların yumurtalıklarını köreltir!",
        "3. Koloni sakinleşince kafes içinde kokulu şerbetle genç döllü ana arı kabul ettirilir veya güçlü bir kovanla gazete kağıdı yöntemiyle birleştirilir.",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Zayıf yalancı ana kovanını kurtarmakla vakit kaybetmek yerine, silkip diğer güçlü bir kovanla birleştirmek en pratik ve verimli yoldur.",
      ],
      prohibitedActions: [
        "Yalancı anaya kaçmış kovana doğrudan kafessiz ana arı SALMAYINIZ; arılar hemen sarıp ana arıyı öldürür.",
      ],
    },
    preventionTips: [
      "Kovan kontrollerinde son muayeneden bu yana anasızlık olup olmadığını 7 günde bir kontrol edin; anasız kalan kovana vakit kaybetmeden günlük yumurtalı çerçeve takviye edin.",
    ],
  },
  {
    id: "petek-cokmesi",
    name: "Petek Çökmesi & Sıcak Çarpması",
    scientificName: "Isıl Bal Mumu Deformasyonu",
    category: "comb_disorder",
    categoryName: "Fiziksel Kovan Afeti",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-amber-600 text-white border-amber-700",
    icon: "Thermometer",
    overview:
      "Aşırı sıcak yaz günlerinde (38-42°C) gölgesiz kalan kovanlarda bal mumunun erime sıcaklığına (62-64°C kovan içi mikro-ısınma) yaklaşmasıyla ağır ballı peteklerin kopup kovan tabanına çökmesi ve arıların bala boğulmasıdır.",
    combSymptoms: [
      "Üst çıtaya yapışık peteğin telden sıyrılarak kovan tabanına yığılması.",
      "Kovan tabanında göllenen bal ve boğulan binlerce larva.",
      "Balmumu petek yapısının pelteleşip akması.",
    ],
    beeSymptoms: [
      "Kovan önünde yoğun panik hali, uçuş tahtasında yüzlerce arının çılgınca kanat çırparak (havalandırma) serinletmeye çalışması.",
      "Kovan tabanından dışarı sızan sıcak bal akıntısı.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı derhal gölgeye alın veya üzerine strafor, çuval, sazlık gölgelik örtün.",
        "2. Kovan uçuş deliğine ve üzerine derhal soğuk temiz su püskürtün.",
        "3. Kovanı açıp çöken kırık petekleri ve boğulan balları hemen temizleyin; aksi halde yağmacılık dakikalar içinde başlar!",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Petek telleri takılırken elektrikli tel ısıtıcıyla mumun tele sağlam gömülmesini sağlayın.",
        "Yaz mevsiminde kovan kapaklarını açık renk veya beyaz boyalı kullanın.",
      ],
      prohibitedActions: [
        "Gölgesiz taşlık alanlarda yaz ortasında katlı ağır kovanları kapalı havalandırmayla bırakmayınız.",
      ],
    },
    preventionTips: [
      "Arılıkta daima gölgelik sundurma veya ağaç altı alanları tercih edin.",
      "Yakında mutlaka temiz arı suluğu bulundurun; arılar su taşıyarak buharlaşmayla kovanı 34.5°C'de tutar.",
    ],
  },
  {
    id: "yagmacilik",
    name: "Kovan Yağmacılığı (Robbing)",
    scientificName: "Koloniler Arası Bal Yağması",
    category: "comb_disorder",
    categoryName: "Davranışsal Kovan Afeti",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-rose-700 text-white border-rose-800",
    icon: "ShieldAlert",
    overview:
      "Nektar kıtlığı döneminde güçlü kolonilerin tarlacılarının zayıf veya anasız kovanlara saldırarak ballarını zorla çalması, petekleri parçalaması ve ana arıyı öldürmesidir.",
    combSymptoms: [
      "Petek sırlarının vahşice yırtılmış, parçalanmış ve kovan tabanına balmumu kırıntıları halinde dökülmüş olması.",
      "Ballı gözlerin tamamen boşaltılması ve peteklerin delik deşik edilmesi.",
    ],
    beeSymptoms: [
      "Kovan uçuş deliğinde ve önünde birbirine kenetlenmiş, boğuşan ve sokan yüzlerce arı.",
      "Kovan etrafında keskin, tiz ve sinirli bir uğultuyla vızıldayan yağmacı arılar.",
      "Kovandan çıkan arıların karınlarının tokluktan şişmiş halde güçlükle havalanması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. UÇUŞ DELİĞİNİ ANINDA DARALTIN: Uçuş deliğini sadece TEK BİR ARININ geçebileceği 1 cm genişliğe düşürün.",
        "2. Kovanın önüne cam levha dayayın: Ev sahibi arılar alttan dolanarak girmeyi öğrenirken, kovan kokusunu doğrudan alan yağmacı arılar cama toslar ve giremez.",
        "3. Giriş tahtasına mazotlu veya elma sirkeli bez sürün (yabancı arıların koku kılavuzunu bozar).",
        "4. Durum kontrol edilemiyorsa kovanı akşam kapatıp en az 3 km uzaktaki başka bir arılığa taşıyın.",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Arılıkta zayıf kovan bırakmayın; 2-3 çerçevelik zayıf kovanları birleştirin.",
        "Beslemeleri KESİNLİKLE gündüz güneş altında yapmayın; sadece güneş battıktan sonra akşam saatinde kovan içine verin.",
      ],
      prohibitedActions: [
        "Arılıkta etrafa şerbet veya bal damlatmayınız.",
        "Kovan kapaklarını gündüz uzun süre açık tutmayınız.",
      ],
    },
    preventionTips: [
      "Sonbaharda nektar akımı bittiğinde tüm kovanların giriş deliklerini önceden daraltın.",
      "İçten besleme kapları (çerçeve tipi şerbetlik) kullanın; dıştan yemleme yapmayın.",
    ],
  },
  {
    id: "zehirlenme",
    name: "Zirai İlaç / Pestisit Zehirlenmesi",
    scientificName: "Neonikotinoid & İnsektisit Toksikasyonu",
    category: "adult",
    categoryName: "Kimyasal Çevre Toksikasyonu",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-red-800 text-white border-red-900",
    icon: "ShieldAlert",
    overview:
      "Tarım arazilerinde bilinçsizce çiçeklenme döneminde sıkılan tarım ilaçlarının (özellikle neonikotinoidler ve böcek ilaçları) tarlacı arılar tarafından nektar ve polenle kovana taşınması sonucu yaşanan kitle katliamıdır.",
    combSymptoms: [
      "Petek kuluçka alanlarında bakıcı arı kalmadığı için yavruların ölmesi ve kovanın üşümesi.",
      "Gözlerdeki taze polenlerin zehirli kalıntı taşıması.",
    ],
    beeSymptoms: [
      "Kovan önünde halı gibi serilmiş binlerce ölü veya can çekişen arı yığını.",
      "Arıların dillerinin (hortumlarının) dışarı fırlamış vaziyette ölmesi (karakteristik zehirlenme belirtisi!).",
      "Arıların bacaklarında felç, dönerek kendi etrafında fırıldak gibi dönme ve hırçınlaşma.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanları derhal ilaçlama yapılan bölgenin en az 5 km dışına taşıyın.",
        "2. Zehir bulaşmış taze polenli çerçeveleri kovandan derhal çıkarıp imha edin.",
        "3. Koloniyi temiz su ve 1:1 hafif şeker şurubuyla bolca besleyerek zehrin yıkanmasını sağlayın.",
      ],
      organicTreatment: [
        "Aktif kömür tozu veya temiz şerbet ile vücuttan toksin atılımını destekleme.",
      ],
      culturalAndBiological: [
        "Çiftçiler ve ilçe tarım müdürlüğü ile koordinasyon kurup ilaçlamaların akşam saatinde ve çiçeklenme bittikten sonra yapılmasını talep edin.",
      ],
      prohibitedActions: [
        "Zehirlenmiş arıların getirdiği polenleri insani tüketim veya kovan beslemesi için KESİNLİKLE kullanmayınız.",
      ],
    },
    legalStatus: "İlçe Tarım Müdürlüğü'ne tutanak tutturularak tazminat davası açılabilir.",
    preventionTips: [
      "Meyve bahçeleri, pamuk ve kanola ekim alanlarına yakın konaklarken çiftçilerle iletişim grubu kurun.",
    ],
  },
  {
    id: "eski-petek-dejenerasyonu",
    name: "Eski Esmer & Siyah Petek Dejenerasyonu",
    scientificName: "Pupa Kılıfı & Patojen Rezervuarı",
    category: "comb_disorder",
    categoryName: "Petek Yapısal Kusuru & Hijyen",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-stone-800 text-white border-stone-900",
    icon: "Layers",
    overview:
      "3 yıldan uzun süre kovan içinde kullanılan, her yavru çıkışında bırakılan pupa gömlekleri ve propolis nedeniyle hücre çapı daralan, rengi zift gibi kararan ve patojen biriktiren peteklerdir. Yavru arıların cüceleşmesine ve hastalık patlamalarına yol açar.",
    combSymptoms: [
      "Peteğin zift siyahı veya koyu kahverengi olması, ışığa tutulduğunda arkasının hiç görünmemesi.",
      "Petek hücre çapının 5.4 mm'den 4.8 mm ve altına daralması.",
      "Petek ağırlığının aşırı artması (bal mumu yerine gömlek ve propolis ağırlığı).",
      "Hücre tabanında eski polen ve mum güvesi kalıntılarının taşlaşması.",
    ],
    beeSymptoms: [
      "Çıkan genç işçi arıların normalden %15-20 daha küçük ve cüce yapılı olması.",
      "Koloni bağışıklığının çökmesi, yavru hastalıklarına karşı aşırı hassasiyet.",
      "Tarlacı arıların taşıma kapasitesinin (kursak hacmi) düşmesi.",
    ],
    rapidFieldTest:
      "Peteği güneşe doğru tutun: Eğer petek gözlerinin arkasından güneş ışığı zerre kadar sızmıyorsa ve petek kalınlaşmışsa o petek en az 3 yaşındadır ve derhal imha edilmelidir.",
    causesAndTransmission: [
      "Petek yenileme takviminin ihmal edilmesi.",
      "Maliyetten kaçarak eski kararmış çerçevelerin kuluçkalıkta sürekli tutulması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. İlkbahar ve sonbahar revizyonlarında kararmış çerçeveleri kuluçkalığın kenarlarına (1 ve 10. çıtalara) kaydırın.",
        "2. Yavru çıkışı biter bitmez kovandan çıkarıp buharlı eritme kazanına gönderin.",
        "3. Yerlerine taze ham petek veya yeni kabartılmış açık renkli petek verin.",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Altın %30 Kuralı: Bir kovandaki kuluçkalık peteklerinin her yıl en az 3 tanesi (%30) yenilenmelidir. Böylece hiçbir petek 3 yıldan eski kalmaz.",
        "Ahşap çıtalar %4'lük kaynar kostik soda suyunda yıkanıp güneşte kurutulmalıdır.",
      ],
      prohibitedActions: [
        "Kararmış esmer petekleri sakın kışlatmada veya ballık katında kullanmayınız; balın rengini karartır ve kalıntı bırakır.",
      ],
    },
    preventionTips: [
      "Çıtaların üst kulaklarına kurşun kalemle yapım yılını yazın (ör: 2024, 2025); 3. yılın sonunda otomatik ıskartaya ayırın.",
    ],
  },
  {
    id: "tropilaelaps",
    name: "Tropilaelaps Akarları (Tropilaelaps clareae & mercedesae)",
    scientificName: "Tropilaelaps spp. (Asya Yavru Akarları)",
    category: "pest",
    categoryName: "İstilacı Dış Parazit",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-red-700 text-white border-red-800",
    icon: "ShieldAlert",
    overview:
      "Güneydoğu Asya kökenli, Varroa'dan daha hızlı koşan, daha hızlı üreyen ve kuluçka alanlarında doğrudan pupaları tüketerek kovanı haftalar içinde söndürebilen, dünya arıcılığının en büyük yeni biyolojik tehdididir.",
    combSymptoms: [
      "Petek kuluçka deseninin paramparça olması; delinmiş ve boşaltılmış yavru gözleri.",
      "Gözlerin içinde hızla kaçışan, Varroa'dan daha ince uzun (kırmızımsı kahve) minik akarlar.",
      "Ölü ve deforme olmuş pupa kalıntıları.",
    ],
    beeSymptoms: [
      "Uçamayan, kanatları eksik, karınları kısalmış tarlacı ve bakıcı arılar.",
      "Kovan tabanında ve petek üzerinde Varroa'dan çok daha çevik ve hızlı hareket eden parazitler.",
      "Koloninin savunmasız kalıp topluca kovanı terk etmesi (kaçış sürüsü).",
    ],
    rapidFieldTest:
      "Yavru gözleri açıldığında akar Varroa gibi yavaş değil; saniyede birkaç santimetre hızla koşarak saklanmaya çalışır. Vücudu yuvarlak değil, uzamış elips şeklindedir.",
    causesAndTransmission: [
      "Uluslararası arı ve ana arı kaçakçılığı, göçer arıcılık rotaları.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Türkiye'de görülmesi durumunda derhal Tarım ve Orman İl Müdürlüğü'ne resmi ihbarda bulunun.",
        "2. Tropilaelaps yetişkin arı üzerinde 2-3 günden fazla yaşayamaz (ağız yapısı sert arı kütikülasını delemeyecek kadar küçüktür); sadece yavruyla beslenir!",
        "3. Kuluçka Kırma Yöntemi: Ana arıyı 9-14 gün kafesleyerek kovanı tamamen yavrusuz bırakın; tüm Tropilaelaps akarları açlıktan ölür!",
      ],
      organicTreatment: [
        "Formik Asit Buharlaştırma: Hücre içine nüfuz ederek akarları hızla öldürür.",
      ],
      culturalAndBiological: [
        "Bölme yaparak yapay kuluçkasız dönem oluşturma.",
      ],
      prohibitedActions: [
        "Bulaşık kolonilerden başka kovanlara açık yavrulu çerçeve aktarmayınız.",
      ],
    },
    legalStatus: "Dünya Hayvan Sağlığı Örgütü (WOAH) ve Türkiye ihbarı zorunlu karantina zararlısıdır.",
    preventionTips: [
      "Karantinasız ana arı ve paket arı girişlerine izin vermeyin.",
    ],
  },
  {
    id: "esek-arisi",
    name: "Eşek Arısı & Asya Eşek Arısı (Vespa crabro / orientalis / velutina)",
    scientificName: "Vespa crabro & Vespa orientalis & Vespa velutina",
    category: "pest",
    categoryName: "Yırtıcı Kovan Avcısı",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-amber-800 text-white border-amber-900",
    icon: "Bug",
    overview:
      "Ağustos-Ekim aylarında kovan girişinde havada asılı kalarak tarlacı arıları yakalayan, kafasını koparıp göğüs kaslarını yavrularına götüren ve zayıf kovanları basıp petekleri ve balı talan eden dev avcı böceklerdir.",
    combSymptoms: [
      "Kovan içine girdiklerinde petekleri parçalarlar, yavru ve balları yağmalarlar.",
    ],
    beeSymptoms: [
      "Kovan uçuş deliğinde arıların korkudan dışarı çıkamaması; uçuş felci.",
      "Kovan önünde kafası veya karnı koparılmış yarım arı ölüleri.",
      "Arıların eşek arısını görünce topluca kümelenip 'ısı topu' (heat-balling) oluşturarak 46°C'de eşek arısını pişirmeye çalışması.",
    ],
    rapidFieldTest:
      "Kovan önünde havada asılı kalan veya kovan uçuş tahtasında arı avlayan 2.5 - 3.5 cm büyüklüğünde dev sarıca veya koyu renkli eşek arıları.",
    causesAndTransmission: [
      "Sonbaharda doğada böcek kıtlığı ve eşek arısı kolonilerinin maksimum nüfusa ulaşması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovan girişlerine Eşek Arısı Kovan Koruma Izgarası (arıların geçebildiği, eşek arısının giremediği 8 mm delikli ızgara) takın.",
        "2. Kovan önlerine Pet Şişe Kapanı yerleştirin: Pet şişenin üst kısmını huni gibi kesip ters takın; içine 1 bardak bira + 2 kaşık şeker + 1 parça çiğ ciğer/balık koyun (bira kokusu bal arısını çekmez, eşek arısını cezbeder!).",
        "3. Arılık etrafındaki eşek arısı yuvalarını akşam karanlığında tespit edip imha edin.",
      ],
      organicTreatment: [
        "Bira + sirke + fermente meyve suyu içerikli özel seçici feromon ve koku tuzakları.",
      ],
      culturalAndBiological: [
        "İlkbaharda görülen İLK Kraliçe Eşek Arılarını öldürün; baharda öldürülen 1 ana eşek arısı, sonbaharda 2.000 eşek arısının doğmasını engeller!",
      ],
      prohibitedActions: [
        "Tuzaklara saf bal veya saf şerbet koymayınız; kendi bal arılarınızı da tuzağa çekip boğarsınız.",
      ],
    },
    preventionTips: [
      "Sonbaharda kovan deliklerini daraltın ve kolonileri güçlü tutun.",
    ],
  },
  {
    id: "ari-biti",
    name: "Arı Biti (Braula coeca)",
    scientificName: "Braula coeca (Kanatsız Diptera Sineği)",
    category: "pest",
    categoryName: "Dış Kommensal Parazit",
    severity: "Orta Risk",
    dangerColor: "bg-yellow-700 text-white border-yellow-800",
    icon: "Bug",
    overview:
      "Gerçek bir bit veya kene olmayıp kanatları körelmiş bir sinek türüdür. Özellikle kraliçe arının ve bakıcı arıların sırtına tutunarak ağızlarına gelen arı sütünü ve balı çalarak beslenir.",
    combSymptoms: [
      "Sırlı peteklerin üzerinde ince tüneller ve beyaz çizgiler (larvaları petek sırının altındaki bal mumu ve polenle beslenir).",
      "Peteğin sır tabakasının çatlaklı ve tünelli görünmesi.",
    ],
    beeSymptoms: [
      "Kraliçe arının veya işçi arıların göğüs (toraks) kısmına yapışmış 1.5 mm boyutunda kırmızımsı kahverengi böcekler.",
      "Kraliçe arının rahatsız olup yumurtlamayı azaltması.",
    ],
    causesAndTransmission: [
      "Yetersiz dumanlama ve zayıf koloniler.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovan körüğüne tütün yaprağı veya kurutulmuş kekik/ceviz yaprağı ekleyerek dumanlama yapın; arı bitleri duman etkisiyle arının üzerinden uyuşarak dip tablasına düşer.",
        "2. Kovan dip tablasına vazelinli beyaz kağıt serin ve düşen bitleri toplayıp yakın.",
      ],
      organicTreatment: [
        "Varroa için uygulanan Formik Asit ve Timol dumanlaması arı bitlerini de %100 döker.",
      ],
      culturalAndBiological: [
        "Peteklerin sırlarını sır bıçağıyla açıp larvaların yok edilmesi.",
      ],
      prohibitedActions: [],
    },
    preventionTips: [
      "Düzenli varroa mücadelesi yapılan kovanlarda arı biti hiçbir zaman barınamaz.",
    ],
  },
  {
    id: "deforme-kanat-virusu",
    name: "Deforme Kanat Virüsü (DWV - Deformed Wing Virus)",
    scientificName: "DWV RNA Iflaviridae",
    category: "adult",
    categoryName: "Viral Enfeksiyon (Varroa Kaynaklı)",
    severity: "Yüksek Tehlike",
    dangerColor: "bg-purple-800 text-white border-purple-900",
    icon: "AlertTriangle",
    overview:
      "Varroa akarlarının arının yağ dokusunu emerken enjekte ettiği, genç arıların kanatlarının hiç gelişmemesine, güdük kalmasına, karınlarının kısalmasına ve ömürlerinin kısalmasına neden olan en yaygın virüstür.",
    combSymptoms: [
      "Kuluçka gözlerinde delinmeler ve erken açılmalar.",
      "Gözlerde susam benzeri Varroa akarları.",
    ],
    beeSymptoms: [
      "Kanatları buruşuk, kıvrık, küt veya tüy gibi zayıf genç arılar.",
      "Arıların uçamayarak kovan önündeki toprağa dökülmesi ve sürünmesi.",
      "Koloninin tarlacı yapamaması ve hızla sönüşe geçmesi.",
    ],
    rapidFieldTest:
      "Yeni çıkmış genç arılara bakın: Eğer kanatları buruşuk ve küçükse ve sırtlarında varroa varsa koloni DWV virüs yükü altındadır.",
    causesAndTransmission: [
      "Varroa yoğunluğunun %3'ün üzerine çıkması (Varroa en büyük vektördür).",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Virüsün doğrudan ilacı yoktur; TEK ÇÖZÜM VARROA YÜKÜNÜ SIFIRA İNDİRMEKTİR!",
        "2. Formik asit veya oksalik asit ile acil varroa şoklaması uygulayın.",
        "3. Koloniyi C vitamini (limon/askorbik asit) ve kekik yağı katkılı invert şerbetle besleyin.",
      ],
      organicTreatment: [
        "Propolis tentürü ve doğal elma sirkesi ile arıların bağışıklığını yükseltme.",
      ],
      culturalAndBiological: [
        "Varroa direnci ve hijyen davranışı (VSH) yüksek ana arı edinilmesi.",
      ],
      prohibitedActions: [
        "Antibiyotik vermeyiniz; antibiyotikler virüslere etki etmez, bağırsak florasını çökertir.",
      ],
    },
    preventionTips: [
      "Bal hasadından hemen sonra Ağustos ayında varroa mücadelesini başlatın.",
    ],
  },
  {
    id: "siyah-kralice-virusu",
    name: "Siyah Kraliçe Hücresi Virüsü (BQCV)",
    scientificName: "Black Queen Cell Virus",
    category: "brood",
    categoryName: "Viral Ana Arı Hastalığı",
    severity: "Orta Risk",
    dangerColor: "bg-indigo-800 text-white border-indigo-900",
    icon: "Crown",
    overview:
      "Özellikle ana arı yetiştiriciliğinde larvaların ve pupaların ana arı yüksüğü içinde kararıp çürümesine neden olan virüstür. Genellikle Nosema apis enfeksiyonu ile birlikte seyreder.",
    combSymptoms: [
      "Ana arı yüksüklerinin (memelerinin) içindeki larvanın sarıdan siyaha dönmesi.",
      "Yüksük duvarlarının kömürleşmiş gibi koyulaşması ve pupanın ölmesi.",
    ],
    beeSymptoms: [
      "Koloninin ana arı yenileyememesi veya yüksüklerin tutmaması.",
      "Nosema belirtileriyle birlikte seyir.",
    ],
    causesAndTransmission: [
      "Nosema parazitinin virüsün bağırsaktan dokulara geçişini kolaylaştırması.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Nosema tedavisini başlatın (Kekik yağı, Nozevit veya invert şurup).",
        "2. Kararmış yüksükleri kesip imha edin.",
        "3. Ana arı yetiştirme çıtalarını ve kovanları pürmüzle dezenfekte edin.",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Damızlık kolonileri Nosemasız ve güçlü tutun.",
      ],
      prohibitedActions: [],
    },
    preventionTips: [
      "İlkbahar ana arı üretiminden önce başlatıcı ve bitirici kovanları Nosema kontrolünden geçirin.",
    ],
  },
  {
    id: "aclik-soguk-vurgunu",
    name: "Açlık Krizleri & Kışlatma Soğuk Vurgunu",
    scientificName: "Koloni İçi Enerji & Isı Çöküşü",
    category: "comb_disorder",
    categoryName: "Yönetimsel Kovan Felaketi",
    severity: "Kritik (Acil İhbar)",
    dangerColor: "bg-blue-800 text-white border-blue-900",
    icon: "Thermometer",
    overview:
      "Kış sonu ve erken ilkbaharda (Şubat-Mart) kovan içi bal kemerlerinin tükenmesi veya arı salkımının 5 cm ötedeki bala soğuk yüzünden ulaşamaması sonucu tüm koloninin kovan içinde donarak veya aç kalarak ölmesidir.",
    combSymptoms: [
      "Arıların kafalarını petek gözlerinin dibine sokmuş, kuyrukları dışarıda kalmış vaziyette topluca donup ölmeleri (karakteristik açlık duruşu!).",
      "Peteklerde tek bir damla sırlı balın kalmamış olması.",
      "Petek kuluçka alanının etrafında bal kemerinin sıfırlanması.",
    ],
    beeSymptoms: [
      "Kovan tabanında ve çıta aralarında binlerce ölü arı.",
      "Kovanda hiç vızıltı olmaması, kapağa vurulduğunda ses gelmemesi.",
      "Kovanın tüy gibi hafiflemiş olması.",
    ],
    rapidFieldTest:
      "Arılar petek gözlerine kafalarını gömmüş ve kıçları dışarıda kaskatı duruyorsa, kovan kesinlikle AÇLIKTAN ölmüştür.",
    causesAndTransmission: [
      "Sonbaharda kış beslemesinin eksik yapılması.",
      "Erken ilkbaharda yavru faaliyeti başlayınca bal tüketiminin 4 katına çıkması.",
      "Kovanın aşırı geniş tutulup arıların salkımı terk edememesi.",
    ],
    treatmentProtocol: {
      urgentActionSteps: [
        "1. Kovanı derhal sıcak bir odaya alın (eğer henüz can çekişen arılar varsa).",
        "2. Çerçevelerin hemen üstüne, arı salkımının tam tepesine doğrudan Arı Keki veya Fondan Şeker torbası yerleştirin.",
        "3. Ilık koyu şerbeti (2:1) boş bir peteğin gözlerine döküp salkımın hemen bitişiğine koyun.",
        "4. Kovanı bölme tahtasıyla sıkıştırıp straforla yalıtın.",
      ],
      organicTreatment: [],
      culturalAndBiological: [
        "Her kovana kışa girerken en az 15-20 kg kapalı sırlı bal bırakılmalıdır.",
      ],
      prohibitedActions: [
        "Soğuk kış günlerinde kovan içine SIVI ŞERBET KESİNLİKLE VERMEYİNİZ! Sıvı şerbet kovan içi nemi artırır, arıları ishal yapar ve dondurur; sadece FONDAN ŞEKER KEKİ verilir.",
      ],
    },
    preventionTips: [
      "Kovan ağırlıklarını Şubat ayında elle tartarak kontrol edin; hafifleyen kovanlara hemen fondan kek koyun.",
    ],
  },
];

export const SYMPTOM_CHECKER_LIST = [
  {
    id: "symp-1",
    label: "Petek gözleri delikli, içeri çökmüş ve koyulaşmış",
    possibleDiseases: ["Amerikan Yavru Çürüklüğü (AYÇ)", "Avrupa Yavru Çürüklüğü (EYÇ)", "Varroa Akarları"],
    primaryMatch: "ayc",
  },
  {
    id: "symp-2",
    label: "Kibrit çöpü testinde kitle sakız gibi 2-3 cm uzuyor",
    possibleDiseases: ["Amerikan Yavru Çürüklüğü (AYÇ)"],
    primaryMatch: "ayc",
  },
  {
    id: "symp-3",
    label: "Açık larvalar 'C' harfi gibi kıvrık sararmış, ekşi koku var",
    possibleDiseases: ["Avrupa Yavru Çürüklüğü (EYÇ)"],
    primaryMatch: "eyc",
  },
  {
    id: "symp-4",
    label: "Petek ve kovan önünde beyaz/gri tebeşir gibi taşlaşmış larvalar",
    possibleDiseases: ["Kireç Hastalığı (Chalkbrood)"],
    primaryMatch: "kirec",
  },
  {
    id: "symp-5",
    label: "Peteklerde beyaz ipeksi örümcek ağları, tüneller ve siyah tozlar",
    possibleDiseases: ["Balmumu Güvesi (Büyük & Küçük Güve)"],
    primaryMatch: "guve",
  },
  {
    id: "symp-6",
    label: "Kanatları güdük/eksik arılar, sırtlarda kahverengi susam akarları",
    possibleDiseases: ["Varroa Akarları", "Deforme Kanat Virüsü (DWV)", "Tulumsu Yavru Çürüklüğü"],
    primaryMatch: "varroa",
  },
  {
    id: "symp-7",
    label: "Göz çeperlerine çok sayıda düzensiz yumurta, kambur erkek gözleri",
    possibleDiseases: ["Yalancı Anaya Kaçma (Laying Workers)"],
    primaryMatch: "yalanci-ana",
  },
  {
    id: "symp-8",
    label: "Kovan önünde sürünme, şiş karın, çıtalarda sarı/kahve ishal lekeleri",
    possibleDiseases: ["Nosema Hastalığı (Nozemozis)"],
    primaryMatch: "nosema",
  },
  {
    id: "symp-9",
    label: "Tüysüz, cilalı gibi simsiyah parlayan arılar, titreme nöbeti",
    possibleDiseases: ["Kronik & Akut Arı Felci Virüsü (CBPV)"],
    primaryMatch: "felc",
  },
  {
    id: "symp-10",
    label: "Uçuş deliğinde şiddetli boğuşma, petek sırlarının parçalanması",
    possibleDiseases: ["Kovan Yağmacılığı (Robbing)"],
    primaryMatch: "yagmacilik",
  },
  {
    id: "symp-11",
    label: "Kovan önünde dilleri dışarıda yığılmış binlerce ölü arı",
    possibleDiseases: ["Zirai İlaç / Pestisit Zehirlenmesi"],
    primaryMatch: "zehirlenme",
  },
  {
    id: "symp-12",
    label: "Larva başı yukarı kalkık, içi su dolu tulum torbası gibi tek parça çıkıyor",
    possibleDiseases: ["Tulumsu Yavru Çürüklüğü (Sacbrood - SBV)"],
    primaryMatch: "tulumsu",
  },
  {
    id: "symp-13",
    label: "Petekler zift gibi simsiyah, hücreler daralmış, arılar cüceleşiyor",
    possibleDiseases: ["Eski Esmer & Siyah Petek Dejenerasyonu"],
    primaryMatch: "eski-petek-dejenerasyonu",
  },
  {
    id: "symp-14",
    label: "Petek üzerinde çok hızlı koşan minik eliptik kırmızı-kahve akarlar",
    possibleDiseases: ["Tropilaelaps Akarları"],
    primaryMatch: "tropilaelaps",
  },
  {
    id: "symp-15",
    label: "Kovan önünde 3 cm büyüklüğünde dev arılar, havada arı avlanması",
    possibleDiseases: ["Eşek Arısı & Asya Eşek Arısı"],
    primaryMatch: "esek-arisi",
  },
  {
    id: "symp-16",
    label: "Arılar kafalarını hücre diplerine sokmuş, petekte hiç bal yok",
    possibleDiseases: ["Açlık Krizleri & Kışlatma Soğuk Vurgunu"],
    primaryMatch: "aclik-soguk-vurgunu",
  },
  {
    id: "symp-17",
    label: "Kraliçe arının sırtında yapışmış küçük kahverengi sinekler",
    possibleDiseases: ["Arı Biti (Braula coeca)"],
    primaryMatch: "ari-biti",
  },
  {
    id: "symp-18",
    label: "Ana arı yüksükleri siyahlaşıp kömürleşmiş, pupa ölümleri",
    possibleDiseases: ["Siyah Kraliçe Hücresi Virüsü (BQCV)"],
    primaryMatch: "siyah-kralice-virusu",
  },
];

export const COMMON_TREATMENT_OPTIONS = [
  {
    id: "treat-formic-flash",
    name: "Formik Asit (%65 Buharlaştırma)",
    type: "organic_acid" as const,
    withdrawalDays: 14,
    tempRange: "12°C - 25°C",
    standardDosage: "Kovan başına günlük 10-15 ml (özel buharlaştırıcı aparat ile)",
    description: "Kapalı yavru gözlerinin içine nüfuz eden tek organik asittir. Bal akımı öncesi uygulanır.",
  },
  {
    id: "treat-oxalic-glycerin",
    name: "Oksalik Asit + Gliserin Şerit/Havlu",
    type: "organic_acid" as const,
    withdrawalDays: 0,
    tempRange: "10°C - 30°C",
    standardDosage: "Kovan başına 2 adet emdirilmiş karton/selüloz şerit (100g oksalik + 100ml saf gliserin)",
    description: "Uzun salınımlı (4-6 hafta) temas yoluyla varroa dökümü. Balda kalıntı bırakmaz.",
  },
  {
    id: "treat-oxalic-sublimation",
    name: "Oksalik Asit Süblimasyon (Buharlaştırma)",
    type: "organic_acid" as const,
    withdrawalDays: 0,
    tempRange: "2°C - 10°C (Kış Yavrusuz Dönem)",
    standardDosage: "Kovan başına 2 gram saf dihidrat oksalik asit tozu (buharlaştırıcı rezistans ile)",
    description: "Kış salkımında yavrusuz kolonide %98 üzerinde kesin varroa temizliği sağlar.",
  },
  {
    id: "treat-oxalic-trickle",
    name: "Oksalik Asit Damlatma Yöntemi",
    type: "organic_acid" as const,
    withdrawalDays: 0,
    tempRange: "0°C - 8°C (Kış Salkımı)",
    standardDosage: "Çıta arasına 5 ml ılık şekerli solüsyon (1L 1:1 şerbete 35g oksalik asit)",
    description: "Yılda sadece 1 kez kış salkımında uygulanır; arıların sindirimine zarar vermemesi için tekrarlanmaz.",
  },
  {
    id: "treat-lactic-acid",
    name: "Laktik Asit (%15 Püskürtme)",
    type: "organic_acid" as const,
    withdrawalDays: 0,
    tempRange: "10°C - 20°C",
    standardDosage: "Çerçeve başına 5-8 ml ince buğu şeklinde püskürtme",
    description: "İlkbahar başlangıcında ve oğul kovanlarda yavru henüz azken son derece güvenli ve etkilidir.",
  },
  {
    id: "treat-thymol",
    name: "Timol Kristalleri & Kekik Yağı Jeli",
    type: "essential_oil" as const,
    withdrawalDays: 21,
    tempRange: "15°C - 30°C",
    standardDosage: "Kovan başına 15-20 gr jel plaka (çıta üstlerine konulur)",
    description: "Bala koku geçebileceği için bal akımından en az 3 hafta önce kovanlardan çıkarılmalıdır.",
  },
  {
    id: "treat-nozevit",
    name: "Nozevit / Bitkisel Polifenol (Nosema)",
    type: "herbal" as const,
    withdrawalDays: 0,
    tempRange: "Mevsim bağımsız",
    standardDosage: "1 litre şerbete 1 ml Nozevit (veya kekik yağı-sirke emülsiyonu)",
    description: "Arının bağırsak florasını onarır, Nosema apis ve ceranae sporlarına karşı doğal kalkandır.",
  },
  {
    id: "treat-drone-comb",
    name: "Erkek Arı Gözlü Petek Tuzağı",
    type: "biological_cultural" as const,
    withdrawalDays: 0,
    tempRange: "İlkbahar - Yaz",
    standardDosage: "Kovan başına 1 adet kılavuz erkek çıtası; gözler kapandığında kesilip imha edilir",
    description: "Kimyasalsız biyolojik yöntem. Varroa akarlarının %80'i erkek gözlerini tercih eder.",
  },
  {
    id: "treat-shook-swarm",
    name: "Çifte Silkme Yöntemi (Shook Swarm)",
    type: "quarantine_action" as const,
    withdrawalDays: 0,
    tempRange: "Bal akımı dışı 15°C+",
    standardDosage: "Tüm eski petekler imha edilir, arılar ham petekli yeni steril kovana silkelenir",
    description: "Hafif AYÇ ve ağır yavru çürüklüklerinde koloniyi kurtaran altın cerrahi yöntem.",
  },
  {
    id: "treat-freezer-shock",
    name: "Derin Dondurucu Petek Şoklama (-18°C)",
    type: "biological_cultural" as const,
    withdrawalDays: 0,
    tempRange: "Depolama öncesi",
    standardDosage: "Tüm kabarmış petekler 24 saat -18°C'de tutulur",
    description: "Mum güvesi yumurta, larva ve pupalarını kimyasalsız %100 öldürür.",
  },
];

// ==========================================
// AYLIK HASTALIK YOĞUNLUK & ISINMA MATRİSİ
// ==========================================
export interface HeatmapMonthCell {
  monthIndex: number;
  monthName: string;
  score: number; // 0: Güvenli/Minimal, 1: Düşük, 2: Orta, 3: Yüksek, 4: PİK TEHLİKE
  label: "Güvenli" | "Düşük Risk" | "Orta Risk" | "Yüksek Tehlike" | "Pik Kriz";
  colorClass: string;
  seasonCause: string;
  actionAdvice: string;
}

export interface DiseaseHeatmapRow {
  diseaseId: string;
  name: string;
  category: "brood" | "pest" | "adult" | "comb_disorder";
  categoryName: string;
  peakPeriodText: string;
  highestRiskRegions: string[];
  months: HeatmapMonthCell[];
}

export const MONTH_NAMES = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
export const FULL_MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function createRow(
  diseaseId: string,
  name: string,
  category: "brood" | "pest" | "adult" | "comb_disorder",
  categoryName: string,
  peakPeriodText: string,
  highestRiskRegions: string[],
  scores: number[],
  causes: string[],
  actions: string[]
): DiseaseHeatmapRow {
  const months: HeatmapMonthCell[] = MONTH_NAMES.map((mName, idx) => {
    const sc = scores[idx];
    let label: HeatmapMonthCell["label"] = "Güvenli";
    let colorClass = "bg-stone-50 text-stone-600 border-stone-200";

    if (sc === 1) {
      label = "Düşük Risk";
      colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (sc === 2) {
      label = "Orta Risk";
      colorClass = "bg-amber-100 text-amber-900 border-amber-300 font-semibold";
    } else if (sc === 3) {
      label = "Yüksek Tehlike";
      colorClass = "bg-orange-500 text-white border-orange-600 font-bold";
    } else if (sc === 4) {
      label = "Pik Kriz";
      colorClass = "bg-rose-600 text-white border-rose-700 font-black shadow-xs ring-1 ring-rose-400";
    }

    return {
      monthIndex: idx,
      monthName: mName,
      score: sc,
      label,
      colorClass,
      seasonCause: causes[idx] || "Mevsimsel standart durum.",
      actionAdvice: actions[idx] || "Rutin kovan kontrollerine devam ediniz.",
    };
  });

  return {
    diseaseId,
    name,
    category,
    categoryName,
    peakPeriodText,
    highestRiskRegions,
    months,
  };
}

export const DISEASE_HEATMAP_DATA: DiseaseHeatmapRow[] = [
  createRow(
    "varroa",
    "Varroa Akarları (Varroa Destructor)",
    "pest",
    "Parazit & Virüs Vektörü",
    "Ağustos - Ekim (Hasat Sonu Piki) & Nisan",
    ["Ege (Muğla Basra)", "Akdeniz", "Marmara (Ayçiçeği)", "Tüm Türkiye"],
    [1, 1, 2, 3, 3, 2, 3, 4, 4, 3, 2, 2],
    [
      "Kış salkımı: Kuluçkasız dönem. Akarlar arı üzerinde açıkta.",
      "Kış sonu salkımı: İlk kuluçka başlamadan son fırsat.",
      "İlkbahar yavru faaliyeti başlar; akarlar erkek gözlerine hücum eder.",
      "Kuluçka alanı genişler; akar çoğalma hızı geometrik artar.",
      "Bal akımı öncesi son pencere; koloni popülasyonu zirvede.",
      "Bal akımı süreci; bala kalıntı bırakmamak için kimyasallar yasaktır.",
      "Bal akımı biter; yavru alanı daralırken arı başına akar yükü katlanır.",
      "HASAT SONU PİK KRİZ: Kış arılarını varroa virüslerinden korumak için 1 numaralı kritik ay!",
      "PİK SEZON: Doğacak kış arılarının sağlıklı olması için acil organik asit kürü.",
      "Sonbahar ikinci ilaçlama penceresi; erkek gözleri ve yavru azalır.",
      "Yavru kesilir; akarlar dışarıda kalır.",
      "Kış salkımı başlar: Yavrusuz kolonide %98 süblimasyon/damlatma vakti."
    ],
    [
      "Oksalik asit süblimasyon kürü yapın.",
      "Hafif günlerde dip tablasını kontrol edin.",
      "Erkek arı gözlü çerçeve tuzağını yerleştirin.",
      "Erkek gözlerini sırlandığında kesip imha edin.",
      "Laktik asit buğulama veya formik asit kısa süreli flaş uygulayın.",
      "Sadece erkek gözü kesme ve mekanik dip tablası temizliği yapın.",
      "Bal sağımı biter bitmez kovanlara formik asit buharlaştırıcı yerleştirin.",
      "Formik asit (%65) veya Oksalik asit+gliserin şeritlerini derhal asın.",
      "Timol jeli veya ikinci seans formik asit buharlaştırmayı tamamlayın.",
      "Doğal döküm sayımı yapın; günde 2'den fazla akar varsa müdahale edin.",
      "Kovanları kış düzenine sokun, dip tahtası telini temizleyin.",
      "Hava 2-6°C iken oksalik asit süblimasyon veya damlatma yapın."
    ]
  ),
  createRow(
    "ayc",
    "Amerikan Yavru Çürüklüğü (AYÇ)",
    "brood",
    "Bakteriyel Petek Hastalığı",
    "Mayıs - Temmuz (Yoğun Kuluçka & Yağma Dönemi)",
    ["İç Anadolu", "Ege", "Karadeniz", "Doğu Anadolu"],
    [0, 0, 1, 3, 4, 4, 4, 3, 2, 1, 0, 0],
    [
      "Kış dönemi: Sporlar uykuda.",
      "Kışlatma: Belirti vermez.",
      "İlk kuluçka artışı; eski esmer peteklerden bulaşma riski başlar.",
      "Kuluçka patlaması: Bakıcı arılar sporlu larvaları beslemeye başlar.",
      "PİK DÖNEMİ: Kovan içi yavru yoğunluğunda delikli ve çökmüş sırlar artar.",
      "PİK DÖNEMİ: İlerlemiş kovanların komşu kovanlarca yağmalanması riski.",
      "Bal akımı sonu nektar kıtlığında zayıf hasta kovanlar yağmalanır.",
      "Yağmacılıkla diğer kovanlara spor taşınması hızlanır.",
      "Sonbahar kontrollerinde kalan çökmüş gözler fark edilir.",
      "Kışa girmeden önce temizlik refleksi azalır.",
      "Kovanlar kapalıdır.",
      "Kış salkımı."
    ],
    [
      "Rutin takip.",
      "Kovan dip tablası temizliği.",
      "Eski esmer petekleri kuluçkalığın kenarlarına kaydırın.",
      "Kibrit çöpü testi yapın; şüpheli çökmüş gözleri inceleyin.",
      "Kibrit testi 2.5 cm uzuyorsa İlçe Tarım'a acil ihbarda bulunun!",
      "Çifte silkme (Shook Swarm) uygulayın veya kovanı kükürtle uyutun.",
      "Asla antibiyotik vermeyin; bulaşık petekleri derhal yakın.",
      "Kovan girişlerini daraltarak yağmacılığı engelleyin.",
      "Kararmış petekleri buharlı mum eritme kazanına gönderin.",
      "Arılık aletlerini %70 alkol ve pürmüzle sterilize edin.",
      "Kış hazırlığı.",
      "Kışlatma."
    ]
  ),
  createRow(
    "eyc",
    "Avrupa Yavru Çürüklüğü (EYÇ)",
    "brood",
    "Bakteriyel Açık Yavru Hastalığı",
    "Nisan - Mayıs (İlkbahar Soğukları & Kuluçka Üşümesi)",
    ["İç Anadolu (Sivas, Konya)", "Doğu Anadolu", "Karadeniz"],
    [0, 0, 1, 4, 4, 2, 1, 1, 1, 0, 0, 0],
    [
      "Kış uykusu.",
      "Kışlatma.",
      "Erken ilkbahar yavru faaliyeti.",
      "PİK KRİZ: Ani ilkbahar soğuk hava dalgasında yavrunun üşütülmesi.",
      "PİK KRİZ: Polen kıtlığında bakıcı arıların larvaları yeterince besleyememesi.",
      "Doğada nektar ve polen bollaşınca koloni temizlik refleksiyle atlatır.",
      "Genellikle yazın kendiliğinden geriler.",
      "Durgun dönem.",
      "Sonbahar serinlikleri.",
      "Kışa hazırlık.",
      "Kovanlar kapalı.",
      "Kış dönemi."
    ],
    [
      "Dinlenme.",
      "Kovan açmayınız.",
      "Erken ilkbaharda proteinli polen keki desteği verin.",
      "Kovanı bölme tahtasıyla sıkıştırın; arının sarmadığı çerçeveleri alın.",
      "Yaşlı ana arıyı kafesleyin veya hijyenik genç ana arı ile değiştirin.",
      "Kekik ve nane uçucu yağ katkılı 1:1 teşvik şerbeti verin.",
      "Bulaşık petekleri kovan dışına alıp eritin.",
      "Rutin kontrol.",
      "Kuvvetli kolonilerle kışa girin.",
      "Daraltma yapın.",
      "Kışlatma.",
      "Kış salkımı."
    ]
  ),
  createRow(
    "nosema",
    "Nosema Hastalığı (Nosema Apis & Ceranae)",
    "adult",
    "Sindirim Mikrosporidya Mantarı",
    "Ocak - Nisan (Kışlatma Nemi) & Ekim - Kasım",
    ["Karadeniz (Yüksek Nem)", "Doğu Anadolu (Uzun Kış)", "Marmara"],
    [4, 4, 4, 3, 1, 0, 0, 1, 2, 3, 4, 4],
    [
      "PİK TEHLİKE: Uzun süre uçuş yapamayan arıların bağırsaklarında spor patlaması.",
      "PİK TEHLİKE: Kovan içi rutubet, çıta üstlerinde ishal lekeleri.",
      "PİK TEHLİKE: İlkbahar uyanışında karınları şiş uçamayan arılar.",
      "İlkbahar uçuşları başlar; bağırsak temizleme ve spor saçılımı.",
      "Hava ısındıkça ve taze polen geldikçe bağırsak epitel hücreleri yenilenir.",
      "Yaz aylarında en düşük seviyededir.",
      "Yaz dönemi durağan.",
      "Sonbahar nemi ve gece-gündüz sıcaklık farkları.",
      "Sonbahar beslemesinde kalitesiz şerbet bağırsakları yorar.",
      "Rutubetli kış hazırlığında sporlar yeniden çoğalmaya başlar.",
      "Kış salkımına girerken kovan içi nem artar.",
      "Kış salkımında arı dışkılayamaz; spor yükü tepe yapar."
    ],
    [
      "Kovan dip havalandırmasını açık tutun, üst örtü nemini kurutun.",
      "Güneşli ilk günlerde arıların dışkılama uçuşunu izleyin.",
      "İshal lekeli çerçeveleri kovandan derhal çıkarıp imha edin.",
      "Nozevit veya elma sirkesi + kekik yağı katkılı 1:1 ılık şerbet verin.",
      "Eski esmer petekleri yenileyin.",
      "Doğal nektar akımı.",
      "Rutin takip.",
      "Kış beslemesini ekim ayına sarkıtmadan erken tamamlayın.",
      "İnvert şurup içine doğal kekik yağı ve propolis tentürü katın.",
      "Kovanları nem almayan rüzgarsız ve güneşli sehpaya yerleştirin.",
      "Fumagillin antibiyotiği YASAKTIR; bitkisel tanen desteği verin.",
      "Kovan içi nemi %60 altında tutacak üst hava tahliyesini sağlayın."
    ]
  ),
  createRow(
    "kirec",
    "Kireç Hastalığı (Chalkbrood)",
    "brood",
    "Petek & Kuluçka Mantarı",
    "Mart - Mayıs (İlkbahar Soğukları & Kovan Taban Nemi)",
    ["Karadeniz (Aşırı Nemli İklim)", "Marmara Vadileri", "Gölgeli Arılıklar"],
    [1, 1, 3, 4, 4, 2, 1, 0, 1, 2, 2, 1],
    [
      "Kış uykusu; mantar sporları petek gözlerinde canlı kalır.",
      "Kovan dibinde rutubet başlangıcı.",
      "İlkbahar erken kovan açımlarında kuluçkanın üşümesi.",
      "PİK TEHLİKE: Kovan tabanında yoğuşan su ve mantarın larvayı sarması.",
      "PİK TEHLİKE: Polen tuzaklarında ve uçuş tahtasında beyaz tebeşir taneleri.",
      "Hava 25°C üstüne çıkınca mantar sporlarının gelişimi durur.",
      "Sıcak yaz aylarında kaybolur.",
      "Sıcakta görülmez.",
      "Sonbahar yağmurlarıyla kovan nemi tekrar artar.",
      "Gece soğumasıyla kovan kapağında yoğuşma.",
      "Kışlatma rutubeti.",
      "Kış dönemi."
    ],
    [
      "Kovan sehpasını yerden 30-40 cm yükseltin.",
      "Dip tahtası ızgarasını temizleyin.",
      "Gereksiz kovan açarak kuluçkayı üşütmeyiniz.",
      "Kovan dip tablasındaki tebeşir mumyalarını derhal temizleyip yakın.",
      "1 litre şerbete 2 damla Çay Ağacı Yağı (Tea Tree Oil) damlatıp besleyin.",
      "Hijyenik davranışlı (VSH) genç ana arı ile kraliçeyi yenileyin.",
      "Kireçli petekleri kovandan çıkarıp eritin.",
      "Güneşli ve havadar yere kovanı taşıyın.",
      "Kovan dip tahtasındaki telli havalandırmayı açık tutun.",
      "Üst örtü bezinin ıslanmasını engelleyin.",
      "Kış hazırlığı.",
      "Rutubetsiz kışlatma."
    ]
  ),
  createRow(
    "guve",
    "Balmumu Güvesi (Galleria mellonella)",
    "pest",
    "Petek Tahrip Edici Zararlı",
    "Haziran - Eylül (25°C+ Sıcak Yaz ve Depolama)",
    ["Ege (Sıcak Kıyı Şeridi)", "Akdeniz", "Güneydoğu Anadolu", "Marmara"],
    [0, 0, 1, 2, 3, 4, 4, 4, 4, 2, 1, 0],
    [
      "Soğukta güve yumurtaları ve larvaları uykudadır.",
      "10°C altında faaliyet göstermez.",
      "Hava ısınmaya başlar; güve kelebekleri kozalardan çıkar.",
      "Zayıf kovanların boş peteklerinde tünel açmaya başlar.",
      "Kovan arısız bırakılan çerçevelerde ipeksi ağlar örülür.",
      "PİK SEZON: Sıcaklık 28-35°C'ye ulaşınca güve kurdu 1 haftada peteği una çevirir!",
      "PİK SEZON: Hasat edilen boş kabarmış petek depolarında devasa istila.",
      "PİK SEZON: Gece kovan girişinde kelebek uçuşları.",
      "PİK SEZON: Petek sandıklarında pupa kozaları.",
      "Havaların soğumasıyla faaliyet yavaşlar.",
      "Soğukta larva gelişimi durur.",
      "Kış uykusu."
    ],
    [
      "Petekleri soğuk ve hava akımı olan depoda asılı tutun.",
      "Depo revizyonu yapın.",
      "Kovanda arının sarmadığı boş petekleri hemen çıkarın.",
      "Kolonileri daima sıkışık ve güçlü tutun; güçlü koloni güveye izin vermez.",
      "Hasat edilen petekleri depoya kaldırmadan önce 24 saat -18°C dondurucuda şoklayın.",
      "Depo peteklerine Biyolojik Bacillus thuringiensis (B401) solüsyonu püskürtün.",
      "Asetik asit (%80) buharı ile petek sandıklarını fümige edin.",
      "Peteklerin arasına kuru ceviz ve defne yaprağı yerleştirin.",
      "KESİNLİKLE NAFTALİN KULLANMAYINIZ! Kanserojendir ve muma işler.",
      "Güvenin kemirdiği petekleri kazıyıp eritin.",
      "Kış muhafazası.",
      "Soğuk depo."
    ]
  ),
  createRow(
    "esek-arisi",
    "Eşek Arısı & Asya Eşek Arısı (Vespa Velutina/Crabro)",
    "pest",
    "Yırtıcı Kovan Avcısı",
    "Ağustos - Ekim (Doğada Av Kıtlığı & Koloni Zirvesi)",
    ["Ege (Muğla, İzmir)", "Marmara", "Akdeniz", "Karadeniz Sahili"],
    [0, 0, 0, 1, 1, 2, 3, 4, 4, 4, 2, 0],
    [
      "Kraliçe eşek arıları kış uykusundadır.",
      "Kış uykusu.",
      "Hava ısınınca İLK ANA EŞEK ARILARI uyanır ve yuva aramaya başlar.",
      "İlkbahar: Ana eşek arısı ilk işçilerini yetiştirir.",
      "Eşek arısı yuvaları büyümeye başlar.",
      "Kovan önlerinde tek tük tarlacı arı avlanmaları başlar.",
      "Nüfusları artar; kovan uçuş tahtasında arı kapmaya başlarlar.",
      "PİK KRİZ: Doğada av kıtlığı başlar; eşek arıları arılıkları kuşatır!",
      "PİK KRİZ: Kovan girişinde havada asılı kalarak yüzlerce tarlacıyı parçalarlar.",
      "PİK KRİZ: Zayıf kovanların içine girip kovanı söndürürler.",
      "Havanın soğumasıyla erkek ve işçi eşek arıları ölür; yeni analar kışlar.",
      "Kış uykusu."
    ],
    [
      "Dinlenme.",
      "Tuzak hazırlığı.",
      "İlkbaharda görülen İLK ANA EŞEK ARILARINI öldürün (2000 arı kurtarır!).",
      "Arılık çevresine 1 bardak bira + şekerli pet şişe kapanları asın.",
      "Kovan önü uçuş tahtalarını izleyin.",
      "Kovan girişlerine 8 mm delikli Eşek Arısı Koruma Izgarası takın.",
      "Pet şişe tuzaklarına et/balık parçası ekleyerek avcıları tuzağa çekin.",
      "Kovan önlerine ters huni pet şişe tuzaklarını sıklaştırın.",
      "Uçuş deliklerini tek arı geçecek kadar daraltın.",
      "Arılık etrafındaki eşek arısı yuvalarını akşam karanlığında imha edin.",
      "Tuzakları kaldırıp temizleyin.",
      "Kışlatma."
    ]
  ),
  createRow(
    "tropilaelaps",
    "Tropilaelaps Akarları (İstilacı Asya Akarları)",
    "pest",
    "İstilacı Dış Parazit",
    "Mayıs - Eylül (Aktif Kuluçka & Göçer Arıcılık)",
    ["Güneydoğu Anadolu Sınır Hatları", "Akdeniz", "Ege"],
    [0, 0, 1, 2, 3, 4, 4, 4, 3, 2, 1, 0],
    [
      "Kış yavrusuz döneminde arı üzerinde yaşayamaz; ölür.",
      "Yavrusuz kolonide barınamaz.",
      "Erken yavru faaliyetiyle risk başlar.",
      "Göçer arıcıların konaklama alanlarında yayılım riski.",
      "Kuluçka alanlarında hızlı üreme.",
      "PİK SEZON: Varroa'dan 3 kat daha hızlı çoğalarak pupaları öldürür.",
      "PİK SEZON: Kovan içinde saniyede birkaç cm hızla koşan eliptik akarlar.",
      "PİK SEZON: Kolonilerin topluca kovanı terk etmesi (kaçış sürüsü).",
      "Sonbahar kuluçkasının tahribatı.",
      "Yavru kesilince akar populasyonu hızla çöker.",
      "Yavrusuz dönemde açlıktan ölürler.",
      "Kış dönemi."
    ],
    [
      "Karantinasız ana arı almayınız.",
      "Giriş kontrolleri.",
      "Kovan içi yavru durumunu kontrol edin.",
      "Şüpheli hızlı koşan akar görüldüğünde Tarım İl Müdürlüğü'ne bildirin.",
      "Formik asit buharlaştırma kürü uygulayın.",
      "KULUÇKA KIRMA: Ana arıyı 10 gün kafesleyip kovanı yavrusuz bırakın!",
      "Akar ergin arı üzerinde 2 günden fazla yaşayamaz; yavrusuzlukta ölür.",
      "Bulaşık çerçeveleri başka kovanlara aktarmayın.",
      "Bölme yaparak kuluçka döngüsünü kırın.",
      "Kovan temizliği.",
      "Kış salkımı.",
      "Kışlatma."
    ]
  ),
  createRow(
    "zehirlenme",
    "Zirai İlaç / Pestisit Zehirlenmesi",
    "adult",
    "Kimyasal Çevre Toksikasyonu",
    "Nisan - Temmuz (Meyve, Kanola, Pamuk, Ayçiçeği Çiçeklenmesi)",
    ["Trakya (Kanola & Ayçiçeği)", "Çukurova (Pamuk & Narenciye)", "İç Anadolu"],
    [0, 0, 1, 4, 4, 4, 3, 2, 1, 0, 0, 0],
    [
      "Tarla ilaçlaması yok.",
      "Kışlatma.",
      "Meyve bahçeleri erken göztaşı ve böcek ilaçlamaları.",
      "PİK TEHLİKE: Meyve bahçeleri ve kanola tarlalarında çiçek üstü insektisit.",
      "PİK TEHLİKE: Mısır tohum ilaçlamaları ve ayçiçeği yabancı ot ilaçlaması.",
      "PİK TEHLİKE: Buğday süne ilaçlamaları ve pamuk böcek ilaçlamaları.",
      "Ayçiçeği çiçeklenme ilaçlamaları; tarlacı arıların toplu ölümü.",
      "İlaçlama yoğunluğu azalır.",
      "Pamuk hasat öncesi yaprak dökücü ilaçlamalar.",
      "Tarım sezonu sonu.",
      "İlaçlama yok.",
      "Kış dönemi."
    ],
    [
      "Dinlenme.",
      "Çiftçilerle iletişim.",
      "Tarım arazilerine yakın konaklarken muhtarlık ve ziraat odasını uyarın.",
      "Kovan önünde dili dışarıda yığılmış ölü arı varsa tutanak tutturun!",
      "Kovanları ilaçlama yapılan alanın en az 5 km dışına taşıyın.",
      "Zehirli polenli petekleri kovandan derhal çıkarıp imha edin.",
      "1:1 temiz şeker şurubuyla bolca besleyerek zehrin yıkanmasını sağlayın.",
      "Zehirlenen arıların getirdiği polenleri asla tüketmeyin.",
      "Rutin takip.",
      "Kış hazırlığı.",
      "Kışlatma.",
      "Kışlatma."
    ]
  ),
  createRow(
    "aclik-soguk-vurgunu",
    "Açlık Krizleri & Kışlatma Soğuk Vurgunu",
    "comb_disorder",
    "Enerji & Sıcaklık Çöküşü",
    "Ocak - Nisan (Kış Sonu & Erken İlkbahar Yağış Mahsuriyeti)",
    ["Doğu Anadolu", "İç Anadolu", "Karadeniz Yaylaları", "Tüm Kışlatma Alanları"],
    [4, 4, 4, 3, 0, 0, 0, 0, 0, 1, 2, 3],
    [
      "PİK TEHLİKE: Kovan içi bal kemerleri biter; arılar petek gözüne gömülü donar.",
      "PİK TEHLİKE: Erken yavru başlar; bal tüketimi 4 katına çıkar!",
      "PİK TEHLİKE: Yalancı bahar sonrası ani kar yağışında arılar salkımı terk edemez.",
      "Hava soğuk ve yağışlı giderse tarlacı arı dışarı çıkamaz; açlık ölümleri.",
      "Doğadan nektar ve polen gelmeye başlar; açlık riski biter.",
      "Bal akımı mevsimi.",
      "Yaz dönemi.",
      "Hasat dönemi.",
      "Hasat sonrası besleme ihmal edilirse risk başlar.",
      "Sonbahar kış beslemesi yetersiz yapılırsa tehlike tohumları atılır.",
      "Kışa en az 15-20 kg kapalı sırlı bal ile girilmelidir.",
      "Soğuk kış günlerinde arılar bal kemerine ulaşamazsa aç kalabilir."
    ],
    [
      "Kovan kapağını vurup dinleyin; tüy gibi hafifse derhal Fondan Şeker Keki koyun.",
      "Soğukta SIVI ŞERBET KESİNLİKLE VERMEYİNİZ! Sadece katı Fondan Kek verilir.",
      "Salkımın tam tepesine doğrudan arı keki poşetini yarıp yerleştirin.",
      "1:1 ılık koyu şerbeti boş petek gözlerine döküp salkımın yanına koyun.",
      "Doğal nektar akımı.",
      "Bal sağımı.",
      "Rutin kontrol.",
      "Hasat sonrası kovanlarda yeterli bal kemeri bırakın.",
      "Ekim ayı başında kış şerbetini (2:1 koyu şurup) tamamlayın.",
      "Kovanları bölme tahtasıyla daraltıp kış yalıtımını yapın.",
      "Ağırlık kontrolü yapın; hafif kovanları işaretleyin.",
      "Kovanları rahatsız etmeyin; üstten fondan kek desteği sağlayın."
    ]
  ),
  createRow(
    "yagmacilik",
    "Kovan Yağmacılığı (Robbing)",
    "comb_disorder",
    "Davranışsal Kovan Afeti",
    "Ağustos - Ekim (Bal Sağımı Sonrası Nektar Kıtlığı)",
    ["Tüm Türkiye Arılıkları (Özellikle Kurak Bölgeler)"],
    [0, 0, 1, 1, 0, 0, 2, 4, 4, 3, 1, 0],
    [
      "Kovanlar kapalıdır.",
      "Uçuş deliği dar.",
      "Erken ilkbaharda zayıf kovanlara dikkat edilmeli.",
      "Besleme sadece akşam saatinde yapılmalıdır.",
      "Nektar akımı varken yağmacılık yaşanmaz.",
      "Bal akımı dönemi.",
      "Bal sağımı başlayınca nektar kokusu arıları hırçınlaştırır.",
      "PİK TEHLİKE: Bal sağıldıktan sonra doğada nektar kesilir; güçlü kovanlar zayıfları basar!",
      "PİK TEHLİKE: Petek sırları parçalanır, uçuş deliğinde kanlı boğuşmalar yaşanır.",
      "Gündüz yapılan açık beslemeler tüm arılığı yağmaya sürükler.",
      "Havalar soğuyunca tarlacı uçuşları azalır.",
      "Kış salkımı."
    ],
    [
      "Kovan deliği dar.",
      "Dinlenme.",
      "Kovan deliklerini dar tutun.",
      "Beslemeleri asla gündüz güneşte yapmayın; sadece güneş batınca verin.",
      "Bal akımı.",
      "Bal hasadı.",
      "Sağım çadırını arı sızdırmaz tutun, petekleri açıkta bırakmayın.",
      "UÇUŞ DELİĞİNİ ANINDA 1 CM'YE DARALTIN (Tek arı geçebilsin)!",
      "Kovanın önüne cam levha dayayın; ev sahibi alttan girer, yağmacı cama çarpar.",
      "Giriş tahtasına mazotlu veya elma sirkeli bez sürerek koku izini şaşırtın.",
      "Kovanları kış deliği ayarına getirin.",
      "Kışlatma."
    ]
  ),
];

// ==========================================
// TÜRKİYE COĞRAFİ BÖLGELERİ HASTALIK RİSKLERİ
// ==========================================
export interface RegionalDiseaseRisk {
  regionId: string;
  regionName: string;
  climateFactor: string;
  icon: string;
  overallThreatLevel: "Kritik" | "Yüksek" | "Orta";
  provinces: string[];
  topRiskDiseases: Array<{
    diseaseName: string;
    riskScore: number;
    riskiestMonths: string;
    regionalCause: string;
    criticalSolution: string;
  }>;
  seasonalAlert: string;
}

export const REGIONAL_DISEASE_RISKS: RegionalDiseaseRisk[] = [
  {
    regionId: "ege",
    regionName: "Ege Bölgesi (Basra & Sahil Şeridi)",
    climateFactor: "Sıcak Akdeniz iklimi, ılıman kışlatma, Ağustos-Kasım devasa Çam Balı göçer akını ve aşırı kovan sıkışıklığı.",
    icon: "Flame",
    overallThreatLevel: "Kritik",
    provinces: ["Muğla", "Aydın", "İzmir", "Manisa", "Denizli", "Uşak"],
    seasonalAlert: "Ağustos-Ekim aylarında Muğla çam balı basra sağımları sonrası aşırı kovan yoğunluğu nedeniyle Varroa, Eşek Arısı ve Balmumu Güvesi 1 numaralı afet haline gelir.",
    topRiskDiseases: [
      {
        diseaseName: "Varroa Akarları (Varroa Destructor)",
        riskScore: 4,
        riskiestMonths: "Ağustos - Ekim (Basra Hasadı Sonu)",
        regionalCause: "Yüzbinlerce kovanın aynı çam ormanına yığılması ve bal akımı bittiğinde yavru daralırken akarların tavan yapması.",
        criticalSolution: "Hasat biter bitmez Formik Asit (%65) veya Oksalik Asit+gliserin şeritleriyle acil toplu arılık ilaçlaması."
      },
      {
        diseaseName: "Eşek Arısı & Vespa Orientalis İstilası",
        riskScore: 4,
        riskiestMonths: "Ağustos - Kasım",
        regionalCause: "Kurak sahil şeridinde doğal böcek kıtlığı ve dev eşek arısı yuvalarının kovanlara organize saldırısı.",
        criticalSolution: "Bira + şekerli pet şişe kapanları ve kovan girişine 8 mm eşek arısı koruma ızgarası takılması."
      },
      {
        diseaseName: "Balmumu Güvesi (Büyük Güve)",
        riskScore: 4,
        riskiestMonths: "Haziran - Eylül",
        regionalCause: "30-38°C hava sıcaklığında depolanan boş kabarmış peteklerin 1 haftada kelebek kurtlarınca mahvedilmesi.",
        criticalSolution: "Peteklerin depoya kaldırılmadan önce 24 saat -18°C dondurucuda şoklanması ve B401 uygulaması."
      },
      {
        diseaseName: "Petek Çökmesi & Sıcak Çarpması",
        riskScore: 3,
        riskiestMonths: "Temmuz - Ağustos",
        regionalCause: "Gölgesiz taşlık alanlarda kovan içi sıcaklığın 40°C'yi aşarak ağır ballı peteklerin tabana yıkılması.",
        criticalSolution: "Kovanların gölgelik sundurmaya alınması, beyaz boyalı kapak ve temiz arı suluğu temini."
      }
    ]
  },
  {
    regionId: "karadeniz",
    regionName: "Karadeniz Bölgesi (Yüksek Nem & Rutubet Kuşağı)",
    climateFactor: "Yıl boyu %80+ bağıl nem, sık yağış, sisli kapalı vadiler ve güneşe hasret kışlatma şartları.",
    icon: "Droplets",
    overallThreatLevel: "Kritik",
    provinces: ["Rize", "Trabzon", "Artvin", "Ordu", "Giresun", "Samsun", "Kastamonu"],
    seasonalAlert: "Aşırı rutubet nedeniyle kovan içinde su yoğuşması mantar sporlarını patlatır; Kireç Hastalığı ve Nosema Ceranae bölgenin en yıkıcı sorunudur.",
    topRiskDiseases: [
      {
        diseaseName: "Kireç Hastalığı (Chalkbrood)",
        riskScore: 4,
        riskiestMonths: "Mart - Haziran",
        regionalCause: "Kovan dip tablasında göllenen su ve rutubetin açık yavru larvalarını mantarla tebeşir gibi taşlaştırması.",
        criticalSolution: "Telli polen tuzaklı kovan tabanı kullanılması, kovanın 40 cm yükseltilmesi ve Çay Ağacı Yağı şerbeti."
      },
      {
        diseaseName: "Nosema Ceranae & Apis (Nozemozis)",
        riskScore: 4,
        riskiestMonths: "Ekim - Mayıs",
        regionalCause: "Güneşsiz günlerin çokluğu nedeniyle arıların kışın dışkılama uçuşuna çıkamaması ve bağırsak epitel çöküşü.",
        criticalSolution: "İnvert şerbet içine Nozevit veya doğal elma sirkesi + kekik yağı emülsiyonu katılması."
      },
      {
        diseaseName: "Taş Hastalığı (Aspergillus)",
        riskScore: 3,
        riskiestMonths: "Nisan - Mayıs",
        regionalCause: "Küflenmiş polenlerin ve ıslak çıtaların larvaları taş gibi katılaştırması (Zoonoz solunum riski!).",
        criticalSolution: "Küflü peteklerin süpürülmeden maskeyle yakılması ve kovanın pürmüzle dezenfeksiyonu."
      }
    ]
  },
  {
    regionId: "ic-anadolu",
    regionName: "İç Anadolu Bölgesi (Karasal İklim & Sert Bahar)",
    climateFactor: "Karasal iklim, sert kış, dengesiz ilkbahar donları ve yaz sonu şiddetli bozkır kuraklığı.",
    icon: "Thermometer",
    overallThreatLevel: "Yüksek",
    provinces: ["Konya", "Ankara", "Sivas", "Eskişehir", "Kayseri", "Aksaray", "Yozgat"],
    seasonalAlert: "Nisan-Mayıs aylarında yalancı baharı takip eden ani soğuk hava dalgalarında kuluçka üşümesi (EYÇ) ve Ağustos kuraklığında Kovan Yağmacılığı pik yapar.",
    topRiskDiseases: [
      {
        diseaseName: "Avrupa Yavru Çürüklüğü (EYÇ)",
        riskScore: 4,
        riskiestMonths: "Nisan - Mayıs",
        regionalCause: "İlkbahar gece donlarında yavru alanının üşümesi ve arıların açık larvaları besleyememesi.",
        criticalSolution: "Kovanların bölme tahtasıyla sıkı tutulması, kuluçka kesintisi ve genç hijyenik ana arı değişimi."
      },
      {
        diseaseName: "Açlık Krizleri & Kışlatma Donması",
        riskScore: 4,
        riskiestMonths: "Ocak - Nisan",
        regionalCause: "Şubat ayında yavru başlayınca balın hızla tükenmesi ve arı salkımının donup kafası hücreye gömülü ölmesi.",
        criticalSolution: "Hafifleyen kovanların üzerine kışın sıvı şerbet yerine doğrudan Fondan Şeker Keki yerleştirilmesi."
      },
      {
        diseaseName: "Kovan Yağmacılığı (Robbing)",
        riskScore: 4,
        riskiestMonths: "Ağustos - Eylül",
        regionalCause: "Bozkır kuraklığında nektarın bıçak gibi kesilmesiyle güçlü kovanların zayıf kovanları talan etmesi.",
        criticalSolution: "Uçuş deliğinin 1 cm'ye daraltılması, kovan önüne cam levha dayanması ve akşam beslemesi."
      }
    ]
  },
  {
    regionId: "marmara",
    regionName: "Marmara & Trakya Bölgesi (Yoğun Tarım & Ayçiçeği Kuşağı)",
    climateFactor: "Geçiş iklimi, yoğun monokültür tarım arazileri (Kanola, Ayçiçeği, Çeltik, Meyve bahçeleri).",
    icon: "Bug",
    overallThreatLevel: "Kritik",
    provinces: ["Edirne", "Tekirdağ", "Kırklareli", "Bursa", "Balıkesir", "Çanakkale", "Yalova"],
    seasonalAlert: "Mayıs-Temmuz aylarında kanola ve ayçiçeği tarlalarındaki yoğun zirai ilaçlama (Neonikotinoidler) kitlesel arı zehirlenmelerine ve hasat sonu Varroa çöküşüne yol açar.",
    topRiskDiseases: [
      {
        diseaseName: "Zirai İlaç / Neonikotinoid Zehirlenmesi",
        riskScore: 4,
        riskiestMonths: "Nisan - Temmuz",
        regionalCause: "Çiçeklenme döneminde bilinçsizce sıkılan böcek ilaçlarının tarlacı arıları kovan önünde dilleri dışarıda katletmesi.",
        criticalSolution: "İlaçlama alanından 5 km uzaklaşma, zehirli polenli çerçeveleri çıkarma ve temiz şerbetle arıyı yıkama."
      },
      {
        diseaseName: "Varroa Destructor & DWV Virüsü",
        riskScore: 4,
        riskiestMonths: "Ağustos - Eylül",
        regionalCause: "Ayçiçeği balı sağımı sonrası aşırı kovan yorgunluğu ve virüs yükünün kanatları güdükleştirmesi.",
        criticalSolution: "Hasattan hemen sonra 14 gün bekleme süreli Formik Asit buharlaştırmasıyla Varroa şoklaması."
      },
      {
        diseaseName: "Amerikan Yavru Çürüklüğü (AYÇ)",
        riskScore: 3,
        riskiestMonths: "Mayıs - Temmuz",
        regionalCause: "Gezginci arıcıların yoğun temasında kaynağı belirsiz petek ve besleme ballarının spor yayması.",
        criticalSolution: "Kibrit çöpü testi ile düzenli tarama ve 5996 sayılı kanun gereği resmi bildirim."
      }
    ]
  },
  {
    regionId: "dogu-anadolu",
    regionName: "Doğu Anadolu Bölgesi (Yüksek Rakım & 6 Ay Kış)",
    climateFactor: "6 ay süren ağır kış şartları, metrelerce kar, -25°C dondurucu soğuklar ve kısa-yoğun yayla çiçeklenmesi.",
    icon: "Thermometer",
    overallThreatLevel: "Yüksek",
    provinces: ["Erzurum", "Kars", "Ardahan", "Ağrı", "Van", "Bitlis", "Muş", "Hakkari"],
    seasonalAlert: "Aşırı uzun kışlatma döneminde arıların 120 gün kovan dışına çıkamaması kışlatma açlığı ve Nosema riskini zirveye çıkarır.",
    topRiskDiseases: [
      {
        diseaseName: "Kışlatma Açlığı & Salkım Donması",
        riskScore: 4,
        riskiestMonths: "Aralık - Nisan",
        regionalCause: "Arıların 5 cm ötedeki bala dondurucu soğuk yüzünden salkımı bozup gidememesi ve açlıktan sönmesi.",
        criticalSolution: "Kışa en az 20 kg kapalı koyu bal kemeriyle girilmesi ve çerçeve üstlerine acil fondan kek konulması."
      },
      {
        diseaseName: "Nosema Apis & Dizanteri İshali",
        riskScore: 4,
        riskiestMonths: "Şubat - Nisan",
        regionalCause: "Uzun kışlatmada dışkılama uçuşu yapılamaması sonucu kovan içi çıta başlarına sarı ishal lekeleri saçılması.",
        criticalSolution: "Kovan içi nemi kurutucu yalıtım malzemeleri ve sonbaharda Nozevit katkılı erken kış beslemesi."
      },
      {
        diseaseName: "Avrupa Yavru Çürüklüğü (EYÇ)",
        riskScore: 3,
        riskiestMonths: "Mayıs Başı",
        regionalCause: "Geç gelen baharda kuluçka genişlerken yaşanan gece donlarında larvaların üşümesi.",
        criticalSolution: "Kafkas damızlık ırk kullanımı, kovanların geç açılması ve erken kek desteği."
      }
    ]
  },
  {
    regionId: "akdeniz",
    regionName: "Akdeniz Bölgesi (Narenciye & Erken Bahar Kuşağı)",
    climateFactor: "Ilıman kış, Şubat narenciye akımı, 42°C+ kavurucu sıcak yaz ve kesintisiz yavru kuluçka faaliyeti.",
    icon: "Flame",
    overallThreatLevel: "Kritik",
    provinces: ["Antalya", "Mersin", "Adana", "Hatay", "Osmaniye", "Kahramanmaraş"],
    seasonalAlert: "Kovanlarda kışın dahi yavru kesilmediği için Varroa akarları kesintisiz çoğalır; Tropilaelaps akarları ve Eşek Arısı tehdidi çok yüksektir.",
    topRiskDiseases: [
      {
        diseaseName: "Varroa & Tropilaelaps Akarları",
        riskScore: 4,
        riskiestMonths: "Yıl Boyu (Mart & Ağustos Pik)",
        regionalCause: "Kolonide kuluçkasız dönem olmaması sebebiyle akarların sürekli kapalı gözlerde koruma altında üremesi.",
        criticalSolution: "Bölme yaparak veya ana arıyı 10 gün kafesleyerek yapay kuluçkasız dönem yaratıp asit uygulamak."
      },
      {
        diseaseName: "Eşek Arısı & Vespa Crabro",
        riskScore: 4,
        riskiestMonths: "Ağustos - Kasım",
        regionalCause: "Sıcak vadilerde eşek arılarının kovan önünde arı avlaması ve kovanları felç etmesi.",
        criticalSolution: "Bira + etli pet şişe kapanları ve daraltılmış kovan giriş ızgaraları."
      },
      {
        diseaseName: "Narenciye Zirai Zehirlenmesi",
        riskScore: 3,
        riskiestMonths: "Mart - Nisan",
        regionalCause: "Portakal ve limon çiçeklenmesinde yapılan gündüz ilaçlamaları.",
        criticalSolution: "Ziraat ilaçlama duyurularının takibi ve kovanların akşam saatinde 3 km güvenli mesafeye kaydırılması."
      }
    ]
  },
  {
    regionId: "guneydogu",
    regionName: "Güneydoğu Anadolu (Aşırı Sıcak & Kurak Kuşak)",
    climateFactor: "Yazın 45°C'yi aşan aşırı sıcaklar, çöl tozu fırtınaları, kuraklık ve su kıtlığı.",
    icon: "Flame",
    overallThreatLevel: "Yüksek",
    provinces: ["Şanlıurfa", "Gaziantep", "Diyarbakır", "Mardin", "Batman", "Siirt"],
    seasonalAlert: "Temmuz-Ağustos aylarında aşırı sıcak çarpması sonucu petek çökmesi ve nektar kuraklığında kovan yağmacılığı pik yapar.",
    topRiskDiseases: [
      {
        diseaseName: "Petek Çökmesi & Sıcak Çarpması",
        riskScore: 4,
        riskiestMonths: "Haziran - Ağustos",
        regionalCause: "42°C+ gölgesiz kovanlarda bal mumunun eriyip kovan tabanına yığılması ve arıların bala boğulması.",
        criticalSolution: "Kovanların üzerine sazlık/strafor gölgelik yapılması, çıta tellerinin elektrikli gömülmesi ve su temini."
      },
      {
        diseaseName: "Kovan Yağmacılığı (Robbing)",
        riskScore: 4,
        riskiestMonths: "Temmuz - Eylül",
        regionalCause: "Bozkır sıcağında doğada nektarın sıfırlanmasıyla arıların birbirini kırması.",
        criticalSolution: "Uçuş deliğini tek arı geçişine daraltma ve cam levha taktiği."
      },
      {
        diseaseName: "Tropilaelaps & Varroa",
        riskScore: 3,
        riskiestMonths: "Nisan - Haziran",
        regionalCause: "Suriye-Irak sınır hattından gelebilecek kontrolsüz parazit yayılımları.",
        criticalSolution: "Karantina kurallarına uyulması ve formik asit buharlaştırma kürü."
      }
    ]
  }
];


