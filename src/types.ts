export type LandUnit = 'acre' | 'kanal' | 'marla' | 'sqft' | 'sqm' | 'hectare';

export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR';

export type PropertyType = 
  | 'Residential'
  | 'Commercial'
  | 'Agricultural'
  | 'Industrial'
  | 'Mixed-Use';

export type ZoningType = 
  | 'residential_single'
  | 'residential_multi'
  | 'commercial'
  | 'industrial'
  | 'agricultural'
  | 'mixed_use'
  | 'recreational'
  | 'unzoned';

export type Topography = 
  | 'flat'
  | 'gently_sloping'
  | 'steep_slope'
  | 'waterfront'
  | 'hilltop_views'
  | 'low_lying_marsh';

export type RoadAccess = 
  | 'paved_highway'
  | 'paved_local'
  | 'gravel_unpaved'
  | 'dirt_easement'
  | 'no_direct_access';

export type LotShape = 'rectangular' | 'corner' | 'cul_de_sac' | 'irregular' | 'flag_lot';

export type SoilQuality = 'prime_buildable' | 'moderate' | 'rocky' | 'sandy' | 'wetland_heavy_clay';

export type MarketTrend = 'rapid_growth' | 'steady_appreciation' | 'stable' | 'cooling' | 'distressed';

export interface LandInputs {
  locationName: string;
  lat?: number;
  lng?: number;
  regionPresetId?: string;
  size: number;
  unit: LandUnit;
  propertyType: PropertyType;
  zoning: ZoningType;
  topography: Topography;
  roadAccess: RoadAccess;
  lotShape: LotShape;
  soilQuality: SoilQuality;
  
  // Utilities & Infrastructure
  hasElectricity: boolean;
  hasWater: boolean; // Municipal or well
  hasSewer: boolean; // Municipal or septic
  hasInternet: boolean;
  distanceToCityMiles: number;

  // Market & Rights
  marketTrend: MarketTrend;
  subdivisionPotential: boolean;
  floodZone: boolean;
  hasWaterfront: boolean;
  hasMineralTimberRights: boolean;

  // Extra Custom Notes
  additionalNotes?: string;
}

export interface ValueFactor {
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  percentageDelta: number; // e.g. +15 or -10
  dollarImpact: number;
  explanation: string;
}

export interface DevelopmentPotential {
  strategy: string;
  feasibility: 'High' | 'Medium' | 'Low';
  estimatedUpside: string;
  description: string;
}

export interface ComparableSale {
  property: string;
  distance: string;
  size: string;
  salePrice: string;
  pricePerAcre: string;
  similarity: string;
}

export interface RiskFactor {
  factor: string;
  severity: 'Low' | 'Moderate' | 'High';
  mitigation: string;
}

export interface PricePerUnit {
  pricePerAcre: number;
  pricePerKanal: number;
  pricePerMarla: number;
  pricePerSqFt: number;
  pricePerSqm: number;
  pricePerHectare: number;
}

export interface ValuationResult {
  estimatedValue: number; // Stored in base currency (USD or PKR reference)
  estimatedValuePKR?: number;
  valueRange: {
    low: number;
    high: number;
  };
  pricePerUnit: PricePerUnit;
  valuationScore: number; // 0 - 100
  buildabilityIndex: number; // 0 - 100
  locationScore: number; // 0 - 100
  investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  breakdown: ValueFactor[];
  developmentPotentials: DevelopmentPotential[];
  comparableSales: ComparableSale[];
  marketTrends: {
    trend: string;
    annualGrowthEstimate: string;
    demandLevel: string;
    summary: string;
  };
  riskFactors: RiskFactor[];
  aiSummary: string;
  calculatedAt: string;
}

export interface SavedEstimate {
  id: string;
  title: string;
  createdAt: string; // ISO date string
  inputs: LandInputs;
  result: ValuationResult;
  currency?: Currency;
}

export interface PresetRegion {
  id: string;
  name: string;
  country: string;
  state: string;
  lat: number;
  lng: number;
  basePricePerAcreUSD: number;
  basePricePerKanalPKR: number;
  tier: 'Prime Urban' | 'Prime Suburban' | 'Urban/Suburban' | 'Rural Development' | 'Exurban/Agricultural';
  description: string;
}
