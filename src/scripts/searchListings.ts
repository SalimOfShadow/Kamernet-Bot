import { Settings } from "../bot";

export function searchListings(settings: Settings) {
  // Parsing the location
  const location: string = settings.location
    .toLocaleLowerCase()
    .replace(" ", "-");

  // Parsing the listing type
  const listingTypeArray: string[] = settings.listingType;
  const listingTypeString = listingTypeArray
    // %2C is the escape ASCII keycode for a comma (" , ")
    // 1 is Room - 2 is Apartment - 4 is Studio - 16 is Student Housing - 8 is Anti-squat
    .map((type) => {
      switch (type) {
        case "room":
          return "%2C1";
        case "apartment":
          return "%2C2";
        case "studio":
          return "%2C4";
        case "student-housing":
          return "";
        case "anti-squat":
          return "8";
        default:
          return "";
      }
    })
    .join("");

  // Parsing the maximum price
  const possiblePrices: number[] = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
    1400, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000,
    4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000,
  ];
  const maxPrice: string = possiblePrices
    .findIndex((price) => price === settings.maxPrice)
    .toString();

  // Parsing the min square meters area
  const possibleDimensions: number[] = [
    0, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 45,
    50, 60, 70, 80, 90, 100,
  ];
  const minSize: string = (
    possibleDimensions.findIndex(
      (dimension) => dimension === settings.minRooms
    ) + 1
  ).toString();

  // Parsing the area radius
  const possibleRadii: number[] = [0, 1, 2, 5, 10, 20];
  const radius: string = (
    possibleRadii.findIndex((radius) => radius === settings.radius) + 1
  ).toString();

  const searchLink: string =
    /*pageNo=1&sort=1*/
    `https://kamernet.nl/en/for-rent/properties-${location}?listingTypes=${listingTypeString}&searchview=1&maxRent=${maxPrice}&minSize=${minSize}&radius=${
      radius === "0" ? "1" : radius
    }
  `;

  console.log(searchLink);

  return searchLink;
}
