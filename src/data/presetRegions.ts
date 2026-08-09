import { PresetRegion } from '../types';

export const PRESET_REGIONS: PresetRegion[] = [
  // Pakistan Major Real Estate & Land Hubs
  {
    id: 'lahore_dha_gulberg',
    name: 'Lahore (DHA / Gulberg / Ferozepur Rd), Punjab',
    country: 'Pakistan',
    state: 'Punjab',
    lat: 31.4700,
    lng: 74.4100,
    basePricePerAcreUSD: 360000,
    basePricePerKanalPKR: 125000000, // ~12.5 Crore PKR / Kanal
    tier: 'Prime Urban',
    description: 'High commercial & residential demand in DHA, Gulberg & Ring Road corridors.'
  },
  {
    id: 'islamabad_cda_dha',
    name: 'Islamabad (CDA Sectors / DHA / Bahria), ICT',
    country: 'Pakistan',
    state: 'Islamabad',
    lat: 33.6844,
    lng: 73.0479,
    basePricePerAcreUSD: 320000,
    basePricePerKanalPKR: 110000000, // ~11 Crore PKR / Kanal
    tier: 'Prime Urban',
    description: 'Capital city prime commercial & residential plots with mountain backdrop views.'
  },
  {
    id: 'karachi_clifton_dha',
    name: 'Karachi (Clifton / DHA / Scheme 33), Sindh',
    country: 'Pakistan',
    state: 'Sindh',
    lat: 24.8607,
    lng: 67.0011,
    basePricePerAcreUSD: 380000,
    basePricePerKanalPKR: 130000000, // ~13 Crore PKR / Kanal
    tier: 'Prime Urban',
    description: 'Coastal financial hub, high density residential and commercial retail.'
  },
  {
    id: 'rawalpindi_bahria_top',
    name: 'Rawalpindi (Bahria Town / Chaklala / GT Rd)',
    country: 'Pakistan',
    state: 'Punjab',
    lat: 33.5651,
    lng: 73.0169,
    basePricePerAcreUSD: 180000,
    basePricePerKanalPKR: 62000000, // ~6.2 Crore PKR / Kanal
    tier: 'Prime Suburban',
    description: 'Gated housing societies, strong commuter links to Islamabad.'
  },
  {
    id: 'pindi_punjab_agri',
    name: 'Central Punjab Agricultural Belt (Faisalabad/Gujranwala)',
    country: 'Pakistan',
    state: 'Punjab',
    lat: 31.4187,
    lng: 73.0791,
    basePricePerAcreUSD: 45000,
    basePricePerKanalPKR: 15500000, // ~1.55 Crore PKR / Kanal
    tier: 'Exurban/Agricultural',
    description: 'Fertile canal-irrigated farmland with high crop yields and industrial expansion.'
  },
  {
    id: 'multan_suburban',
    name: 'Multan (Northern Bypass / DHA Multan)',
    country: 'Pakistan',
    state: 'Punjab',
    lat: 30.1575,
    lng: 71.5249,
    basePricePerAcreUSD: 95000,
    basePricePerKanalPKR: 32000000, // ~3.2 Crore PKR / Kanal
    tier: 'Urban/Suburban',
    description: 'Rapidly growing South Punjab commercial and residential expansion.'
  },
  {
    id: 'peshawar_ring_rd',
    name: 'Peshawar (Hayatabad / Regi Model Town), KPK',
    country: 'Pakistan',
    state: 'KPK',
    lat: 34.0151,
    lng: 71.5249,
    basePricePerAcreUSD: 140000,
    basePricePerKanalPKR: 48000000, // ~4.8 Crore PKR / Kanal
    tier: 'Prime Suburban',
    description: 'Strategic trade corridor, growing suburban residential demand.'
  },
  {
    id: 'gwadar_deep_sea',
    name: 'Gwadar (CPEC Free Zone / Marine Drive), Balochistan',
    country: 'Pakistan',
    state: 'Balochistan',
    lat: 25.1264,
    lng: 62.3225,
    basePricePerAcreUSD: 110000,
    basePricePerKanalPKR: 38000000, // ~3.8 Crore PKR / Kanal
    tier: 'Urban/Suburban',
    description: 'Deep-sea port city, logistics, warehousing, and commercial investment zone.'
  },

  // International Benchmark Markets
  {
    id: 'austin_tx',
    name: 'Austin Metro Area (Travis County), TX',
    country: 'USA',
    state: 'Texas',
    lat: 30.2672,
    lng: -97.7431,
    basePricePerAcreUSD: 145000,
    basePricePerKanalPKR: 50000000,
    tier: 'Prime Suburban',
    description: 'High tech expansion corridor, strong residential & commercial demand.'
  },
  {
    id: 'miami_fl',
    name: 'Greater Miami & Fort Lauderdale, FL',
    country: 'USA',
    state: 'Florida',
    lat: 25.7617,
    lng: -80.1918,
    basePricePerAcreUSD: 380000,
    basePricePerKanalPKR: 130000000,
    tier: 'Prime Urban',
    description: 'High coastal land scarcity, luxury residential & mixed-use zoning.'
  },
  {
    id: 'london_uk',
    name: 'Home Counties Fringe, London UK',
    country: 'UK',
    state: 'England',
    lat: 51.5074,
    lng: -0.1278,
    basePricePerAcreUSD: 350000,
    basePricePerKanalPKR: 120000000,
    tier: 'Prime Urban',
    description: 'High planning permission upside, suburban residential potential.'
  }
];

export const DEFAULT_PRESET = PRESET_REGIONS[0]; // Lahore DHA / Gulberg as default
