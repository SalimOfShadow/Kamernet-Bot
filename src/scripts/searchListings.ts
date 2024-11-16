import { Settings } from "../bot";

export async function searchListings(settings: Settings) {
  const location: string = settings.location
    .toLocaleLowerCase()
    .replace(" ", "-");

  // %2C1 is Room - %2C2 is Apartment - %2C4 is Studio - %2C16 is Student Housing - 8 is Anti-squat
  const listingTypeArray: string[] = settings.listingType;
  const listingTypeString = listingTypeArray
    .map((type) => {
      switch (type) {
        case "room":
          return "%2C1";
        case "apartment":
          return "%2C2";
        case "studio":
          return "%2C4";
        case "student-housing":
          return "%2C16";
        case "anti-squat":
          return "8";
        default:
          return "";
      }
    })
    .join("");

  const maxPrice: string = settings.maxPrice.toString();
  const maxPriceTrimmed: string = maxPrice.substring(0, maxPrice.length - 2);
  console.log(maxPriceTrimmed);
  const searchLink: string = `
        https://kamernet.nl/en/for-rent/properties-${location}?listingTypes=${listingTypeString}&searchview=1&maxRent=${maxPriceTrimmed}&minSize=2&radius=5&pageNo=1&sort=1
        `;
}
function printLocation(loc: string) {
  const location: string = loc.toLocaleLowerCase().replace(" ", "-");
  console.log(location);
}
printLocation("Amsterdam");
