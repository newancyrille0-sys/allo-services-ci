/**
 * Cities and Regions of Côte d'Ivoire
 * 65 major cities organized by region
 */

export const CITIES_CI = [
  // Major cities
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "Daloa",
  "San-Pédro",
  "Korhogo",
  "Abengourou",
  "Man",
  "Gagnoa",
  "Divo",
  // Secondary cities
  "Bondoukou",
  "Bouna",
  "Odienné",
  "Katiola",
  "Séguela",
  "Mankono",
  "Touba",
  "Biankouma",
  "Danane",
  "Guiglo",
  "Duékoué",
  "Toulepleu",
  "Bangolo",
  "Danané",
  "Logoualé",
  // Central region
  "Bouafle",
  "Sinfra",
  "Zuénoula",
  "Vavoua",
  "Issia",
  "Soubré",
  "Guitry",
  "Dabou",
  "Grand-Lahou",
  "Tiassalé",
  "Sikensi",
  // Eastern region
  "Aboisso",
  "Adzopé",
  "Akoupé",
  "Anyama",
  "Bonoua",
  "Maféré",
  // Northern region
  "Ferkessédougou",
  "Kong",
  "Tingréla",
  "Sinématiali",
  "Niakaramandougou",
  // Western region
  "Banguiné",
  " Facobly",
  "Kouibly",
  // Southern region
  "Grand-Bassam",
  "Jacqueville",
  "Bingerville",
  "Songon",
  "Modeste",
  "Assinie",
  "Betié",
  // Interior cities
  "Sassandra",
  " Fresco",
  "Lakota",
  "Gboguhé",
  "Ouragahio",
  "Oumé",
  "Hiré",
] as const;

export type CityCI = (typeof CITIES_CI)[number];

export interface RegionCI {
  name: string;
  cities: string[];
}

export const REGIONS_CI: RegionCI[] = [
  {
    name: "Abidjan",
    cities: ["Abidjan", "Bingerville", "Songon", "Anyama", "Modeste"],
  },
  {
    name: "Bas-Sassandra",
    cities: ["San-Pédro", "Sassandra", "Fresco", "Tabou", "Grand-Béréby"],
  },
  {
    name: "Comoé",
    cities: ["Abengourou", "Aboisso", "Adzopé", "Agboville", "Akoupé", "Anyama"],
  },
  {
    name: "Denguélé",
    cities: ["Odienné", "Tengréla", "Kani", "Minignan", "Madinani"],
  },
  {
    name: "Gôh-Djiboua",
    cities: ["Divo", "Gagnoa", "Lakota", "Oumé", "Ouragahio", "Hiré"],
  },
  {
    name: "Lacs",
    cities: ["Yamoussoukro", "Toumodi", "Tiassalé", "Dabou", "Bouaké"],
  },
  {
    name: "Lagunes",
    cities: ["Abidjan", "Grand-Bassam", "Bingerville", "Jacqueville", "Adzopé", "Akoupé", "Assinie", "Betié", "Bonoua"],
  },
  {
    name: "Montagnes",
    cities: ["Man", "Danane", "Bangolo", "Biankouma", "Danané", "Guiglo", "Toulepleu", "Duékoué"],
  },
  {
    name: "Sassandra-Marahoué",
    cities: ["Daloa", "Bouaflé", "Sinfra", "Zuénoula", "Vavoua", "Issia", "Soubré", "Guitry"],
  },
  {
    name: "Savanes",
    cities: ["Korhogo", "Ferkessédougou", "Boundiali", "Katiola", "Tingréla", "Sinématiali", "Niakaramandougou"],
  },
  {
    name: "Vallée du Bandama",
    cities: ["Bouaké", "Katiola", "Béoumi", "Sakassou", "Botro"],
  },
  {
    name: "Woroba",
    cities: ["Séguéla", "Mankono", "Touba", "Kounahiri", "Mankono"],
  },
  {
    name: "Zanzan",
    cities: ["Bondoukou", "Bouna", "Tanda", "Koun-Fao", "Sandégué", "Assuéfry"],
  },
  {
    name: "Indénié-Djuablin",
    cities: ["Abengourou", "Agnibilékrou", "Bettié", "Daoukro"],
  },
  {
    name: "N'zi",
    cities: ["Dimbokro", "Bocanda", "Bongouanou", "Daoukro"],
  },
];

/**
 * Get all cities as a flat array
 */
export function getAllCities(): string[] {
  return [...CITIES_CI];
}

/**
 * Cities array alias for backward compatibility
 */
export const cities = [...CITIES_CI];

/**
 * Search cities by query
 */
export function searchCities(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  return CITIES_CI.filter(city => 
    city.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get region for a city
 */
export function getRegionForCity(cityName: string): string | null {
  for (const region of REGIONS_CI) {
    if (region.cities.includes(cityName)) {
      return region.name;
    }
  }
  return null;
}

/**
 * Popular cities for quick selection
 */
export const POPULAR_CITIES = [
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "Daloa",
  "San-Pédro",
  "Korhogo",
  "Abengourou",
  "Man",
  "Gagnoa",
] as const;

export type PopularCity = (typeof POPULAR_CITIES)[number];

/**
 * Abidjan communes/neighborhoods
 */
export const ABIDJAN_COMMUNES = [
  "Plateau",
  "Cocody",
  "Marcory",
  "Treichville",
  "Adjame",
  "Yopougon",
  "Abobo",
  "Koumassi",
  "Attécoubé",
  "Bingerville",
  "Songon",
] as const;

export type AbidjanCommune = (typeof ABIDJAN_COMMUNES)[number];
