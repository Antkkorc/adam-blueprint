export const BOTSWANA_LOCATIONS = [
  "All Locations",
  "Gaborone",
  "Francistown",
  "Maun",
  "Lobatse",
  "Selebi-Phikwe",
  "Kasane",
  "Palapye",
  "Serowe",
  "Jwaneng",
  "Orapa",
  "Sowa Town",
  "Tlokweng",
  "Mogoditshane",
];

export interface CityWards {
  city: string;
  wards: string[];
}

// Edit wards here anytime — this is the only file you need to touch
export const LOCATION_TREE: CityWards[] = [
  {
    city: "Gaborone",
    wards: [
      "Gaborone West", "Gaborone South", "Gaborone North", "Phakalane",
      "Broadhurst", "Kgale", "Riverside", "Old Naledi", "CBD",
      "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
      "Block 6", "Block 7", "Block 8", "Block 9", "Block 10",
      "Extension 4", "Extension 9",
    ],
  },
  { city: "Tlokweng", wards: ["Tlokweng", "Boseja", "Bontleng"] },
  { city: "Mogoditshane", wards: ["Mogoditshane", "Block 1", "Block 2", "Block 3"] },
  {
    city: "Francistown",
    wards: [
      "CBD", "Block 1", "Block 2", "Block 3", "Block 5", "Block 6",
      "Block 7", "Block 8", "Block 9", "Block 10", "Somerset East",
      "Somerset West", "Monarch", "Tati Siding",
    ],
  },
  { city: "Maun", wards: ["Maun", "Matlapana", "Boseja", "Disaneng", "Matshwane"] },
  { city: "Selebi-Phikwe", wards: ["Town Centre", "Block 1", "Block 2", "Block 3", "Block 4", "Block 5"] },
  { city: "Kasane", wards: ["Kasane", "Kazungula", "Chobe"] },
  { city: "Palapye", wards: ["Palapye", "Extension 1", "Extension 2"] },
  { city: "Lobatse", wards: ["Lobatse", "Peleng", "Woodhall"] },
  { city: "Serowe", wards: ["Serowe", "Boiteko", "Newtown"] },
  { city: "Jwaneng", wards: ["Jwaneng", "Jwaneng Mine"] },
  { city: "Orapa", wards: ["Orapa"] },
  { city: "Sowa Town", wards: ["Sowa Town"] },
];