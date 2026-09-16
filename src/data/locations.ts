export const BOTSWANA_LOCATIONS = [
  "All Locations",
  "Gaborone",
  "Tlokweng",
  "Mogoditshane",
  "Mmopane",
  "Francistown",
  "Maun",
  "Selebi Phikwe",
  "Gantsi",
  "Kasane",
  "Palapye",
  "Lobatse",
  "Molepolole",
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
      "Phakalane", "Block 1", "Block 2", "Block 3", "Block 4", "Block 5",
      "Block 6", "Block 7", "Block 8", "Block 9", "Block 10",
      "Broadhurst", "Extension 4", "Extension 9", "Old Naledi",
      "Gaborone Village", "CBD",
    ],
  },
  { city: "Tlokweng", wards: ["Tlokweng Village", "Bothe"] },
  { city: "Mogoditshane", wards: ["Mogoditshane Village", "Block 1", "Block 2", "Block 3"] },
  { city: "Mmopane", wards: ["Mmopane Village"] },
  {
    city: "Francistown",
    wards: [
      "CBD", "Block 1", "Block 2", "Block 3", "Block 5", "Block 6",
      "Block 7", "Block 8", "Block 9", "Block 10", "Somerset West", "Monarch",
    ],
  },
  { city: "Maun", wards: ["Maun Central", "Matlapeng", "Sarewa", "Boro"] },
  { city: "Selebi Phikwe", wards: ["Town Centre", "Block 1", "Block 2", "Block 3", "Block 4", "Block 5"] },
  { city: "Gantsi", wards: ["Gantsi Village"] },
  { city: "Kasane", wards: ["Kasane Village", "Chobe"] },
  { city: "Palapye", wards: ["Palapye Village"] },
  { city: "Lobatse", wards: ["Lobatse Village"] },
  { city: "Molepolole", wards: ["Molepolole Village"] },
];