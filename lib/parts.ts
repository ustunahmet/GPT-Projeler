export type MotorModel = {
  id: string;
  brand: string;
  model: string;
  kv: number;
  statorSize: string;
  recommendedVoltage: string;
  maxContinuousCurrentA: number;
  maxBurstCurrentA: number;
  weightG: number;
  compatiblePropInch: string;
  estimatedMaxThrustG: number;
  notes: string;
};

export type BatteryModel = {
  id: string;
  brand: string;
  model: string;
  cellCount: number;
  nominalVoltageV: number;
  capacityMah: number;
  capacityAh: number;
  continuousCRating: number;
  burstCRating?: number;
  weightG: number;
  chemistry: 'LiPo' | 'Li-ion';
  usableReservePercent: number;
  notes: string;
};

export type PropellerModel = {
  id: string;
  brand: string;
  model: string;
  diameterInch: number;
  pitchInch: number;
  blades: number;
  material: string;
  weightG: number;
  notes: string;
};

export const motorModels: MotorModel[] = [
  {
    id: 'motor-eco-2212-920kv',
    brand: 'Eğitim Veri Seti',
    model: '2212 920KV Trainer',
    kv: 920,
    statorSize: '2212',
    recommendedVoltage: '3S-4S',
    maxContinuousCurrentA: 18,
    maxBurstCurrentA: 25,
    weightG: 55,
    compatiblePropInch: '9-10 inch',
    estimatedMaxThrustG: 850,
    notes: 'Başlangıç seviye quad eğitim projeleri için örnek motor kaydıdır; satın alma önerisi değildir.',
  },
  {
    id: 'motor-mid-2814-700kv',
    brand: 'Eğitim Veri Seti',
    model: '2814 700KV Endurance',
    kv: 700,
    statorSize: '2814',
    recommendedVoltage: '4S-6S',
    maxContinuousCurrentA: 28,
    maxBurstCurrentA: 38,
    weightG: 105,
    compatiblePropInch: '12-14 inch',
    estimatedMaxThrustG: 1550,
    notes: 'Daha büyük pervane ve daha düşük KV mantığını göstermek için temsili veridir.',
  },
  {
    id: 'motor-light-1806-2300kv',
    brand: 'Eğitim Veri Seti',
    model: '1806 2300KV Light',
    kv: 2300,
    statorSize: '1806',
    recommendedVoltage: '3S-4S',
    maxContinuousCurrentA: 14,
    maxBurstCurrentA: 20,
    weightG: 28,
    compatiblePropInch: '5-6 inch',
    estimatedMaxThrustG: 520,
    notes: 'Küçük ve hafif eğitim sınıfı multirotor karşılaştırmaları için temsili kayıttır.',
  },
];

export const batteryModels: BatteryModel[] = [
  {
    id: 'battery-3s-2200-35c',
    brand: 'Eğitim Veri Seti',
    model: '3S 2200mAh 35C Trainer',
    cellCount: 3,
    nominalVoltageV: 11.1,
    capacityMah: 2200,
    capacityAh: 2.2,
    continuousCRating: 35,
    burstCRating: 50,
    weightG: 180,
    chemistry: 'LiPo',
    usableReservePercent: 20,
    notes: 'Küçük eğitim projelerinde Wh ve C-rating hesabını göstermek için temsili batarya.',
  },
  {
    id: 'battery-4s-5000-30c',
    brand: 'Eğitim Veri Seti',
    model: '4S 5000mAh 30C Utility',
    cellCount: 4,
    nominalVoltageV: 14.8,
    capacityMah: 5000,
    capacityAh: 5,
    continuousCRating: 30,
    burstCRating: 45,
    weightG: 520,
    chemistry: 'LiPo',
    usableReservePercent: 20,
    notes: 'MVP test verisindeki 14.8V 5Ah örneğiyle uyumlu temsili batarya.',
  },
  {
    id: 'battery-6s-10000-liion',
    brand: 'Eğitim Veri Seti',
    model: '6S 10000mAh Li-ion Endurance',
    cellCount: 6,
    nominalVoltageV: 22.2,
    capacityMah: 10000,
    capacityAh: 10,
    continuousCRating: 10,
    weightG: 980,
    chemistry: 'Li-ion',
    usableReservePercent: 25,
    notes: 'Uzun süre odaklı tasarımlarda enerji yoğunluğu ve düşük C-rating farkını anlatan temsili kayıt.',
  },
];

export const propellerModels: PropellerModel[] = [
  { id: 'prop-5045-3', brand: 'Eğitim Veri Seti', model: '5x4.5x3', diameterInch: 5, pitchInch: 4.5, blades: 3, material: 'Kompozit', weightG: 4, notes: 'Küçük, çevik platform örneği.' },
  { id: 'prop-1045-2', brand: 'Eğitim Veri Seti', model: '10x4.5', diameterInch: 10, pitchInch: 4.5, blades: 2, material: 'Naylon kompozit', weightG: 12, notes: 'Disk yüklemesi testindeki 10 inch örnekle uyumlu kayıt.' },
  { id: 'prop-1355-2', brand: 'Eğitim Veri Seti', model: '13x5.5', diameterInch: 13, pitchInch: 5.5, blades: 2, material: 'Karbon kompozit', weightG: 24, notes: 'Düşük KV dayanım platformları için temsili pervane.' },
];

export function getPartCatalog() {
  return { motors: motorModels, batteries: batteryModels, propellers: propellerModels };
}

export function calculateBatteryContinuousCurrentA(battery: BatteryModel) {
  return Number((battery.capacityAh * battery.continuousCRating).toFixed(1));
}

export function calculateBatteryEnergyWh(battery: BatteryModel) {
  return Number((battery.nominalVoltageV * battery.capacityAh).toFixed(2));
}

export function calculateMotorTotalThrustKg(motor: MotorModel, motorCount: number) {
  return Number(((motor.estimatedMaxThrustG * motorCount) / 1000).toFixed(2));
}
