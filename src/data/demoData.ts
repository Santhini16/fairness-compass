export interface District {
  id: string;
  State: string;
  District: string;
  Latitude: number;
  Longitude: number;
  Population: number;
  Poverty_Index: number;
  Minority_Percentage: number;
  Rural_Percentage: number;
  Disaster_Severity: number;
  Aid_Received: number;
}

export const REQUIRED_COLUMNS = [
  "State", "District", "Latitude", "Longitude",
  "Population", "Poverty_Index", "Minority_Percentage",
  "Rural_Percentage", "Disaster_Severity", "Aid_Received"
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

let idCounter = 0;
const genId = () => `d-${++idCounter}`;

export const generateDemoData = (): District[] => [
  { id: genId(), State: "Bihar", District: "Araria", Latitude: 26.15, Longitude: 87.52, Population: 2810000, Poverty_Index: 0.82, Minority_Percentage: 28.5, Rural_Percentage: 92.1, Disaster_Severity: 0.75, Aid_Received: 120 },
  { id: genId(), State: "Bihar", District: "Kishanganj", Latitude: 26.09, Longitude: 87.95, Population: 1690000, Poverty_Index: 0.79, Minority_Percentage: 67.8, Rural_Percentage: 88.4, Disaster_Severity: 0.60, Aid_Received: 85 },
  { id: genId(), State: "Uttar Pradesh", District: "Shravasti", Latitude: 27.50, Longitude: 81.93, Population: 1110000, Poverty_Index: 0.88, Minority_Percentage: 15.2, Rural_Percentage: 95.6, Disaster_Severity: 0.40, Aid_Received: 45 },
  { id: genId(), State: "Uttar Pradesh", District: "Bahraich", Latitude: 27.57, Longitude: 81.60, Population: 3490000, Poverty_Index: 0.85, Minority_Percentage: 29.1, Rural_Percentage: 91.3, Disaster_Severity: 0.65, Aid_Received: 150 },
  { id: genId(), State: "Jharkhand", District: "Pakur", Latitude: 24.63, Longitude: 87.84, Population: 900000, Poverty_Index: 0.76, Minority_Percentage: 42.3, Rural_Percentage: 93.7, Disaster_Severity: 0.35, Aid_Received: 30 },
  { id: genId(), State: "Madhya Pradesh", District: "Sheopur", Latitude: 25.67, Longitude: 76.70, Population: 688000, Poverty_Index: 0.81, Minority_Percentage: 8.1, Rural_Percentage: 89.2, Disaster_Severity: 0.50, Aid_Received: 55 },
  { id: genId(), State: "Odisha", District: "Malkangiri", Latitude: 18.35, Longitude: 81.88, Population: 614000, Poverty_Index: 0.77, Minority_Percentage: 57.4, Rural_Percentage: 96.1, Disaster_Severity: 0.70, Aid_Received: 40 },
  { id: genId(), State: "Chhattisgarh", District: "Korba", Latitude: 22.35, Longitude: 82.68, Population: 1206000, Poverty_Index: 0.65, Minority_Percentage: 38.9, Rural_Percentage: 72.5, Disaster_Severity: 0.30, Aid_Received: 95 },
  { id: genId(), State: "Rajasthan", District: "Barmer", Latitude: 25.75, Longitude: 71.38, Population: 2604000, Poverty_Index: 0.72, Minority_Percentage: 14.7, Rural_Percentage: 94.8, Disaster_Severity: 0.80, Aid_Received: 110 },
  { id: genId(), State: "Maharashtra", District: "Nandurbar", Latitude: 21.37, Longitude: 74.24, Population: 1648000, Poverty_Index: 0.74, Minority_Percentage: 69.3, Rural_Percentage: 87.6, Disaster_Severity: 0.45, Aid_Received: 60 },
  { id: genId(), State: "Assam", District: "Dhubri", Latitude: 26.02, Longitude: 89.98, Population: 1950000, Poverty_Index: 0.80, Minority_Percentage: 79.7, Rural_Percentage: 90.3, Disaster_Severity: 0.85, Aid_Received: 75 },
  { id: genId(), State: "West Bengal", District: "Murshidabad", Latitude: 24.18, Longitude: 88.27, Population: 7100000, Poverty_Index: 0.71, Minority_Percentage: 66.3, Rural_Percentage: 82.1, Disaster_Severity: 0.55, Aid_Received: 200 },
  { id: genId(), State: "Gujarat", District: "Dahod", Latitude: 22.84, Longitude: 74.25, Population: 2127000, Poverty_Index: 0.69, Minority_Percentage: 72.1, Rural_Percentage: 91.5, Disaster_Severity: 0.25, Aid_Received: 80 },
  { id: genId(), State: "Karnataka", District: "Raichur", Latitude: 16.21, Longitude: 77.36, Population: 1924000, Poverty_Index: 0.68, Minority_Percentage: 22.4, Rural_Percentage: 78.3, Disaster_Severity: 0.40, Aid_Received: 105 },
  { id: genId(), State: "Tamil Nadu", District: "Ramanathapuram", Latitude: 9.37, Longitude: 78.83, Population: 1353000, Poverty_Index: 0.55, Minority_Percentage: 18.9, Rural_Percentage: 74.2, Disaster_Severity: 0.60, Aid_Received: 130 },
  { id: genId(), State: "Andhra Pradesh", District: "Vizianagaram", Latitude: 18.11, Longitude: 83.42, Population: 2342000, Poverty_Index: 0.62, Minority_Percentage: 12.5, Rural_Percentage: 80.7, Disaster_Severity: 0.50, Aid_Received: 90 },
  { id: genId(), State: "Kerala", District: "Wayanad", Latitude: 11.61, Longitude: 76.08, Population: 817000, Poverty_Index: 0.38, Minority_Percentage: 35.8, Rural_Percentage: 96.4, Disaster_Severity: 0.90, Aid_Received: 160 },
  { id: genId(), State: "Manipur", District: "Chandel", Latitude: 24.33, Longitude: 93.97, Population: 144000, Poverty_Index: 0.73, Minority_Percentage: 91.2, Rural_Percentage: 97.8, Disaster_Severity: 0.55, Aid_Received: 15 },
  { id: genId(), State: "Meghalaya", District: "South Garo Hills", Latitude: 25.30, Longitude: 90.62, Population: 142000, Poverty_Index: 0.70, Minority_Percentage: 88.6, Rural_Percentage: 95.3, Disaster_Severity: 0.45, Aid_Received: 12 },
  { id: genId(), State: "Telangana", District: "Adilabad", Latitude: 19.67, Longitude: 78.53, Population: 708000, Poverty_Index: 0.60, Minority_Percentage: 18.3, Rural_Percentage: 83.9, Disaster_Severity: 0.35, Aid_Received: 70 },
];

// Utility functions
export const calcVulnerabilityIndex = (d: District): number => {
  return +(d.Poverty_Index * 0.35 + (d.Minority_Percentage / 100) * 0.2 + (d.Rural_Percentage / 100) * 0.15 + d.Disaster_Severity * 0.30).toFixed(3);
};

export const calcAidPerCapita = (d: District): number => {
  return +(d.Aid_Received / (d.Population / 1_000_000)).toFixed(2);
};

export const calcFairnessScore = (d: District): number => {
  const vulnerability = calcVulnerabilityIndex(d);
  const aidPC = calcAidPerCapita(d);
  const maxAidPC = 200;
  const normalizedAid = Math.min(aidPC / maxAidPC, 1);
  const fairness = 1 - Math.abs(vulnerability - normalizedAid);
  return +Math.max(0, Math.min(1, fairness)).toFixed(3);
};

export const calcGiniCoefficient = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return 0;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  if (mean === 0) return 0;
  let sumDiff = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumDiff += Math.abs(sorted[i] - sorted[j]);
    }
  }
  return +(sumDiff / (2 * n * n * mean)).toFixed(4);
};

export const calcNationalFairness = (data: District[]): number => {
  if (data.length === 0) return 0;
  const scores = data.map(calcFairnessScore);
  return +(scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(3);
};

export const calcTotalBudget = (data: District[]): number => {
  return data.reduce((s, d) => s + d.Aid_Received, 0);
};

export const calcUnderservedCount = (data: District[]): number => {
  return data.filter(d => calcFairnessScore(d) < 0.5).length;
};

export const calcBudgetUtilization = (data: District[]): number => {
  const totalAid = calcTotalBudget(data);
  const totalVulnerability = data.reduce((s, d) => s + calcVulnerabilityIndex(d), 0);
  const avgVuln = totalVulnerability / data.length;
  return +Math.min(100, (avgVuln * 100 + totalAid / data.length * 0.3)).toFixed(1);
};

export const classifyDistrict = (d: District): "Critical" | "High" | "Moderate" | "Adequate" => {
  const fs = calcFairnessScore(d);
  if (fs < 0.35) return "Critical";
  if (fs < 0.50) return "High";
  if (fs < 0.65) return "Moderate";
  return "Adequate";
};

export const calcRecommendedAllocation = (
  d: District,
  totalBudget: number,
  data: District[],
  weights = { poverty: 0.35, population: 0.25, minority: 0.2, disaster: 0.2 }
): number => {
  const score = d.Poverty_Index * weights.poverty +
    (d.Population / Math.max(...data.map(x => x.Population))) * weights.population +
    (d.Minority_Percentage / 100) * weights.minority +
    d.Disaster_Severity * weights.disaster;
  const totalScores = data.reduce((s, x) => {
    return s + x.Poverty_Index * weights.poverty +
      (x.Population / Math.max(...data.map(y => y.Population))) * weights.population +
      (x.Minority_Percentage / 100) * weights.minority +
      x.Disaster_Severity * weights.disaster;
  }, 0);
  return +(totalBudget * score / totalScores).toFixed(1);
};
