export type CalculatorWarning = { level: 'info' | 'warning'; message: string };
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
function assertRange(name: string, value: number, min: number, max: number) {
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${name} ${min} ile ${max} arasında olmalıdır.`);
}
export function calculateThrust(input: { auwKg: number; motorCount: number; safetyFactor: number }) {
  assertRange('AUW', input.auwKg, 0.05, 25); assertRange('Motor sayısı', input.motorCount, 1, 16); assertRange('Güvenlik katsayısı', input.safetyFactor, 1.1, 3);
  const totalRequiredThrustKgf = round(input.auwKg * input.safetyFactor);
  const requiredThrustPerMotorKgf = round(totalRequiredThrustKgf / input.motorCount);
  return { totalRequiredThrustKgf, requiredThrustPerMotorKgf, thrustToWeightRatio: round(input.safetyFactor), weightNewton: round(input.auwKg * 9.81), comment: `Motor başına yaklaşık ${requiredThrustPerMotorKgf.toFixed(2)} kgf itki hedeflenmelidir. Bu değer eğitim amaçlı ön boyutlandırmadır.` };
}
export function calculateBatteryEndurance(input: { nominalVoltageV: number; capacityAh: number; reservePercent: number; averagePowerW?: number; averageCurrentA?: number }) {
  assertRange('Nominal voltaj', input.nominalVoltageV, 3.7, 100); assertRange('Kapasite', input.capacityAh, 0.1, 200); assertRange('Rezerv', input.reservePercent, 0, 60);
  const averagePowerW = input.averagePowerW ?? (input.averageCurrentA ? input.averageCurrentA * input.nominalVoltageV : 0); assertRange('Ortalama güç', averagePowerW, 1, 10000);
  const totalWh = round(input.nominalVoltageV * input.capacityAh); const usableWh = round(totalWh * (1 - input.reservePercent / 100));
  return { totalWh, usableWh, estimatedMinutes: round((usableWh / averagePowerW) * 60), averageCurrentA: round(averagePowerW / input.nominalVoltageV), comment: 'Tahmini süre; rüzgâr, manevra, batarya sağlığı ve üretici datasheet değerlerine göre değişir.' };
}
export function calculateCurrent(input: { totalPowerW: number; voltageV: number; marginPercent?: number; motorCount: number }) {
  assertRange('Toplam güç', input.totalPowerW, 1, 10000); assertRange('Voltaj', input.voltageV, 3.7, 100); assertRange('Motor sayısı', input.motorCount, 1, 16);
  const totalCurrentA = round(input.totalPowerW / input.voltageV, 1); const margin = (input.marginPercent ?? 20) / 100;
  return { totalCurrentA, currentPerMotorA: round(totalCurrentA / input.motorCount, 1), recommendedContinuousCurrentA: round(totalCurrentA * (1 + margin), 1), comment: 'ESC ve kablo seçimleri üretici datasheet değerleriyle doğrulanmalıdır.' };
}
export function calculateDiskLoading(input: { propDiameterInch: number; motorCount: number; auwKg: number }) {
  assertRange('Pervane çapı', input.propDiameterInch, 2, 40); assertRange('Motor sayısı', input.motorCount, 1, 16); assertRange('AUW', input.auwKg, 0.05, 25);
  const diameterM = input.propDiameterInch * 0.0254; const totalDiskAreaM2 = input.motorCount * Math.PI * (diameterM / 2) ** 2;
  return { totalDiskAreaM2: round(totalDiskAreaM2, 3), diskLoadingNm2: round((input.auwKg * 9.81) / totalDiskAreaM2), diskLoadingKgM2: round(input.auwKg / totalDiskAreaM2), comment: 'Daha düşük disk yüklemesi genellikle daha verimli hover eğilimi verir.' };
}
export function calculatePayloadMargin(input: { mtowKg: number; emptyWeightKg: number; batteryWeightKg: number; payloadKg: number; accessoryWeightKg: number }) {
  assertRange('MTOW', input.mtowKg, 0.05, 25); [input.emptyWeightKg,input.batteryWeightKg,input.payloadKg,input.accessoryWeightKg].forEach((v)=>assertRange('Ağırlık', v, 0, 25));
  const totalWeightKg = round(input.emptyWeightKg + input.batteryWeightKg + input.payloadKg + input.accessoryWeightKg); const remainingMarginKg = round(input.mtowKg - totalWeightKg);
  return { totalWeightKg, remainingMarginKg, payloadRatioPercent: round((input.payloadKg / input.mtowKg) * 100), status: remainingMarginKg < 0 ? 'over_limit' : remainingMarginKg < input.mtowKg * 0.1 ? 'tight' : 'ok', comment: 'MTOW marjı eğitim amaçlıdır; yasal limit ve üretici önerileri ayrıca kontrol edilmelidir.' };
}
