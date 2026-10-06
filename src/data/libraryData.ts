import { BookChapter } from "../types";

export const BEEKEEPING_LIBRARY: BookChapter[] = [
  {
    id: "bolum-1",
    chapterNumber: 1,
    title: "Temel Bilgiler ve Başlangıç",
    subtitle: "Arıcılığa Giriş, Ekipmanlar, Arılık Yeri Seçimi ve Mevzuat",
    badge: "1. Cilt",
    icon: "Compass",
    description:
      "Arıcılık yolculuğuna doğru ve bilinçli adımlarla başlayın. Temel aletler, koruyucu kıyafetler, güvenli kovan yerleşimi ve yasal mevzuatı öğrenin.",
    subsections: [
      {
        id: "1-1",
        title: "Arıcılığa Giriş ve Temel Felsefe",
        summary: "Arı kolonisi bir süper-organizmadır. Başarılı bir arıcı, arının doğasına müdahale eden değil, onun ritmine uyum sağlayan rehberdir.",
        content: [
          "Arıcılık hem doğayla derin bir bağ kurmayı sağlayan huzurlu bir uğraş, hem de yüksek katma değerli ürünler sunan kadim bir tarımsal faaliyettir.",
          "Yeni başlayan bir arıcı için en ideal başlangıç, ilkbaharda (Nisan-Mayıs) 2 veya 3 adet 5-6 çerçeveli sağlıklı koloni (ruşet veya kovan) ile başlamaktır. Tek kovanla başlamak risklidir; çünkü bir kovanda anasızlık veya zayıflık yaşandığında diğerinden takviye çerçeve veya yumurta alma şansı olmaz.",
          "Arılarla çalışırken sakin, yavaş ve kendinden emin hareket etmek esastır. Keskin parfümler, ter kokusu ve siyah/koyu renkli kıyafetler arıları savunmaya geçirir.",
        ],
        stepByStep: [
          "Adım 1: Bölgenizdeki arıcılar birliğine veya deneyimli bir usta arıcıya çıraklık ederek ilk pratik deneyimi kazanın.",
          "Adım 2: İlkbaharda sağlıklı, kuluçka düzeni sıkı, uysal ana arıya sahip 2-3 adet koloni edinin.",
          "Adım 3: Kovanlarınızı yerleştireceğiniz meraların nektar ve polen takvimini önceden araştırın.",
        ],
        warnings: [
          "Arı zehrine karşı alerjiniz olup olmadığını başlangıçta mutlaka bir sağlık kuruluşunda test ettirin veya alerji kitinizi daima yanınızda bulundurun.",
        ],
      },
      {
        id: "1-2",
        title: "Gerekli Temel Ekipmanlar ve Koruyucu Kıyafetler",
        summary: "Körük, maske, el demiri ve fırça olmadan kovana yaklaşılmaz. Kaliteli ekipman güvenliğin ve iş veriminin anahtarıdır.",
        content: [
          "Arıcının en temel dört aleti şunlardır: Körük, El Demiri (Kazıyıcı), Arıcı Maskesi/Tulumu ve Arıcı Fırçası.",
          "Körük: Arılara duman verildiğinde yangın tehlikesi algılayıp kursaklarını balla doldururlar. Kursağı dolu arı karın halkalarını bükemez ve sokamaz. Körük yakıtı olarak kuru talaş, çam pürçüğü, defne yaprağı ve kuru tezek/kavak mantarı tercih edilmelidir. Sentetik veya naylon atıklar asla yakılmamalıdır!",
          "El Demiri: Propolis ile birbirine yapıştırılmış çerçeveleri aralamak ve kovan içi mum artıklarını kazımak için vazgeçilmez paslanmaz çelik alettir.",
          "Arıcı Maskesi ve Tulumu: Beyaz veya açık sarı renkte olmalı, yüzü tül korumalı ve bilekleri lastikli olmalıdır. Beyaz renk arılara dinginlik verir; koyu renkler ise ayı gibi yırtıcıları çağrıştırır.",
          "Eldiven: Deri veya kalın nitril eldivenler kullanılır. Hijyen açısından nitril eldivenler propolis ve hastalık bulaşmasını engellemede daha üstündür.",
        ],
        stepByStep: [
          "Körük Yakma: Alt kısma çıra veya kuru ot koyup tutuşturun, duman yükselince üzerine sıkıca çam ibresi veya talaş doldurup kapağı kapatın. Körükten alev değil, serin ve yoğun beyaz duman çıkmalıdır.",
          "Kovan Açılışı: Önce uçuş deliğine hafifçe 1-2 puf duman verin. 1 dakika bekleyin, ardından üst kapağı hafifçe aralayıp örtü bezinin altına 2 puf duman vererek çalışmaya başlayın.",
        ],
      },
      {
        id: "1-3",
        title: "Arılık Yeri Seçimi ve Mikro-Klima Faktörleri",
        summary: "Doğru yer seçimi kovan verimini %50 artırır. Güneş, rüzgar, nem ve su kaynağı dengesi hayati önem taşır.",
        content: [
          "Güneşlenme: Kovan giriş delikleri sabah güneşini erken alacak şekilde Güneydoğu veya Güney yönüne bakmalıdır. Sabah erken ısınan kovan, tarlacıları erkenden nektara gönderir.",
          "Rüzgar Koruması: Sürekli esen sert poyraz veya kuzey rüzgarlarına karşı arılık arkası tepe, ağaçlık veya çit gibi rüzgar kesicilerle korunmalıdır.",
          "Zemin ve Nem: Tabanı su tutan çukur yerlerden kaçınılmalıdır. Yüksek taban nemi kışın arı ölümlerine ve kireç hastalığına davetiye çıkarır. Kovanlar yerden en az 25-30 cm yüksekte sehpalara konulmalıdır.",
          "Temiz Su Kaynağı: Arılar kuluçka ısısını düşürmek ve şerbet yapmak için günde yüzlerce litre suya ihtiyaç duyar. Arılığa 100-200 metre mesafede şamandıralı veya damlamalı temiz arı suluğu kurulmalıdır.",
        ],
        warnings: [
          "Kovanları kesinlikle yoğun ilaçlama yapılan elma, pamuk veya mısır tarlalarının hemen sınırına koymayınız.",
        ],
      },
      {
        id: "1-4",
        title: "Mevzuat, Arıcılık Kayıt Sistemi (AKS) ve Yasal Kurallar",
        summary: "Türkiye'de arıcılık kuralları, kovan mesafeleri ve göçer arıcılık izinleri.",
        content: [
          "Tarım ve Orman Bakanlığı Arıcılık Yönetmeliği uyarınca en az 30 kovan sahibi olan arıcılar Arıcılık Kayıt Sistemi'ne (AKS) kaydolabilir ve işletme tescil numarası alır.",
          "Kovan Konaklama Mesafeleri: Sabit ve gezginci arılıklar arasında en az 2.000 metre mesafe olması esastır (zengin flora alanlarında ilçe komisyonları bu mesafeyi düzenleyebilir).",
          "Yerleşim Yerine Mesafe: Arılıklar köy ve mahalle yerleşim yerlerinden, ana karayollarından en az 200 metre uzakta kurulmalıdır.",
          "Gezginci Arıcılık İzinleri: İl/İlçe Tarım Müdürlüğü'nden 'Arı Sevk Raporu' ve veteriner sağlık raporu alınmadan kovan nakli yapılamaz.",
        ],
      },
    ],
  },
  {
    id: "bolum-2",
    chapterNumber: 2,
    title: "Arı Biyolojisi ve Koloni Yönetimi",
    subtitle: "Ana Arı, İşçi Arı, Erkek Arı Rolleri, Mevsimlik Bakım, Oğul Kontrolü ve Kışlatma",
    badge: "2. Cilt",
    icon: "Users",
    description:
      "Arı ailesinin iç dinamiklerini, kraliçenin biyolojisini, oğul eğiliminin yönetilmesini ve kış salkımının korunmasını derinlemesine kavrayın.",
    subsections: [
      {
        id: "2-1",
        title: "Arı Ailesinin Üç Bireyi ve Görev Dağılımı",
        summary: "Kovandaki mükemmel işbölümü: Ana arı (kraliçe), on binlerce dişi işçi arı ve erkek arılar.",
        content: [
          "Ana Arı (Kraliçe): Koloninin anasıdır. Döllenmiş yumurtadan 16 günde çıkar. Günde kendi ağırlığı kadar (1500-2000 adet) yumurta bırakabilir. Salgıladığı kraliçe feromonu (mandibular feromon) koloninin bir arada kalmasını ve işçi arıların yumurtalıklarının körelmesini sağlar. Ömrü 3-5 yıldır ancak ticari verimi 2. yıldan sonra düşer.",
          "İşçi Arı: Döllenmiş yumurtadan 21 günde çıkar. Yaşamının ilk 21 günü kovan içi hizmetindedir (1-3 gün petek temizliği, 4-10 gün kuluçka bakıcılığı ve arı sütü salgılama, 11-17 gün balmumu salgılama ve petek örme, 18-21 gün kovan bekçiliği). 21. günden sonra tarlacı olur; nektar, polen, propolis ve su taşır. Yaz ömrü 40-45 gün, kış ömrü ise 5-6 aydır.",
          "Erkek Arı: Döllenmemiş yumurtadan (partenogenez) 24 günde çıkar. İğnesi, bal mumu bezi ve polen sepeti yoktur. Tek görevi yeni doğan genç ana arılarla havada çiftleşmektir. Sonbaharda nektar akımı bitince işçi arılar tarafından kovan dışına atılır.",
        ],
      },
      {
        id: "2-2",
        title: "Mevsimlik Bakım Rutinleri (İlkbahar - Yaz - Sonbahar - Kış)",
        summary: "Yılın 12 ayında arıcının kovanında yapması gereken mevsimsel müdahaleler.",
        content: [
          "İlkbahar (Mart-Nisan): Hava 15°C'yi geçtiğinde kovan ilk kez açılır. Kraliçe varlığı, yavru deseni kontrol edilir. Dip tahtası temizlenir veya değiştirilir. 1:1 teşvik şerbeti ile ana arı yumurtlamaya teşvik edilir. Sıkışan kovanlara kabarmış petek veya ham petek verilir.",
          "Yaz (Mayıs-Temmuz): Koloni 9-10 çerçeveyi doldurunca ballık (kat) atılır. Kat arasına ana arı ızgarası konularak ananın yukarıya yumurta atması engellenir. Oğul önleme kontrolleri her 7-8 günde bir yapılır.",
          "Sonbahar (Ağustos-Ekim): Bal hasadı sonrası arılar aç bırakılmaz. Varroa ile en kritik esaslı mücadele bu dönemde yapılır. 2:1 oranında koyu şerbetle kışlık bal stoğu tamamlatılır. Kovan zayıfsa bölme tahtasıyla daraltılır.",
          "Kış (Kasım-Şubat): Kovanlar rahatsız edilmez, kapak açılmaz. Giriş deliği daraltılır, fare girişine karşı tel takılır. Aşırı soğuklarda gerekirse çerçeve üstüne pudra şekerli arı keki konur. Aralık-Ocak aylarında yavrusuz dönemde oksalik asit uygulaması yapılır.",
        ],
      },
      {
        id: "2-3",
        title: "Oğul Kontrolü, Belirtileri ve Önleme Yöntemleri",
        summary: "Arının doğal üreme güdüsünü yönetmek ve tarlacı gücünü bölmeden bal verimini korumak.",
        content: [
          "Oğul Neden Çıkar? Kovan içinde yer darlığı, havalandırma yetersizliği, yaşlı ana arı feromonunun zayıflaması ve aşırı polen/bal bloke olması arıları oğula sevk eder.",
          "Oğul Belirtileri: Çerçevelerin alt ve yan kenarlarında çok sayıda aşağı sarkan yüksük (ana arı memesi) dikilmesi, tarlacıların çalışmayı bırakıp kovan önünde salkım yapması (sakal bırakması) ve ananın yumurtlamayı azaltıp zayıflamasıdır.",
          "Oğul Önleme Teknikleri: 1) Zamanında kat atmak veya araya kabarmış boş petek girmek. 2) Yaşlı anayı gençleştirmek. 3) Kuluçkalıktan kapalı yavrulu çerçeve alıp zayıf kovanlara vermek yerine boş çerçeve vermek. 4) Yapay bölme (oğul bölmesi) yaparak arının stresini almak.",
        ],
        stepByStep: [
          "Adım 1: 7 günde bir kuluçkalık çerçevelerini kaldırıp alt kısımlardaki meme başlangıçlarını (yüksükleri) kontrol edin.",
          "Adım 2: Meme varsa ve kurtçuk/süt doluysa, koloniyi 2'ye veya 3'e bölerek yapay oğul oluşturun.",
          "Adım 3: Eğer bölmek istemiyorsanız, tüm memeleri titizlikle bozun ve kovanın tabanına boş kabarmış çerçeve yerleştirip havalandırmayı açın.",
        ],
      },
      {
        id: "2-4",
        title: "Kışlatma Hazırlıkları ve Kovan Daraltma",
        summary: "Kışın arıyı soğuk değil, rutubet ve açlık öldürür! Kovan daraltmanın altın kuralları.",
        content: [
          "Daraltma Kuralı: Arının sarmadığı boş çerçeveler kovan içinde bırakılmaz. Arı kaç çerçeveyi yoğun kaplıyorsa o kadar çerçeve bırakılır ve yanına strafor bölme tahtası konur.",
          "Havalandırma: Arılar kışın salkım halinde titreyerek 25-30°C ısı üretir. Bu süreçte yoğun su buharı çıkar. Eğer üst kapakta havalandırma deliği yoksa bu buhar tavanda yoğuşup arıların üzerine buz gibi damlar ve salkımı dondurur. Bu yüzden üst havalandırma daima açık kalmalı, sadece kovan girişi daraltılmalıdır.",
          "Bal Rezervi: Her çerçeve arı için kışa girerken en az 1.5 - 2 kg kapalı sırlı bal rezervi bulunmalıdır (8 çerçeveli kovan için 14-16 kg bal).",
        ],
      },
    ],
  },
  {
    id: "bolum-3",
    chapterNumber: 3,
    title: "Kovan İçi Sağlık ve Besleme",
    subtitle: "Varroa ve Mücadelesi (Organik Asitler & Uçucu Yağlar), Arı Hastalıkları ve Besin Teknikleri",
    badge: "3. Cilt",
    icon: "HeartPulse",
    description:
      "Varroa ile savaşta Laktik Asit, Formik Asit, Oksalik Asit protokolleri, uçucu esansiyel yağlar, yavru çürüklüğü teşhisi ve kışlık/baharlık şerbet hazırlama kılavuzu.",
    subsections: [
      {
        id: "3-1",
        title: "Varroa Destructor Biyolojisi ve Genel Mücadele Prensipleri",
        summary: "Arının yağ dokusunu emen, kanat deformasyon virüsü bulaştıran ölümcül parazitle mücadele zamanlaması ve biyolojik takvim.",
        content: [
          "Varroa akarı arının kanını (hemolenf) ve özellikle yağ dokusunu (fat body) emerek bağışıklık sistemini çökertir, arının yaşam süresini yarı yarıya kısaltır ve Kanat Deformasyon Virüsü (DWV) başta olmak üzere ölümcül virüsleri yayar.",
          "Gözler sırlanmadan hemen önce dişi varroa larva hücresine girer; arı sütünün altına dalarak kendini gizler ve hücre kapandıktan sonra pupanın üzerinde hızla ürer. Bir kapalı gözden birden fazla yeni döllenmiş akar çıkar.",
          "Bal hasadı döneminde (ballık katları üzerindeyken) kovana bala koku veya kalıntı bırakacak hiçbir kimyasal veya asit uygulanamaz! Tüm mücadele ilkbahar erken dönemde veya sonbahar bal hasadından hemen sonra ve kışın yavrusuz salkım döneminde yapılmalıdır.",
          "Varroa mücadelesinde tek bir yönteme bağımlı kalınmamalı; ruhsatlı organik asitler, uçucu esansiyel yağlar ve dip tahtası tuzaklama gibi entegre biyolojik yöntemler nöbetleşe uygulanmalıdır.",
        ],
        traditionalSolutions: [
          "Dip Tablası ve Polen Çekmecesi Sayımı: Tabanı ızgaralı kovanlarda düşen varroalar çekmeceye düşer ve geri tırmanamaz. Çekmeceye sürülen vazelinli kağıt ile günlük akar döküm sayısı takip edilir.",
          "Pudra Şekeri Metodu: Çerçevelerin üzerine pudra şekeri serpildiğinde arılar birbirini yalamaya (grooming) başlar; akarlar şekere basınca tutunamaz ve dip ızgarasına dökülür.",
        ],
        modernSolutions: [
          "Erkek Arı Gözü İmhası: Varroa dişi arı yerine 8 kat daha fazla erkek arı larvalarını tercih eder. İlkbaharda çerçeve altına takılan erkek arı peteği sırlanınca kesilip atılarak kovan içi akar yükü %50 azaltılır.",
        ],
        warnings: [
          "Kalıntı riski olan sentetik kimyasal şeritler balmumunda birikir ve yıllarca çıkmaz; peteklerde kalıntı bırakmayan organik asitler ve doğal uçucu yağlar tercih edilmelidir.",
        ],
      },
      {
        id: "3-2",
        title: "⭐ Organik Asitler ile Varroa Mücadelesi (Laktik, Formik, Oksalik Asit)",
        summary: "Laktik asit (%15 sulandırma), Formik asit (10 cc kuralı, 15-25°C) ve Oksalik asit (gliserinli mendil & buhar, 0-5°C) tam kullanım rehberi.",
        content: [
          "1. LAKTİK ASİT (Doğal ve Yumuşak Koruma): İnsanlarda ve canlılarda doğal efor harcayınca kaslarda yorgunluk hissi veren doğal bir asittir. Aşırı asidik değildir, pH değeri arıyı yakacak düzeyde düşük ve aşırı yakıcı değildir. En büyük üstünlüğü açık ve kapalı yavruya, yumurtaya ve yetişkin arıya hiçbir zarar vermemesidir. Yavrulu dönemlerde dahi gönül rahatlığıyla kullanılabilir.",
          "Laktik Asit Hazırlanışı ve Kullanımı: Sulandırılarak %15 asit + %85 temiz içme suyu ile seyreltilip iyice çalkalanır. Plastik fısfıs şişesine konup kovan üzerinden çerçeve aralarına ve arıların üzerine ince sis şeklinde fıskırtılabilir. Çok ani bir şok öldürücü etkisi yoktur; ancak düzenli ve sürekli periyodik kullanımda akarları çok başarılı şekilde döker. Açık yavruya, yumurtaya ve ana arıya zarar vermez.",
          "2. FORMİK ASİT (Karınca Asiti - Güçlü Buhar Etkisi): Halk arasında karınca asiti olarak bilinen, kapalı yavru gözlerinin altına bile nüfuz edebilen son derece etkili ve yakıcı bir organik asittir. Piyasada çok fazla formu ve derecesi bulunur; mutlaka kaliteli DİHİDRAT formu tercih edilmelidir. Sanayi tipleri yabancı madde ve ağır kimyasal içerdiğinden çok problemlidir, kovan sağlığı için asla ucuza kaçılmamalıdır!",
          "Formik Asit Sıcaklık, Havalandırma ve Güvenlik Sınırları: Uygulama dönemi sonbahardır (veya erken ilkbahar). Hava sıcaklığı mutlaka 15°C ile 25°C arasında olmalıdır. Kesinlikle 20-28°C kritik üst sıcaklık sınırını aşmamalı ve yağmurlu havada uygulanmamalıdır! Aşırı sıcaklıkta ani buharlaşma kovanın sönmesine (koloninin ölmesine) yol açar. Arı gün içinde dışarı çıkabiliyor olmalı ve kovan havalandırması mükemmel olmalıdır; havalandırma yetersiz kalırsa arılar strese girer, ana arıyı keser (öldürür) veya kovan terki yaşanır!",
          "Formik Asit Dozajı ve Uygulama Tekniği: Dozaj kovana 10 cc'yi (ml) kesinlikle geçemez! Hızlı buharlaşırsa kovan ölür. Açık yavruya yakıcı etkisi nedeniyle zarar verir. Alttan uygulanamaz; formik asit buharı havadan ağır olduğu için üstten çıtaların üzerine yerleştirilen aparatlar veya karton plakalar vasıtasıyla verilir. Arı ani stres ve koku şoku yaşamasın diye ilk gün alıştırma dozu olarak birkaç cc verilir, arı ortama alıştıktan sonra ertesi gün 10 cc'ye tamamlanır. 10 cc kuralına uyulduğunda arıya zararı yoktur; ciddi miktarda varroa döker ve bu döküm yavaş yavaş 2 gün boyunca kovan içine yayılarak devam eder.",
          "Kişisel Korunma (İş Güvenliği): Kendini koru, formik asit yakıcıdır ve buharı asla solunmamalıdır! Açık havada oksalik asit kadar akciğerlere çökücü olmasa da buharı yakıcıdır; mutlaka kimyasal koruyucu gözlük, asit filtreli maske ve aside dayanıklı eldiven takılmalıdır.",
          "3. OKSALİK ASİT (Kışlık Yavrusuz Dönem Silahı): Kışın hava sıcaklığı 0°C ile 5°C arasındayken, yavrunun en az olduğu veya kuluçkanın tamamen bittiği tarihte (Kasım-Ocak) kullanılır. Fazlası olursa veya sıcak havalarda arıya zarar verir.",
          "Oksalik Asit Uygulama Yöntemleri: 1) Isıtarak Buharlaştırma (Süblimasyon): Elektrikli buharlaştırıcı aparatla uçuş deliğinden verilir. DİKKAT: Süblimleşen oksalik asit buharını solumak insan ciğerlerine çok ağır ve kalıcı zarar verir; mutlaka profesyonel asit gaz maskesi takılmalıdır! 2) Doğal Gliserinli Mendil Yöntemi: Oksalik asit doğal saf gliserinle karıştırılıp selüloz emici mendillere emdirilir ve çıtaların üzerine serilir. Arılar bu mendili kemirip parçalayarak kovan dışına atmaya çalışırken temas yoluyla asidi tüm kovan içine yayar ve uzun süreli akar dökümü sağlar.",
          "Oksalik Asit Kritik Uyarısı: Asla devamlı ve sık sık kullanılmaz! Arının hassas ağız sistemine, sindirim organlarına ve solunum trakesine zarar verir. Yılda 1 (en fazla 2) defa, sadece yavrusuz kış salkımında uygulanmalıdır.",
        ],
        stepByStep: [
          "Laktik Asit Reçetesi: %15 saf laktik asit + %85 içme suyunu plastik sprey şişesinde çalkalayın. Çerçeveleri kaldırarak arılı yüzeylere 45 derecelik açıyla hafif buğu halinde fıskırtın (kovan başına 30-50 ml püskürtme).",
          "Formik Asit 10 cc Protokolü: Sıcaklığın 15-25°C aralığında ve yağmursuz olduğunu teyit edin. Havalandırmayı açın. 1. Gün: 3 cc alıştırma dozunu üst aparatla çıtaların üstüne koyun. 2. Gün: 10 cc kaliteli dihidrat formik asit ile tamamlayın. 2 gün boyunca kovanı açmayın.",
          "Oksalik Asit Gliserinli Mendil: 100 ml bitkisel gliserini 60°C'de hafifçe ısıtıp içine 100 gr oksalik asit dihidratı döküp şeffaflaşana kadar karıştırın. Selüloz havlu/mendillere emdirin. 0-5°C kış salkımında çıtaların üzerine yatırın.",
        ],
        warnings: [
          "Formik asit asla 10 cc dozajını aşamaz! 25°C üstü sıcaklıkta kovan söner ve ana arı kesilir.",
          "Formik asit alttan verilemez, mutlaka çıtaların üstünden uygulanmalıdır. Kovan havalandırması tam açık olmalıdır.",
          "Oksalik asit buharını kesinlikle solumayınız; insan ciğerine çok zararlıdır, tam koruyucu maske takınız.",
          "Oksalik asit devamlı kullanılmaz, arının ağız yapısını ve trakesini yıpratır. Sadece kışın 0-5°C'de yavrusuzken uygulanır.",
          "Asitlerle çalışırken koruyucu asit gözlüğü, kimyasal eldiven ve gaz maskesi kullanınız.",
        ],
        calculatorType: "formic",
      },
      {
        id: "3-3",
        title: "⭐ Uçucu Esansiyel Yağlar ile Doğal Koruma (Kekik, Okaliptüs, Nane, Çay Ağacı)",
        summary: "Kekik (Timol), Okaliptüs (Sineol), Nane (Mentol) ve Çay ağacı uçucu yağlarıyla doğal akar dökümü, temizleme refleksi ve bağışıklık kalkanı.",
        content: [
          "Uçucu Aromatik Yağların Arıcılıktaki Yeri: Bitkilerin damıtılmasıyla elde edilen saf uçucu esansiyel yağlar; arıcılıkta hem varroa akarlarının sinir sistemini felç ederek düşmesini sağlamak hem de koloninin hijyenik tımar (grooming) refleksini uyarmak için doğanın sunduğu en kıymetli hazinedir.",
          "1. KEKİK YAĞI & TİMOL (Thymus vulgaris - Karvakrol): Varroa mücadelesinde doğal altın standarttır. 15°C ile 30°C arasında buharlaşan timol ve karvakrol molekülleri, varroa akarlarının ayaklarındaki vantuzların tutunma kabiliyetini yok eder, akarları sersemletip dip ızgarasına döker. Aynı zamanda güçlü bir antiseptiktir; nosema ve mantar sporlarını yok eder. İlkbahar/sonbahar şerbetine 1 litreye 1-2 damla saf kekik yağı damlatılması sindirim sistemini temizler.",
          "2. OKALİPTÜS YAĞI (Eucalyptus globulus - Sineol): Yüksek oranda 'Eucalyptol (1,8-sineol)' bileşeni içerir. Arıların solunum borularını (trake) dezenfekte eder ve ölümcül trake akarına (Acarapis woodi) karşı en güçlü doğal korumayı sağlar. Kovan içindeki nem ve bayat hava kokusunu arındırarak ferah ve antimikrobiyal bir hava yaratır.",
          "3. NANE YAĞI & MENTOL (Mentha piperita): Arıların koku alma antenlerini ve birbirlerini temizleme (grooming) refleksini anında uyarır. Yoğun nane kokusu arıları hareketlendirir; arılar birbirlerinin üzerindeki varroaları ısırarak bacaklarını koparır ve kovan dışına atarlar. Kovan içi havalandırma güdüsünü tetikler.",
          "4. ÇAY AĞACI YAĞI (Melaleuca alternifolia - Tea Tree): Doğanın en güçlü doğal antibakteriyel ve antifungal uçucu yağıdır. Kireç hastalığı (Ascosphaera apis), yavru çürüklüğü başlangıcı ve peteklerdeki küf mantarlarına karşı kovan içi doğal bir koruyucu bariyer oluşturur.",
          "5. DEFNE VE LAVANTA YAĞI: Arıları sakinleştirici ve varroayı sersemletici etkiye sahiptir. Özellikle körük yakıtına kuru defne yaprağı ve lavanta dalları eklenmesi ya da çıta üstüne birkaç damla damlatılması muayene esnasında arının hırçınlaşmasını engeller.",
        ],
        stepByStep: [
          "Doğal Mukavva Şerit Yapımı: 100 ml doğal taşıyıcı yağ (hafif zeytinyağı veya sıvı parafin) içine 15 damla saf kekik yağı + 10 damla okaliptüs yağı + 5 damla nane yağı + 5 damla çay ağacı yağı damlatıp iyice çalkalayın. 3x15 cm mukavva şeritlere emdirip kuluçkalık çıtalarının üzerine yatırın.",
          "Şerbet & Şurup Aromaterapi Katkısı: 5 litre soğumuş teşvik şerbetine, yarım çay bardağı ılık suda 1 tatlı kaşığı organik elma sirkesi ile emülsifiye edilmiş 3 damla kekik yağı ve 2 damla nane yağı ilave edip karıştırın. Akşam beslemesi yapın.",
          "Körük Aromaterapisi: Körük yakıtının üstüne kuru kekik demeti, defne yaprakları ve çam kozalağı ilave edin. Kovan açıldığında arıların üzerine hafifçe tütsüleyin.",
        ],
        traditionalSolutions: [
          "Eski Usta Ot Karışımı: Kuru kekik yaprağı, dağ nanesi ve pelin otu dövülerek tülbent içinde kovan örtü bezinin üzerine konur; arılar örtüyü havalandırdıkça kokusu akarları döker.",
          "Kekik Suyu Püskürtme: 1 litre kaynar suya 2 çorba kaşığı dağ kekiği atılıp 15 dakika demlendirilir, soğuyunca süzülüp fısfıs ile kovan içine sıkılır; hem koku kaynaşması sağlar hem akar dökümünü hızlandırır.",
        ],
        modernSolutions: [
          "Standart Timol Kristali Plakaları: 15-30°C hava sıcaklığında kovan üstüne jel veya sünger şeklinde konur, doğal kekik kokusuyla 3-4 hafta boyunca dengeli akar dökümü sağlar.",
          "Mikro-Emülsiyon Esansiyel Şeritler: Uçucu yağların kovan sıcaklığında kontrollü ve homojen salınmasını sağlayan selülozik taşıyıcı şeritler.",
        ],
        warnings: [
          "Uçucu esansiyel yağları saf ve konsantre halde doğrudan arıların veya ana arının üzerine asla damlatmayınız; mutlaka taşıyıcı yağ veya şerbet içinde seyreltilmelidir.",
          "Aşırı dozda nane veya kekik yağı kovan içi koku karmaşasına yol açabilir; önerilen damla sayılarına sadık kalınız.",
        ],
      },
      {
        id: "3-4",
        title: "Yavru Çürüklüğü (Amerikan & Avrupa), Kireç, Taş ve Tulumsu Hastalığı",
        summary: "Kovanı yok edebilecek tehlikeli yavru hastalıklarının teşhis ipuçları, kibrit testi ve yasal tedbirler.",
        content: [
          "1. Amerikan Yavru Çürüklüğü (AYÇ - Paenibacillus larvae): İhbarı mecburidir! Sporları 40 yıl canlı kalabilir. Belirtileri: Petek kuluçka düzeninde delikli, içeri çökmüş ve koyulaşmış petek gözleri. Gözün içine kibrit çöpü sokulup çekildiğinde çürük balık kokusu eşliğinde 2-3 cm iplik gibi uzayan kahverengi yapışkan kitle. Tedavisi antibiyotikle yapılamaz; Tarım Bakanlığı talimatıyla kovan imha edilir veya yakılır. Erken dönemde 'Çifte Silkme Yöntemi' ile temiz kovana sadece ham petek verilerek arı kurtarılabilir.",
          "2. Avrupa Yavru Çürüklüğü (EYÇ - Melissococcus plutonius): Genellikle larva sırlanmadan önce ölür, kıvrık sarımsı 'C' şekli alır. Ekşi sirke kokusu yayar. Kibrit testinde uzama yapmaz. Güçlü koloniler, kuluçka döngüsü kesintisi ve genç hijyenik ana arı ile tedavi edilebilir.",
          "3. Kireç Hastalığı (Ascosphaera apis): Larvaların kireç parçası gibi beyaz-gri taşlaşmasıdır. Taban nemi ve yetersiz havalandırma tetikler. Kovan dip tahtasına dökülen kireç mumyalarıyla teşhis edilir. Çay ağacı yağı, kekik esansı ve taban havalandırmasıyla iyileşir.",
          "4. Taş Hastalığı (Aspergillus flavus): Larvaları ve ergin arıları taş gibi katılaştıran, yeşilimsi küf üreten zoonoz bir mantardır. Maskesiz yaklaşılmamalıdır.",
          "5. Tulumsu Yavru Çürüklüğü (Sacbrood Virus): Larvanın sırlanma aşamasında başı yukarı kalkık, su dolu bir tulum gibi cımbızla dağılmadan tek parça çıkmasıdır. Ana arı değişimi ve vitamin takviyesi ile aşılır.",
        ],
        stepByStep: [
          "AYÇ Şüphesinde Saha Adımları: 1) Kibrit çöpü testini yapın; uzama varsa kovanı hemen kapatın. 2) Uçuş deliğini daraltıp yağmayı önleyin. 3) İlçe Tarım Müdürlüğü'ne haber verin. 4) Asla başka kovanlara çerçeve aktarmayın.",
          "Kireç Hastalığı Tedavi Adımı: 1) Kovanı güneşli kuru sehpaya alın. 2) Alt tel havalandırmayı açın. 3) Kireçli petekleri çıkarıp eritin. 4) 1 litre 1:1 şerbete 3 damla çay ağacı yağı katarak besleyin.",
        ],
        warnings: [
          "Amerikan Yavru Çürüklüğü'nde KESİNLİKLE ANTİBİYOTİK KULLANMAYINIZ! Antibiyotik bakterinin sporlarını öldürmez, hastalığı gizler ve baldaki kalıntısıyla insan sağlığını tehlikeye atar.",
        ],
      },
      {
        id: "3-5",
        title: "Şerbet ve Besin Hazırlama Teknikleri (İnvert Şurup & Kek)",
        summary: "Arının midesini yormayan 1:1, 2:1 şerbet tarifleri, ters şeker (invert) tekniği ve arı keki yapımı.",
        content: [
          "1:1 İlkbahar Teşvik Şerbeti: 1 litre suya 1 kg toz şeker. Arılara nektar akımı hissi vererek kraliçeyi yumurtlatır. Su ılık olmalı, şeker kaynatılmamalıdır! İçine yarım limon suyu veya 1 çay kaşığı organik elma sirkesi eklenir.",
          "2:1 Sonbahar Kışlatma Şerbeti: 1 litre suya 2 kg toz şeker. Yoğun kıvamlıdır; arı kışlık stok yaparken fazla su uçurmakla yorulmaz. Yağmacılığı önlemek için akşam saatlerinde verilir.",
          "Ters Şeker (İnvert Şurup) Nedir? Sakaroz şekeri arının invertaz enzimiyle glukoz ve fruktoza parçalaması arının ömrünü kısaltır. İnvert şurup, sitrik asit (limon tuzu) veya invertaz enzimiyle şekerin önceden parçalanmasıdır. Hazırlandığında arıyı yıpratmaz ve petekte asla ekşimez.",
        ],
        stepByStep: [
          "Evde İnvert Şurup Yapımı: 10 kg kristal şeker + 4 litre su + 10 gram limon tuzu (sitrik asit). Karışım 70-75°C'de yaklaşık 45-60 dakika yavaşça karıştırılır (asla 80°C'yi aşıp kaynatılmaz, aksi halde toksik HMF oluşur!). Karışım berraklaşınca soğumaya bırakılır.",
          "Proteinli Arı Keki Yapımı: 3 kg pudra şekeri + 1 kg süzme bal veya invert şurup + 200 gr polen ikamesi veya bira mayası + 2 yemek kaşığı elma sirkesi. Hamur gibi yoğrulup buzdolabı poşetine konur, üzeri çizilerek çerçevelerin üstüne yatırılır.",
        ],
        calculatorType: "syrup",
      },
      {
        id: "3-6",
        title: "Petek Zararlıları: Balmumu Güvesi, Trake Akarları ve Kovan Böceği",
        summary: "Kabarmış petekleri un haline getiren güveye karşı biyolojik B401, dondurucu şoklaması ve trake akarı mentol protokolü.",
        content: [
          "Balmumu Güvesi (Galleria mellonella): Zayıf kovanlarda ve depodaki kabarmış peteklerde tüneller açarak ipeksi ağlar ören ve mumu toza çeviren zararlıdır. Korunmanın en doğal yolu petekleri depolamadan önce -18°C derin dondurucuda 24 saat şoklamaktır. Biyolojik Bacillus thuringiensis (B401) bakterisi güve larvalarını peteğe zarar vermeden yok eder.",
          "Trake Akarları (Acarapis woodi): Arıların nefes borularına yerleşerek kanatların 'K' şeklinde açılmasına ve uçamamaya yol açar. Tülbent içinde kovan üstüne konan 50 gr mentol kristalleri ve okaliptüs yağı dumanı ile temizlenir.",
          "Küçük Kovan Böceği (Aethina tumida): Karantinaya tabi istilacı bir böcektir. Balı mayalandırıp çürük portakal kokusu yayar. Görüldüğünde derhal Tarım Müdürlüğü'ne ihbar edilmelidir.",
        ],
        warnings: [
          "Petekleri güveden korumak için KESİNLİKLE NAFTALİN KULLANMAYINIZ! Naftalin petekte ve balda kalıcı kanserojen zehir bırakır.",
        ],
      },
      {
        id: "3-7",
        title: "Petek Kusurları, Yalancı Ana, Petek Çökmesi ve Kovan Yağmacılığı",
        summary: "Kambur yavru, yalancı anadan kovan kurtarma tekniği, aşırı sıcakta petek erimesi ve yağmacılık savunması.",
        content: [
          "Yalancı Anaya Kaçma: Kovan uzun süre anasız kaldığında işçi arıların yumurtalıkları gelişir; petek gözü kenarlarına 3-5 adet biçimsiz yumurta atarlar ve hepsi kubbe şeklinde erkek arıya ('kambur yavru') dönüşür. Kurtarma yöntemi: Kovan 40 metre uzağa taşınıp örtüye silkelenir. Eski kovana açık yavrulu test çerçevesi verilir; açık yavru feromonu işçi arıların yumurtalıklarını köreltir ve yeni kraliçe kabul ettirilir.",
          "Petek Çökmesi (Sıcak Çarpması): 38°C üstü gölgesiz sıcakta balmumu yumuşayarak kovan tabanına düşer ve arılar boğulur. Kovanların üstüne gölgelik yapılmalı ve arılıkta temiz su kaynağı bulundurulmalıdır.",
          "Kovan Yağmacılığı (Robbing): Nektar kıtlığında güçlü kovanların zayıf kovanın balını parçalamasıdır. Uçuş deliği tek arı geçecek kadar daraltılır, girişe cam levha konur ve beslemeler sadece gece yapılır.",
        ],
      },
    ],
  },
  {
    id: "bolum-4",
    chapterNumber: 4,
    title: "Hasat ve Ürün İşleme",
    subtitle: "Balın Olgunlaşma Tespiti, Süzme, Polen, Propolis, Arı Sütü ve Apiterapi",
    badge: "4. Cilt",
    icon: "Wheat",
    description:
      "Emeklerin karşılığını alma vakti. Sırlanmış olgun bal hasadı, hijyenik süzme, polen tuzaklama, propolis tentürü ve arı sütü sağımı.",
    subsections: [
      {
        id: "4-1",
        title: "Balın Olgunlaşma Tespiti ve Hasat Zamanlaması",
        summary: "Ham bal asla hasat edilmez! Peteklerin en az %70 sırlanması ve nem oranı kuralları.",
        content: [
          "Ham bal (olgunlaşmamış nektar) %20'den fazla su içerir ve kavanozda kısa sürede fermente olup ekşir.",
          "Sırlanma Kuralı: Bir peteğin hasat edilebilmesi için petek yüzeyinin en az 2/3'ünün (üçte ikisinin - %70) arılar tarafından balmumu ile sırlanmış (mühürlenmiş) olması gerekir.",
          "Silkeleme Testi: Peteği yatay tutup hafifçe aşağı doğru silkeleyin; eğer gözlerden nektar damlıyorsa o petek henüz olgunlaşmamıştır, kovanda kalmalıdır.",
          "Refraktometre Ölçümü: Profesyonel arıcılar bal refraktometresi ile nemi ölçer. Kaliteli Türk balında nem oranı maksimum %17 - %18 olmalıdır.",
        ],
        stepByStep: [
          "Adım 1: Sabah erken saatte körükle hafif duman verip sırlı ballık çerçevelerini fırça yardımıyla arılarından arındırın.",
          "Adım 2: Çerçeveleri arı geçirmez kapalı taşıma sandıklarına koyup hızla hasat odasına alın.",
          "Adım 3: Kovanlara yağmacılık başlatmamak için arılıkta açıkta bal veya şerbet damlası bırakmayın.",
        ],
      },
      {
        id: "4-2",
        title: "Bal Süzme, Dinlendirme ve Paketleme",
        summary: "Sır alma, santrifüj süzme makinesi ve dinlendirme kazanında hava kabarcığı ayrıştırma.",
        content: [
          "Sır Alma: Sır tarağı veya sıcak sır bıçağı ile petek yüzeyindeki ince balmumu tabakası zarar vermeden soyulur.",
          "Santrifüj Süzme: Çerçeveler dönen süzme makinesine dengeli yerleştirilir. İlk başta yavaş çevrilir, petek kırılmasını önlemek için iki yönlü süzülür.",
          "Dinlendirme: Süzülen bal çift katlı paslanmaz süzgeçten geçirilerek dinlendirme kazanına alınır. Oda sıcaklığında (20-25°C) 48-72 saat dinlendirilir. Bu sürede balın içindeki mikroskobik hava kabarcıkları ve balmumu zerreleri yüzeye çıkar ve köpük şeklinde sıyrılarak alınır.",
          "Paketleme: Bal ışık almayan cam kavanozlarda, oda sıcaklığında (15-20°C) muhafaza edilmelidir. Metal kapak hava almayacak şekilde kapatılır.",
        ],
      },
      {
        id: "4-3",
        title: "Değerli Yan Ürünler: Polen, Propolis ve Arı Sütü",
        summary: "Kovanın sadece bal değil; süper gıdalar üreten mucizevi fabrikasını keşfedin.",
        content: [
          "Tuzaklanmış Polen: Kovan altına yerleştirilen polen tuzaklarıyla toplanır. Tarlacı arı ızgaradan geçerken bacaklarındaki polen sepeti çekmeceye dökülür. Polen her gün toplanmalı, nemli bırakılmamalıdır. Yaş olarak dondurucuda (-18°C) saklanabilir veya 35°C'yi aşmayan fırınlarda kurutulur.",
          "Propolis: Arıların kavak, huş ve çam reçinelerinden ürettiği doğal antibiyotiktir. Kovan üst örtü bezi yerine plastik propolis ızgarası konur. Dolunca buzluğa atılır; soğukta donan propolis çıtır çıtır kırılarak toplanır. Evde %70-96 saf etil alkol ile 1/3 oranında 30 gün çalkalanarak zengin propolis tentürü elde edilir.",
          "Arı Sütü: Genç işçi arıların yutak bezlerinden salgıladığı kraliyet besinidir. Ana arı yüksüklerinden transferin 72. saatinde plastik/ahşap spatulalarla toplanır ve ışık görmeden -18°C derin dondurucuya konur.",
        ],
      },
    ],
  },
  {
    id: "bolum-5",
    chapterNumber: 5,
    title: "İleri Düzey Arıcılık ve İnovasyon",
    subtitle: "Ana Arı Yetiştiriciliği, Kraliçe Doğum Takvimi, Suni Tohumlama ve Dijital Arılık",
    badge: "5. Cilt",
    icon: "Sparkles",
    description:
      "Doolittle larva transferi, uluslararası ana boyama renkleri, mikroskopik suni tohumlama ve kovan terazisi gibi dijital teknolojiler.",
    subsections: [
      {
        id: "5-1",
        title: "Ana Arı Yetiştiriciliği (Doolittle Yöntemi)",
        summary: "Damızlık kovandan 1 günlük genç larvaların aktarılması ile üstün vasıflı ana arı üretimi.",
        content: [
          "Doolittle Yöntemi: Yapay ana yüksüğü çanaklarına transfer iğnesiyle 12-24 saatlik en genç larvaların aşılanmasıdır.",
          "Başlatıcı Koloni (Cell Starter): Güçlü, genç işçi arı nüfusu çok yoğun, anasız bırakılmış kovanlara aşılama çıtası verilir. Arılar 24-48 saat içinde larvalara hücum ederek sütle doldurur ve memeleri başlatır.",
          "Bitirici Koloni (Finisher): Başlatılan yüksükler güçlü, katlı bir kovanın üst katına (ana ızgarası üstü) verilerek sırlanana kadar mükemmel beslenir.",
        ],
        stepByStep: [
          "1. Gün: Damızlık kovandan en genç hilal şeklindeki kurtçukları (1 günlük larva) seçin.",
          "2. Gün: Aşılama iğnesiyle bir damla arı sütü üzerine larvayı zedelemeden bırakın.",
          "3. Gün: Başlatıcı kolonide kabul oranını sayın (genellikle %85-95 başarı).",
          "10. Gün: Memeler sırlanıp kuluçka dönemi bitmeden önce tek tek ruşetlere veya çiftleşme kutularına (strafor) dağıtın.",
        ],
      },
      {
        id: "5-2",
        title: "Kraliçe Doğum Süreci ve Sonrası İlk 15 Günde Yapılacaklar",
        summary: "Doğumdan ilk yumurtaya gün gün kraliçe takibi ve uluslararası işaretleme renkleri.",
        content: [
          "1. Gün (Doğum): Genç ana memeyi kemirip çıkar. Hemen diğer memeleri arar ve sokarak rakiplerini yok eder. Ses çıkararak (öterek / piping) egemenliğini ilan eder.",
          "2 - 4. Gün: Kovan içinde gezinir, bolca beslenir, dış kabuğu sertleşir ve mandibular feromon salgısı artar.",
          "5 - 8. Gün (Oryantasyon ve Çiftleşme): Hava güneşli ve rüzgarsız olduğunda (13:00 - 16:00 arası) çiftleşme uçuşuna çıkar. Havada erkek arı toplanma alanlarında 10-18 farklı erkek arıyla havada çiftleşir. Spermathecasına 5-6 milyon sperm depolar.",
          "10 - 14. Gün (İlk Yumurtlama): Çiftleşen ananın karnı şişer ve petek gözlerine baş aşağı girerek dik, bembeyaz yumurtalar bırakmaya başlar.",
          "Uluslararası Ana Arı Boyama Renkleri: Son rakama göre uluslararası standart: 1 ve 6 = BEYAZ, 2 ve 7 = SARI, 3 ve 8 = KIRMIZI, 4 ve 9 = YEŞİL, 5 ve 0 = MAVİ. (Örnek: 2026 yılı rengi = BEYAZ, 2025 yılı = MAVİ).",
        ],
      },
      {
        id: "5-3",
        title: "Suni Tohumlama ve Dijital Arıcılık Sistemleri",
        summary: "Genetik ıslah laboratuvarı ve IoT kovan terazileri ile akıllı arılık.",
        content: [
          "Suni Tohumlama (İnseminasyon): Saf ırk hatlarını korumak için mikroskop altında anestezi (CO2) verilmiş kraliçeye, seçilmiş damızlık erkek arılardan alınan spermlerin mikro-şırınga ile enjekte edilmesidir.",
          "Dijital Kovan Terazisi: Kovan altına konulan GSM/GPRS bağlantılı ağırlık sensörleri arıcının cep telefonuna her saat veri gönderir. Günlük tartı artışı nektar akımının başladığını veya ani kilo kaybı oğul çıktığını anında haber verir!",
          "İç Sıcaklık & Nem Sensörleri: Kovan içi kuluçka ısısının (34.5°C) sabit kalıp kalmadığını, kışın salkımın durumunu kapağı açmadan takip etmeyi sağlar.",
        ],
      },
    ],
  },
  {
    id: "karakovan-geleneksel",
    chapterNumber: 6,
    title: "Geleneksel Karakovan ve Eski Tip Arı Bakımı",
    subtitle: "Sepet Kovan, Kütük Arıcılığı, Sıfır Mum Katkısı ve Doğal Oğul Yönetimi",
    badge: "Özel Bölüm",
    icon: "Boxes",
    description:
      "Atalarımızın asırlık yöntemleriyle kütük ve sepet karakovan bakımı, kılavuz peteksiz doğal petek ördürme ve melisa otuyla oğul yakalama.",
    subsections: [
      {
        id: "6-1",
        title: "Karakovan Felsefesi ve Kovan Türleri (Kütük & Sepet)",
        summary: "Doğallığın zirvesi: İnsan eliyle basılmış hazır mum yok, çerçeve yok, tel yok!",
        content: [
          "Karakovan balının modern fenni kovandan en büyük farkı, arıya hiçbir hazır parafinli ham petek verilmemesidir. Arı peteğin tamamını kendi karın halkalarındaki balmumu bezlerinden salgılar.",
          "Kütük Karakovan (Ihlara / Ağaç Oyma): İçi oyulmuş ıhlamur, kestane veya çam kütüklerinden yapılır. İki ucu ahşap kapakla kapatılır, arkadan bal hasat edilir, önden arı girip çıkar.",
          "Sepet Kovan: Hayıt, söğüt veya fındık dallarından örülen sepetin dışı; killi toprak, odun külü ve taze sığır gübresi (tezek) harcıyla sıvanır. Bu sıva kovanı kışın sıcacık tutar, yazın serinletir ve parazit barındırmaz.",
        ],
      },
      {
        id: "6-2",
        title: "Kılavuz Petek ve Tamamen Doğal Petek Ördürme",
        summary: "Düzgün petek örmeleri için tavan çizgisi oluşturma sırları.",
        content: [
          "Karakovanın tavanına sadece 1 cm genişliğinde saf doğal balmumu eritilerek çizgi çekilir (kılavuz izi).",
          "Arılar bu çizgiyi referans alarak aşağıya doğru kusursuz hilal şeklinde petek sarkıtırlar.",
          "Karakovan balı peteğiyle birlikte tüketilir çünkü mumu ağızda sakızlaşmaz, ipek gibi erir.",
        ],
      },
      {
        id: "6-3",
        title: "Doğal Oğul Yakalama ve Kovana Yerleştirme Sanatı",
        summary: "Ağaç dalına konan oğul kümesini melisa kokusuyla sakinleştirip sepete alma adımları.",
        content: [
          "Oğul Otu (Melisa officinalis): Arıların nasonov feromonuna birebir benzeyen koku yayar. Oğul yakalama sepetinin içine taze melisa yaprakları ovularak sürülür.",
          "Körükle Sakinleştirme: Dalda asılı oğul kümesine hafif serin duman üflenir, arılar dalı daha sıkı tutar.",
          "Çırpma Tekniği: Sepet kümenin altına tutulur ve dala tek, sert bir darbe vurulur. Arıların %90'ı sepetin içine dökülür.",
          "Anayı Bulma: Eğer kraliçe sepetin içine düşmüşse, havadaki arılar kanat çırparak koku yayar ve 15 dakika içinde hepsi tıpış tıpış sepete yürür.",
        ],
      },
      {
        id: "6-4",
        title: "Karakovan Hasadı ve Kışlatma Farkları",
        summary: "Arının hakkını bırakarak hasat etmek: Doğal dengeyi korumanın sırrı.",
        content: [
          "Karakovanda bal hasadı genellikle sonbaharda (Eylül-Ekim) yapılır.",
          "Kütük kovanın arka kapağı açılır, duman verilerek arılar öne doğru sürülür.",
          "Kovanın arka yarısındaki bal özel kıvrık hasat bıçağıyla kesilir. Asla kovanın tamamı hasat edilmez; ön kısımdaki yavrulu ve ballı alan arının kışlık hakkı olarak bırakılır!",
        ],
      },
    ],
  },
];
