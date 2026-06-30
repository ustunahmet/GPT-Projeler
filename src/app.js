const missions = [
  {
    id: "education",
    label: "Eğitim / öğrenme / başlangıç",
    recommendedTypes: ["training", "hobby"],
    why: "Eğitim görevlerinde amaç maksimum performans değil; düşük maliyet, kolay tamir edilebilirlik, güvenli test ve anlaşılır sistem mimarisidir. Küçük quadcopter veya eğitim frame’i yeni başlayan kullanıcı için en doğru başlangıçtır."
  },
  {
    id: "imaging",
    label: "Fotoğraf / video / haritalama",
    recommendedTypes: ["camera", "multirotor"],
    why: "Görüntüleme görevlerinde titreşim, stabilite, uçuş kontrol hassasiyeti ve gimbal entegrasyonu önceliklidir. Yüksek hızdan çok temiz görüntü, güvenli hover ve batarya yönetimi önemlidir."
  },
  {
    id: "fpv",
    label: "FPV / hızlı manevra / sportif uçuş",
    recommendedTypes: ["fpv"],
    why: "FPV sistemlerde düşük ağırlık, yüksek thrust-to-weight oranı, gecikmesi düşük görüntü aktarımı ve çevik kontrol önceliklidir. Uzun süreli hover değil, yüksek tepki ve dayanıklı frame gereklidir."
  },
  {
    id: "agriculture",
    label: "Tarım / ilaçlama / saha uygulaması",
    recommendedTypes: ["agriculture"],
    why: "Tarım görevlerinde sıvı payload, pompa/nozul sistemi, korozyon dayanımı, geniş pervane, düşük disk yükü ve servis kolaylığı kritik hale gelir. Bu sınıfta gövde hacmi ve bakım erişimi performans kadar önemlidir."
  },
  {
    id: "cargo",
    label: "Kargo / taşıma / lojistik",
    recommendedTypes: ["heavyLift", "vtol"],
    why: "Kargo görevlerinde sadece kaldırma kuvveti yetmez; ağırlık merkezi, payload sabitleme, görev süresi, yedekli güç dağıtımı ve emniyetli iniş senaryosu tasarımın merkezinde olmalıdır."
  },
  {
    id: "fire",
    label: "Yangın / afet / yüksek sıcaklık çevresi",
    recommendedTypes: ["tethered", "heavyLift"],
    why: "Yangın ve afet görevlerinde termal dayanım, kablolu güç seçeneği, nozul/payload entegrasyonu, operatör güvenliği ve görev sürekliliği normal drone projelerinden daha kritiktir. Batarya ve elektronik koruması ayrı tasarlanmalıdır."
  },
  {
    id: "security",
    label: "Güvenlik / ISR / keşif-gözetleme",
    recommendedTypes: ["multirotor", "vtol"],
    why: "Güvenlik ve ISR görevlerinde sessiz çalışma, stabil görüntü, uzun süreli görev, güvenilir haberleşme, GNSS/RTK ve veri güvenliği birlikte düşünülmelidir. Platform seçimi görev menziline göre değişir."
  },
  {
    id: "research",
    label: "Ar-Ge / özel mühendislik projesi",
    recommendedTypes: ["heavyLift", "vtol", "tethered"],
    why: "Ar-Ge projelerinde amaç hazır ürün almak değil; gereksinim, hesap, prototip, test ve doğrulama döngüsü kurmaktır. Kullanıcı, varsayımları ve mühendislik limitlerini görerek ilerlemelidir."
  }
];

const droneTypes = [
  {
    id: "hobby",
    label: "Hobi quadcopter",
    title: "Hobi / başlangıç quadcopter",
    baseScore: 74,
    explanation: "Basit mekanik yapı, düşük maliyet ve hızlı öğrenme için uygundur. Payload veya uzun menzil hedefleri için doğru sınıf değildir.",
    components: ["Basit ve dayanıklı frame", "4 motorlu yapı", "Uygun maliyetli ESC", "6S veya daha düşük batarya", "Temel flight controller"]
  },
  {
    id: "training",
    label: "Eğitim drone’u",
    title: "Eğitim odaklı güvenli platform",
    baseScore: 82,
    explanation: "Öğrencinin frame, motor, ESC, batarya, pervane ve yazılım ilişkisini anlaması için kontrollü ve modüler yapı sağlar.",
    components: ["Koruyucu pervane yapısı", "Kolay sökülebilir frame", "Düşük riskli batarya", "Simülasyon destekli uçuş", "Yedek pervane ve kol seti"]
  },
  {
    id: "fpv",
    label: "FPV / racing drone",
    title: "FPV çevik uçuş platformu",
    baseScore: 78,
    explanation: "Yüksek çeviklik, düşük gecikme ve yüksek güç/ağırlık oranı sunar. Eğitim için dikkatli simülasyon ve emniyet alanı gerekir.",
    components: ["Yüksek KV motor", "Düşük gecikmeli VTX", "Dayanıklı karbon frame", "Yüksek C değerli batarya", "PID ayarı ve filtreleme"]
  },
  {
    id: "camera",
    label: "Kamera / gimbal drone’u",
    title: "Stabil görüntüleme platformu",
    baseScore: 84,
    explanation: "Titreşim izolasyonu, stabil hover, gimbal uyumu ve güvenli batarya yönetimi için dengeli bir multirotor yaklaşımı gerekir.",
    components: ["Düşük titreşimli motor-pervane kombinasyonu", "Gimbal montaj alanı", "GNSS destekli FC", "Titreşim sönümleme", "Temiz güç hattı"]
  },
  {
    id: "multirotor",
    label: "Genel amaç multirotor",
    title: "Genel amaç profesyonel multirotor",
    baseScore: 80,
    explanation: "Görüntüleme, test, hafif taşıma ve güvenlik görevleri için esnek bir mimari sunar. Menzil ve verim sabit kanat/VTOL kadar yüksek değildir.",
    components: ["Yeterli thrust rezervi", "Modüler payload rayı", "RTK/GNSS opsiyonu", "Güvenilir PDU", "Uçuş log analizi"]
  },
  {
    id: "agriculture",
    label: "Tarım drone’u",
    title: "Tarım ve sıvı payload platformu",
    baseScore: 86,
    explanation: "Sıvı tank, pompa, nozul, geniş pervane ve saha bakımına göre tasarlanır. Ağırlık merkezi sıvı hareketi nedeniyle ayrıca kontrol edilmelidir.",
    components: ["Kimyasala dayanıklı gövde", "Pompa/nozul kontrolü", "Geniş pervane", "Yüksek kapasiteli batarya", "Saha bakım modülleri"]
  },
  {
    id: "heavyLift",
    label: "Ağır yük multirotor",
    title: "Ağır yük / payload taşıma platformu",
    baseScore: 76,
    explanation: "Yüksek payload için uygundur; ancak enerji tüketimi, batarya ağırlığı, yedeklilik ve test prosedürü çok dikkatli yönetilmelidir.",
    components: ["X8 veya octocopter yapı", "Yüksek thrust motor", "Yedekli güç dağıtımı", "Payload kilitleme", "Geniş güvenlik payı"]
  },
  {
    id: "vtol",
    label: "Sabit kanat VTOL",
    title: "Uzun menzil VTOL konsepti",
    baseScore: 75,
    explanation: "Uzun menzil ve verim için multirotordan daha uygundur. Mekanik ve yazılım karmaşıklığı daha yüksektir; eğitim ve test süreci daha disiplinlidir.",
    components: ["Sabit kanat gövde", "VTOL motor grubu", "Cruise motor", "Geçiş kontrolü", "Uzun menzil haberleşme"]
  },
  {
    id: "tethered",
    label: "Yerden beslemeli / tethered drone",
    title: "Sürekli görev tethered platform",
    baseScore: 79,
    explanation: "Uzun süre havada kalma, güvenlik, yangın/afet veya sabit gözetleme görevlerinde avantajlıdır. Kablo yönetimi ve yer güç ünitesi temel tasarım unsurudur.",
    components: ["Yerden güç ünitesi", "Tether kablo makarası", "Kablo gerilim kontrolü", "Termal koruma", "Acil batarya yedeği"]
  }
];

const educationModules = [
  {
    title: "1. Görev tanımı",
    text: "Payload, uçuş süresi, menzil, ortam ve regülasyon hedefi netleşmeden motor veya batarya seçimi yapılmaz.",
    tag: "Gereksinim"
  },
  {
    title: "2. Drone mimarisi",
    text: "Quad, hex, X8, octocopter, VTOL veya tethered yapı; görev süresi ve güvenlik ihtiyacına göre seçilir.",
    tag: "Mimari"
  },
  {
    title: "3. Frame ve ağırlık merkezi",
    text: "Kol boyu, gövde rijitliği, payload konumu ve titreşim aktarımı uçuş karakterini doğrudan etkiler.",
    tag: "Mekanik"
  },
  {
    title: "4. Motor ve pervane",
    text: "Motor seçimi sadece maksimum thrust’a göre değil; verim, ısı, pervane çapı ve görev profiline göre yapılır.",
    tag: "İtki"
  },
  {
    title: "5. ESC ve güç dağıtımı",
    text: "ESC akım kapasitesi, soğutma, kablo kesiti, sigorta, pre-charge ve PDU güvenliği birlikte ele alınır.",
    tag: "Elektrik"
  },
  {
    title: "6. Batarya ve enerji",
    text: "Kapasite, C değeri, seri/paralel yapı, ağırlık, gerilim düşümü ve güvenli kullanım sınırları hesaplanır.",
    tag: "Enerji"
  },
  {
    title: "7. Flight controller",
    text: "ArduPilot, INAV veya Betaflight seçimi; görev, otonomi ihtiyacı ve sensör mimarisine göre yapılır.",
    tag: "Kontrol"
  },
  {
    title: "8. Test ve doğrulama",
    text: "Pervanesiz test, yön kontrolü, motor sırası, düşük irtifa hover, log analizi ve kademeli payload testleri uygulanır.",
    tag: "Güvenlik"
  }
];

const missionSelect = document.querySelector("#mission");
const droneTypeSelect = document.querySelector("#droneType");
const plannerForm = document.querySelector("#plannerForm");
const educationCards = document.querySelector("#educationCards");

function populateSelects() {
  missions.forEach((mission) => {
    const option = document.createElement("option");
    option.value = mission.id;
    option.textContent = mission.label;
    missionSelect.appendChild(option);
  });

  droneTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.label;
    droneTypeSelect.appendChild(option);
  });
}

function renderEducation() {
  educationCards.innerHTML = educationModules
    .map((module) => `
      <article class="edu-card">
        <strong>${module.title}</strong>
        <p>${module.text}</p>
        <small>${module.tag}</small>
      </article>
    `)
    .join("");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value, decimals = 1) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

function calculateScore({ mission, droneType, payload, endurance, mtow, environment, skill }) {
  let score = droneType.baseScore;

  if (mission.recommendedTypes.includes(droneType.id)) score += 16;
  else score -= 10;

  if (payload > 8 && ["hobby", "training", "fpv", "camera"].includes(droneType.id)) score -= 22;
  if (payload > 15 && ["heavyLift", "agriculture", "tethered"].includes(droneType.id)) score += 6;
  if (endurance > 45 && droneType.id === "vtol") score += 12;
  if (endurance > 45 && ["hobby", "fpv", "camera"].includes(droneType.id)) score -= 18;
  if (environment === "hot" && !["tethered", "heavyLift"].includes(droneType.id)) score -= 10;
  if (environment === "longrange" && droneType.id !== "vtol") score -= 12;
  if (skill === "beginner" && ["heavyLift", "vtol", "tethered", "agriculture"].includes(droneType.id)) score -= 10;
  if (skill === "professional" && ["heavyLift", "vtol", "tethered"].includes(droneType.id)) score += 7;
  if (mtow < payload * 1.35) score -= 16;

  return clamp(Math.round(score), 0, 100);
}

function calculateMetrics({ mtow, motors, voltage, endurance, droneType }) {
  const thrustRatio = ["heavyLift", "agriculture", "tethered"].includes(droneType.id) ? 2.4 : droneType.id === "fpv" ? 4.0 : 2.0;
  const minTotalThrust = mtow * thrustRatio;
  const motorHoverLoad = mtow / motors;

  const powerFactor = droneType.id === "vtol" ? 115 : droneType.id === "fpv" ? 190 : droneType.id === "heavyLift" ? 150 : 135;
  const hoverPower = mtow * powerFactor;
  const hoverCurrent = hoverPower / voltage;
  const usableBatteryFactor = 0.82;
  const requiredEnergy = (hoverPower * (endurance / 60)) / usableBatteryFactor;

  return {
    thrustRatio,
    minTotalThrust,
    motorHoverLoad,
    hoverPower,
    hoverCurrent,
    requiredEnergy
  };
}

function buildWhyText({ mission, droneType, score, payload, endurance, mtow, environment }) {
  const environmentText = {
    open: "Açık alan düşük riskli test için uygundur; yine de güvenlik çevresi ve failsafe ayarları gereklidir.",
    urban: "Şehir içi veya engelli çevrede sensör, failsafe, geofence ve düşük riskli test yaklaşımı zorunludur.",
    hot: "Yüksek sıcaklık veya yangın çevresinde batarya, ESC, kablo ve gövde malzemesi termal açıdan ayrıca korunmalıdır.",
    industrial: "Endüstriyel sahada elektromanyetik parazit, metal yapılar, GNSS zayıflaması ve saha güvenliği dikkate alınmalıdır.",
    longrange: "Uzun menzil görevlerde multirotor verimi sınırlı kalabilir; VTOL veya sabit kanat mimari daha mantıklı olabilir."
  };

  const payloadRatio = payload / mtow;
  const payloadComment = payloadRatio > 0.35
    ? "Payload toplam ağırlığın yüksek bir yüzdesini oluşturuyor. Ağırlık merkezi, bağlantı noktaları ve thrust rezervi kritik hale gelir."
    : "Payload/MTOW oranı başlangıç hesabı için yönetilebilir görünüyor; yine de gerçek komponent ağırlıklarıyla revizyon gerekir.";

  return `
    <p><strong>${droneType.title}</strong> seçimi için uygunluk skoru ${score}/100 olarak hesaplandı.</p>
    <p>${mission.why}</p>
    <p>${droneType.explanation}</p>
    <p>${payloadComment}</p>
    <p>${environmentText[environment]}</p>
    <p>Hedef uçuş süresi ${endurance} dakika olduğu için batarya kapasitesi, sistem ağırlığı ve görev profili birlikte optimize edilmelidir.</p>
  `;
}

function renderResults(event) {
  event?.preventDefault();

  const mission = missions.find((item) => item.id === missionSelect.value);
  const droneType = droneTypes.find((item) => item.id === droneTypeSelect.value);
  const payload = Number(document.querySelector("#payload").value || 0);
  const endurance = Number(document.querySelector("#endurance").value || 0);
  const mtow = Number(document.querySelector("#mtow").value || 0);
  const motors = Number(document.querySelector("#motors").value || 4);
  const voltage = Number(document.querySelector("#voltage").value || 51.8);
  const skill = document.querySelector("#skill").value;
  const environment = document.querySelector("#environment").value;

  const score = calculateScore({ mission, droneType, payload, endurance, mtow, environment, skill });
  const metrics = calculateMetrics({ mtow, motors, voltage, endurance, droneType });

  const recommendationTitle = document.querySelector("#recommendationTitle");
  const recommendationText = document.querySelector("#recommendationText");
  const scoreBar = document.querySelector("#scoreBar span");
  const scoreText = document.querySelector("#scoreText");
  const whyBox = document.querySelector("#whyBox");
  const componentList = document.querySelector("#componentList");

  recommendationTitle.textContent = droneType.title;
  recommendationText.textContent = score >= 80
    ? "Bu seçim görev profili için güçlü bir başlangıç noktasıdır. Detaylı komponent seçimi ve test planı ile ilerlenebilir."
    : score >= 60
      ? "Bu seçim kullanılabilir; ancak bazı mühendislik riskleri var. Aşağıdaki uyarılar dikkate alınmalıdır."
      : "Bu seçim görev için zayıf görünüyor. Drone tipi, payload hedefi veya uçuş süresi yeniden değerlendirilmelidir.";

  scoreBar.style.width = `${score}%`;
  scoreText.textContent = `Uygunluk skoru: ${score}/100`;
  whyBox.innerHTML = buildWhyText({ mission, droneType, score, payload, endurance, mtow, environment });

  componentList.innerHTML = droneType.components
    .map((component) => `<li>${component}</li>`)
    .join("");

  document.querySelector("#metricMotorLoad").textContent = `${formatNumber(metrics.motorHoverLoad)} kg / motor`;
  document.querySelector("#metricThrust").textContent = `${formatNumber(metrics.minTotalThrust)} kgf toplam`;
  document.querySelector("#metricPower").textContent = `${formatNumber(metrics.hoverPower / 1000, 2)} kW`;
  document.querySelector("#metricCurrent").textContent = `${formatNumber(metrics.hoverCurrent)} A @ ${formatNumber(voltage)} V`;
  document.querySelector("#metricEnergy").textContent = `${formatNumber(metrics.requiredEnergy / 1000, 2)} kWh`;
}

populateSelects();
renderEducation();
plannerForm.addEventListener("submit", renderResults);
plannerForm.addEventListener("change", renderResults);
renderResults();
