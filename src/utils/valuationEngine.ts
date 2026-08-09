import { LandInputs, ValuationResult, ValueFactor, ComparableSale, DevelopmentPotential, RiskFactor, LandUnit, PricePerUnit } from '../types';
import { PRESET_REGIONS } from '../data/presetRegions';

export const USD_TO_PKR_RATE = 278.0;

export function convertToAcres(size: number, unit: LandUnit): number {
  if (size <= 0) return 0.1;
  switch (unit) {
    case 'acre':
      return size;
    case 'kanal':
      return size * 0.125; // 8 Kanals = 1 Acre
    case 'marla':
      return size * 0.00625; // 160 Marlas = 1 Acre (20 Marlas = 1 Kanal)
    case 'sqft':
      return size / 43560;
    case 'sqm':
      return size / 4046.86;
    case 'hectare':
      return size * 2.47105;
    default:
      return size;
  }
}

export function convertFromAcres(acres: number, targetUnit: LandUnit): number {
  switch (targetUnit) {
    case 'acre':
      return acres;
    case 'kanal':
      return acres * 8;
    case 'marla':
      return acres * 160;
    case 'sqft':
      return acres * 43560;
    case 'sqm':
      return acres * 4046.86;
    case 'hectare':
      return acres / 2.47105;
  }
}

export function calculateInstantValuation(inputs: LandInputs): ValuationResult {
  const acres = convertToAcres(inputs.size, inputs.unit);
  
  // Find preset base price or default
  let basePricePerAcreUSD = 120000;
  if (inputs.regionPresetId) {
    const preset = PRESET_REGIONS.find(r => r.id === inputs.regionPresetId);
    if (preset) basePricePerAcreUSD = preset.basePricePerAcreUSD;
  }

  // Size scale economy discount (larger parcels have lower price PER acre/kanal, though higher total)
  let sizeFactor = 1.0;
  if (acres > 100) sizeFactor = 0.55;
  else if (acres > 50) sizeFactor = 0.65;
  else if (acres > 20) sizeFactor = 0.75;
  else if (acres > 5) sizeFactor = 0.88;
  else if (acres < 0.25) sizeFactor = 1.45; // Premium per acre/kanal for small 5 Marla / 10 Marla urban infill plots
  else if (acres < 0.5) sizeFactor = 1.30;

  let adjustedPricePerAcre = basePricePerAcreUSD * sizeFactor;

  const valueFactors: ValueFactor[] = [];

  // 1. Property Type & Zoning Multiplier
  let zoningMult = 1.0;
  let zoningLabel = 'Standard Land Use';

  // Map PropertyType first if set, then zoning
  if (inputs.propertyType === 'Commercial') {
    zoningMult = 2.2;
    zoningLabel = 'Commercial Retail / Business Center (+120%)';
  } else if (inputs.propertyType === 'Mixed-Use') {
    zoningMult = 1.85;
    zoningLabel = 'Mixed-Use High Density (+85%)';
  } else if (inputs.propertyType === 'Residential') {
    if (inputs.zoning === 'residential_multi') {
      zoningMult = 1.6;
      zoningLabel = 'Multi-Family Residential (+60%)';
    } else {
      zoningMult = 1.3;
      zoningLabel = 'Single-Family Residential (+30%)';
    }
  } else if (inputs.propertyType === 'Industrial') {
    zoningMult = 1.25;
    zoningLabel = 'Industrial & Warehousing (+25%)';
  } else if (inputs.propertyType === 'Agricultural') {
    zoningMult = 0.55;
    zoningLabel = 'Agricultural Focus (-45%)';
  } else {
    // Fallback to zoning
    switch (inputs.zoning) {
      case 'commercial': zoningMult = 2.2; zoningLabel = 'Commercial Zoning (+120%)'; break;
      case 'mixed_use': zoningMult = 1.85; zoningLabel = 'Mixed-Use High Density (+85%)'; break;
      case 'residential_multi': zoningMult = 1.6; zoningLabel = 'Multi-Family Residential (+60%)'; break;
      case 'residential_single': zoningMult = 1.3; zoningLabel = 'Single-Family Residential (+30%)'; break;
      case 'industrial': zoningMult = 1.25; zoningLabel = 'Industrial / Logistics (+25%)'; break;
      case 'agricultural': zoningMult = 0.55; zoningLabel = 'Agricultural Focus (-45%)'; break;
      case 'recreational': zoningMult = 0.45; zoningLabel = 'Recreational / Open Space (-55%)'; break;
      case 'unzoned': zoningMult = 0.7; zoningLabel = 'Unzoned / Flexible (-30%)'; break;
    }
  }

  const zoningDelta = (zoningMult - 1) * 100;
  valueFactors.push({
    category: 'Zoning & Property Type',
    impact: zoningDelta >= 0 ? 'positive' : 'negative',
    percentageDelta: Math.round(zoningDelta),
    dollarImpact: Math.round(adjustedPricePerAcre * (zoningMult - 1) * acres),
    explanation: `${zoningLabel} based on development potential.`
  });

  // 2. Topography
  let topoMult = 1.0;
  let topoLabel = 'Standard Topography';
  switch (inputs.topography) {
    case 'waterfront': topoMult = 1.8; topoLabel = 'Waterfront / Canal Frontage (+80%)'; break;
    case 'hilltop_views': topoMult = 1.35; topoLabel = 'Elevated Scenic Views (+35%)'; break;
    case 'flat': topoMult = 1.1; topoLabel = 'Flat Build-Ready Level Ground (+10%)'; break;
    case 'gently_sloping': topoMult = 1.0; topoLabel = 'Gently Sloping (Baseline)'; break;
    case 'steep_slope': topoMult = 0.65; topoLabel = 'Steep Slope Construction Penalty (-35%)'; break;
    case 'low_lying_marsh': topoMult = 0.5; topoLabel = 'Low-Lying Wetland Soil (-50%)'; break;
  }
  const topoDelta = (topoMult - 1) * 100;
  valueFactors.push({
    category: 'Topography & Terrain',
    impact: topoDelta >= 0 ? 'positive' : 'negative',
    percentageDelta: Math.round(topoDelta),
    dollarImpact: Math.round(adjustedPricePerAcre * (topoMult - 1) * acres),
    explanation: topoLabel
  });

  // 3. Road Access
  let roadMult = 1.0;
  let roadLabel = 'Access';
  switch (inputs.roadAccess) {
    case 'paved_highway': roadMult = 1.35; roadLabel = 'Paved Expressway / Main Boulevard (+35%)'; break;
    case 'paved_local': roadMult = 1.2; roadLabel = 'Paved Public Road / Sector Avenue (+20%)'; break;
    case 'gravel_unpaved': roadMult = 0.9; roadLabel = 'Unpaved / Gravel Road (-10%)'; break;
    case 'dirt_easement': roadMult = 0.7; roadLabel = 'Private Passage (-30%)'; break;
    case 'no_direct_access': roadMult = 0.45; roadLabel = 'No Direct Road Access (-55%)'; break;
  }
  const roadDelta = (roadMult - 1) * 100;
  valueFactors.push({
    category: 'Road & Transit Access',
    impact: roadDelta >= 0 ? 'positive' : 'negative',
    percentageDelta: Math.round(roadDelta),
    dollarImpact: Math.round(adjustedPricePerAcre * (roadMult - 1) * acres),
    explanation: roadLabel
  });

  // 4. Infrastructure & Utilities
  let utilsScore = 0;
  if (inputs.hasElectricity) utilsScore += 12;
  if (inputs.hasWater) utilsScore += 15;
  if (inputs.hasSewer) utilsScore += 18;
  if (inputs.hasInternet) utilsScore += 5;

  const utilsMult = 1 + utilsScore / 100;
  valueFactors.push({
    category: 'Utilities & Services',
    impact: utilsScore > 0 ? 'positive' : 'negative',
    percentageDelta: utilsScore,
    dollarImpact: Math.round(adjustedPricePerAcre * (utilsScore / 100) * acres),
    explanation: `Grid Electric (${inputs.hasElectricity ? 'Yes' : 'No'}), Water (${inputs.hasWater ? 'Yes' : 'No'}), Sewer/Drainage (${inputs.hasSewer ? 'Yes' : 'No'}), Fiber Internet (${inputs.hasInternet ? 'Yes' : 'No'})`
  });

  // 5. Special Features & Risk
  let bonusRiskMult = 1.0;
  if (inputs.subdivisionPotential) bonusRiskMult += 0.20;
  if (inputs.hasWaterfront) bonusRiskMult += 0.25;
  if (inputs.hasMineralTimberRights) bonusRiskMult += 0.10;
  if (inputs.floodZone) bonusRiskMult -= 0.25;

  const bonusRiskDelta = (bonusRiskMult - 1) * 100;
  valueFactors.push({
    category: 'Special Development Rights & Risk',
    impact: bonusRiskDelta >= 0 ? 'positive' : 'negative',
    percentageDelta: Math.round(bonusRiskDelta),
    dollarImpact: Math.round(adjustedPricePerAcre * (bonusRiskMult - 1) * acres),
    explanation: `Subdivision Potential (${inputs.subdivisionPotential ? '+20%' : 'No'}), Waterfront (+25%), Flood Risk (${inputs.floodZone ? '-25%' : 'None'})`
  });

  // Combine Multipliers
  const totalMultiplier = zoningMult * topoMult * roadMult * utilsMult * bonusRiskMult;
  const finalPricePerAcreUSD = Math.round(adjustedPricePerAcre * totalMultiplier);
  const totalValueUSD = Math.round(finalPricePerAcreUSD * acres);
  const totalValuePKR = Math.round(totalValueUSD * USD_TO_PKR_RATE);

  const pricePerKanalUSD = Math.round(finalPricePerAcreUSD / 8);
  const pricePerMarlaUSD = Math.round(finalPricePerAcreUSD / 160);
  const pricePerSqFtUSD = +(finalPricePerAcreUSD / 43560).toFixed(2);
  const pricePerSqmUSD = +(finalPricePerAcreUSD / 4046.86).toFixed(2);
  const pricePerHectareUSD = Math.round(finalPricePerAcreUSD * 2.47105);

  const pricePerUnit: PricePerUnit = {
    pricePerAcre: finalPricePerAcreUSD,
    pricePerKanal: pricePerKanalUSD,
    pricePerMarla: pricePerMarlaUSD,
    pricePerSqFt: pricePerSqFtUSD,
    pricePerSqm: pricePerSqmUSD,
    pricePerHectare: pricePerHectareUSD,
  };

  // Buildability Index
  let buildabilityIndex = 75;
  if (inputs.topography === 'flat' || inputs.topography === 'gently_sloping') buildabilityIndex += 15;
  if (inputs.topography === 'steep_slope' || inputs.topography === 'low_lying_marsh') buildabilityIndex -= 30;
  if (inputs.hasSewer && inputs.hasWater) buildabilityIndex += 10;
  if (inputs.soilQuality === 'prime_buildable') buildabilityIndex += 10;
  buildabilityIndex = Math.min(99, Math.max(15, buildabilityIndex));

  // Location Score
  let locationScore = 80;
  if (inputs.distanceToCityMiles <= 10) locationScore += 15;
  else if (inputs.distanceToCityMiles > 35) locationScore -= 20;
  if (inputs.roadAccess === 'paved_highway' || inputs.roadAccess === 'paved_local') locationScore += 10;
  locationScore = Math.min(98, Math.max(20, locationScore));

  const valuationScore = Math.round((buildabilityIndex * 0.4) + (locationScore * 0.4) + (inputs.subdivisionPotential ? 15 : 5));

  let investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' = 'B+';
  if (valuationScore >= 88) investmentGrade = 'A+';
  else if (valuationScore >= 80) investmentGrade = 'A';
  else if (valuationScore >= 70) investmentGrade = 'B+';
  else if (valuationScore >= 60) investmentGrade = 'B';
  else if (valuationScore >= 50) investmentGrade = 'C';
  else investmentGrade = 'D';

  const lowValuation = Math.round(totalValueUSD * 0.88);
  const highValuation = Math.round(totalValueUSD * 1.15);

  // Formatting strings for comparable sales
  const isPakistaniContext = inputs.locationName.toLowerCase().includes('lahore') || 
    inputs.locationName.toLowerCase().includes('islamabad') || 
    inputs.locationName.toLowerCase().includes('karachi') || 
    inputs.locationName.toLowerCase().includes('pakistan') ||
    inputs.unit === 'kanal' || inputs.unit === 'marla';

  const compCurrencySymbol = isPakistaniContext ? 'Rs. ' : '$';
  const compMult = isPakistaniContext ? USD_TO_PKR_RATE : 1;

  const comparableSales: ComparableSale[] = [
    {
      property: `Similar ${inputs.propertyType} Plot (Block A)`,
      distance: '0.6 km away',
      size: `${inputs.size} ${inputs.unit}`,
      salePrice: `${compCurrencySymbol}${Math.round((totalValueUSD * 0.94) * compMult).toLocaleString()}`,
      pricePerAcre: `${compCurrencySymbol}${Math.round((finalPricePerAcreUSD * 0.98) * compMult).toLocaleString()}`,
      similarity: '95% Match'
    },
    {
      property: `Adjacent Corner Parcel (Phase 2)`,
      distance: '1.2 km away',
      size: `${(inputs.size * 1.1).toFixed(1)} ${inputs.unit}`,
      salePrice: `${compCurrencySymbol}${Math.round((totalValueUSD * 1.12) * compMult).toLocaleString()}`,
      pricePerAcre: `${compCurrencySymbol}${Math.round((finalPricePerAcreUSD * 0.99) * compMult).toLocaleString()}`,
      similarity: '90% Match'
    },
    {
      property: `Nearby Sector Plot C`,
      distance: '1.8 km away',
      size: `${(inputs.size * 0.85).toFixed(1)} ${inputs.unit}`,
      salePrice: `${compCurrencySymbol}${Math.round((totalValueUSD * 0.84) * compMult).toLocaleString()}`,
      pricePerAcre: `${compCurrencySymbol}${Math.round((finalPricePerAcreUSD * 1.02) * compMult).toLocaleString()}`,
      similarity: '86% Match'
    }
  ];

  const developmentPotentials: DevelopmentPotential[] = [
    {
      strategy: inputs.subdivisionPotential ? 'Subdivision into 5 & 10 Marla Plots' : 'Custom Residential Villa Construction',
      feasibility: 'High',
      estimatedUpside: inputs.subdivisionPotential ? '+35% to +55% Net Margin' : '+20% Construction Capital Value',
      description: inputs.subdivisionPotential 
        ? `Splitting this ${inputs.size} ${inputs.unit} parcel into smaller residential plots yields significantly higher overall market realization.`
        : `Developing a modern multi-story residential residence maximizing location and frontage.`
    },
    {
      strategy: inputs.hasElectricity ? 'Commercial Strip / Plaza Ground Lease' : 'Agri-Solar Farm or Organic Lease',
      feasibility: acres >= 0.5 ? 'High' : 'Medium',
      estimatedUpside: isPakistaniContext ? 'Rs. 250,000 - 800,000 / month passive rental income' : '$1,500 - $4,000 / acre / year',
      description: 'Long-term ground lease or commercial shop development for steady passive cash flow.'
    }
  ];

  const riskFactors: RiskFactor[] = [];
  if (!inputs.hasSewer) {
    riskFactors.push({
      factor: 'Lack of Municipal Sewer Line',
      severity: 'Moderate',
      mitigation: 'Requires septic tank installation or private soakage pit approval.'
    });
  }
  if (inputs.floodZone) {
    riskFactors.push({
      factor: 'Seasonal Rain / Flood Area',
      severity: 'High',
      mitigation: 'Elevated plinth levels and proper stormwater drainage layout required.'
    });
  }
  if (inputs.topography === 'steep_slope') {
    riskFactors.push({
      factor: 'Sloping Terrain Grade',
      severity: 'Moderate',
      mitigation: 'Retaining boundary walls and site levelling needed before foundation work.'
    });
  }
  if (riskFactors.length === 0) {
    riskFactors.push({
      factor: 'Standard Market Holding Time',
      severity: 'Low',
      mitigation: 'Normal transaction closing timeframe applies.'
    });
  }

  return {
    estimatedValue: totalValueUSD,
    estimatedValuePKR: totalValuePKR,
    valueRange: { low: lowValuation, high: highValuation },
    pricePerUnit,
    valuationScore,
    buildabilityIndex,
    locationScore,
    investmentGrade,
    breakdown: valueFactors,
    developmentPotentials,
    comparableSales,
    marketTrends: {
      trend: inputs.marketTrend === 'rapid_growth' ? 'High Growth Sector' : 'Steady Appreciation',
      annualGrowthEstimate: inputs.marketTrend === 'rapid_growth' ? '12-18% YoY' : '6-9% YoY',
      demandLevel: 'Strong Buyer & Investor Competition',
      summary: `Land prices in ${inputs.locationName || 'this sector'} show steady upward momentum backed by urban development and infrastructure access.`
    },
    riskFactors,
    aiSummary: `The ${inputs.propertyType.toLowerCase()} land parcel in ${inputs.locationName || 'the target region'} (${inputs.size} ${inputs.unit}) holds an estimated market value of ${isPakistaniContext ? `Rs. ${totalValuePKR.toLocaleString()}` : `$${totalValueUSD.toLocaleString()}`}. Key drivers include ${inputs.propertyType} zoning, ${inputs.roadAccess.replace('_', ' ')} road access, and utility connections.`,
    calculatedAt: new Date().toISOString()
  };
}
