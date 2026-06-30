import { Nav } from '@/components/ui/Nav';
import { batteryModels, calculateBatteryContinuousCurrentA, calculateBatteryEnergyWh, calculateMotorTotalThrustKg, motorModels, propellerModels } from '@/lib/parts';

export const metadata = {
  title: 'Parça Veri Seti | eCalculator',
  description: 'eCalculator MVP hesaplamalarında kullanılabilecek temsili motor, batarya ve pervane eğitim veri seti.',
};

export default function PartsPage() {
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Parça Veri Seti</h1>
        <p className="warn">
          Bu katalog eğitim amaçlı temsili veriler içerir; marka/model satın alma önerisi veya uçuş güvenliği garantisi değildir.
          Gerçek projelerde üretici datasheet değerleri doğrulanmalıdır.
        </p>

        <h2>Motor modelleri</h2>
        <div className="grid">
          {motorModels.map((motor) => (
            <article className="card" key={motor.id}>
              <h3>{motor.model}</h3>
              <p>{motor.kv}KV · {motor.statorSize} · {motor.recommendedVoltage}</p>
              <p>Motor başına tahmini azami itki: {motor.estimatedMaxThrustG} g</p>
              <p>Quad toplam tahmini itki: {calculateMotorTotalThrustKg(motor, 4)} kgf</p>
              <p>Sürekli akım: {motor.maxContinuousCurrentA} A · Ağırlık: {motor.weightG} g</p>
              <small>{motor.notes}</small>
            </article>
          ))}
        </div>

        <h2>Batarya modelleri</h2>
        <div className="grid">
          {batteryModels.map((battery) => (
            <article className="card" key={battery.id}>
              <h3>{battery.model}</h3>
              <p>{battery.cellCount}S · {battery.nominalVoltageV} V · {battery.capacityMah} mAh · {battery.chemistry}</p>
              <p>Enerji: {calculateBatteryEnergyWh(battery)} Wh</p>
              <p>Sürekli akım limiti: {calculateBatteryContinuousCurrentA(battery)} A</p>
              <p>Varsayılan rezerv: %{battery.usableReservePercent} · Ağırlık: {battery.weightG} g</p>
              <small>{battery.notes}</small>
            </article>
          ))}
        </div>

        <h2>Pervane modelleri</h2>
        <div className="grid">
          {propellerModels.map((propeller) => (
            <article className="card" key={propeller.id}>
              <h3>{propeller.model}</h3>
              <p>Çap: {propeller.diameterInch} inch · Pitch: {propeller.pitchInch} · Kanat: {propeller.blades}</p>
              <p>Malzeme: {propeller.material} · Ağırlık: {propeller.weightG} g</p>
              <small>{propeller.notes}</small>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
